import React, { useState, useEffect } from "react";
import {
  Bot,
  Zap,
  CheckCircle2,
  X,
  RefreshCw,
  UserCheck,
  AlertTriangle,
  Mail,
  Database,
  ArrowRight,
  ShieldAlert,
  Layers,
  Cpu,
  Play,
  Copy,
  Check,
  Send,
  Building,
  DollarSign,
  Briefcase,
  Terminal,
  FileSpreadsheet,
  Download,
  ExternalLink,
} from "lucide-react";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.origin.includes(":5173")
    ? "http://localhost:8000"
    : "");

export default function WorkforceHub({ isOpen, onClose, onShowToast }) {
  const [directive, setDirective] = useState(
    "Process new incoming leads, qualify them, update our CRM, and draft personalized follow-up emails"
  );
  const [leads, setLeads] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [crmLoading, setCrmLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("workflow"); // 'workflow' | 'crm' | 'logs'
  const [integrations, setIntegrations] = useState(null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);

  // Fetch CRM leads on mount or refresh
  const fetchCrmLeads = async () => {
    setCrmLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/crm/leads`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.leads && data.leads.length > 0 && !selectedLeadId) {
          setSelectedLeadId(data.leads[0].id);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch CRM leads:", err);
    } finally {
      setCrmLoading(false);
    }
  };

  const fetchIntegrations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/crm/integrations`);
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCrmLeads();
      fetchIntegrations();
    }
  }, [isOpen]);

  // Poll task status if waiting for approval or in progress
  useEffect(() => {
    let interval = null;
    if (activeTask && (activeTask.status === "PLANNING" || activeTask.status === "QUALIFYING")) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/workflow/status/${activeTask.task_id}`);
          if (res.ok) {
            const data = await res.json();
            setActiveTask(data);
          }
        } catch (e) {
          // ignore polling error
        }
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTask]);

  // Launch workflow
  const handleRunWorkflow = async () => {
    if (!directive.trim()) return;
    setIsRunning(true);
    try {
      const payload = {
        directive: directive.trim(),
        lead_id: selectedLeadId ? parseInt(selectedLeadId, 10) : null,
      };
      const res = await fetch(`${API_BASE}/api/workflow/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Execution failed: ${res.statusText}`);
      }
      const data = await res.json();
      setActiveTask(data);
      if (onShowToast) {
        onShowToast(`⚡ Multi-Agent Crew dispatched for lead #${data.target_lead?.id || ""}`);
      }
      await fetchCrmLeads();
    } catch (err) {
      alert(`Workflow Run Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Human-in-the-Loop decision
  const handleHitlApproval = async (approved) => {
    if (!activeTask || !activeTask.task_id) return;
    setIsApproving(true);
    try {
      const res = await fetch(`${API_BASE}/api/workflow/approve/${activeTask.task_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approved,
          feedback: approved
            ? "Authorized by human supervisor for production dispatch."
            : "Rejected by human supervisor during supervisory review.",
        }),
      });

      if (!res.ok) {
        throw new Error(`Approval failed: ${res.statusText}`);
      }
      const data = await res.json();

      // Refresh task state
      const taskRes = await fetch(`${API_BASE}/api/workflow/status/${activeTask.task_id}`);
      if (taskRes.ok) {
        const fullTask = await taskRes.json();
        setActiveTask(fullTask);
      } else {
        setActiveTask((prev) => ({ ...prev, status: approved ? "COMPLETED" : "REJECTED" }));
      }

      await fetchCrmLeads();
      if (onShowToast) {
        onShowToast(
          approved
            ? "✅ Action Approved! CRM record updated & email dispatched."
            : "❌ Action Rejected. Staged changes canceled."
        );
      }
    } catch (err) {
      alert(`HITL Decision Error: ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  // Reset CRM Mock Data
  const handleResetCrm = async () => {
    if (!confirm("Reset CRM database to fresh initial inbound leads?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/crm/reset`, { method: "POST" });
      if (res.ok) {
        await fetchCrmLeads();
        setActiveTask(null);
        if (onShowToast) onShowToast("♻️ CRM database reset to seed state.");
      }
    } catch (e) {
      alert("Failed to reset CRM.");
    }
  };

  // Export CSV for Excel / Google Sheets
  const handleExportCsv = () => {
    window.open(`${API_BASE}/api/crm/export`, "_blank");
  };

  // Trigger Google Sheets Webhook Sync
  const handleSyncSheets = async () => {
    setIsSyncingSheets(true);
    try {
      const res = await fetch(`${API_BASE}/api/crm/sync-sheets`, { method: "POST" });
      const data = await res.json();
      if (onShowToast) {
        onShowToast(
          data.webhook_configured
            ? `📊 Synced ${data.synced_count} leads to Google Sheets!`
            : "ℹ️ Webhook dispatched. To connect live sheet, add GOOGLE_SHEETS_WEBHOOK_URL to .env."
        );
      }
    } catch (e) {
      alert("Failed to dispatch Google Sheets sync.");
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  if (!isOpen) return null;

  const approval = activeTask?.approval_payload;
  const isPendingApproval = activeTask?.status === "PENDING_APPROVAL";
  const isCompleted = activeTask?.status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 anim-chat-open">
      <div className="glass-card w-full max-w-6xl rounded-2xl flex flex-col h-[92vh] overflow-hidden border border-cyan-500/30 shadow-2xl bg-[#090d16]">
        {/* ── 1. MODAL HEADER ──────────────────────────────────────────────── */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/80 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-white tracking-wide font-mono">
                  AUTONOMOUS ENTERPRISE WORKFORCE
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                  CrewAI Multi-Agent + HITL
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                  Hackathon Challenge
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Autonomous multi-agent orchestration for cross-platform enterprise task execution with supervisory checkpointing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="bg-slate-950/80 p-1 rounded-xl border border-white/10 flex items-center space-x-1 text-xs">
              <button
                onClick={() => setActiveTab("workflow")}
                className={`px-3 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "workflow"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}>
                <Layers className="w-3.5 h-3.5" />
                <span>Workflow & DAG</span>
              </button>
              <button
                onClick={() => setActiveTab("crm")}
                className={`px-3 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "crm"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}>
                <Database className="w-3.5 h-3.5" />
                <span>Simulated CRM ({leads.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("logs")}
                className={`px-3 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "logs"
                    ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}>
                <Terminal className="w-3.5 h-3.5" />
                <span>Agent Execution Logs</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── 2. MODAL BODY ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#070a12]">
          {/* TAB 1: WORKFLOW & HITL VIEW */}
          {activeTab === "workflow" && (
            <div className="space-y-5">
              {/* Directive Input Box & Lead Selector */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Natural Language Enterprise Business Directive
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">Target CRM Lead:</span>
                    <select
                      value={selectedLeadId}
                      onChange={(e) => setSelectedLeadId(e.target.value)}
                      disabled={isRunning}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white outline-none focus:border-cyan-400 cursor-pointer">
                      {leads.map((l) => (
                        <option key={l.id} value={l.id}>
                          #{l.id} {l.name} · {l.company} ({l.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <textarea
                    rows={2}
                    value={directive}
                    onChange={(e) => setDirective(e.target.value)}
                    placeholder="Enter natural language business directive for the multi-agent workforce..."
                    className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition resize-none font-mono"
                  />
                  <button
                    onClick={handleRunWorkflow}
                    disabled={isRunning || !directive.trim()}
                    className="px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 transition shadow-lg shadow-cyan-500/25 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-w-[150px]">
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Orchestrating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        <span>Launch Multi-Agent Crew</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
                  <span className="text-[10px] text-slate-500 font-mono uppercase shrink-0">Workflow Presets:</span>
                  {[
                    "Process new incoming leads, qualify them, update our CRM, and draft personalized follow-up emails",
                    "Analyze enterprise cloud footprint, evaluate ACV deal fit, stage CRM pipeline, and draft executive outreach",
                    "Qualify inbound VIP fintech lead, check compliance signals, stage proposal in CRM, and prepare outreach memo",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDirective(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[10.5px] text-slate-300 hover:text-white transition cursor-pointer whitespace-nowrap shrink-0">
                      Preset {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4-STAGE EXECUTION DAG PROGRESS */}
              {activeTask && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                        Multi-Agent Execution DAG & Task Progression
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Task ID: <code className="text-cyan-300 font-bold">{activeTask.task_id}</code>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-slate-400">Current Status:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border font-mono ${
                          activeTask.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                            : activeTask.status === "PENDING_APPROVAL"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse"
                            : activeTask.status === "REJECTED"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                            : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                        }`}>
                        {activeTask.status}
                      </span>
                    </div>
                  </div>

                  {/* DAG Stages Timeline Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                    {(activeTask.dag || []).map((step, idx) => {
                      const isStepDone = step.status === "COMPLETED";
                      const isStepActive = step.status === "IN_PROGRESS";
                      const isStepWaiting = step.status === "WAITING" || step.status === "PENDING";
                      const isStepRejected = step.status === "REJECTED";

                      return (
                        <div
                          key={step.id || idx}
                          className={`p-3 rounded-xl border flex flex-col justify-between text-xs transition ${
                            isStepDone
                              ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                              : isStepActive
                              ? "bg-cyan-950/40 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10"
                              : isStepRejected
                              ? "bg-rose-950/30 border-rose-500/40 text-rose-300"
                              : "bg-slate-900/40 border-slate-800 text-slate-500"
                          }`}>
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono font-bold">STAGE {idx + 1}</span>
                              {isStepDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {isStepActive && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
                              {isStepWaiting && <span className="w-2 h-2 rounded-full bg-slate-600" />}
                              {isStepRejected && <X className="w-3.5 h-3.5 text-rose-400" />}
                            </div>
                            <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug">
                              {step.title.replace(/^\d+\.\s*/, "")}
                            </h4>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                            {step.agent}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── 3. SUPERVISOR & HUMAN-IN-THE-LOOP (HITL) CHECKPOINT CARD ── */}
              {isPendingApproval && approval && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/60 shadow-2xl space-y-4 anim-float-up">
                  {/* Alert Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                        <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white tracking-wide">
                            SUPERVISOR CHECKPOINT: HUMAN-IN-THE-LOOP AUTHORIZATION REQUIRED
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-black uppercase font-mono">
                            Pending Approval
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-200/80">
                          {approval.checkpoint_policy ||
                            "High-risk enterprise action staged. Execution halted until supervisor provides cryptographic sign-off."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHitlApproval(false)}
                        disabled={isApproving}
                        className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40">
                        <X className="w-4 h-4 text-rose-400" />
                        <span>Reject & Abort</span>
                      </button>
                      <button
                        onClick={() => handleHitlApproval(true)}
                        disabled={isApproving}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer disabled:opacity-40">
                        {isApproving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        <span>✅ Approve & Dispatch Action</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary Grid: Lead & CRM Staging & Email Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Left: Lead Qualification & Staged CRM Status */}
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                            1. Target Lead & Qualification
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                              approval.qualification_tier === "HOT"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}>
                            Score: {approval.qualification_score}/100 · Tier: {approval.qualification_tier}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-sm font-bold text-white">{approval.lead_name}</h4>
                          <span className="text-xs text-slate-400">
                            {approval.lead_title} · {approval.company}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-slate-300 leading-relaxed bg-slate-950 p-2.5 rounded-lg border border-white/5">
                          {approval.qualification_notes}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 font-mono uppercase">
                          2. Staged CRM State Changes
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[10px] text-slate-500 font-mono block">Proposed Pipeline Status:</span>
                            <span className="font-bold text-cyan-300 font-mono text-[11px]">
                              {approval.staged_crm_status}
                            </span>
                          </div>
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5">
                            <span className="text-[10px] text-slate-500 font-mono block">Activity Note:</span>
                            <span className="text-slate-300 text-[11px] line-clamp-1">{approval.staged_crm_notes}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Full Email Draft Preview */}
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-400 font-mono uppercase flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-cyan-400" />
                            3. Staged Outreach Email Draft
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">To: {approval.recipient_email}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-white/5 text-xs font-mono text-slate-200">
                          <span className="text-slate-500">Subject: </span>
                          <span className="font-bold text-white">{approval.email_subject}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-white/5 text-[11.5px] text-slate-300 whitespace-pre-wrap font-sans max-h-48 overflow-y-auto leading-relaxed">
                          {approval.email_body}
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-white/5">
                        <span>Tool: EmailDispatcherTool (SMTP Staged)</span>
                        <button
                          onClick={() => handleCopy("email_body", approval.email_body)}
                          className="text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer">
                          {copiedKey === "email_body" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === "email_body" ? "Copied" : "Copy Draft"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. COMPLETION CELEBRATION CARD ── */}
              {isCompleted && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between anim-float-up">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Autonomous Enterprise Workflow Completed</h4>
                      <p className="text-xs text-emerald-200/80">
                        Lead qualified, CRM pipeline committed to database, and outreach email dispatched via SMTP.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("crm")}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                    <span>View Updated CRM</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE SIMULATED CRM DATABASE TABLE */}
          {activeTab === "crm" && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    Enterprise CRM Database (Supabase Cloud + Google Sheets Sync)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live enterprise records. Agents research firmographics, evaluate scores, and stage CRM movements.
                  </p>

                  {/* Integration Status Badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-mono flex items-center gap-1.5 border bg-slate-900 border-slate-700 text-slate-300">
                      <Database className="w-3 h-3 text-cyan-400" />
                      <span>CRM Backend:</span>
                      <span className={integrations?.supabase?.enabled ? "text-emerald-400 font-bold" : "text-cyan-300 font-bold"}>
                        {integrations?.supabase?.enabled ? "⚡ Supabase Cloud (PostgreSQL)" : "📁 SQLite (Local / Vercel Serverless)"}
                      </span>
                    </span>

                    <span className="px-2.5 py-0.5 rounded-lg text-[10.5px] font-mono flex items-center gap-1.5 border bg-slate-900 border-slate-700 text-slate-300">
                      <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                      <span>Google Sheets / Excel:</span>
                      <span className={integrations?.google_sheets_crm?.webhook_configured ? "text-emerald-400 font-bold" : "text-amber-300 font-bold"}>
                        {integrations?.google_sheets_crm?.webhook_configured ? "🔗 Webhook Sync Active" : "📥 Export Enabled"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    title="Export CRM database as CSV for Google Sheets / Excel"
                    className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Excel / Sheets</span>
                  </button>

                  <button
                    onClick={handleSyncSheets}
                    disabled={isSyncingSheets}
                    title="Send current leads to Google Sheets webhook"
                    className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40">
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? "animate-spin" : ""}`} />
                    <span>Sync to Sheets</span>
                  </button>

                  <button
                    onClick={handleResetCrm}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer">
                    ♻️ Reset Demo
                  </button>

                  <button
                    onClick={fetchCrmLeads}
                    disabled={crmLoading}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40">
                    <RefreshCw className={`w-3.5 h-3.5 ${crmLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] font-mono border-b border-white/10">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Lead / Company</th>
                      <th className="p-3">Industry</th>
                      <th className="p-3">Revenue & Size</th>
                      <th className="p-3">Deal Value</th>
                      <th className="p-3">Score & Tier</th>
                      <th className="p-3">CRM Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-mono font-bold text-cyan-400">#{l.id}</td>
                        <td className="p-3">
                          <div className="font-bold text-white">{l.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {l.title} · <span className="text-cyan-300 font-semibold">{l.company}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-300">{l.industry}</td>
                        <td className="p-3">
                          <div>{l.annual_revenue}</div>
                          <div className="text-[10px] text-slate-500">{l.company_size}</div>
                        </td>
                        <td className="p-3 font-mono text-emerald-400 font-bold">
                          ${l.deal_value?.toLocaleString()}
                        </td>
                        <td className="p-3">
                          {l.qualification_score > 0 ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                l.qualification_tier === "HOT"
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              }`}>
                              {l.qualification_score}/100 · {l.qualification_tier}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-mono text-[10px]">Pending Eval</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-bold border ${
                              l.status === "QUALIFIED_PROPOSAL_STAGED"
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                                : l.status === "OUTREACH_DISPATCHED"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                            {l.status}
                          </span>
                          {l.staged_status && (
                            <div className="text-[9.5px] text-amber-400 mt-1 font-mono">
                              Staged: {l.staged_status}
                            </div>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedLeadId(l.id);
                              setActiveTab("workflow");
                              setDirective(
                                `Process incoming lead #${l.id} (${l.name} at ${l.company}), qualify their tech stack (${l.tech_stack}), update CRM, and draft personalized outreach`
                              );
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-600/80 hover:bg-cyan-500 text-white text-[10px] font-bold transition cursor-pointer">
                            Target Lead
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AGENT EXECUTION LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Real-Time Multi-Agent Execution Stream
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeTask?.logs?.length || 0} event entries recorded
                </span>
              </div>

              {activeTask?.logs && activeTask.logs.length > 0 ? (
                <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
                  {activeTask.logs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1 hover:border-cyan-500/30 transition">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-cyan-300">{log.agent}</span>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {log.stage}
                          </span>
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-slate-200 text-[11px] leading-relaxed">{log.message}</p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <pre className="text-[9.5px] bg-slate-900 p-2 rounded text-slate-400 overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-950 rounded-xl border border-white/5">
                  No active workflow logs yet. Launch a directive from the "Workflow & DAG" tab.
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── 3. MODAL FOOTER ────────────────────────────────────────────── */}
        <div className="px-5 py-3 border-t border-white/10 bg-slate-950 text-xs text-slate-400 flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>FastAPI Backend Connected: `http://localhost:8000`</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">
              Endpoints: `/api/workflow/run` · `/api/workflow/approve` · `/api/crm/leads`
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition cursor-pointer">
              Close Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
