"""
SQLite Persistent Memory Engine for AI Virtual Office
Provides persistent episodic, semantic, and task-execution memory for all 21 agents.
Stored in a local SQLite database file (office_memory.db).
"""

import sqlite3
import os
import json
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional

logger = logging.getLogger("uvicorn.error")

DB_DIR = os.path.dirname(os.path.abspath(__file__))
# Check if running in Vercel or read-only serverless environment
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    DB_PATH = os.path.join("/tmp", "office_memory.db")
else:
    DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(DB_DIR, "office_memory.db"))


def get_db_connection() -> sqlite3.Connection:
    """Creates a thread-safe connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Initializes SQLite schema and indexes for agent memory and events."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id TEXT NOT NULL,
            agent_name TEXT NOT NULL,
            cabin TEXT,
            division TEXT,
            memory_type TEXT DEFAULT 'task_execution',
            directive TEXT NOT NULL,
            deliverable TEXT NOT NULL,
            summary TEXT,
            provider TEXT,
            model TEXT,
            duration_seconds REAL DEFAULT 0.0,
            timestamp TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_facts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id TEXT NOT NULL,
            fact_key TEXT NOT NULL,
            fact_value TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS office_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_id TEXT,
            event_type TEXT NOT NULL,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Indexes for fast retrieval by agent and timestamp
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_memories_agent ON agent_memories(agent_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_memories_time ON agent_memories(created_at DESC)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_facts_agent ON agent_facts(agent_id)")

    conn.commit()
    conn.close()
    logger.info(f"SQLite Memory Database initialized at: {DB_PATH}")


def save_agent_memory(
    agent_id: str,
    agent_name: str,
    cabin: str,
    division: str,
    directive: str,
    deliverable: str,
    provider: str,
    model: str,
    duration_seconds: float = 0.0,
    memory_type: str = "task_execution",
    summary: Optional[str] = None,
) -> int:
    """Saves an execution or conversational interaction into SQLite memory."""
    if not summary:
        # Generate a concise summary from the first lines of the deliverable or directive
        clean_text = deliverable.strip().replace("\n", " ")
        summary = (clean_text[:160] + "...") if len(clean_text) > 160 else clean_text

    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    cursor.execute(
        """
        INSERT INTO agent_memories (
            agent_id, agent_name, cabin, division, memory_type,
            directive, deliverable, summary, provider, model,
            duration_seconds, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            agent_id,
            agent_name,
            cabin,
            division,
            memory_type,
            directive,
            deliverable,
            summary,
            provider,
            model,
            duration_seconds,
            now_str,
        ),
    )
    memory_id = cursor.lastrowid

    # Also log an office event
    cursor.execute(
        """
        INSERT INTO office_events (agent_id, event_type, details)
        VALUES (?, 'task_recorded', ?)
        """,
        (agent_id, f"Agent {agent_name} stored memory #{memory_id}: {directive[:80]}"),
    )

    conn.commit()
    conn.close()
    return memory_id


def get_agent_memories(agent_id: str, limit: int = 30) -> List[Dict[str, Any]]:
    """Retrieves all past memories for a specific agent in reverse chronological order."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, agent_id, agent_name, cabin, division, memory_type,
               directive, deliverable, summary, provider, model,
               duration_seconds, timestamp, created_at
        FROM agent_memories
        WHERE agent_id = ?
        ORDER BY id DESC
        LIMIT ?
        """,
        (agent_id, limit),
    )
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def get_agent_context_for_prompt(agent_id: str, max_memories: int = 4) -> str:
    """
    Constructs contextual memory injection text for LLMs.
    Allows the agent to reference previous conversations, directives, and completed tasks.
    """
    memories = get_agent_memories(agent_id, limit=max_memories)
    if not memories:
        return ""

    context_lines = [
        "=== AGENT EPISODIC MEMORY (RETRIEVED FROM SQLITE DATABASE) ===",
        "You possess persistent memory across interactions. Here are your recent task logs and deliverables:",
    ]
    for idx, mem in enumerate(reversed(memories), 1):
        context_lines.append(
            f"[{idx}] Time: {mem.get('timestamp') or mem.get('created_at')}\n"
            f"    Directive received: \"{mem.get('directive')}\"\n"
            f"    Your Deliverable summary: \"{mem.get('summary')}\"\n"
        )
    context_lines.append("=== END OF SQLITE MEMORY CONTEXT ===\n")
    return "\n".join(context_lines)


def get_all_memories(
    limit: int = 100,
    search_query: Optional[str] = None,
    agent_id: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Queries memories across all 21 agents with optional search filter."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT id, agent_id, agent_name, cabin, division, memory_type,
               directive, deliverable, summary, provider, model,
               duration_seconds, timestamp, created_at
        FROM agent_memories
    """
    params = []
    clauses = []

    if agent_id:
        clauses.append("agent_id = ?")
        params.append(agent_id)

    if search_query and search_query.strip():
        clauses.append("(directive LIKE ? OR deliverable LIKE ? OR summary LIKE ? OR agent_name LIKE ?)")
        wildcard = f"%{search_query.strip()}%"
        params.extend([wildcard, wildcard, wildcard, wildcard])

    if clauses:
        query += " WHERE " + " AND ".join(clauses)

    query += " ORDER BY id DESC LIMIT ?"
    params.append(limit)

    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()

    return [dict(row) for row in rows]


def add_agent_fact(agent_id: str, fact_key: str, fact_value: str) -> int:
    """Stores key factual knowledge directly in agent's SQLite memory."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO agent_facts (agent_id, fact_key, fact_value) VALUES (?, ?, ?)",
        (agent_id, fact_key, fact_value),
    )
    fact_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return fact_id


def get_agent_facts(agent_id: str) -> List[Dict[str, Any]]:
    """Retrieves all facts known by an agent."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, fact_key, fact_value, created_at FROM agent_facts WHERE agent_id = ? ORDER BY id DESC", (agent_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def clear_memories(agent_id: Optional[str] = None) -> int:
    """Wipes memory either for a specific agent or for the whole office."""
    conn = get_db_connection()
    cursor = conn.cursor()

    if agent_id:
        cursor.execute("DELETE FROM agent_memories WHERE agent_id = ?", (agent_id,))
        count = cursor.rowcount
        cursor.execute("DELETE FROM agent_facts WHERE agent_id = ?", (agent_id,))
    else:
        cursor.execute("DELETE FROM agent_memories")
        count = cursor.rowcount
        cursor.execute("DELETE FROM agent_facts")
        cursor.execute("DELETE FROM office_events")

    conn.commit()
    conn.close()
    return count


def get_memory_stats() -> Dict[str, Any]:
    """Returns database size, memory count per agent, and global stats."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM agent_memories")
    total_memories = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT agent_id) FROM agent_memories")
    active_agents = cursor.fetchone()[0]

    cursor.execute("""
        SELECT agent_id, agent_name, COUNT(*) as count
        FROM agent_memories
        GROUP BY agent_id
        ORDER BY count DESC
        LIMIT 10
    """)
    top_agents = [dict(row) for row in cursor.fetchall()]

    db_size_bytes = os.path.getsize(DB_PATH) if os.path.exists(DB_PATH) else 0

    conn.close()

    return {
        "db_path": DB_PATH,
        "db_size_kb": round(db_size_bytes / 1024, 2),
        "total_memories": total_memories,
        "agents_with_memories": active_agents,
        "top_agents": top_agents,
    }


# Auto-initialize database schema when module is loaded
init_db()
