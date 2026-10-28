import json
from workforce_crm import reset_crm_database, crm_fetch_leads
from workforce_crew import run_enterprise_workflow_sync, execute_hitl_approval_sync

print("--- Resetting CRM ---")
reset_crm_database()

print("--- Initial Leads in CRM ---")
leads = crm_fetch_leads()
for l in leads:
    print(f"[{l['id']}] {l['name']} ({l['company']}) - Status: {l['status']}, Score: {l['qualification_score']}")

print("\n--- Running Enterprise Workflow ---")
directive = "Process new incoming leads, qualify them, update our CRM, and draft personalized follow-up emails"
run_res = run_enterprise_workflow_sync(directive)
print("Run Status:", run_res.get("status"))
print("Task ID:", run_res.get("task_id"))
print("Target Lead:", run_res["target_lead"]["name"], "at", run_res["target_lead"]["company"])
print("Staged CRM Status:", run_res["approval_payload"]["staged_crm_status"])
print("Email Subject:", run_res["approval_payload"]["email_subject"])
print("Pending Approval:", run_res["approval_payload"]["requires_action"])

print("\n--- Executing Human-in-the-Loop Approval ---")
appr_res = execute_hitl_approval_sync(run_res["task_id"], approved=True)
print("Approval Status:", appr_res.get("status"))
print("Committed Status:", appr_res["crm_result"]["final_status"])
print("Email Receipt:", appr_res["email_result"]["delivery_receipt"])

print("\n--- Final CRM Leads State ---")
leads_after = crm_fetch_leads()
for l in leads_after:
    print(f"[{l['id']}] {l['name']} ({l['company']}) - Status: {l['status']}, Score: {l['qualification_score']}/{l['qualification_tier']}")
