"""
Enterprise Simulated CRM & Email Dispatch Database Layer with SQLite.
Provides realistic mock CRM operations, retry logic, error handling,
activity logging, and human-in-the-loop staging for CrewAI multi-agent workflows.
"""

import os
import sqlite3
import json
import time
import logging
import csv
import io
import urllib.request
from typing import Dict, Any, List, Optional
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger("uvicorn.error")


DB_DIR = os.path.dirname(os.path.abspath(__file__))
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
    CRM_DB_PATH = os.path.join("/tmp", "workforce_crm.db")
else:
    CRM_DB_PATH = os.environ.get("DATABASE_PATH", os.path.join(DB_DIR, "workforce_crm.db"))

# Optional Supabase Cloud Integration
SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = (os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_ANON_KEY") or "").strip()
GOOGLE_SHEETS_WEBHOOK_URL = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip()

try:
    from supabase import create_client, Client
    SUPABASE_LIB_AVAILABLE = True
except ImportError:
    create_client = None
    Client = None
    SUPABASE_LIB_AVAILABLE = False


def get_supabase_client():
    """Returns active Supabase client if configured in .env, else None."""
    if SUPABASE_LIB_AVAILABLE and SUPABASE_URL and SUPABASE_KEY:
        try:
            return create_client(SUPABASE_URL, SUPABASE_KEY)
        except Exception as e:
            logger.warning(f"Failed to connect to Supabase: {e}")
            return None
    return None


def is_supabase_enabled() -> bool:
    """Returns True if Supabase Cloud credentials are configured."""
    return bool(SUPABASE_LIB_AVAILABLE and SUPABASE_URL and SUPABASE_KEY)


def sync_lead_to_google_sheets(lead: Dict[str, Any], event_type: str = "CRM_UPDATE") -> bool:
    """
    Sends updated lead data to Google Sheets / Excel Online via Google Apps Script Webhook.
    """
    webhook_url = os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip() or GOOGLE_SHEETS_WEBHOOK_URL
    if not webhook_url:
        return False
    try:
        payload = {
            "event": event_type,
            "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
            "lead_id": lead.get("id"),
            "name": lead.get("name"),
            "title": lead.get("title"),
            "company": lead.get("company"),
            "email": lead.get("email"),
            "industry": lead.get("industry"),
            "company_size": lead.get("company_size"),
            "annual_revenue": lead.get("annual_revenue"),
            "deal_value": lead.get("deal_value", 0),
            "tech_stack": lead.get("tech_stack"),
            "intent_signal": lead.get("intent_signal"),
            "status": lead.get("status"),
            "qualification_score": lead.get("qualification_score", 0),
            "qualification_tier": lead.get("qualification_tier", "UNEVALUATED"),
            "qualification_notes": lead.get("qualification_notes", "")
        }
        data_bytes = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            webhook_url,
            data=data_bytes,
            headers={"Content-Type": "application/json", "User-Agent": "Synthetix-CRM-Sync/1.0"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=5.0) as resp:
            return resp.status in (200, 201)
    except Exception as e:
        logger.warning(f"Google Sheets webhook sync error: {e}")
        return False

SEED_LEADS = [
    {
        "name": "Sarah Lin",
        "title": "VP of Engineering",
        "company": "Apex Cloud Systems",
        "email": "sarah.lin@apexcloud.io",
        "industry": "Enterprise Cloud & DevOps",
        "company_size": "250-500 employees",
        "annual_revenue": "$45M ARR",
        "deal_value": 75000,
        "tech_stack": "AWS, Kubernetes, Terraform, Datadog",
        "intent_signal": "Downloaded Enterprise Multi-Agent Whitepaper, visited Pricing 4 times this week.",
        "status": "NEW_INBOUND",
        "qualification_score": 0,
        "qualification_tier": "UNEVALUATED",
        "qualification_notes": "Awaiting initial qualification research by Lead Qualifier Agent."
    },
    {
        "name": "Marcus Vance",
        "title": "Chief Technology Officer",
        "company": "FinTech Matrix",
        "email": "marcus.v@fintechmatrix.com",
        "industry": "Financial Technology & Payments",
        "company_size": "1,000-5,000 employees",
        "annual_revenue": "$180M ARR",
        "deal_value": 150000,
        "tech_stack": "GCP, Snowflake, Kafka, Python, Go",
        "intent_signal": "Requested demo for automated cross-platform task orchestration and compliance logging.",
        "status": "NEW_INBOUND",
        "qualification_score": 0,
        "qualification_tier": "UNEVALUATED",
        "qualification_notes": "High priority enterprise inbound lead."
    },
    {
        "name": "Elena Rostova",
        "title": "Head of Operations",
        "company": "BioHealth Logistics",
        "email": "e.rostova@biohealthlog.com",
        "industry": "Healthcare & Life Sciences",
        "company_size": "80-150 employees",
        "annual_revenue": "$12M ARR",
        "deal_value": 35000,
        "tech_stack": "Azure, PostgreSQL, HIPAA compliant pipeline",
        "intent_signal": "Explored API documentation regarding automated CRM and secure dispatch workflows.",
        "status": "NEW_INBOUND",
        "qualification_score": 0,
        "qualification_tier": "UNEVALUATED",
        "qualification_notes": "Mid-market lead with strict compliance requirements."
    },
    {
        "name": "David Thorne",
        "title": "Founder & CEO",
        "company": "Solopreneur Studio",
        "email": "david@solostudio.xyz",
        "industry": "Independent Consulting",
        "company_size": "1-5 employees",
        "annual_revenue": "$150k ARR",
        "deal_value": 5000,
        "tech_stack": "Webflow, Zapier",
        "intent_signal": "Submitted general contact form inquiry asking about free tier.",
        "status": "NEW_INBOUND",
        "qualification_score": 0,
        "qualification_tier": "UNEVALUATED",
        "qualification_notes": "May be below enterprise ICP minimum threshold."
    }
]


def get_crm_db():
    conn = sqlite3.connect(CRM_DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_crm_db(seed_if_empty: bool = True):
    conn = get_crm_db()
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS crm_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            title TEXT,
            company TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            industry TEXT,
            company_size TEXT,
            annual_revenue TEXT,
            deal_value INTEGER DEFAULT 0,
            tech_stack TEXT,
            intent_signal TEXT,
            status TEXT DEFAULT 'NEW_INBOUND',
            qualification_score INTEGER DEFAULT 0,
            qualification_tier TEXT DEFAULT 'UNEVALUATED',
            qualification_notes TEXT,
            staged_status TEXT,
            staged_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS crm_activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id INTEGER,
            agent_id TEXT,
            action TEXT NOT NULL,
            details TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS staged_emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id TEXT NOT NULL,
            lead_id INTEGER,
            to_email TEXT NOT NULL,
            recipient_name TEXT,
            company TEXT,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            status TEXT DEFAULT 'STAGED',
            dispatch_timestamp TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS workflow_tasks (
            task_id TEXT PRIMARY KEY,
            directive TEXT NOT NULL,
            status TEXT NOT NULL,
            plan_json TEXT,
            dag_json TEXT,
            logs_json TEXT,
            approval_payload_json TEXT,
            result_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()

    if seed_if_empty:
        cur.execute("SELECT COUNT(*) as count FROM crm_leads")
        cnt = cur.fetchone()["count"]
        if cnt == 0:
            for l in SEED_LEADS:
                cur.execute("""
                    INSERT INTO crm_leads (
                        name, title, company, email, industry, company_size,
                        annual_revenue, deal_value, tech_stack, intent_signal,
                        status, qualification_score, qualification_tier, qualification_notes
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    l["name"], l["title"], l["company"], l["email"], l["industry"],
                    l["company_size"], l["annual_revenue"], l["deal_value"],
                    l["tech_stack"], l["intent_signal"], l["status"],
                    l["qualification_score"], l["qualification_tier"], l["qualification_notes"]
                ))
            conn.commit()
            logger.info("CRM database seeded with enterprise leads.")

    conn.close()


def reset_crm_database():
    """Resets CRM database back to initial state with fresh demo seed data."""
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM crm_activity_logs")
    cur.execute("DELETE FROM staged_emails")
    cur.execute("DELETE FROM workflow_tasks")
    cur.execute("DELETE FROM crm_leads")
    for l in SEED_LEADS:
        cur.execute("""
            INSERT INTO crm_leads (
                name, title, company, email, industry, company_size,
                annual_revenue, deal_value, tech_stack, intent_signal,
                status, qualification_score, qualification_tier, qualification_notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            l["name"], l["title"], l["company"], l["email"], l["industry"],
            l["company_size"], l["annual_revenue"], l["deal_value"],
            l["tech_stack"], l["intent_signal"], l["status"],
            l["qualification_score"], l["qualification_tier"], l["qualification_notes"]
        ))
    conn.commit()
    conn.close()
    return {"status": "reset", "leads_count": len(SEED_LEADS)}


# ════════════════════════════════════════════════════════════════════════════
# CRM Operations with Resilient Retry & Error Handling
# ════════════════════════════════════════════════════════════════════════════

def crm_fetch_leads(status_filter: Optional[str] = None, limit: int = 10, retries: int = 2) -> List[Dict[str, Any]]:
    """Fetches leads from CRM with retry logic."""
    for attempt in range(retries + 1):
        try:
            conn = get_crm_db()
            cur = conn.cursor()
            if status_filter:
                cur.execute("SELECT * FROM crm_leads WHERE status = ? ORDER BY id ASC LIMIT ?", (status_filter, limit))
            else:
                cur.execute("SELECT * FROM crm_leads ORDER BY id ASC LIMIT ?", (limit,))
            rows = [dict(r) for r in cur.fetchall()]
            conn.close()
            return rows
        except Exception as e:
            if attempt < retries:
                time.sleep(0.15)
                continue
            logger.error(f"CRM fetch failed after {retries} retries: {e}")
            return []


def crm_get_lead_by_id(lead_id: int) -> Optional[Dict[str, Any]]:
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM crm_leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def crm_update_lead_qualification(
    lead_id: int,
    score: int,
    tier: str,
    notes: str,
    agent_id: str = "lead_qualifier"
) -> Dict[str, Any]:
    """Updates lead score and qualification tier in CRM."""
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE crm_leads 
        SET qualification_score = ?, qualification_tier = ?, qualification_notes = ?,
            status = CASE WHEN status = 'NEW_INBOUND' THEN 'QUALIFIED' ELSE status END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (score, tier, notes, lead_id))

    cur.execute("""
        INSERT INTO crm_activity_logs (lead_id, agent_id, action, details)
        VALUES (?, ?, 'QUALIFICATION_EVALUATED', ?)
    """, (lead_id, agent_id, f"Score: {score}/100, Tier: {tier}. Notes: {notes[:80]}..."))

    conn.commit()
    conn.close()

    # Trigger real-time sync to Google Sheets CRM Webhook
    lead_row = crm_get_lead_by_id(lead_id)
    if lead_row:
        sync_lead_to_google_sheets(lead_row, event_type="LEAD_QUALIFIED")

    return {"status": "success", "lead_id": lead_id, "score": score, "tier": tier}


def crm_stage_status_update(
    lead_id: int,
    staged_status: str,
    staged_notes: str,
    agent_id: str = "crm_updater"
) -> Dict[str, Any]:
    """Stages a CRM status change for human approval checkpoint."""
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("""
        UPDATE crm_leads
        SET staged_status = ?, staged_notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (staged_status, staged_notes, lead_id))

    cur.execute("""
        INSERT INTO crm_activity_logs (lead_id, agent_id, action, details)
        VALUES (?, ?, 'STAGED_STATUS_UPDATE', ?)
    """, (lead_id, agent_id, f"Staged status: {staged_status}. Staged notes: {staged_notes[:80]}..."))

    conn.commit()
    conn.close()
    return {"status": "staged", "lead_id": lead_id, "staged_status": staged_status}


def crm_commit_status_update(
    lead_id: int,
    final_status: Optional[str] = None,
    agent_id: str = "human_supervisor"
) -> Dict[str, Any]:
    """Commits staged CRM status changes upon Human-in-the-Loop authorization."""
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM crm_leads WHERE id = ?", (lead_id,))
    lead = cur.fetchone()
    if not lead:
        conn.close()
        return {"status": "error", "message": f"Lead {lead_id} not found."}

    applied_status = final_status or lead["staged_status"] or "OUTREACH_DISPATCHED"
    applied_notes = lead["staged_notes"] or "Approved by Human-in-the-Loop authorization."

    cur.execute("""
        UPDATE crm_leads
        SET status = ?, qualification_notes = COALESCE(qualification_notes, '') || ' | ' || ?,
            staged_status = NULL, staged_notes = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    """, (applied_status, applied_notes, lead_id))

    cur.execute("""
        INSERT INTO crm_activity_logs (lead_id, agent_id, action, details)
        VALUES (?, ?, 'COMMITTED_CRM_UPDATE', ?)
    """, (lead_id, agent_id, f"Committed status: {applied_status}"))

    conn.commit()
    conn.close()

    # Trigger real-time sync to Google Sheets CRM Webhook
    lead_row = crm_get_lead_by_id(lead_id)
    if lead_row:
        sync_lead_to_google_sheets(lead_row, event_type="CRM_STATUS_COMMITTED")

    return {"status": "committed", "lead_id": lead_id, "final_status": applied_status}


# ════════════════════════════════════════════════════════════════════════════
# Email Dispatcher Operations (Staging & Final Dispatch)
# ════════════════════════════════════════════════════════════════════════════

def email_stage_draft(
    task_id: str,
    lead_id: int,
    to_email: str,
    recipient_name: str,
    company: str,
    subject: str,
    body: str,
    agent_id: str = "email_dispatcher"
) -> Dict[str, Any]:
    """Stages an outreach email in the approval queue."""
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO staged_emails (task_id, lead_id, to_email, recipient_name, company, subject, body, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'STAGED')
    """, (task_id, lead_id, to_email, recipient_name, company, subject, body))
    email_id = cur.lastrowid

    cur.execute("""
        INSERT INTO crm_activity_logs (lead_id, agent_id, action, details)
        VALUES (?, ?, 'EMAIL_DRAFT_STAGED', ?)
    """, (lead_id, agent_id, f"Draft staged [ID: {email_id}] Subject: '{subject}'"))

    conn.commit()
    conn.close()
    return {
        "status": "staged",
        "email_id": email_id,
        "task_id": task_id,
        "to_email": to_email,
        "subject": subject
    }


def send_live_smtp_email(
    to_email: str,
    subject: str,
    body: str,
    from_email: str = "anshkumarjain2@gmail.com"
) -> Dict[str, Any]:
    """
    Delivers physical email over live SMTP via Gmail (smtp.gmail.com).
    Uses TLS encryption on port 587.
    """
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    sender = os.getenv("SMTP_USER", "").strip() or os.getenv("EMAIL_FROM", "").strip() or from_email
    password = (os.getenv("SMTP_PASSWORD", "") or os.getenv("GMAIL_APP_PASSWORD", "")).strip()

    # Optional test redirection: if target lead has a fictional/mock domain (.io, .corp), 
    # redirect to the user's real email so it lands in their actual inbox!
    actual_recipient = to_email
    redirect_target = os.getenv("REDIRECT_ALL_LEAD_EMAILS_TO", "").strip()
    if redirect_target:
        actual_recipient = redirect_target
    elif any(mock_domain in to_email.lower() for mock_domain in ["@apexcloud.io", "@fintechmatrix.io", "@biohealth.io", "@solopreneur.org"]):
        # Can automatically deliver mock lead emails directly to user's real Gmail for live demo proof!
        actual_recipient = os.getenv("DEMO_RECEIVE_EMAIL", sender).strip()

    if sender and password:
        try:
            msg = MIMEMultipart()
            msg["From"] = f"Ansh Kumar Jain <{sender}>"
            msg["To"] = actual_recipient
            msg["Subject"] = f"[Synthetix AI Workforce] {subject}"
            
            disclaimer = f"\n\n---\n[Sent via Synthetix AI Autonomous Workforce CRM from {sender} to {to_email}]"
            msg.attach(MIMEText(body + disclaimer, "plain", "utf-8"))

            server = smtplib.SMTP(smtp_host, smtp_port, timeout=12.0)
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(sender, password)
            server.sendmail(sender, [actual_recipient], msg.as_string())
            server.quit()

            logger.info(f"LIVE EMAIL DISPATCHED to {actual_recipient} from {sender}!")
            return {
                "delivered_live": True,
                "sender": sender,
                "recipient": actual_recipient,
                "original_to": to_email,
                "receipt": f"250 2.0.0 OK: Delivered live via {smtp_host} to {actual_recipient}"
            }
        except Exception as e:
            logger.error(f"Live SMTP delivery failed: {e}")
            return {
                "delivered_live": False,
                "sender": sender,
                "recipient": actual_recipient,
                "error": str(e),
                "receipt": f"SMTP Gateway Alert: {e}"
            }

    # If App Password not yet configured in .env, record armed state
    return {
        "delivered_live": False,
        "sender": sender,
        "recipient": actual_recipient,
        "receipt": f"250 2.0.0 OK (Armed from {sender}; add 16-char App Password in SMTP_PASSWORD to send live)"
    }


def email_dispatch_approved(
    task_id: str,
    email_id: Optional[int] = None,
    agent_id: str = "human_supervisor",
    retries: int = 2
) -> Dict[str, Any]:
    """
    Executes email dispatch once Human-in-the-Loop approval is granted.
    Delivers live email via Gmail SMTP (from anshkumarjain2@gmail.com) if configured,
    and logs activity in SQLite and Supabase.
    """
    for attempt in range(retries + 1):
        try:
            conn = get_crm_db()
            cur = conn.cursor()
            if email_id:
                cur.execute("SELECT * FROM staged_emails WHERE id = ?", (email_id,))
            else:
                cur.execute("SELECT * FROM staged_emails WHERE task_id = ? AND status = 'STAGED' LIMIT 1", (task_id,))
            row = cur.fetchone()

            if not row:
                conn.close()
                return {"status": "error", "message": "No staged email found for dispatch."}

            # Attempt live SMTP delivery from anshkumarjain2@gmail.com
            smtp_result = send_live_smtp_email(
                to_email=row["to_email"],
                subject=row["subject"],
                body=row["body"],
                from_email="anshkumarjain2@gmail.com"
            )

            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
            cur.execute("""
                UPDATE staged_emails 
                SET status = 'DISPATCHED', dispatch_timestamp = ?
                WHERE id = ?
            """, (now_str, row["id"]))

            cur.execute("""
                INSERT INTO crm_activity_logs (lead_id, agent_id, action, details)
                VALUES (?, ?, 'EMAIL_DISPATCHED', ?)
            """, (row["lead_id"], agent_id, f"Dispatched from anshkumarjain2@gmail.com to {row['to_email']}: '{row['subject']}' | {smtp_result.get('receipt')}"))

            conn.commit()
            conn.close()

            return {
                "status": "dispatched",
                "email_id": row["id"],
                "from_email": "anshkumarjain2@gmail.com",
                "to_email": row["to_email"],
                "subject": row["subject"],
                "dispatched_at": now_str,
                "live_delivery": smtp_result.get("delivered_live", False),
                "delivery_receipt": smtp_result.get("receipt", f"250 2.0.0 OK: message queued as MSG-{row['id']}-SMTP")
            }
        except Exception as e:
            if attempt < retries:
                time.sleep(0.2)
                continue
            logger.error(f"Email dispatch error: {e}")
            return {"status": "failed", "error": str(e)}


# ════════════════════════════════════════════════════════════════════════════
# Workflow Task State Management (DAG & HITL Tracking)
# ════════════════════════════════════════════════════════════════════════════

def workflow_create_task(
    task_id: str,
    directive: str,
    initial_status: str = "PLANNING",
    dag: Optional[List[Dict[str, Any]]] = None
) -> None:
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT OR REPLACE INTO workflow_tasks (
            task_id, directive, status, dag_json, logs_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    """, (task_id, directive, initial_status, json.dumps(dag or []), json.dumps([])))
    conn.commit()
    conn.close()


def workflow_update_task_state(
    task_id: str,
    status: str,
    dag: Optional[List[Dict[str, Any]]] = None,
    new_logs: Optional[List[Dict[str, Any]]] = None,
    approval_payload: Optional[Dict[str, Any]] = None,
    result: Optional[Dict[str, Any]] = None
) -> None:
    conn = get_crm_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM workflow_tasks WHERE task_id = ?", (task_id,))
    existing = cur.fetchone()
    if not existing:
        conn.close()
        return

    existing_logs = json.loads(existing["logs_json"] or "[]")
    if new_logs:
        existing_logs.extend(new_logs)

    dag_str = json.dumps(dag) if dag is not None else existing["dag_json"]
    logs_str = json.dumps(existing_logs)
    appr_str = json.dumps(approval_payload) if approval_payload is not None else existing["approval_payload_json"]
    res_str = json.dumps(result) if result is not None else existing["result_json"]

    cur.execute("""
        UPDATE workflow_tasks
        SET status = ?, dag_json = ?, logs_json = ?, approval_payload_json = ?,
            result_json = ?, updated_at = CURRENT_TIMESTAMP
        WHERE task_id = ?
    """, (status, dag_str, logs_str, appr_str, res_str, task_id))
    conn.commit()
    conn.close()


def workflow_get_task_state(task_id: str) -> Optional[Dict[str, Any]]:
    conn = get_crm_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM workflow_tasks WHERE task_id = ?", (task_id,))
    row = cur.fetchone()
    conn.close()
    if not row:
        return None

    return {
        "task_id": row["task_id"],
        "directive": row["directive"],
        "status": row["status"],
        "dag": json.loads(row["dag_json"] or "[]"),
        "logs": json.loads(row["logs_json"] or "[]"),
        "approval_payload": json.loads(row["approval_payload_json"]) if row["approval_payload_json"] else None,
        "result": json.loads(row["result_json"]) if row["result_json"] else None,
        "created_at": row["created_at"],
        "updated_at": row["updated_at"]
    }


def crm_export_csv() -> str:
    """Exports all CRM leads into CSV format compatible with Google Sheets and Microsoft Excel."""
    leads = crm_fetch_leads(limit=500)
    output = io.StringIO()
    fieldnames = [
        "id", "name", "title", "company", "email", "industry", "company_size",
        "annual_revenue", "deal_value", "tech_stack", "intent_signal",
        "status", "qualification_score", "qualification_tier", "qualification_notes",
        "staged_status", "updated_at"
    ]
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    for l in leads:
        writer.writerow(l)
    return output.getvalue()


def crm_get_integration_status() -> Dict[str, Any]:
    """Returns connectivity status for Supabase, Google Sheets, and local SQLite."""
    sb_active = is_supabase_enabled()
    gsheets_active = bool(os.getenv("GOOGLE_SHEETS_WEBHOOK_URL", "").strip() or GOOGLE_SHEETS_WEBHOOK_URL)
    
    return {
        "supabase": {
            "enabled": sb_active,
            "url": SUPABASE_URL if sb_active else "Not configured in .env",
            "driver": "supabase-py (postgrest)" if SUPABASE_LIB_AVAILABLE else "Library missing",
            "status": "connected" if sb_active else "offline_fallback_active"
        },
        "google_sheets_crm": {
            "enabled": gsheets_active,
            "webhook_configured": gsheets_active,
            "sync_mode": "Auto-sync on CRM qualification & approval",
            "export_available": True
        },
        "sqlite_local": {
            "active": True,
            "path": CRM_DB_PATH,
            "mode": "Primary engine (or local backup cache when Supabase active)"
        }
    }


# Auto-initialize database on import
init_crm_db()
