"""
FastAPI Server for AI Virtual Office (21-Agent Enterprise Simulation)
Provides the `/api/run-task` endpoint with asynchronous execution via asyncio.to_thread,
directory endpoints for the 21 CrewAI agents, and SQLite persistent memory endpoints.
"""

import os
import asyncio
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from crew_setup import (
    get_all_agents_list,
    get_agent_profile,
    execute_agent_task_sync,
)
from memory import (
    get_all_memories,
    get_agent_memories,
    save_agent_memory,
    clear_memories,
    get_memory_stats,
    add_agent_fact,
    get_agent_facts,
)
from mcp_tools import (
    EMPLOYEE_MCP_TOOLS,
    get_tools_for_agent,
    execute_mcp_tool,
    search_web_duckduckgo,
)

app = FastAPI(
    title="AI Virtual Office - 21 Agent Simulation Backend with SQLite Memory & MCP",
    description="Enterprise multi-agent task execution, dynamic model gateway, SQLite memory engine, and employee MCP productivity suite",
    version="2.2.0",
)

# Enable CORS for React frontend (Vite default port 5173 / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RunTaskRequest(BaseModel):
    provider: str = Field(default="openai", description="LLM Provider: openai, anthropic, or gemini")
    model: str = Field(default="gpt-4o", description="Model name, e.g. gpt-4o, claude-3-5-sonnet, gemini-2.5-flash")
    api_key: Optional[str] = Field(default=None, description="API Key for the chosen provider")
    target_agent_id: str = Field(..., description="ID of the assigned agent (e.g., 'ceo', 'director_eng')")
    instruction: str = Field(..., description="Task directive / user prompt for the agent")
    tool_id: Optional[str] = Field(default=None, description="Optional specific MCP tool to trigger")
    tool_params: Optional[Dict[str, Any]] = Field(default=None, description="Parameters for the MCP tool")


class ExecuteToolRequest(BaseModel):
    tool_id: str = Field(..., description="Tool ID (e.g. web_search, math_eval, wcag_auditor)")
    params: Dict[str, Any] = Field(default_factory=dict, description="Tool execution parameters")


class AddMemoryNoteRequest(BaseModel):
    note: str = Field(..., description="Memory note or instruction to store in agent's SQLite memory")
    memory_type: str = Field(default="user_note", description="Type of memory: user_note, directive, insight")


@app.get("/")
def root():
    stats = get_memory_stats()
    return {
        "status": "online",
        "service": "AI Virtual Office Backend",
        "agent_count": 21,
        "memory_engine": "SQLite (office_memory.db)",
        "total_memories_stored": stats["total_memories"],
        "endpoints": {
            "run_task": "/api/run-task",
            "agents": "/api/agents",
            "memories": "/api/memories",
            "memory_stats": "/api/memories/stats",
        },
    }


@app.get("/health")
def health():
    return {"status": "healthy", "memory": "sqlite_connected"}


@app.get("/api/agents")
def list_agents():
    """Returns the complete 21-agent enterprise directory with cabin details."""
    agents = get_all_agents_list()
    return {"total": len(agents), "agents": agents}


@app.get("/api/agents/{agent_id}")
def get_agent(agent_id: str):
    """Retrieve full persona and status of an individual agent."""
    agent = get_agent_profile(agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent '{agent_id}' not found in registry.",
        )
    return agent


# ════════════════════════════════════════════════════════════════════════════
# SQLite Persistent Memory API Endpoints
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/memories/stats")
def memory_statistics():
    """Returns database size, record counts, and active memory retention metrics."""
    return get_memory_stats()


@app.get("/api/memories")
def list_memories(
    limit: int = Query(default=50, ge=1, le=200),
    q: Optional[str] = Query(default=None, description="Search keyword"),
    agent_id: Optional[str] = Query(default=None, description="Filter by agent id"),
):
    """Retrieves SQLite memory logs across the entire virtual office."""
    records = get_all_memories(limit=limit, search_query=q, agent_id=agent_id)
    return {"total": len(records), "memories": records}


@app.get("/api/agents/{agent_id}/memories")
def get_agent_memory_log(agent_id: str, limit: int = Query(default=25, ge=1, le=100)):
    """Retrieves chronological memory timeline and facts for a specific agent."""
    agent = get_agent_profile(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found.")

    memories = get_agent_memories(agent_id, limit=limit)
    facts = get_agent_facts(agent_id)
    return {
        "agent_id": agent_id,
        "agent_name": agent["name"],
        "memory_count": len(memories),
        "memories": memories,
        "facts": facts,
    }


@app.post("/api/agents/{agent_id}/memories")
def add_memory_note(agent_id: str, payload: AddMemoryNoteRequest):
    """Manually stores a contextual memory note or directive into agent's SQLite memory."""
    agent = get_agent_profile(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found.")

    memory_id = save_agent_memory(
        agent_id=agent_id,
        agent_name=agent["name"],
        cabin=agent["cabin"],
        division=agent["division"],
        directive=payload.note,
        deliverable=f"Manual memory note recorded: {payload.note}",
        provider="manual",
        model="user-note",
        memory_type=payload.memory_type,
    )
    return {"status": "saved", "memory_id": memory_id, "agent_id": agent_id}


@app.delete("/api/memories")
def wipe_memories(agent_id: Optional[str] = Query(default=None, description="Optional agent to clear")):
    """Wipes SQLite memories for either a specific agent or the entire office."""
    deleted_count = clear_memories(agent_id)
    return {"status": "cleared", "deleted_count": deleted_count, "target": agent_id or "all"}


# ════════════════════════════════════════════════════════════════════════════
# Task Execution Endpoint with Dynamic Gateway & SQLite Memory
# ════════════════════════════════════════════════════════════════════════════

@app.post("/api/run-task")
async def run_task(payload: RunTaskRequest):
    """
    POST endpoint accepting provider, model, API key, target agent ID, and user instruction.
    Executes the task asynchronously via asyncio.to_thread, automatically retrieving
    prior SQLite episodic context and writing deliverables back to SQLite.
    """
    if not payload.instruction.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task instruction cannot be empty.",
        )

    agent = get_agent_profile(payload.target_agent_id)
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Target agent '{payload.target_agent_id}' does not exist.",
        )

    try:
        # Non-blocking async execution using asyncio.to_thread
        result = await asyncio.to_thread(
            execute_agent_task_sync,
            provider=payload.provider,
            model=payload.model,
            api_key=payload.api_key,
            target_agent_id=payload.target_agent_id,
            instruction=payload.instruction.strip(),
            tool_id=payload.tool_id,
            tool_params=payload.tool_params,
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Crew execution failed: {str(exc)}",
        )


# ════════════════════════════════════════════════════════════════════════════
# MCP & Employee Productivity Tools Endpoints
# ════════════════════════════════════════════════════════════════════════════

@app.get("/api/mcp/tools")
def get_all_mcp_tools():
    """Returns the complete catalog of MCP tools categorized by division."""
    return {"catalog": EMPLOYEE_MCP_TOOLS}


@app.get("/api/agents/{agent_id}/tools")
def get_agent_tools(agent_id: str):
    """Returns the customized MCP productivity toolkit for a specific agent."""
    agent = get_agent_profile(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found.")
    tools = get_tools_for_agent(agent["division"])
    return {
        "agent_id": agent_id,
        "agent_name": agent["name"],
        "division": agent["division"],
        "tools_count": len(tools),
        "tools": tools,
    }


@app.post("/api/mcp/execute")
def execute_tool_endpoint(payload: ExecuteToolRequest):
    """Directly executes an MCP or productivity tool (e.g. web search, calculator, WCAG audit)."""
    try:
        result = execute_mcp_tool(payload.tool_id, payload.params)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Tool execution failed: {str(e)}")


@app.get("/api/search")
def search_endpoint(q: str = Query(..., description="Web search query")):
    """Live web search endpoint powered by DuckDuckGo."""
    return search_web_duckduckgo(q)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

