-- ============================================================================
-- SUPABASE SCHEMA FOR AI ENTERPRISE WORKFORCE & CRM
-- Copy and paste this script directly into your Supabase project's SQL Editor
-- (https://supabase.com/dashboard/project/_/sql) and click "Run"
-- ============================================================================

-- 1. Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRM Leads Table
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id BIGSERIAL PRIMARY KEY,
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRM Activity Logs Table
CREATE TABLE IF NOT EXISTS public.crm_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    agent_id TEXT,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Staged Emails Queue Table
CREATE TABLE IF NOT EXISTS public.staged_emails (
    id BIGSERIAL PRIMARY KEY,
    task_id TEXT NOT NULL,
    lead_id BIGINT REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    to_email TEXT NOT NULL,
    recipient_name TEXT,
    company TEXT,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'STAGED',
    dispatch_timestamp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Workflow Tasks & DAG Table
CREATE TABLE IF NOT EXISTS public.workflow_tasks (
    task_id TEXT PRIMARY KEY,
    directive TEXT NOT NULL,
    status TEXT NOT NULL,
    plan_json JSONB,
    dag_json JSONB,
    logs_json JSONB,
    approval_payload_json JSONB,
    result_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_score ON public.crm_leads(qualification_score DESC);
CREATE INDEX IF NOT EXISTS idx_staged_emails_task ON public.staged_emails(task_id);

-- 7. Seed Data with Enterprise Demo Inbound Leads
INSERT INTO public.crm_leads (
    name, title, company, email, industry, company_size,
    annual_revenue, deal_value, tech_stack, intent_signal,
    status, qualification_score, qualification_tier, qualification_notes
) VALUES
(
    'Sarah Lin',
    'VP of Engineering',
    'Apex Cloud Systems',
    'sarah.lin@apexcloud.io',
    'Enterprise Cloud & DevOps',
    '250-500 employees',
    '$45M ARR',
    75000,
    'AWS, Kubernetes, Terraform, Datadog',
    'Downloaded Enterprise Multi-Agent Whitepaper, visited Pricing 4 times this week.',
    'NEW_INBOUND',
    0,
    'UNEVALUATED',
    'Awaiting initial qualification research by Lead Qualifier Agent.'
),
(
    'Marcus Vance',
    'Chief Technology Officer',
    'FinTech Matrix',
    'marcus.v@fintechmatrix.com',
    'Financial Technology & Payments',
    '1,000-5,000 employees',
    '$180M ARR',
    150000,
    'GCP, Snowflake, Kafka, Python, Go',
    'Requested demo for automated cross-platform task orchestration and compliance logging.',
    'NEW_INBOUND',
    0,
    'UNEVALUATED',
    'High priority enterprise inbound lead.'
),
(
    'Elena Rostova',
    'Head of Operations',
    'BioHealth Logistics',
    'e.rostova@biohealthlog.com',
    'Healthcare & Life Sciences',
    '80-150 employees',
    '$12M ARR',
    35000,
    'Azure, PostgreSQL, HIPAA compliant pipeline',
    'Explored API documentation regarding automated CRM and secure dispatch workflows.',
    'NEW_INBOUND',
    0,
    'UNEVALUATED',
    'Mid-market lead with strict compliance requirements.'
),
(
    'David Thorne',
    'Founder & CEO',
    'Solopreneur Studio',
    'david@solostudio.xyz',
    'Independent Consulting',
    '1-5 employees',
    '$150k ARR',
    5000,
    'Webflow, Zapier',
    'Submitted general contact form inquiry asking about free tier.',
    'NEW_INBOUND',
    0,
    'UNEVALUATED',
    'May be below enterprise ICP minimum threshold.'
)
ON CONFLICT (email) DO NOTHING;

-- 8. Enable Row Level Security (RLS) - Permissive for authenticated service role
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staged_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON public.crm_leads FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON public.crm_activity_logs FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON public.staged_emails FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON public.workflow_tasks FOR ALL USING (true);
