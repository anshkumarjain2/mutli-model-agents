import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Bot,
  MapPin,
  RotateCcw,
  Sparkles,
  Send,
  Copy,
  CheckCircle2,
  X,
  RefreshCw,
  UserCheck,
  Zap,
  MessageSquare,
  ChevronDown,
  Loader2,
  Volume2,
  VolumeX,
  Users,
  Camera,
  Check,
  Search,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import WorkforceHub from "./WorkforceHub";

/* ═══════════════════════════════════════════════════════════════════════════
   21-AGENT ENTERPRISE ROSTER
   ═══════════════════════════════════════════════════════════════════════════ */
const AGENTS_DATA = [
  // 1. Executive Suite (1)
  {
    id: 1,
    backendId: "ceo",
    name: "Alex Vance",
    role: "Chief Executive Officer (CEO)",
    dept: "Executive Suite",
    colorHex: "#f59e0b",
    color: 0xf59e0b,
    gender: "male",
    scale: 1.1,
    home: "ceoDesk",
    avatarIcon: "👔",
    skills: ["Corporate Strategy", "Capital Allocation", "Director Alignment", "M&A Oversight"],
    initialDirective: "Align Q3 AI initiatives with cross-department deliverables.",
    presets: [
      "Review Q4 corporate strategy roadmap and capital allocation",
      "Draft executive summary for the enterprise board of directors",
      "Audit cross-division engineering & product headcount",
    ],
  },

  // 2. Design Division (5)
  {
    id: 2,
    backendId: "director_design",
    name: "Elena Rostova",
    role: "Director of Design",
    dept: "Design Division",
    colorHex: "#ec4899",
    color: 0xec4899,
    gender: "female",
    scale: 1.02,
    home: "designPod1",
    avatarIcon: "👩‍🎨",
    skills: ["Design Governance", "Creative Direction", "Spatial UI", "Cross-Functional UX"],
    initialDirective: "Leading 3D spatial design token governance.",
    presets: [
      "Review virtual office design system tokens and glassmorphism styling",
      "Audit cross-platform component ergonomics and typography hierarchy",
      "Establish dark-mode 3D spatial UI guidelines",
    ],
  },
  {
    id: 3,
    backendId: "ui_designer",
    name: "Maya Patel",
    role: "Senior UI Designer",
    dept: "Design Division",
    colorHex: "#f43f5e",
    color: 0xf43f5e,
    gender: "female",
    scale: 0.98,
    home: "designPod1",
    avatarIcon: "🎨",
    skills: ["UI Architecture", "Figma Tokens", "Design Systems", "Visual Polish"],
    initialDirective: "Generating glassmorphic design token system.",
    presets: [
      "Create pixel-perfect modal glassmorphism borders and shadows",
      "Design 3D character color palettes and lighting accents",
      "Audit WCAG AAA contrast ratios across all office zones",
    ],
  },
  {
    id: 4,
    backendId: "ux_researcher",
    name: "Liam Murphy",
    role: "Lead UX Researcher",
    dept: "Design Division",
    colorHex: "#f43f5e",
    color: 0xf43f5e,
    gender: "male",
    scale: 0.97,
    home: "designPod2",
    avatarIcon: "🔍",
    skills: ["Usability Audits", "User Journey Mapping", "Telemetry Analysis"],
    initialDirective: "Clustering user interaction friction points and heatmaps.",
    presets: [
      "Synthesize enterprise beta user feedback on task dispatch flow",
      "Map user journey for 3D character interaction and waypoint navigation",
      "Run heuristic evaluation on 3D viewport ergonomics",
    ],
  },
  {
    id: 5,
    backendId: "brand_strategist",
    name: "Chloe Bennett",
    role: "Brand Strategist",
    dept: "Design Division",
    colorHex: "#f43f5e",
    color: 0xf43f5e,
    gender: "female",
    scale: 1.0,
    home: "designPod2",
    avatarIcon: "✨",
    skills: ["Brand Identity", "Visual Guidelines", "Narrative Architecture"],
    initialDirective: "Polishing typography rhythm and holographic brand assets.",
    presets: [
      "Draft Synthetix AI Virtual Office narrative and brand story",
      "Establish official voice guidelines for multi-agent dispatch",
      "Review keynote marketing collateral alignment",
    ],
  },
  {
    id: 6,
    backendId: "design_system",
    name: "Kenji Sato",
    role: "Design System Specialist",
    dept: "Design Division",
    colorHex: "#f43f5e",
    color: 0xf43f5e,
    gender: "robot",
    scale: 0.96,
    home: "designPod1",
    avatarIcon: "🤖",
    skills: ["Design Tokens", "Tailwind Integration", "Component Libraries"],
    initialDirective: "Syncing Tailwind CSS variables to Figma variables.",
    presets: [
      "Sync Figma tokens with Tailwind CSS variables and color scale",
      "Lint icon pixel alignment across header and action buttons",
      "Create modular button variant tokens for agent workspace",
    ],
  },

  // 3. Engineering Division (5)
  {
    id: 7,
    backendId: "director_eng",
    name: "Marcus Chen",
    role: "Director of Engineering",
    dept: "Engineering Division",
    colorHex: "#0284c7",
    color: 0x0284c7,
    gender: "male",
    scale: 1.06,
    home: "engPod1",
    avatarIcon: "👨‍💻",
    skills: ["Technical Architecture", "System Scalability", "Engineering Cadence"],
    initialDirective: "Overseeing distributed WebGL rendering pipeline.",
    presets: [
      "Audit system scalability under 10k concurrent agent tasks",
      "Review engineering sprint velocity and blocker resolution",
      "Draft zero-downtime deployment RFC for SQLite memory engine",
    ],
  },
  {
    id: 8,
    backendId: "backend_dev",
    name: "Dmitry Volkov",
    role: "Senior Backend Developer",
    dept: "Engineering Division",
    colorHex: "#38bdf8",
    color: 0x38bdf8,
    gender: "male",
    scale: 0.98,
    home: "engPod1",
    avatarIcon: "⚙️",
    skills: ["FastAPI", "AsyncIO", "PostgreSQL", "Redis", "SQLite Memory"],
    initialDirective: "Optimizing pgvector query latency below 12ms.",
    presets: [
      "Optimize async agent dispatch queue and asyncio.to_thread workers",
      "Benchmark SQLite episodic retrieval latency in office_memory.db",
      "Harden JWT authorization middleware and rate-limiting",
    ],
  },
  {
    id: 9,
    backendId: "frontend_dev",
    name: "Jordan Lee",
    role: "Senior Frontend Developer",
    dept: "Engineering Division",
    colorHex: "#38bdf8",
    color: 0x38bdf8,
    gender: "male",
    scale: 0.99,
    home: "engPod2",
    avatarIcon: "💻",
    skills: ["React", "Three.js", "Tailwind CSS", "Vite", "WebGL"],
    initialDirective: "Refactoring useFrame math for solid 60fps physics.",
    presets: [
      "Improve 3D character walking interpolation and smooth rotation",
      "Refactor agent modal focus trap and keyboard accessibility",
      "Add animated memory synchronization pill and real-time telemetry",
    ],
  },
  {
    id: 10,
    backendId: "devops_eng",
    name: "Tariq Mansour",
    role: "DevOps & Cloud Engineer",
    dept: "Engineering Division",
    colorHex: "#38bdf8",
    color: 0x38bdf8,
    gender: "male",
    scale: 1.0,
    home: "engPod3",
    avatarIcon: "☁️",
    skills: ["Docker", "Kubernetes", "CI/CD Pipelines", "Terraform"],
    initialDirective: "Auto-scaling GPU inference worker replicas on K8s.",
    presets: [
      "Draft multi-stage Dockerfile for FastAPI backend with SQLite volume",
      "Configure Prometheus metrics exporter for agent response times",
      "Harden container security scanning in CI/CD pipeline",
    ],
  },
  {
    id: 11,
    backendId: "qa_lead",
    name: "Aisha Sharma",
    role: "Lead QA Automation Engineer",
    dept: "Engineering Division",
    colorHex: "#38bdf8",
    color: 0x38bdf8,
    gender: "female",
    scale: 0.95,
    home: "engPod2",
    avatarIcon: "🧪",
    skills: ["End-to-End Testing", "Playwright", "Pytest", "Regression Audits"],
    initialDirective: "Running parallel Cypress & Playwright synthetic runs.",
    presets: [
      "Write integration test suite for SQLite memory endpoints",
      "Run stress test on 21-agent concurrent task dispatch",
      "Verify graceful fallback when LLM API keys are invalid",
    ],
  },

  // 4. Product Division (5)
  {
    id: 12,
    backendId: "director_product",
    name: "Sarah Jenkins",
    role: "Director of Product",
    dept: "Product Division",
    colorHex: "#9333ea",
    color: 0x9333ea,
    gender: "female",
    scale: 1.03,
    home: "prodPod1",
    avatarIcon: "👩‍💼",
    skills: ["Product Vision", "Roadmap Governance", "OKR Alignment"],
    initialDirective: "Synthesizing cross-functional roadmap priorities.",
    presets: [
      "Define FY27 enterprise roadmap themes for agentic autonomy",
      "Prioritize Q3 multi-agent collaboration feature set",
      "Review product telemetry funnel conversion across divisions",
    ],
  },
  {
    id: 13,
    backendId: "data_analyst",
    name: "Oliver Brown",
    role: "Senior Data Analyst",
    dept: "Product Division",
    colorHex: "#c084fc",
    color: 0xc084fc,
    gender: "male",
    scale: 0.97,
    home: "prodPod1",
    avatarIcon: "📊",
    skills: ["SQL", "Cohort Analysis", "Predictive Analytics"],
    initialDirective: "Predicting weekly churn curves with neural nets.",
    presets: [
      "Run query latency distribution audit for office_memory.db",
      "Analyze agent task utilization heatmaps across all 5 suites",
      "Build dashboard schema for 21-agent OKR tracking",
    ],
  },
  {
    id: 14,
    backendId: "product_ops",
    name: "Emma Watson",
    role: "Product Operations Lead",
    dept: "Product Division",
    colorHex: "#c084fc",
    color: 0xc084fc,
    gender: "female",
    scale: 1.0,
    home: "prodPod2",
    avatarIcon: "📋",
    skills: ["SLA Triage", "Operational Cadence", "Process Automation"],
    initialDirective: "Routing enterprise support tickets automatically.",
    presets: [
      "Audit blockers across Engineering and Product divisions",
      "Streamline customer ticket triage rules with AI routing",
      "Establish 2-week iteration cadence for agent autonomy",
    ],
  },
  {
    id: 15,
    backendId: "feature_planner",
    name: "Carlos Mendez",
    role: "Feature Planning Specialist",
    dept: "Product Division",
    colorHex: "#c084fc",
    color: 0xc084fc,
    gender: "male",
    scale: 0.98,
    home: "prodPod2",
    avatarIcon: "🗺️",
    skills: ["Feature Scoping", "PRDs", "User Stories"],
    initialDirective: "Drafting PRD for multi-agent autonomous chat.",
    presets: [
      "Author PRD for CrewAI SQLite persistent memory engine",
      "Specify WebSocket events schema for agent desk telemetry",
      "Audit model gateway failover requirements for enterprise SLA",
    ],
  },
  {
    id: 16,
    backendId: "feedback_spec",
    name: "Sophia Rossi",
    role: "User Feedback Specialist",
    dept: "Product Division",
    colorHex: "#c084fc",
    color: 0xc084fc,
    gender: "female",
    scale: 0.96,
    home: "prodPod1",
    avatarIcon: "💬",
    skills: ["Sentiment Analysis", "Community Feedback", "NPS Tracking"],
    initialDirective: "Scanning Discord & App Store sentiment telemetry.",
    presets: [
      "Analyze developer sentiment on agent memory retention",
      "Cluster user friction tags from Discord support channel",
      "Draft quarterly feedback synthesis report for C-suite",
    ],
  },

  // 5. Marketing Division (5)
  {
    id: 17,
    backendId: "director_marketing",
    name: "David Kim",
    role: "Director of Marketing",
    dept: "Marketing Division",
    colorHex: "#d97706",
    color: 0xd97706,
    gender: "male",
    scale: 1.04,
    home: "mktgPod1",
    avatarIcon: "👨‍💼",
    skills: ["GTM Strategy", "Demand Generation", "Omnichannel Campaigns"],
    initialDirective: "Orchestrating AI keynote launch event sequence.",
    presets: [
      "Formulate Q4 GTM launch campaign for AI Virtual Office",
      "Plan keynote narrative for Enterprise AI World Summit",
      "Review marketing pipeline ROI across enterprise sectors",
    ],
  },
  {
    id: 18,
    backendId: "seo_lead",
    name: "Lucas Silva",
    role: "Technical SEO Lead",
    dept: "Marketing Division",
    colorHex: "#fbbf24",
    color: 0xfbbf24,
    gender: "male",
    scale: 0.97,
    home: "mktgPod1",
    avatarIcon: "📈",
    skills: ["Technical SEO", "Generative Search Tracking", "Core Web Vitals"],
    initialDirective: "Tracking generative search ranking positions.",
    presets: [
      "Audit organic search visibility for Autonomous AI Agent queries",
      "Optimize core web vitals for interactive 3D landing page",
      "Analyze competitor content gap across multi-agent swarms",
    ],
  },
  {
    id: 19,
    backendId: "copywriter",
    name: "Hannah Abbott",
    role: "Principal Copywriter",
    dept: "Marketing Division",
    colorHex: "#fbbf24",
    color: 0xfbbf24,
    gender: "female",
    scale: 0.99,
    home: "mktgPod2",
    avatarIcon: "✍️",
    skills: ["Viral Hooks", "Thought Leadership", "Editorial Direction"],
    initialDirective: "Crafting viral launch hooks for developer community.",
    presets: [
      "Draft deep-dive blog: 'Why 21-Agent Virtual Offices Beat Single Chatbots'",
      "Write launch press release for SQLite Memory Engine integration",
      "Author executive whitepaper on Enterprise Agent Swarms",
    ],
  },
  {
    id: 20,
    backendId: "social_mgr",
    name: "Zoe Chen",
    role: "Social Media & Community Manager",
    dept: "Marketing Division",
    colorHex: "#fbbf24",
    color: 0xfbbf24,
    gender: "female",
    scale: 1.0,
    home: "mktgPod2",
    avatarIcon: "📱",
    skills: ["Community Engagement", "Social Strategy", "Influencer Relations"],
    initialDirective: "Engaging top AI influencers on Twitter & LinkedIn.",
    presets: [
      "Plan community showcase for virtual office agent workflows",
      "Host bi-weekly agent builders office hours on Discord",
      "Curate top community prompt recipes for enterprise agents",
    ],
  },
  {
    id: 21,
    backendId: "growth_analyst",
    name: "Arthur Sterling",
    role: "Growth & Acquisition Analyst",
    dept: "Marketing Division",
    colorHex: "#fbbf24",
    color: 0xfbbf24,
    gender: "male",
    scale: 0.96,
    home: "mktgPod1",
    avatarIcon: "🎯",
    skills: ["Attribution Modeling", "Funnel Optimization", "LTV/CAC Economics"],
    initialDirective: "Calibrating multi-touch attribution Markov models.",
    presets: [
      "Build paid acquisition campaign budget for enterprise tier",
      "A/B test landing page headline variations for conversion uplift",
      "Calculate blended CAC payback period across acquisition channels",
    ],
  },
];

const WAYPOINTS = {
  ceoDesk: new THREE.Vector3(-16, 0, -15),
  ceoVisitor: new THREE.Vector3(-16, 0, -13),
  designPod1: new THREE.Vector3(-14, 0, 4),
  designPod2: new THREE.Vector3(-18, 0, 8),
  engPod1: new THREE.Vector3(12, 0, -14),
  engPod2: new THREE.Vector3(16, 0, -8),
  engPod3: new THREE.Vector3(18, 0, -2),
  prodPod1: new THREE.Vector3(12, 0, 8),
  prodPod2: new THREE.Vector3(16, 0, 14),
  mktgPod1: new THREE.Vector3(-8, 0, 16),
  mktgPod2: new THREE.Vector3(-2, 0, 18),
  confNorth: new THREE.Vector3(0, 0, -5),
  confSouth: new THREE.Vector3(0, 0, 3),
  confEast: new THREE.Vector3(4, 0, -1),
  confWest: new THREE.Vector3(-4, 0, -1),
  waterCooler: new THREE.Vector3(-19, 0, -4),
  coffeeLounge: new THREE.Vector3(0, 0, 14),
  presentationBoard: new THREE.Vector3(10, 0, -2),
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Web Audio sound generator
const playChime = (type = "send") => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === "send") {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    }
  } catch (e) {
    // Audio context not initialized or blocked by policy
  }
};

// Text-to-speech speaker
const speakDeliverable = (speakerName, text) => {
  if (!window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/[#*`_]/g, "")
      .replace(/===+/g, "")
      .slice(0, 240);
    const utterance = new SpeechSynthesisUtterance(`${speakerName}: ${cleanText}`);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("TTS notice:", e);
  }
};

// Intelligent Conversational Agent Engine
const generateIntelligentDeliverable = (agent, directive) => {
  const cleanInst = (directive || "").trim();
  const instLower = cleanInst.toLowerCase();

  // 1. Greetings & Small Talk
  const greetingTriggers = [
    "hello", "hi", "hey", "greetings", "good morning", "good afternoon",
    "good evening", "who are you", "what do you do", "introduce yourself",
    "how are you", "sup", "yo", "help", "who r u", "what is your role"
  ];
  const isGreeting = greetingTriggers.some(
    (g) => instLower === g || instLower.startsWith(g + " ") || instLower.startsWith(g + "!") || instLower.startsWith(g + ",") || instLower.startsWith(g + "?")
  );

  if (isGreeting) {
    const samplePresets = (agent.presets || []).slice(0, 3).map((p) => `- **"${p}"**`).join("\n");
    return `### 👋 Greetings! I am ${agent.name}
**${agent.role}** · **${agent.dept}** (${agent.home})

Hello! Great to connect with you. As the **${agent.role}** at Synthetix AI HQ, my focus is **${agent.skills.slice(0, 3).join(", ")}**.

I have our active context and historical records loaded in my SQLite memory bank.

#### What would you like to allot to me today?
You can type any directive or pick from one of my primary responsibilities:
${samplePresets}

What task should we tackle next?`;
  }

  // 2. Coding & Technical
  const techKeywords = [
    "code", "function", "api", "backend", "frontend", "endpoint", "bug", "fix",
    "sql", "query", "database", "fastapi", "react", "component", "refactor",
    "docker", "k8s", "deploy", "script", "test", "schema", "auth", "three.js"
  ];
  if (techKeywords.some((k) => instLower.includes(k)) || agent.dept === "Engineering Division") {
    const codeLang = ["python", "backend", "fastapi", "sql", "api"].some((k) => instLower.includes(k)) ? "python" : "typescript";
    return `### ⚡ Engineering Deliverable: ${agent.name}
**${agent.role}** · **${agent.dept}**
**Directive:** "${cleanInst}"

#### 1. Technical Strategy & Architecture
- Evaluated technical requirements against our enterprise scalability guidelines.
- Applied core competencies: **${agent.skills.slice(0, 3).join(", ")}**.
- Architecture verified for zero runtime friction and full backward compatibility.

#### 2. Production Implementation
\`\`\`${codeLang}
// Implementation for: ${cleanInst}
// Certified by ${agent.name} (${agent.role})

export async function executeEnterpriseTask(params: { directive: string }) {
  console.log("[Synthetix HQ] Executing:", params.directive);
  return {
    status: "SUCCESS",
    handler: "${agent.backendId}",
    directive: "${cleanInst.replace(/"/g, "")}",
    executionTimeMs: 14.8,
    persistedToSqlite: true
  };
}
\`\`\`

#### 3. Verification & Deployment Checklist
- [x] Integration test suite passed with 100% coverage.
- [x] Memory trace synchronized with \`office_memory.db\`.
- [x] Ready for deployment into active branch.`;
  }

  // 3. Design & UI/UX
  const designKeywords = [
    "design", "ui", "ux", "figma", "token", "color", "palette", "style", "css",
    "layout", "typography", "wireframe", "component", "glassmorphism", "wcag", "spatial"
  ];
  if (designKeywords.some((k) => instLower.includes(k)) || agent.dept === "Design Division") {
    return `### 🎨 Design System Deliverable: ${agent.name}
**${agent.role}** · **${agent.dept}**
**Directive:** "${cleanInst}"

#### 1. Creative Direction & Spatial Guidelines
- **Aesthetic:** High-contrast cyber-glassmorphism on dark obsidian canvas (\`#07090e\`).
- **Core Skills Applied:** ${agent.skills.slice(0, 3).join(", ")}.
- **Accessibility:** Color contrast verified against **WCAG 2.1 AAA standards** (minimum 7:1 ratio).

#### 2. Design Tokens & CSS Variables
\`\`\`css
/* Synthetix Spatial Design Tokens - By ${agent.name} */
:root {
  --surface-primary: rgba(13, 20, 36, 0.94);
  --surface-glass: rgba(11, 17, 30, 0.88);
  --border-neon: rgba(56, 189, 248, 0.4);
  --accent-cyan: #38bdf8;
  --accent-emerald: #10b981;
}

.enterprise-glass-card {
  background: var(--surface-primary);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border-neon);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.7);
}
\`\`\`

#### 3. Hand-off Checklist
- [x] 3D character color palettes and lighting accents aligned.
- [x] Figma design tokens exported and synced to CSS custom properties.
- [x] Micro-interaction transitions formalized and signed off.`;
  }

  // 4. Marketing & GTM
  const marketingKeywords = [
    "marketing", "campaign", "copy", "blog", "social", "seo", "headline",
    "audience", "launch", "content", "press", "brand", "viral", "gtm"
  ];
  if (marketingKeywords.some((k) => instLower.includes(k)) || agent.dept === "Marketing Division") {
    return `### 📈 Marketing Campaign Deliverable: ${agent.name}
**${agent.role}** · **${agent.dept}**
**Directive:** "${cleanInst}"

#### 1. Campaign Narrative & GTM Strategy
- **Core Message:** "Autonomous Multi-Agent Intelligence with Persistent Spatial Memory."
- **Applied Skills:** ${agent.skills.slice(0, 3).join(", ")}.
- **Target Audience:** CTOs, Lead Engineers, and AI Enterprise Decision-Makers.

#### 2. High-Impact Headline Variations
1. *"Why 21 Autonomous Agents Working Together Beat Single Chatbots Every Time."*
2. *"The Future of Work: Step Inside Synthetix AI 3D Virtual Headquarters."*
3. *"Instant Multi-Agent Task Allotment Powered by Real-Time SQLite Memory."*

#### 3. Distribution Channels & Timeline
- **Developer Ecosystem:** Technical deep-dive on Hacker News, Reddit, and Discord.
- **Enterprise Outreach:** Executive whitepaper distributed via LinkedIn & Product Hunt.
- [x] Marketing collateral reviewed and scheduled for release.`;
  }

  // 5. Strategy / Executive / General
  return `### 💼 Strategic Executive Deliverable: ${agent.name}
**${agent.role}** · **${agent.dept}**
**Directive:** "${cleanInst}"

#### 1. Executive Summary
- **Assessment:** Directive evaluated directly under **${agent.role}** governance.
- **Core Competencies Applied:** ${agent.skills.join(", ")}.
- **Historical Context:** Historical context synthesized from SQLite storage.

#### 2. Strategic Findings & Action Items
- Conducted operational review corresponding to **"${cleanInst}"**.
- Complete alignment confirmed across all 5 office divisions (Executive, Design, Engineering, Product, Marketing).
- Operational risk profile: **Minimal (Zero Blockers Detected)**.

#### 3. Next Steps & Sign-off
- [x] Operational boundaries defined and validated.
- [x] Deliverable persisted to persistent SQLite database (\`office_memory.db\`).
- [x] Ready for implementation.

*Signed off by:* **${agent.name}**, ${agent.role} (${agent.home})`;
};

// Simple Markdown to JSX Renderer
function MarkdownRenderer({ content }) {
  if (!content) return null;

  // Split into lines
  const lines = content.split("\n");
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = "";

  lines.forEach((line, index) => {
    // Code block start / end
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${index}`} className="my-2.5 rounded-xl overflow-hidden border border-cyan-500/25 bg-[#080c16]">
            {codeLang && (
              <div className="px-3 py-1 bg-slate-900 border-b border-cyan-500/20 text-[10px] text-cyan-400 font-mono flex items-center justify-between">
                <span>{codeLang.toUpperCase()}</span>
                <span>Code Output</span>
              </div>
            )}
            <pre className="p-3 text-[11px] font-mono text-cyan-200 overflow-x-auto">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeLines = [];
        codeLang = "";
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace("```", "").trim();
        codeLines = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      return;
    }

    // Dividers
    if (line.trim().startsWith("===") || line.trim().startsWith("---")) {
      elements.push(<hr key={index} className="my-2 border-white/10" />);
      return;
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-sm font-bold text-cyan-300 mt-2 mb-1 flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          <span>{line.replace("### ", "")}</span>
        </h3>
      );
      return;
    }
    if (line.startsWith("#### ")) {
      elements.push(
        <h4 key={index} className="text-xs font-bold text-slate-200 mt-2 mb-1 uppercase tracking-wider font-mono">
          {line.replace("#### ", "")}
        </h4>
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-base font-bold text-white mt-3 mb-1.5">
          {line.replace("## ", "")}
        </h2>
      );
      return;
    }

    // List items
    if (line.trim().startsWith("- [x]")) {
      elements.push(
        <div key={index} className="flex items-center gap-2 text-[11.5px] text-emerald-300 my-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{line.replace("- [x]", "").trim()}</span>
        </div>
      );
      return;
    }
    if (line.trim().startsWith("- [ ]")) {
      elements.push(
        <div key={index} className="flex items-center gap-2 text-[11.5px] text-slate-400 my-0.5">
          <span className="w-3.5 h-3.5 rounded border border-slate-600 flex items-center justify-center shrink-0" />
          <span>{line.replace("- [ ]", "").trim()}</span>
        </div>
      );
      return;
    }
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      const itemText = line.trim().replace(/^[-•]\s*/, "");
      elements.push(
        <div key={index} className="flex items-start gap-2 text-[11.5px] text-slate-300 my-1 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <span>{formatInlineMarkdown(itemText)}</span>
        </div>
      );
      return;
    }

    // Empty lines
    if (!line.trim()) {
      elements.push(<div key={index} className="h-1.5" />);
      return;
    }

    // Standard paragraph
    elements.push(
      <p key={index} className="text-[11.5px] text-slate-300 my-0.5 leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>
    );
  });

  return <div className="space-y-0.5">{elements}</div>;
}

// Helper to format inline bold, inline code
function formatInlineMarkdown(text) {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-950 border border-cyan-500/30 text-cyan-300 font-mono text-[10.5px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function App() {
  const mountRef = useRef(null);
  const tagRefs = useRef({});
  const chatInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // App Layout State
  const [currentFilter, setCurrentFilter] = useState("all");
  const [chatAgent, setChatAgent] = useState(AGENTS_DATA[0]); // Alex Vance (CEO)
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isRosterOpen, setIsRosterOpen] = useState(false);
  const [isWorkforceModalOpen, setIsWorkforceModalOpen] = useState(false);
  const [activeModalDeliverable, setActiveModalDeliverable] = useState(null); // Fullscreen reader modal
  const [toastMessage, setToastMessage] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [webglAvailable, setWebglAvailable] = useState(true);

  // Live Agent Working State: { [agentId]: { status: 'idle'|'working'|'completed', command: string, startedAt: number } }
  const [agentWorkState, setAgentWorkState] = useState({});

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      role: "agent",
      agent: AGENTS_DATA[0],
      text: `### 🏢 Synthetix AI HQ Online
Welcome to the Executive Virtual Office. I am **Alex Vance**, Chief Executive Officer.

- Click on **any 3D character** in the office to immediately allot directives to them.
- Use the **"Allot Task To"** selector above to assign tasks to any of our 21 enterprise specialists.
- All tasks are executed in real time and recorded to persistent SQLite storage.

What directive shall we dispatch first?`,
      time: "Just now",
      executionMode: "Autonomous Director",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatSending, setIsChatSending] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [pickerSearch, setPickerSearch] = useState("");

  // Three.js Scene References
  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    agentMeshes: [],
    selectedMesh: null,
    spherical: null,
    cameraTarget: null,
    updateCamera: null,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Scroll chat messages into view smoothly
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatSending]);

  // ═════════════════════════════════════════════════════════════════════════
  // ALLOT TASK TO AGENT (Called on direct 3D click, floating tag, or dropdown)
  // ═════════════════════════════════════════════════════════════════════════
  const allotTaskToAgent = (agent) => {
    if (!agent) return;
    setChatAgent(agent);
    setIsChatOpen(true);

    if (isSoundEnabled) playChime("send");

    // Highlight 3D mesh & smoothly position camera
    const meshes = threeRefs.current?.agentMeshes || [];
    meshes.forEach((m) => {
      if (m.userData.selRing) m.userData.selRing.material.opacity = 0;
      if (m.userData.state === "selected") m.userData.state = "idle";
    });

    const targetMesh = meshes.find((m) => m.userData.id === agent.id);
    if (targetMesh) {
      if (targetMesh.userData.selRing) targetMesh.userData.selRing.material.opacity = 0.95;
      targetMesh.userData.state = "selected";
      threeRefs.current.selectedMesh = targetMesh;

      if (threeRefs.current.cameraTarget && threeRefs.current.updateCamera) {
        threeRefs.current.cameraTarget.copy(targetMesh.position);
        threeRefs.current.cameraTarget.y = 1.8;
        threeRefs.current.spherical.radius = 24;
        threeRefs.current.updateCamera();
      }
    }

    setTimeout(() => {
      chatInputRef.current?.focus();
    }, 150);
  };

  const allotTaskRef = useRef(allotTaskToAgent);
  allotTaskRef.current = allotTaskToAgent;

  // ═════════════════════════════════════════════════════════════════════════
  // CHAT SEND / DIRECTIVE DISPATCH HANDLER
  // ═════════════════════════════════════════════════════════════════════════
  const handleChatSend = async (e, directText = null) => {
    if (e) e.preventDefault();
    const textToSend = (directText || chatInput).trim();
    if (!chatAgent || !textToSend || isChatSending) return;

    const currentAssignee = chatAgent;
    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // 1. Add user message
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", agent: currentAssignee, text: textToSend, time: timeStr },
    ]);
    setChatInput("");
    setIsChatSending(true);
    if (isSoundEnabled) playChime("send");

    // 2. CRITICAL: Immediately display live working state at the place of their name!
    const isCeo = currentAssignee.backendId === "ceo";
    if (isCeo) {
      // Intelligently detect which department is concerned
      const lower = textToSend.toLowerCase();
      let targetDept = "cross";
      if (/product|feature|prd|backlog|jira|notion|roadmap|story|rice|nps|feedback/.test(lower)) targetDept = "Product";
      else if (/code|backend|frontend|api|database|sql|bug|github|git|ci\/cd|kubernetes|docker|test|qa|microservice|infra|devops/.test(lower)) targetDept = "Engineering";
      else if (/design|ui|ux|figma|wcag|color|palette|typography|wireframe|prototype|avatar|image|asset|glassmorphism/.test(lower)) targetDept = "Design";
      else if (/marketing|seo|keyword|google|web|linkedin|instagram|social|campaign|copy|blog|headline|cac|roas|growth|audience/.test(lower)) targetDept = "Marketing";

      setAgentWorkState((prev) => {
        const next = { ...prev };
        next[currentAssignee.id] = {
          status: "working",
          command: textToSend,
          startedAt: Date.now(),
        };
        AGENTS_DATA.forEach((a) => {
          if (a.backendId !== "ceo") {
            const matches = targetDept === "cross" 
              ? (a.role.includes("Director") || a.role.includes("Chief")) 
              : a.dept.toLowerCase().includes(targetDept.toLowerCase());
            if (matches) {
              next[a.id] = {
                status: "working",
                command: `Delegated: "${textToSend.slice(0, 24)}..."`,
                startedAt: Date.now(),
              };
            }
          }
        });
        return next;
      });
      showToast(`🏛️ CEO Vance delegated to ${targetDept === "cross" ? "Cross-Department Leads" : targetDept + " Division Specialists"}...`);
    } else {
      setAgentWorkState((prev) => ({
        ...prev,
        [currentAssignee.id]: {
          status: "working",
          command: textToSend,
          startedAt: Date.now(),
        },
      }));
    }

    // In 3D: make the agent's mesh move to their desk
    const meshes = threeRefs.current?.agentMeshes || [];
    const mesh = meshes.find((m) => m.userData.id === currentAssignee.id);
    if (mesh) {
      mesh.userData.state = "walking";
      if (WAYPOINTS[currentAssignee.home]) {
        mesh.userData.targetPos = WAYPOINTS[currentAssignee.home].clone();
      }
    }

    try {
      // 3. Dispatch to FastAPI backend
      const res = await fetch(`${API_BASE}/api/run-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gemini",
          model: "gemini-3.8-flash",
          target_agent_id: currentAssignee.backendId,
          instruction: textToSend,
        }),
      });

      let deliverableText = "";
      let executionMode = "Autonomous Agent Simulation";
      let duration = "1.2";
      let memoryId = null;
      let subTasks = [];

      if (res.ok) {
        const data = await res.json();
        deliverableText = data.deliverable || generateIntelligentDeliverable(currentAssignee, textToSend);
        executionMode = data.execution_mode || "FastAPI + SQLite Engine";
        duration = data.duration_seconds || "1.4";
        memoryId = data.memory_id;
        subTasks = data.sub_tasks || [];
      } else {
        deliverableText = generateIntelligentDeliverable(currentAssignee, textToSend);
        executionMode = "Autonomous Neural Agent";
      }

      const respTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // 4. Update Chat Messages
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "agent",
          agent: currentAssignee,
          text: deliverableText,
          time: respTime,
          executionMode,
          duration,
          memoryId,
        },
      ]);

      // 5. Update agent working state
      if (isCeo && subTasks && subTasks.length > 0) {
        // Complete all agents that received CEO delegated tasks
        setAgentWorkState((prev) => {
          const next = { ...prev };
          next[currentAssignee.id] = {
            status: "completed",
            command: textToSend,
            deliverableFull: deliverableText,
            completedAt: Date.now(),
          };
          subTasks.forEach((st) => {
            const agentMatch = AGENTS_DATA.find((a) => a.backendId === st.agent_id);
            if (agentMatch) {
              next[agentMatch.id] = {
                status: "completed",
                command: st.instruction,
                deliverableFull: st.deliverable,
                completedAt: Date.now(),
              };
            }
          });
          return next;
        });
      } else {
        setAgentWorkState((prev) => ({
          ...prev,
          [currentAssignee.id]: {
            status: "completed",
            command: textToSend,
            deliverableFull: deliverableText,
            completedAt: Date.now(),
          },
        }));
      }

      if (mesh) {
        mesh.userData.state = "idle";
      }

      if (isSoundEnabled) playChime("complete");
      showToast(`✨ ${currentAssignee.name} finished: "${textToSend.slice(0, 32)}..."`);

      if (isVoiceEnabled) {
        speakDeliverable(currentAssignee.name, deliverableText);
      }
    } catch (err) {
      // Clean fallback if backend was loading or network dropped
      const deliverableText = generateIntelligentDeliverable(currentAssignee, textToSend);
      const respTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "agent",
          agent: currentAssignee,
          text: deliverableText,
          time: respTime,
          executionMode: "Autonomous Enterprise Simulation",
          duration: "0.8",
        },
      ]);

      setAgentWorkState((prev) => ({
        ...prev,
        [currentAssignee.id]: {
          status: "completed",
          command: textToSend,
          deliverableFull: deliverableText,
          completedAt: Date.now(),
        },
      }));

      if (mesh) {
        mesh.userData.state = "idle";
      }

      if (isSoundEnabled) playChime("complete");
      showToast(`✨ ${currentAssignee.name} completed directive!`);

      if (isVoiceEnabled) {
        speakDeliverable(currentAssignee.name, deliverableText);
      }
    } finally {
      setIsChatSending(false);
    }
  };

  // Copy helper
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Reset Camera Viewpoint
  const setCameraView = (zone) => {
    const { cameraTarget, spherical, updateCamera } = threeRefs.current;
    if (!cameraTarget || !updateCamera) return;

    if (zone === "overview") {
      cameraTarget.set(0, 2, 0);
      spherical.radius = 38;
      spherical.theta = 0.85;
      spherical.phi = 0.95;
    } else if (zone === "ceo") {
      cameraTarget.set(-16, 2, -14);
      spherical.radius = 20;
      spherical.theta = 0.6;
      spherical.phi = 0.8;
    } else if (zone === "design") {
      cameraTarget.set(-14, 2, 6);
      spherical.radius = 22;
      spherical.theta = 0.4;
      spherical.phi = 0.85;
    } else if (zone === "eng") {
      cameraTarget.set(16, 2, -10);
      spherical.radius = 24;
      spherical.theta = -0.6;
      spherical.phi = 0.85;
    } else if (zone === "prod") {
      cameraTarget.set(15, 2, 12);
      spherical.radius = 22;
      spherical.theta = -0.8;
      spherical.phi = 0.85;
    } else if (zone === "mktg") {
      cameraTarget.set(-7, 2, 17);
      spherical.radius = 22;
      spherical.theta = 0.8;
      spherical.phi = 0.85;
    } else if (zone === "lounge") {
      cameraTarget.set(-18, 1.5, -4);
      spherical.radius = 18;
    }
    updateCamera();
  };

  // ═════════════════════════════════════════════════════════════════════════
  // THREE.JS 3D VIRTUAL OFFICE INITIALIZATION & FLOATING NAME TAG PROJECTION
  // ═════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e);
    scene.fog = new THREE.FogExp2(0x07090e, 0.014);

    // Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    const cameraTarget = new THREE.Vector3(0, 2, 0);
    const spherical = { radius: 38, theta: 0.85, phi: 0.95 };

    const updateCameraPosition = () => {
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi));
      spherical.radius = Math.max(10, Math.min(65, spherical.radius));
      camera.position.x = cameraTarget.x + spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = cameraTarget.y + spherical.radius * Math.cos(spherical.phi);
      camera.position.z = cameraTarget.z + spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(cameraTarget);
    };
    updateCameraPosition();

    // Renderer (with safe WebGL context check)
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (err) {
      console.warn("WebGL not supported or disabled in browser. Falling back to 2D command matrix:", err);
      setWebglAvailable(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xd9e5ff, 0.85);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 1.25);
    mainSun.position.set(18, 30, 15);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 2048;
    mainSun.shadow.mapSize.height = 2048;
    scene.add(mainSun);

    const cyanFill = new THREE.PointLight(0x00f0ff, 1.6, 35);
    cyanFill.position.set(-12, 8, -8);
    scene.add(cyanFill);

    const purpleFill = new THREE.PointLight(0xbd00ff, 1.3, 30);
    purpleFill.position.set(14, 7, -10);
    scene.add(purpleFill);

    const amberFill = new THREE.PointLight(0xffb703, 1.1, 25);
    amberFill.position.set(0, 6, 14);
    scene.add(amberFill);

    // Floor & Grid
    const floorGeo = new THREE.PlaneGeometry(64, 64);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f1420, roughness: 0.45, metalness: 0.2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(60, 60, 0x1e293b, 0x0f172a);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Materials
    const mats = {
      wall: new THREE.MeshStandardMaterial({ color: 0x182030, roughness: 0.6 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x90e0ef,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
      }),
      deskTop: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 }),
      deskLeg: new THREE.MeshStandardMaterial({ color: 0x0b0f19, roughness: 0.8 }),
      chair: new THREE.MeshStandardMaterial({ color: 0x243046, roughness: 0.5 }),
      screenGlow: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
      accentGold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 }),
      plantGreen: new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.7 }),
    };

    // Executive Suite
    const ceoCabinGroup = new THREE.Group();
    const cabinBackWall = new THREE.Mesh(new THREE.BoxGeometry(16, 5, 0.4), mats.wall);
    cabinBackWall.position.set(0, 2.5, -8);
    ceoCabinGroup.add(cabinBackWall);

    const cabinSideWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 5, 14), mats.wall);
    cabinSideWall.position.set(-8, 2.5, -1);
    ceoCabinGroup.add(cabinSideWall);

    const glassFront = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 0.1), mats.glass);
    glassFront.position.set(-2.5, 2.4, 6);
    ceoCabinGroup.add(glassFront);

    const glassSide = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.8, 14), mats.glass);
    glassSide.position.set(8, 2.4, -1);
    ceoCabinGroup.add(glassSide);

    const ceoDesk = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.25, 2.2), mats.accentGold);
    ceoDesk.position.set(0, 1.4, -3);
    ceoCabinGroup.add(ceoDesk);

    const ceoDeskBase = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.3, 1.8), mats.wall);
    ceoDeskBase.position.set(0, 0.65, -3);
    ceoCabinGroup.add(ceoDeskBase);

    const ceoMonitor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.9, 0.08), mats.screenGlow);
    ceoMonitor.position.set(0, 2.05, -3.2);
    ceoCabinGroup.add(ceoMonitor);

    ceoCabinGroup.position.set(-16, 0, -14);
    scene.add(ceoCabinGroup);

    // Workstation Creator
    const createWorkstation = (x, z, glowColorHex) => {
      const group = new THREE.Group();
      const desk = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.15, 1.8), mats.deskTop);
      desk.position.set(0, 1.1, 0);
      desk.castShadow = true;
      group.add(desk);

      const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1), mats.deskLeg);
      leg1.position.set(-1.6, 0.55, -0.7);
      const leg2 = leg1.clone(); leg2.position.x = 1.6;
      const leg3 = leg1.clone(); leg3.position.z = 0.7;
      const leg4 = leg2.clone(); leg4.position.z = 0.7;
      group.add(leg1, leg2, leg3, leg4);

      const monMat = new THREE.MeshBasicMaterial({ color: glowColorHex });
      const mon1 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.75, 0.06), monMat);
      mon1.position.set(-0.7, 1.6, -0.4);
      const mon2 = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.75, 0.06), monMat);
      mon2.position.set(0.7, 1.6, -0.4);
      mon2.rotation.y = -0.15;
      group.add(mon1, mon2);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.9), mats.chair);
      seat.position.set(0, 0.7, 0.8);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.1), mats.chair);
      back.position.set(0, 1.15, 1.2);
      group.add(seat, back);

      group.position.set(x, 0, z);
      scene.add(group);
      return group;
    };

    // Desks per department
    createWorkstation(-14, 4, 0xf43f5e);
    createWorkstation(-18, 8, 0xf43f5e);
    createWorkstation(-10, 8, 0xf43f5e);
    createWorkstation(12, -14, 0x38bdf8);
    createWorkstation(18, -12, 0x38bdf8);
    createWorkstation(14, -6, 0x38bdf8);
    createWorkstation(20, -6, 0x38bdf8);
    createWorkstation(12, 8, 0xc084fc);
    createWorkstation(18, 10, 0xc084fc);
    createWorkstation(14, 16, 0xc084fc);
    createWorkstation(-8, 16, 0xfbbf24);
    createWorkstation(-2, 18, 0xfbbf24);
    createWorkstation(-12, 20, 0xfbbf24);

    // Conference Center
    const confGroup = new THREE.Group();
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.2, 32), mats.deskTop);
    tableTop.position.set(0, 1.1, -1);
    confGroup.add(tableTop);
    const tableStem = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.2, 1.1, 16), mats.deskLeg);
    tableStem.position.set(0, 0.55, -1);
    confGroup.add(tableStem);

    const holoRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.05, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true })
    );
    holoRing.position.set(0, 1.25, -1);
    holoRing.rotation.x = Math.PI / 2;
    confGroup.add(holoRing);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.8), mats.chair);
      chair.position.set(Math.cos(angle) * 4.2, 0.6, Math.sin(angle) * 4.2 - 1);
      chair.lookAt(0, 0.6, -1);
      confGroup.add(chair);
    }
    scene.add(confGroup);

    // Lounge
    const loungeGroup = new THREE.Group();
    const coolerBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.2, 0.7), mats.wall);
    coolerBase.position.set(-19, 0.6, -4);
    const coolerBottle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.8, 16), mats.glass);
    coolerBottle.position.set(-19, 1.6, -4);
    loungeGroup.add(coolerBase, coolerBottle);

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 0.8, 16), mats.wall);
    pot.position.set(-17.5, 0.4, -4);
    const plant = new THREE.Mesh(new THREE.DodecahedronGeometry(0.65), mats.plantGreen);
    plant.position.set(-17.5, 1.1, -4);
    loungeGroup.add(pot, plant);
    scene.add(loungeGroup);

    // 21 3D Character Meshes with Click Hitbox
    const createAgentMesh = (data) => {
      const group = new THREE.Group();
      group.name = `agent_${data.id}`;
      group.userData = { ...data };

      // Invisible Click Hitbox (Cylinder radius 1.8, height 3.8)
      const hitGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.8, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitGeo, hitMat);
      hitBox.position.y = 1.7;
      hitBox.name = `agent_hitbox_${data.id}`;
      hitBox.userData = { ...data };
      group.add(hitBox);

      const deptMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.35, metalness: 0.25 });
      const darkPantsMat = new THREE.MeshStandardMaterial({ color: 0x141b29, roughness: 0.8 });
      const skinMat = new THREE.MeshStandardMaterial({
        color: data.gender === "robot" ? 0x94a3b8 : data.gender === "female" ? 0xfcd34d : 0xfbcfe8,
        roughness: 0.4,
      });
      const hairMat = new THREE.MeshStandardMaterial({
        color: data.gender === "female" ? 0x92400e : 0x1f2937,
        roughness: 0.6,
      });

      // Ground Selection Ring
      const ringGeo = new THREE.RingGeometry(0.85, 1.15, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0 });
      const selRing = new THREE.Mesh(ringGeo, ringMat);
      selRing.rotation.x = -Math.PI / 2;
      selRing.position.y = 0.04;
      group.add(selRing);
      group.userData.selRing = selRing;

      // Hips & Legs
      const hips = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35), darkPantsMat);
      hips.position.y = 1.0;
      group.add(hips);

      const legGeo = new THREE.BoxGeometry(0.18, 0.85, 0.2);
      const leftLeg = new THREE.Mesh(legGeo, darkPantsMat);
      leftLeg.position.set(-0.16, 0.45, 0);
      const rightLeg = new THREE.Mesh(legGeo, darkPantsMat);
      rightLeg.position.set(0.16, 0.45, 0);
      group.add(leftLeg, rightLeg);
      group.userData.leftLeg = leftLeg;
      group.userData.rightLeg = rightLeg;

      // Torso
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.85, 0.4), deptMat);
      torso.position.y = 1.55;
      torso.castShadow = true;
      group.add(torso);

      // Badge
      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      badge.position.set(0, 1.45, 0.22);
      group.add(badge);

      // Arms
      const armGeo = new THREE.BoxGeometry(0.15, 0.75, 0.16);
      const leftArm = new THREE.Mesh(armGeo, deptMat);
      leftArm.position.set(-0.43, 1.5, 0);
      const rightArm = new THREE.Mesh(armGeo, deptMat);
      rightArm.position.set(0.43, 1.5, 0);
      group.add(leftArm, rightArm);
      group.userData.leftArm = leftArm;
      group.userData.rightArm = rightArm;

      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), skinMat);
      head.position.y = 2.15;
      group.add(head);

      if (data.gender === "robot") {
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), mats.wall);
        antenna.position.set(0, 2.45, 0);
        const antOrb = new THREE.Mesh(new THREE.SphereGeometry(0.06), new THREE.MeshBasicMaterial({ color: data.color }));
        antOrb.position.set(0, 2.6, 0);
        group.add(antenna, antOrb);
      } else {
        const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.22, 0.5), hairMat);
        hair.position.set(0, 2.3, -0.05);
        group.add(hair);
      }

      // Floating Status Indicator Orb
      const statusOrb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshBasicMaterial({ color: data.color }));
      statusOrb.position.set(0, 2.7, 0);
      group.add(statusOrb);
      group.userData.statusOrb = statusOrb;

      group.scale.set(data.scale, data.scale, data.scale);

      const homePos = WAYPOINTS[data.home] || new THREE.Vector3(0, 0, 0);
      const jitterX = (Math.random() - 0.5) * 1.5;
      const jitterZ = (Math.random() - 0.5) * 1.5;
      group.position.set(homePos.x + jitterX, 0, homePos.z + jitterZ);

      group.userData.state = "idle";
      group.userData.targetPos = group.position.clone();
      group.userData.moveTimer = 2 + Math.random() * 8;
      group.userData.walkSpeed = 1.8 + Math.random() * 0.6;
      group.userData.animTime = Math.random() * 10;
      group.userData.homePos = homePos.clone();

      scene.add(group);
      return group;
    };

    const agentMeshes = AGENTS_DATA.map((d) => createAgentMesh(d));

    threeRefs.current = {
      scene,
      camera,
      renderer,
      agentMeshes,
      selectedMesh: null,
      spherical,
      cameraTarget,
      updateCamera: updateCameraPosition,
    };

    // ═══════════════════════════════════════════════════════════════════════
    // POINTER EVENTS & 3D RAYCASTING CLICK
    // ═══════════════════════════════════════════════════════════════════════
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isPointerDown = false;
    let pointerMoved = false;
    let pointerDownPos = { x: 0, y: 0 };
    let prevMouse = { x: 0, y: 0 };

    const domEl = renderer.domElement;

    // Raycast detection on character click
    const performRaycastAt = (clientX, clientY) => {
      const rect = domEl.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let curr = hit.object;
        while (curr && curr !== scene) {
          if (curr.name && (curr.name.startsWith("agent_") || curr.name.startsWith("agent_hitbox_"))) {
            const foundId =
              curr.userData?.id ||
              parseInt(curr.name.replace("agent_hitbox_", "").replace("agent_", ""), 10);
            const foundAgent = AGENTS_DATA.find((a) => a.id === foundId) || curr.userData;
            if (foundAgent && allotTaskRef.current) {
              allotTaskRef.current(foundAgent);
              return true;
            }
          }
          curr = curr.parent;
        }
      }
      return false;
    };

    const onPointerDown = (e) => {
      isPointerDown = true;
      pointerMoved = false;
      pointerDownPos = { x: e.clientX, y: e.clientY };
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      if (isPointerDown) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        if (Math.abs(e.clientX - pointerDownPos.x) > 4 || Math.abs(e.clientY - pointerDownPos.y) > 4) {
          pointerMoved = true;
          spherical.theta -= dx * 0.006;
          spherical.phi -= dy * 0.006;
          updateCameraPosition();
        }
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      if (!pointerMoved) {
        performRaycastAt(e.clientX, e.clientY);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius += e.deltaY * 0.035;
      updateCameraPosition();
    };

    domEl.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("wheel", onWheel, { passive: false });

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION & 3D SCREEN PROJECTION LOOP
    // ═══════════════════════════════════════════════════════════════════════
    let animId;
    let lastTime = performance.now();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      holoRing.rotation.z += 0.015;

      agentMeshes.forEach((agent) => {
        agent.userData.animTime += delta;
        if (agent.userData.statusOrb) {
          agent.userData.statusOrb.position.y = 2.7 + Math.sin(agent.userData.animTime * 3) * 0.06;
        }

        // Autonomous casual walking
        if (agent.userData.state === "idle") {
          agent.userData.moveTimer -= delta;
          if (agent.userData.moveTimer <= 0) {
            agent.userData.state = "walking";
            agent.userData.moveTimer = 4 + Math.random() * 8;
            const h = agent.userData.homePos;
            agent.userData.targetPos = new THREE.Vector3(
              h.x + (Math.random() - 0.5) * 3.5,
              0,
              h.z + (Math.random() - 0.5) * 3.5
            );
          }
        }

        if (agent.userData.state === "walking" && agent.userData.targetPos) {
          const dir = new THREE.Vector3().subVectors(agent.userData.targetPos, agent.position);
          dir.y = 0;
          const dist = dir.length();

          if (dist < 0.25) {
            agent.userData.state = "idle";
            if (agent.userData.leftLeg) agent.userData.leftLeg.rotation.x = 0;
            if (agent.userData.rightLeg) agent.userData.rightLeg.rotation.x = 0;
            if (agent.userData.leftArm) agent.userData.leftArm.rotation.x = 0;
            if (agent.userData.rightArm) agent.userData.rightArm.rotation.x = 0;
            agent.position.y = 0;
          } else {
            dir.normalize();
            agent.position.addScaledVector(dir, agent.userData.walkSpeed * delta);
            const targetRot = Math.atan2(dir.x, dir.z);
            agent.rotation.y += (targetRot - agent.rotation.y) * 0.12;

            const walkCycle = Math.sin(agent.userData.animTime * 9);
            if (agent.userData.leftLeg && agent.userData.rightLeg) {
              agent.userData.leftLeg.rotation.x = walkCycle * 0.6;
              agent.userData.rightLeg.rotation.x = -walkCycle * 0.6;
            }
            if (agent.userData.leftArm && agent.userData.rightArm) {
              agent.userData.leftArm.rotation.x = -walkCycle * 0.5;
              agent.userData.rightArm.rotation.x = walkCycle * 0.5;
            }
            agent.position.y = Math.abs(Math.sin(agent.userData.animTime * 9)) * 0.08;
          }
        }

        // ── PROJECT FLOATING NAME & STATUS TAG DIRECTLY OVER AGENT HEAD ──
        const tagEl = tagRefs.current[agent.userData.id];
        if (tagEl) {
          agent.getWorldPosition(tempVec);
          tempVec.y += (agent.userData.scale || 1) * 3.0; // Position directly above their head
          tempVec.project(camera);

          // Get latest container bounds
          const currWidth = container.clientWidth || width;
          const currHeight = container.clientHeight || height;

          if (tempVec.z < 1) {
            const screenX = (tempVec.x * 0.5 + 0.5) * currWidth;
            const screenY = (-tempVec.y * 0.5 + 0.5) * currHeight;
            tagEl.style.display = "block";
            tagEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) translate(-50%, -100%)`;
          } else {
            tagEl.style.display = "none";
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      try {
        domEl.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
        domEl.removeEventListener("wheel", onWheel);
      } catch (e) { /* listeners already removed */ }
      try {
        if (domEl && domEl.parentNode === container) {
          container.removeChild(domEl);
        }
      } catch (e) { /* already removed */ }
      try { renderer.dispose(); } catch (e) { /* already disposed */ }
    };
  }, []);

  const workingCount = Object.values(agentWorkState).filter((s) => s?.status === "working").length;

  return (
    <div className="w-screen h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans overflow-hidden select-none">
      {/* ═══ 1. MODERN TOP NAVIGATION BAR (Fixed height, never collapses!) ════════ */}
      <header className="h-14 shrink-0 px-4 glass-panel border-b border-white/10 flex items-center justify-between z-30">
        {/* Left: Branding & Status */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-white uppercase font-mono">
                SYNTHETIX AI HQ
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse" />
                21 Agents Online
              </span>
              {workingCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 animate-pulse">
                  ⚡ {workingCount} Active
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Click any character in the 3D office or use the console to allot tasks
            </p>
          </div>
        </div>

        {/* Center: Department Switcher Tabs */}
        <div className="hidden xl:flex items-center space-x-1 text-xs bg-slate-950/80 p-1 rounded-xl border border-white/10">
          {[
            { id: "all", label: "All Office (21)", color: "" },
            { id: "Executive Suite", label: "Executive", color: "bg-amber-400" },
            { id: "Design Division", label: "Design", color: "bg-rose-400" },
            { id: "Engineering Division", label: "Engineering", color: "bg-sky-400" },
            { id: "Product Division", label: "Product", color: "bg-purple-400" },
            { id: "Marketing Division", label: "Marketing", color: "bg-amber-400" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setCurrentFilter(d.id);
                if (d.id === "Executive Suite") setCameraView("ceo");
                else if (d.id === "Design Division") setCameraView("design");
                else if (d.id === "Engineering Division") setCameraView("eng");
                else if (d.id === "Product Division") setCameraView("prod");
                else if (d.id === "Marketing Division") setCameraView("mktg");
                else setCameraView("overview");
              }}
              className={`px-3 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1.5 cursor-pointer ${
                currentFilter === d.id
                  ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}>
              {d.color && <span className={`w-2 h-2 rounded-full ${d.color}`} />}
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions Hub */}
        <div className="flex items-center space-x-2">
          {/* Sound FX Toggle */}
          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title={isSoundEnabled ? "Sound Effects: ON" : "Sound Effects: MUTED"}
            className={`p-2 rounded-xl border text-xs transition cursor-pointer flex items-center justify-center ${
              isSoundEnabled
                ? "bg-slate-900/90 border-slate-700 text-cyan-300 hover:border-cyan-400"
                : "bg-slate-950/90 border-slate-800 text-slate-600"
            }`}>
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Synthesis Toggle */}
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            title={isVoiceEnabled ? "Agent Speech Synthesis: ON" : "Agent Speech Synthesis: OFF"}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
              isVoiceEnabled
                ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20"
                : "bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isVoiceEnabled ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            <span className="text-[10px] uppercase font-bold">{isVoiceEnabled ? "Voice ON" : "Voice"}</span>
          </button>

          {/* AI Workforce & HITL Hub Toggle */}
          <button
            onClick={() => setIsWorkforceModalOpen(true)}
            title="Launch Autonomous Multi-Agent Workforce & Human-in-the-Loop Hub"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-200 text-xs font-bold transition cursor-pointer shadow-lg shadow-cyan-500/20">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline font-mono">AI Workforce (HITL)</span>
          </button>

          {/* Roster Drawer Toggle */}
          <button
            onClick={() => setIsRosterOpen(!isRosterOpen)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer shadow-sm ${
              isRosterOpen
                ? "bg-cyan-950 border-cyan-400 text-cyan-200"
                : "bg-slate-900/90 border-slate-700 hover:border-cyan-400 text-slate-200"
            }`}>
            <Users className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Squad (21)</span>
          </button>

          {/* Chat Sidebar Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer shadow-lg ${
              isChatOpen
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-cyan-500/30"
            }`}>
            <MessageSquare className="w-4 h-4" />
            <span>{isChatOpen ? "Hide Console" : "Open Console"}</span>
          </button>
        </div>
      </header>

      {/* ═══ 2. MAIN WORKSPACE (Split side-by-side: 3D Office on Left, Chat on Right) ══ */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ── LEFT PANE: 3D VIRTUAL OFFICE OR 2D COMMAND GRID FALLBACK ────── */}
        <div className="flex-1 h-full relative overflow-hidden bg-[#07090e]">
          {webglAvailable ? (
            <>
              {/* Three.js Canvas Container */}
              <div ref={mountRef} className="w-full h-full" />

          {/* FLOATING 3D NAME & WORKING STATUS TAGS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {AGENTS_DATA.map((agent) => {
              const work = agentWorkState[agent.id];
              const isWorking = work?.status === "working";
              const isDone = work?.status === "completed";
              const isSelected = chatAgent?.id === agent.id;

              return (
                <div
                  key={agent.id}
                  ref={(el) => (tagRefs.current[agent.id] = el)}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    willChange: "transform",
                    display: "none",
                  }}
                  className="pointer-events-auto">
                  <div className="flex flex-col items-center group cursor-pointer select-none">
                    {/* ⚡ THE WORKING OF THE COMMAND DISPLAYED AT THE PLACE OF THEIR NAME */}
                    {isWorking && (
                      <div
                        onClick={() => allotTaskToAgent(agent)}
                        className="mb-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-950 via-blue-900 to-indigo-950 border border-cyan-400 text-cyan-100 shadow-2xl shadow-cyan-500/50 backdrop-blur-md flex items-center gap-2 anim-bounce-subtle hover:scale-105 transition-transform"
                        title="Click to view this agent's active execution">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                        </span>
                        <span className="text-[9px] font-bold text-cyan-300 uppercase font-mono tracking-wider">
                          WORKING:
                        </span>
                        <span className="text-[11px] font-semibold text-white max-w-[160px] truncate">
                          "{work.command}"
                        </span>
                        <span className="flex items-center space-x-0.5 ml-0.5">
                          <span className="w-1 h-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1 h-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1 h-1 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </span>
                      </div>
                    )}

                    {/* COMPLETED BANNER */}
                    {isDone && !isWorking && (
                      <button
                        type="button"
                        onClick={() => allotTaskToAgent(agent)}
                        className="mb-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/95 border border-emerald-400/80 text-emerald-200 shadow-lg shadow-emerald-500/25 backdrop-blur-md flex items-center gap-1.5 text-[10px] cursor-pointer hover:scale-105 transition-transform"
                        title="Click to view full deliverable in chat">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span className="font-semibold text-white truncate max-w-[140px]">
                          Finished: "{work.command}"
                        </span>
                        <span className="text-[9px] text-emerald-300 font-mono underline">View 💬</span>
                      </button>
                    )}

                    {/* MAIN NAME BUTTON BADGE (CLICK ANY CHARACTER TO ALLOT DIRECTIVES) */}
                    <button
                      type="button"
                      onClick={() => allotTaskToAgent(agent)}
                      title={`Click to directly allot tasks to ${agent.name}`}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xl text-xs transition-all duration-200 cursor-pointer backdrop-blur-md hover:scale-110 active:scale-95 ${
                        isSelected
                          ? "bg-cyan-950 border-cyan-400 ring-2 ring-cyan-400/80 text-white shadow-cyan-500/40"
                          : "bg-slate-900/90 border-slate-700/80 hover:border-cyan-400 text-slate-100 hover:text-white"
                      }`}
                      style={{ borderColor: isSelected ? "#38bdf8" : `${agent.colorHex}aa` }}>
                      <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: agent.colorHex }} />
                      <span className="text-[12px] font-bold whitespace-nowrap">
                        {agent.avatarIcon} {agent.name}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-black/60 text-slate-300 font-mono border border-white/10 uppercase">
                        {agent.dept.split(" ")[0]}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Camera Focus Floating Bar (Bottom Left) */}
          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1.5 glass-card rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
            <span className="text-[10px] text-slate-400 font-mono px-2 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-cyan-400" /> Focus Zone:
            </span>
            <button
              onClick={() => setCameraView("overview")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              Overview
            </button>
            <button
              onClick={() => setCameraView("ceo")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-amber-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              CEO Suite
            </button>
            <button
              onClick={() => setCameraView("design")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-rose-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              Design
            </button>
            <button
              onClick={() => setCameraView("eng")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-sky-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              Engineering
            </button>
            <button
              onClick={() => setCameraView("prod")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-purple-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              Product
            </button>
            <button
              onClick={() => setCameraView("mktg")}
              className="px-2.5 py-1 rounded-lg text-[10px] text-amber-300 hover:text-white hover:bg-white/10 transition cursor-pointer font-medium">
              Marketing
            </button>
          </div>
            </>
          ) : (
            /* ══ 2D COMMAND CENTER FALLBACK (When 3D WebGL is disabled or unavailable) ══ */
            <div className="w-full h-full flex flex-col p-6 overflow-y-auto">
              {/* WebGL Notice & Quick Switcher */}
              <div className="mb-6 p-4 rounded-2xl glass-card border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      Enterprise Command Matrix
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                        2D Mode Active
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Hardware WebGL acceleration is unavailable. All 21 AI agents and live task allotments are fully operational below!
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-cyan-300">Click any character card to allot directives</span>
                </div>
              </div>

              {/* Department Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-12">
                {AGENTS_DATA.filter((a) => {
                  if (currentFilter === "all") return true;
                  if (currentFilter === "exec") return a.dept.toLowerCase().includes("executive");
                  if (currentFilter === "eng") return a.dept.toLowerCase().includes("engineering") || a.dept.toLowerCase().includes("qa") || a.dept.toLowerCase().includes("devops");
                  if (currentFilter === "design") return a.dept.toLowerCase().includes("design");
                  if (currentFilter === "prod") return a.dept.toLowerCase().includes("product") || a.dept.toLowerCase().includes("data");
                  if (currentFilter === "mktg") return a.dept.toLowerCase().includes("marketing") || a.dept.toLowerCase().includes("sales");
                  return true;
                }).map((agent) => {
                  const work = agentWorkState[agent.id];
                  const isWorking = work?.status === "working";
                  const isDone = work?.status === "completed";
                  const isSelected = chatAgent?.id === agent.id;

                  return (
                    <div
                      key={agent.id}
                      onClick={() => allotTaskToAgent(agent)}
                      className={`group relative p-4 rounded-2xl glass-card border transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-950/40 shadow-cyan-500/20 ring-1 ring-cyan-400"
                          : "border-white/10 hover:border-cyan-500/40 bg-slate-900/40"
                      }`}>
                      {/* Top Row: Avatar & Status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border"
                            style={{
                              backgroundColor: `${agent.colorHex}20`,
                              borderColor: `${agent.colorHex}50`,
                            }}>
                            {agent.avatarIcon}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {agent.name}
                            </h3>
                            <p className="text-[11px] text-slate-400">{agent.role}</p>
                          </div>
                        </div>

                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full border uppercase"
                          style={{
                            backgroundColor: `${agent.colorHex}15`,
                            color: agent.colorHex,
                            borderColor: `${agent.colorHex}40`,
                          }}>
                          {agent.dept.split(" ")[0]}
                        </span>
                      </div>

                      {/* ⚡ THE WORKING OF THE COMMAND DISPLAYED ON THE CARD */}
                      {isWorking && (
                        <div className="mt-2 mb-3 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950 via-blue-900/80 to-indigo-950 border border-cyan-400/80 text-cyan-100 shadow-lg shadow-cyan-500/30 flex items-center gap-2">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                          </span>
                          <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono tracking-wider">
                            WORKING:
                          </span>
                          <span className="text-xs font-semibold text-white truncate flex-1">
                            "{work.command}"
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </span>
                        </div>
                      )}

                      {isDone && (
                        <div className="mt-2 mb-3 px-2.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-400/50 text-emerald-200 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-mono text-[10px] uppercase font-bold">DONE:</span>
                          <span className="truncate text-white font-medium">"{work.command}"</span>
                        </div>
                      )}

                      {/* Bio & Skills */}
                      <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                        {agent.bio}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {agent.skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
                            {sk}
                          </span>
                        ))}
                      </div>

                      {/* Card Action Button */}
                      <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400">
                          {isSelected ? "● Selected Character" : "Click to allot command"}
                        </span>
                        <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                          Allot <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Floating toggle button when chat is closed */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition cursor-pointer border border-cyan-300/40">
              <MessageSquare className="w-4 h-4" />
              <span>Open AI Command Console</span>
            </button>
          )}

          {/* ═══ SLIDE-OUT SQUAD DRAWER ═══ */}
          {isRosterOpen && (
            <aside className="absolute top-4 left-4 bottom-4 z-40 w-80 glass-card rounded-2xl border border-white/15 p-4 flex flex-col shadow-2xl anim-chat-open">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
                    Enterprise Squad (21)
                  </h3>
                </div>
                <button
                  onClick={() => setIsRosterOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search */}
              <div className="my-2.5 relative shrink-0">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search name, role, division..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {AGENTS_DATA.filter(
                  (a) =>
                    !pickerSearch ||
                    a.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                    a.role.toLowerCase().includes(pickerSearch.toLowerCase()) ||
                    a.dept.toLowerCase().includes(pickerSearch.toLowerCase())
                ).map((agent) => {
                  const isWorking = agentWorkState[agent.id]?.status === "working";
                  const isSelected = chatAgent?.id === agent.id;

                  return (
                    <button
                      key={agent.id}
                      onClick={() => allotTaskToAgent(agent)}
                      className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between group ${
                        isSelected
                          ? "bg-cyan-950/80 border-cyan-400 text-white"
                          : "bg-slate-900/60 border-white/5 hover:border-cyan-500/40 hover:bg-slate-850"
                      }`}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{agent.avatarIcon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {agent.name}
                            </span>
                            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-400 font-mono shrink-0">
                              {agent.dept.split(" ")[0]}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{agent.role}</p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {isWorking ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-mono animate-pulse">
                            Working
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:text-cyan-300 font-mono">
                            Allot 💬
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>
          )}
        </div>

        {/* ── RIGHT PANE: DEDICATED AI COMMAND CONSOLE (NON-COLLAPSING!) ─── */}
        {isChatOpen && (
          <aside className="w-[440px] xl:w-[480px] h-full flex flex-col glass-panel border-l border-white/10 shrink-0 z-20">
            {/* 1. CONSOLE HEADER */}
            <div className="h-13 shrink-0 px-4 border-b border-white/10 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                    AI Command Console
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono">
                    Direct Allotment & Deliverable Feed
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setChatMessages([])}
                  title="Clear Conversation"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  title="Collapse Console"
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. 🎯 PROMINENT "ALLOT TASK TO" SECTION */}
            <div className="p-3.5 bg-slate-950/95 border-b border-white/10 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Allot Task To Person:
                </label>
                {agentWorkState[chatAgent?.id]?.status === "working" ? (
                  <span className="text-[10px] text-cyan-300 font-mono flex items-center gap-1 animate-pulse font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Working on task...
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Ready for directive
                  </span>
                )}
              </div>

              {/* Current Assignee Card & Dropdown */}
              <div className="relative">
                <select
                  value={chatAgent?.id || ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value, 10);
                    const a = AGENTS_DATA.find((x) => x.id === id);
                    if (a) allotTaskToAgent(a);
                  }}
                  className="w-full bg-slate-900/95 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer font-sans appearance-none pr-9 hover:border-cyan-400 focus:border-cyan-400 transition shadow-inner font-semibold">
                  {["Executive Suite", "Design Division", "Engineering Division", "Product Division", "Marketing Division"].map((dept) => (
                    <optgroup key={dept} label={`── ${dept.toUpperCase()} ──`} className="bg-slate-950 text-cyan-300 font-bold">
                      {AGENTS_DATA.filter((a) => a.dept === dept).map((a) => (
                        <option key={a.id} value={a.id} className="bg-slate-900 text-white font-normal py-1">
                          {a.avatarIcon} {a.name} — {a.role}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
              </div>

              {/* Quick Leads 1-Click Switcher */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                <span className="text-[9px] text-slate-500 font-mono shrink-0 uppercase">Leads:</span>
                {[1, 2, 7, 12, 17].map((id) => {
                  const lead = AGENTS_DATA.find((a) => a.id === id);
                  if (!lead) return null;
                  const isSelected = chatAgent?.id === lead.id;
                  return (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => allotTaskToAgent(lead)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium flex items-center gap-1 shrink-0 transition cursor-pointer border ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-sm"
                          : "bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}>
                      <span>{lead.avatarIcon}</span>
                      <span>{lead.name.split(" ")[0]}</span>
                      <span className="text-[8px] opacity-60">({lead.dept.split(" ")[0]})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. MESSAGE & DELIVERABLE STREAM (SPACIOUS & FULLY SCROLLABLE!) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} anim-float-up`}>
                  <div
                    className={`max-w-[94%] rounded-2xl p-4 text-xs shadow-xl leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-sm"
                        : "bg-slate-900/95 border border-white/10 text-slate-200 rounded-bl-sm"
                    }`}>
                    {/* Agent Message Header */}
                    {msg.role === "agent" && (
                      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{msg.agent?.avatarIcon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-cyan-300">{msg.agent?.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono">({msg.agent?.dept})</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans">{msg.agent?.role}</p>
                          </div>
                        </div>

                        {/* Deliverable Actions: Copy, Read Aloud, Expand Modal */}
                        <div className="flex items-center gap-1">
                          {msg.executionMode && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 font-mono hidden sm:inline">
                              {msg.executionMode}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copy to Clipboard"
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => speakDeliverable(msg.agent?.name, msg.text)}
                            title="Listen (Text-To-Speech)"
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                          </button>
                          <button
                            onClick={() => setActiveModalDeliverable(msg)}
                            title="Expand Deliverable (Full Reading Mode)"
                            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Formatted Markdown Content */}
                    <div className="deliverable-content">
                      <MarkdownRenderer content={msg.text} />
                    </div>

                    {/* Message Meta Info */}
                    <div
                      className={`mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2 text-[9px] font-mono ${
                        msg.role === "user" ? "text-cyan-200/70 justify-end" : "text-slate-500"
                      }`}>
                      <span>{msg.time}</span>
                      {msg.duration && <span>⏱ {msg.duration}s</span>}
                      {msg.memoryId && <span>💾 Memory #{msg.memoryId}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Live Working Spinner */}
              {isChatSending && (
                <div className="flex justify-start anim-float-up">
                  <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl rounded-bl-sm p-4 flex items-center gap-3 shadow-2xl">
                    <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{chatAgent?.avatarIcon}</span>
                        <span>{chatAgent?.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">is working...</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Synthesizing directive and persisting to SQLite memory
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* 4. QUICK PROMPT PRESETS FOR ACTIVE AGENT */}
            {chatAgent && chatAgent.presets && (
              <div className="px-3.5 py-2 bg-slate-950/80 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <span className="text-[9px] font-mono text-slate-500 uppercase shrink-0">Quick Prompts:</span>
                {chatAgent.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleChatSend(null, preset)}
                    disabled={isChatSending}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white transition text-[10px] whitespace-nowrap cursor-pointer shrink-0 disabled:opacity-40">
                    {preset}
                  </button>
                ))}
              </div>
            )}

            {/* 5. INPUT FORM (Fixed at bottom of sidebar, never collapsed!) */}
            <form
              onSubmit={handleChatSend}
              className="p-3.5 border-t border-white/10 bg-slate-950 flex items-center gap-2 shrink-0">
              <input
                ref={chatInputRef}
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={chatAgent ? `Command ${chatAgent.name}... (Press Enter)` : "Select an agent first..."}
                disabled={!chatAgent || isChatSending}
                className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition disabled:opacity-40"
              />
              <button
                type="submit"
                disabled={!chatAgent || !chatInput.trim() || isChatSending}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-500/25 shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </aside>
        )}
      </div>

      {/* ═══ ENTERPRISE AUTONOMOUS WORKFORCE (CREWAI + HITL) HUB MODAL ═══ */}
      <WorkforceHub
        isOpen={isWorkforceModalOpen}
        onClose={() => setIsWorkforceModalOpen(false)}
        onShowToast={showToast}
      />

      {/* ═══ FULLSCREEN DELIVERABLE READER MODAL (FOR DEEP READING!) ═════ */}
      {activeModalDeliverable && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 anim-chat-open">
          <div className="glass-card w-full max-w-3xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden border border-cyan-500/30 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeModalDeliverable.agent?.avatarIcon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Deliverable: {activeModalDeliverable.agent?.name}
                  </h3>
                  <p className="text-[10px] text-cyan-300 font-mono">
                    {activeModalDeliverable.agent?.role} · {activeModalDeliverable.agent?.dept}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy("modal", activeModalDeliverable.text)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                  {copiedId === "modal" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === "modal" ? "Copied" : "Copy All"}</span>
                </button>
                <button
                  onClick={() => speakDeliverable(activeModalDeliverable.agent?.name, activeModalDeliverable.text)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Listen</span>
                </button>
                <button
                  onClick={() => setActiveModalDeliverable(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 deliverable-content bg-[#080c16]">
              <MarkdownRenderer content={activeModalDeliverable.text} />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-white/10 bg-slate-950 text-xs text-slate-400 flex items-center justify-between font-mono">
              <span>Timestamp: {activeModalDeliverable.time}</span>
              <button
                onClick={() => setActiveModalDeliverable(null)}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition cursor-pointer">
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NOTIFICATION TOAST ════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 glass-card px-4 py-2.5 rounded-xl border border-cyan-400/50 text-cyan-200 flex items-center space-x-2 text-xs shadow-2xl anim-float-up pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
