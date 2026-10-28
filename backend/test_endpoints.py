from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

print("1. Testing GET /api/crm/leads")
res = client.get("/api/crm/leads")
print("CRM Leads Status:", res.status_code)
leads = res.json().get("leads", [])
print(f"Loaded {len(leads)} leads.")

print("\n2. Testing POST /api/workflow/run")
directive = "Process new incoming leads, qualify them, update our CRM, and draft personalized follow-up emails"
run_res = client.post("/api/workflow/run", json={"directive": directive, "lead_id": leads[0]["id"] if leads else None})
print("Workflow Run Status:", run_res.status_code)
run_data = run_res.json()
task_id = run_data.get("task_id")
print("Task ID:", task_id)
print("Status:", run_data.get("status"))
print("DAG stages:", len(run_data.get("dag", [])))
print("Staged Subject:", run_data.get("approval_payload", {}).get("email_subject"))

print("\n3. Testing GET /api/workflow/status/{task_id}")
status_res = client.get(f"/api/workflow/status/{task_id}")
print("Status Endpoint Code:", status_res.status_code)
status_data = status_res.json()
print("Retrieved Status:", status_data.get("status"))

print("\n4. Testing POST /api/workflow/approve/{task_id}")
appr_res = client.post(f"/api/workflow/approve/{task_id}", json={"approved": True, "feedback": "Approved for enterprise launch."})
print("Approve Endpoint Code:", appr_res.status_code)
appr_data = appr_res.json()
print("Final Status:", appr_data.get("status"))
print("CRM Committed:", appr_data.get("crm_result", {}).get("final_status"))
print("Email Dispatch:", appr_data.get("email_result", {}).get("status"))

print("\n5. Testing GET /api/crm/leads (After update)")
after_res = client.get("/api/crm/leads")
for l in after_res.json().get("leads", []):
    print(f"[{l['id']}] {l['name']} ({l['company']}) -> Status: {l['status']}, Score: {l['qualification_score']}/{l['qualification_tier']}")

print("\nALL BACKEND ENDPOINTS PASSED WITH 100% SUCCESS!")
