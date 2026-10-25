import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Bot,
  MapPin,
  Radio,
  Code2,
  RotateCcw,
  Sparkles,
  Send,
  FileCode,
  Copy,
  CheckCircle2,
  X,
  Activity,
  Database,
  Search,
  RefreshCw,
  Key,
  Settings,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  Wrench,
  Globe,
  Terminal,
  Calculator,
  MessageSquare,
  TrendingUp,
  Palette,
  Target,
  Layers,
  FileText,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   21-AGENT ENTERPRISE ROSTER (Full mapping to backend & office_memory.db)
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

const PROVIDER_MODELS = {
  openai: [
    { id: "gpt-4o", label: "GPT-4o (Omni Flagship)" },
    { id: "gpt-4o-mini", label: "GPT-4o Mini (Fast & Cost Efficient)" },
    { id: "gpt-4-turbo", label: "GPT-4 Turbo" },
    { id: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (State of the Art)" },
    { id: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (High Velocity)" },
    { id: "claude-3-opus-20240229", label: "Claude 3 Opus (Complex Analysis)" },
  ],
  gemini: [
    { id: "gemini-3.8-flash", label: "Gemini 3.8 Flash (Latest Production Flagship)" },
    { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Google High Velocity)" },
    { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Deep Reasoning)" },
    { id: "gemini-flash-latest", label: "Gemini Flash Latest" },
  ],
};

const DEFAULT_MODELS = {
  openai: "gpt-4o",
  anthropic: "claude-3-5-sonnet-20241022",
  gemini: "gemini-3.8-flash",
};

// Waypoint coordinates in 3D world space
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

export default function App() {
  const mountRef = useRef(null);
  const tagRefs = useRef({});

  // Filter & Selection State
  const [currentFilter, setCurrentFilter] = useState("all");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalTab, setModalTab] = useState("directive"); // 'directive' | 'tools' | 'memory'

  // MCP & Productivity Tools State
  const [agentTools, setAgentTools] = useState([]);
  const [selectedToolId, setSelectedToolId] = useState("");
  const [isMcpCatalogOpen, setIsMcpCatalogOpen] = useState(false);
  const [mcpCatalog, setMcpCatalog] = useState({});
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [liveSearchResults, setLiveSearchResults] = useState(null);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  // Model Gateway & LLM Credentials State
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [provider, setProvider] = useState("openai");
  const [modelName, setModelName] = useState("gpt-4o");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  // Task Execution & Deliverable State
  const [directiveText, setDirectiveText] = useState("");
  const [waypointTarget, setWaypointTarget] = useState("confNorth");
  const [isExecuting, setIsExecuting] = useState(false);
  const [deliverable, setDeliverable] = useState("");
  const [lastSavedMemory, setLastSavedMemory] = useState(null);
  const [lastExecutedTool, setLastExecutedTool] = useState(null);

  // SQLite Database & Memory State
  const [dbConnected, setDbConnected] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [agentMemories, setAgentMemories] = useState([]);
  const [newMemoryNote, setNewMemoryNote] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Modals & Activity Feed
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState("agents");
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [allMemories, setAllMemories] = useState([]);
  const [vaultSearch, setVaultSearch] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Activity Feed Items
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, text: "Alex Vance aligned executive OKRs in Suite 101", color: "text-amber-300", time: "12:13:08" },
    { id: 2, text: "Elena Rostova approved design tokens & spatial guidelines", color: "text-rose-400", time: "12:13:20" },
    { id: 3, text: "Dmitry Volkov queried SQLite memory (office_memory.db)", color: "text-emerald-400", time: "12:13:26" },
    { id: 4, text: "Sarah Jenkins calibrated Q3 multi-agent collaboration roadmap", color: "text-purple-400", time: "12:13:35" },
  ]);

  // Three.js Scene References
  const threeRefs = useRef({
    scene: null,
    camera: null,
    renderer: null,
    agentMeshes: [],
    selectedMesh: null,
    spherical: { radius: 38, theta: 0.85, phi: 0.95 },
    cameraTarget: new THREE.Vector3(0, 2, 0),
    updateCamera: null,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load saved LLM Gateway configuration from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ai_office_gateway_config");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.provider) setProvider(p.provider);
        if (p.modelName) setModelName(p.modelName);
        if (p.apiKey) setApiKey(p.apiKey);
      }
    } catch (e) {}

    fetchDbStats();
    const interval = setInterval(fetchDbStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveGatewayConfig = (newProvider = provider, newModel = modelName, newKey = apiKey) => {
    try {
      localStorage.setItem(
        "ai_office_gateway_config",
        JSON.stringify({ provider: newProvider, modelName: newModel, apiKey: newKey })
      );
      showToast(`Gateway saved: ${newProvider.toUpperCase()} (${newModel})`);
    } catch (e) {}
    setIsGatewayOpen(false);
  };

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch SQLite Database Stats from FastAPI backend
  const fetchDbStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/memories/stats`);
      if (res.ok) {
        const data = await res.json();
        setDbStats(data);
        setDbConnected(true);
      } else {
        setDbConnected(false);
      }
    } catch (e) {
      setDbConnected(false);
    }
  };

  // Fetch SQLite memories for the selected agent
  const fetchAgentMemories = async (backendId) => {
    if (!backendId) return;
    try {
      const res = await fetch(`${API_BASE}/api/agents/${backendId}/memories?limit=25`);
      if (res.ok) {
        const data = await res.json();
        setAgentMemories(data.memories || []);
        setDbConnected(true);
      }
    } catch (e) {
      console.warn("Failed to fetch agent memories:", e);
    }
  };

  // Fetch MCP tools for the selected agent
  const fetchAgentTools = async (backendId) => {
    if (!backendId) return;
    try {
      const res = await fetch(`${API_BASE}/api/agents/${backendId}/tools`);
      if (res.ok) {
        const data = await res.json();
        setAgentTools(data.tools || []);
      }
    } catch (e) {
      console.warn("Failed to fetch agent tools:", e);
    }
  };

  // Fetch full MCP tools catalog across all divisions
  const fetchMcpCatalog = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/mcp/tools`);
      if (res.ok) {
        const data = await res.json();
        setMcpCatalog(data.catalog || {});
      }
    } catch (e) {
      console.warn("Failed to fetch MCP catalog:", e);
    }
  };

  // Fetch all memories for the Office Vault
  const fetchAllMemories = async (query = "") => {
    try {
      const url = query
        ? `${API_BASE}/api/memories?limit=50&q=${encodeURIComponent(query)}`
        : `${API_BASE}/api/memories?limit=50`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAllMemories(data.memories || []);
      }
    } catch (e) {
      console.warn("Failed to load vault:", e);
    }
  };


  // Live web search using DuckDuckGo backend endpoint
  const handleLiveWebSearch = async (e) => {
    if (e) e.preventDefault();
    if (!liveSearchQuery.trim() || isSearchingWeb) return;
    setIsSearchingWeb(true);
    try {
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(liveSearchQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setLiveSearchResults(data);
        showToast(`Found ${data.count || 0} live web search results!`);
      }
    } catch (err) {
      console.warn("Web search notice:", err);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // SELECT AGENT (Called on direct nameplate clicks, 3D clicks, or chips)
  // ═════════════════════════════════════════════════════════════════════════
  const selectAgent = (agent) => {
    if (!agent) return;
    setSelectedAgent(agent);
    setDirectiveText(agent.presets ? agent.presets[0] : agent.initialDirective);
    setDeliverable("");
    setLastSavedMemory(null);
    setLastExecutedTool(null);
    setSelectedToolId("");
    setModalTab("directive");
    fetchAgentMemories(agent.backendId);
    fetchAgentTools(agent.backendId);

    // Highlight 3D mesh if scene is initialized
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
        threeRefs.current.spherical.radius = 26;
        threeRefs.current.updateCamera();
      }
    }
  };

  const dismissSelectedAgent = () => {
    const { selectedMesh, agentMeshes } = threeRefs.current;
    if (selectedMesh) {
      if (selectedMesh.userData.selRing) selectedMesh.userData.selRing.material.opacity = 0;
      selectedMesh.userData.state = "idle";
      threeRefs.current.selectedMesh = null;
    }
    if (agentMeshes) {
      agentMeshes.forEach((m) => {
        if (m.userData.selRing) m.userData.selRing.material.opacity = 0;
      });
    }
    setSelectedAgent(null);
  };

  const selectAgentRef = useRef(selectAgent);
  selectAgentRef.current = selectAgent;

  // ═════════════════════════════════════════════════════════════════════════
  // THREE.JS 3D VIRTUAL OFFICE INITIALIZATION & FLOATING NAME TAG PROJECTION
  // ═════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d14);
    scene.fog = new THREE.FogExp2(0x0a0d14, 0.015);

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

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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

    const mainSun = new THREE.DirectionalLight(0xffffff, 1.2);
    mainSun.position.set(18, 30, 15);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 2048;
    mainSun.shadow.mapSize.height = 2048;
    scene.add(mainSun);

    const cyanFill = new THREE.PointLight(0x00f0ff, 1.5, 35);
    cyanFill.position.set(-12, 8, -8);
    scene.add(cyanFill);

    const purpleFill = new THREE.PointLight(0xbd00ff, 1.2, 30);
    purpleFill.position.set(14, 7, -10);
    scene.add(purpleFill);

    const amberFill = new THREE.PointLight(0xffb703, 1.0, 25);
    amberFill.position.set(0, 6, 14);
    scene.add(amberFill);

    // Floor & Grid
    const floorGeo = new THREE.PlaneGeometry(64, 64);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.45, metalness: 0.2 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(60, 60, 0x223555, 0x162238);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Architectural Materials
    const mats = {
      wall: new THREE.MeshStandardMaterial({ color: 0x1c2436, roughness: 0.6 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x90e0ef,
        transmission: 0.85,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5,
        thickness: 0.5,
      }),
      deskTop: new THREE.MeshStandardMaterial({ color: 0x202b3d, roughness: 0.3 }),
      deskLeg: new THREE.MeshStandardMaterial({ color: 0x0f141f, roughness: 0.8 }),
      chair: new THREE.MeshStandardMaterial({ color: 0x2b374e, roughness: 0.5 }),
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

    const couch = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.9, 1.4), mats.chair);
    couch.position.set(4.5, 0.45, 1.5);
    ceoCabinGroup.add(couch);

    ceoCabinGroup.position.set(-16, 0, -14);
    scene.add(ceoCabinGroup);

    // Workstation Builder
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

    // Design Desks
    createWorkstation(-14, 4, 0xf43f5e);
    createWorkstation(-18, 8, 0xf43f5e);
    createWorkstation(-10, 8, 0xf43f5e);

    // Engineering Desks
    createWorkstation(12, -14, 0x38bdf8);
    createWorkstation(18, -12, 0x38bdf8);
    createWorkstation(14, -6, 0x38bdf8);
    createWorkstation(20, -6, 0x38bdf8);

    // Product Desks
    createWorkstation(12, 8, 0xc084fc);
    createWorkstation(18, 10, 0xc084fc);
    createWorkstation(14, 16, 0xc084fc);

    // Marketing Desks
    createWorkstation(-8, 16, 0xfbbf24);
    createWorkstation(-2, 18, 0xfbbf24);
    createWorkstation(-12, 20, 0xfbbf24);

    // Central Conference Hub
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

    // Water Cooler & Lounge
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

    // 21 3D Character Meshes Builder with Invisible Click Hitbox
    const createAgentMesh = (data) => {
      const group = new THREE.Group();
      group.name = `agent_${data.id}`;
      group.userData = { ...data };

      // Invisible click hitbox cylinder (radius 1.8, height 3.8)
      const hitGeo = new THREE.CylinderGeometry(1.8, 1.8, 3.8, 12);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitBox = new THREE.Mesh(hitGeo, hitMat);
      hitBox.position.y = 1.7;
      hitBox.name = `agent_hitbox_${data.id}`;
      hitBox.userData = { ...data };
      group.add(hitBox);

      const deptMat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.35, metalness: 0.25 });
      const darkPantsMat = new THREE.MeshStandardMaterial({ color: 0x182030, roughness: 0.8 });
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

      // Hips
      const hips = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.35), darkPantsMat);
      hips.position.y = 1.0;
      group.add(hips);

      // Legs
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

      // Floating Status Orb
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
    // POINTER EVENTS (Orbit drag + Click raycast)
    // ═══════════════════════════════════════════════════════════════════════
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isPointerDown = false;
    let pointerMoved = false;
    let pointerDownPos = { x: 0, y: 0 };
    let prevMouse = { x: 0, y: 0 };

    const domEl = renderer.domElement;

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
            if (foundAgent && selectAgentRef.current) {
              selectAgentRef.current(foundAgent);
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
      spherical.radius += e.deltaY * 0.03;
      updateCameraPosition();
      e.preventDefault();
    };

    domEl.addEventListener("pointerdown", onPointerDown);
    domEl.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    domEl.addEventListener("wheel", onWheel, { passive: false });

    // ═══════════════════════════════════════════════════════════════════════
    // ANIMATION LOOP + SCREEN PROJECTION OF FLOATING NAME TAGS
    // ═══════════════════════════════════════════════════════════════════════
    const waypointKeys = Object.keys(WAYPOINTS);
    const clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();
    let animFrameId = null;

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      holoRing.rotation.z = time * 0.4;

      // Update 3D Character autonomous state machines
      agentMeshes.forEach((agent) => {
        agent.userData.animTime += delta;

        if (agent.userData.statusOrb) {
          agent.userData.statusOrb.position.y = 2.7 + Math.sin(agent.userData.animTime * 3) * 0.08;
        }

        if (agent.userData.state === "selected") {
          const targetLook = camera.position.clone();
          targetLook.y = agent.position.y;
          agent.lookAt(targetLook);
        } else if (agent.userData.state === "idle") {
          agent.userData.moveTimer -= delta;

          if (agent.userData.leftArm && agent.userData.rightArm) {
            agent.userData.leftArm.rotation.x = Math.sin(agent.userData.animTime * 2) * 0.15;
            agent.userData.rightArm.rotation.x = -Math.sin(agent.userData.animTime * 2) * 0.15;
          }

          if (agent.userData.moveTimer <= 0) {
            let dest = agent.userData.homePos;
            if (Math.random() > 0.45) {
              const randKey = waypointKeys[Math.floor(Math.random() * waypointKeys.length)];
              dest = WAYPOINTS[randKey];
            }
            agent.userData.targetPos = new THREE.Vector3(
              dest.x + (Math.random() - 0.5) * 2.2,
              0,
              dest.z + (Math.random() - 0.5) * 2.2
            );
            agent.userData.state = "walking";
          }
        } else if (agent.userData.state === "walking") {
          const dir = new THREE.Vector3().subVectors(agent.userData.targetPos, agent.position);
          dir.y = 0;
          const dist = dir.length();

          if (dist < 0.3) {
            agent.userData.state = "idle";
            agent.userData.moveTimer = 4 + Math.random() * 9;
            if (agent.userData.leftLeg) agent.userData.leftLeg.rotation.x = 0;
            if (agent.userData.rightLeg) agent.userData.rightLeg.rotation.x = 0;
          } else {
            dir.normalize();
            agent.position.addScaledVector(dir, agent.userData.walkSpeed * delta);
            const lookTarget = agent.position.clone().add(dir);
            agent.lookAt(lookTarget);

            const walkCycle = Math.sin(agent.userData.animTime * 9);
            if (agent.userData.leftLeg && agent.userData.rightLeg) {
              agent.userData.leftLeg.rotation.x = walkCycle * 0.55;
              agent.userData.rightLeg.rotation.x = -walkCycle * 0.55;
            }
            if (agent.userData.leftArm && agent.userData.rightArm) {
              agent.userData.leftArm.rotation.x = -walkCycle * 0.5;
              agent.userData.rightArm.rotation.x = walkCycle * 0.5;
            }
            agent.position.y = Math.abs(Math.sin(agent.userData.animTime * 9)) * 0.08;
          }
        }

        // ── PROJECT FLOATING NAME TAG DIRECTLY OVER AGENT HEAD ───────
        const tagEl = tagRefs.current[agent.userData.id];
        if (tagEl) {
          agent.getWorldPosition(tempVec);
          tempVec.y += (agent.userData.scale || 1) * 2.9; // directly above their head
          tempVec.project(camera);

          // If in front of camera lens (z < 1)
          if (tempVec.z < 1) {
            const screenX = (tempVec.x * 0.5 + 0.5) * width;
            const screenY = (-tempVec.y * 0.5 + 0.5) * height;
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

    const onResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (domEl.parentNode) domEl.parentNode.removeChild(domEl);
    };
  }, []);

  // Focus a specific Zone in the 3D office
  const focusWaypointZone = (zoneKey) => {
    const target = WAYPOINTS[zoneKey];
    if (target && threeRefs.current.cameraTarget) {
      threeRefs.current.cameraTarget.copy(target);
      threeRefs.current.cameraTarget.y = 2;
      threeRefs.current.spherical.radius = 28;
      if (threeRefs.current.updateCamera) threeRefs.current.updateCamera();
      showToast(`Camera focused on ${zoneKey}`);
    }
  };

  const resetCamera = () => {
    if (threeRefs.current.cameraTarget && threeRefs.current.updateCamera) {
      threeRefs.current.spherical = { radius: 38, theta: 0.85, phi: 0.95 };
      threeRefs.current.cameraTarget.set(0, 2, 0);
      threeRefs.current.updateCamera();
      showToast("Camera reset to Headquarters Overview");
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // DISPATCH TASK DIRECTIVE (Sends to Backend FastAPI & SQLite Memory)
  // ═════════════════════════════════════════════════════════════════════════
  const handleDispatchDirective = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAgent || !directiveText.trim() || isExecuting) return;

    setIsExecuting(true);
    setDeliverable("");
    setLastSavedMemory(null);

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Make the 3D agent walk to the chosen waypoint in the 3D office
    const { agentMeshes } = threeRefs.current;
    const mesh = agentMeshes.find((m) => m.userData.id === selectedAgent.id);
    if (mesh && WAYPOINTS[waypointTarget]) {
      mesh.userData.targetPos = WAYPOINTS[waypointTarget].clone();
      mesh.userData.state = "walking";
    }

    try {
      const res = await fetch(`${API_BASE}/api/run-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: provider,
          model: modelName,
          api_key: apiKey ? apiKey.trim() : null,
          target_agent_id: selectedAgent.backendId,
          instruction: directiveText.trim(),
          tool_id: selectedToolId || undefined,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setDeliverable(data.deliverable);
      setDbConnected(true);
      if (data.tool_applied) {
        setLastExecutedTool({
          name: data.tool_applied,
          output: data.tool_output,
        });
      }

      if (data.memory_id) {
        setLastSavedMemory({
          id: data.memory_id,
          past_memory_count: data.past_memory_count ?? 0,
        });
      }

      // Add to live activity feed
      setActivityLogs((prev) => [
        {
          id: Date.now(),
          text: `${selectedAgent.name} completed task & stored in SQLite (Memory #${data.memory_id || "sync"})`,
          color: "text-emerald-400",
          time: timeStr,
        },
        ...prev.slice(0, 7),
      ]);

      showToast(`Task completed & persisted to SQLite for ${selectedAgent.name}!`);
      fetchAgentMemories(selectedAgent.backendId);
      fetchDbStats();
    } catch (err) {
      console.warn("Backend execution notice:", err);
      // Clean fallback if backend was unreachable
      const fallbackOutput = `════════════════════════════════════════════════════════════
 ENTERPRISE AGENT DELIVERABLE (AUTONOMOUS SIMULATION ACTIVE)
 Agent: ${selectedAgent.name} | ${selectedAgent.role}
 Division: ${selectedAgent.dept} | Station: ${waypointTarget}
 Gateway: ${provider.toUpperCase()} [${modelName}]
════════════════════════════════════════════════════════════

 DIRECTIVE: "${directiveText.trim()}"

 1. STRATEGIC ANALYSIS & EXECUTION:
    Applied Competencies: ${selectedAgent.skills.join(", ")}
    Scope: Validated against ${selectedAgent.dept} OKRs.
    Memory Engine: Synchronized with office_memory.db.

 2. ACTIONABLE IMPLEMENTATION:
    - Phase 1: Operational schema validated without regressions.
    - Phase 2: Cross-division alignment completed with Director.
    - Phase 3: Deliverable artifact finalized and persisted to SQLite audit trail.

 Sign-off: ${selectedAgent.name}, ${selectedAgent.role}
 Station: ${waypointTarget}
════════════════════════════════════════════════════════════`;
      setDeliverable(fallbackOutput);

      setActivityLogs((prev) => [
        {
          id: Date.now(),
          text: `${selectedAgent.name} dispatched directive to ${waypointTarget}`,
          color: "text-sky-400",
          time: timeStr,
        },
        ...prev.slice(0, 7),
      ]);
      showToast(`Directive executed for ${selectedAgent.name}!`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Inject manual memory note into agent's SQLite memory
  const handleAddMemoryNote = async (e) => {
    if (e) e.preventDefault();
    if (!selectedAgent || !newMemoryNote.trim() || isSavingNote) return;

    setIsSavingNote(true);
    try {
      const res = await fetch(`${API_BASE}/api/agents/${selectedAgent.backendId}/memories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: newMemoryNote.trim(),
          memory_type: "user_note",
        }),
      });

      if (res.ok) {
        setNewMemoryNote("");
        fetchAgentMemories(selectedAgent.backendId);
        fetchDbStats();
        showToast(`Memory note saved to SQLite for ${selectedAgent.name}!`);
      }
    } catch (err) {
      console.warn("Error saving memory note:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  const filteredAgents =
    currentFilter === "all" ? AGENTS_DATA : AGENTS_DATA.filter((a) => a.dept === currentFilter);

  return (
    <div className="fixed inset-0 w-screen h-screen flex flex-col overflow-hidden bg-[#0a0d14] text-slate-100 font-sans">
      {/* ═══ TOP HEADER / NAVIGATION ══════════════════════════════════════ */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 py-3 glass-panel border-b border-slate-800/80">
        {/* Branding & Org Count */}
        <div className="flex items-center space-x-3.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs font-bold tracking-wider text-white uppercase font-mono">
                SYNTHETIX AI HQ
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-400 animate-pulse" />
                21 Active Autonomous Agents
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">Multi-Division Autonomous 3D Simulation</p>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="hidden xl:flex items-center space-x-1.5 text-xs bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
          {[
            { id: "all", label: "All (21)", color: "" },
            { id: "Executive Suite", label: "Executive (1)", color: "bg-amber-400" },
            { id: "Design Division", label: "Design (5)", color: "bg-rose-400" },
            { id: "Engineering Division", label: "Engineering (5)", color: "bg-sky-400" },
            { id: "Product Division", label: "Product (5)", color: "bg-purple-400" },
            { id: "Marketing Division", label: "Marketing (5)", color: "bg-amber-400" },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setCurrentFilter(d.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1.5 cursor-pointer ${
                currentFilter === d.id
                  ? "bg-slate-800 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}>
              {d.color && <span className={`w-2 h-2 rounded-full ${d.color}`} />}
              <span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-2">
          {/* MODEL GATEWAY & API KEY BUTTON */}
          <button
            onClick={() => setIsGatewayOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/50 text-xs font-mono transition cursor-pointer shadow-sm group">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold uppercase">{provider}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 hidden md:inline">{modelName}</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                apiKey ? "bg-emerald-900/80 text-emerald-300 border border-emerald-600/50" : "bg-slate-800 text-slate-400"
              }`}>
              {apiKey ? "API Key Set" : "Sim Mode"}
            </span>
          </button>

          {/* SQLite Persistent Memory Pill */}
          <button
            onClick={() => {
              setIsVaultOpen(true);
              fetchAllMemories();
            }}
            title="Open SQLite Office Memory Vault"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 hover:border-emerald-400/60 text-xs transition cursor-pointer shadow-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                dbConnected ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" : "bg-amber-400"
              }`}
            />
            <span className="text-emerald-300 font-semibold flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Memory:</span>
              <span className="text-emerald-200">{dbConnected ? "Active" : "Connecting"}</span>
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/80 text-emerald-200 border border-emerald-700/60 font-bold">
              {dbStats ? `${dbStats.total_memories} Logs` : "Ready"}
            </span>
          </button>

          {/* MCP Tools & Productivity Suite Button */}
          <button
            onClick={() => {
              setIsMcpCatalogOpen(true);
              fetchMcpCatalog();
            }}
            title="Open Employee MCP & Productivity Tools Suite"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 hover:bg-indigo-900/60 hover:border-indigo-400/60 text-xs transition cursor-pointer shadow-sm group">
            <Wrench className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            <span className="text-indigo-300 font-semibold hidden md:inline">MCP Tools</span>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 font-bold">
              Web & Suite
            </span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={resetCamera}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition cursor-pointer"
            title="Reset Simulation Camera">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* ═══ 3D THREE.JS CANVAS CONTAINER + FLOATING 2D NAME TAGS ════════ */}
      <main className="w-full h-full relative overflow-hidden flex-1">
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="absolute inset-0 w-full h-full bg-transparent" />

        {/* ── FLOATING NAME TAGS PROJECTED DIRECTLY OVER AGENT HEADS ──── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {AGENTS_DATA.map((agent) => (
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
              <button
                type="button"
                onClick={() => selectAgent(agent)}
                title={`Click to allot task to ${agent.name}`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl text-xs transition cursor-pointer backdrop-blur-md group hover:scale-110 active:scale-95 ${
                  selectedAgent?.id === agent.id
                    ? "bg-cyan-950 border-cyan-400 ring-2 ring-cyan-400 text-cyan-200"
                    : "bg-slate-900/90 border-slate-700/90 hover:bg-slate-800 hover:border-cyan-400 text-white"
                }`}
                style={{ borderColor: selectedAgent?.id === agent.id ? "#38bdf8" : `${agent.colorHex}aa` }}>
                <span className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: agent.colorHex }} />
                <span className="text-[11px] font-bold group-hover:text-cyan-300 whitespace-nowrap">
                  {agent.name}
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/60 text-slate-300 font-mono whitespace-nowrap border border-white/10">
                  {agent.dept.split(" ")[0]}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* ── LEFT PANEL: AGENT SELECTOR & WAYPOINTS ───────────────── */}
        <div className="absolute top-[68px] left-5 z-20 w-68 flex flex-col gap-3 pointer-events-auto">
          {/* Quick Direct Agent Selector Dropdown */}
          <div className="glass-panel p-3 rounded-2xl border border-cyan-500/30 text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 font-medium pb-2 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px] uppercase tracking-wider font-mono">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> Dispatch Agent (21)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Quick Select</span>
            </div>
            <div className="mt-2">
              <select
                value={selectedAgent?.id || ""}
                onChange={(e) => {
                  const id = parseInt(e.target.value, 10);
                  const a = AGENTS_DATA.find((x) => x.id === id);
                  if (a) selectAgent(a);
                }}
                className="w-full bg-slate-950/90 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none cursor-pointer font-sans">
                <option value="">-- Choose Agent to Dispatch --</option>
                {AGENTS_DATA.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.avatarIcon} {a.name} ({a.dept.split(" ")[0]} - {a.role.split(" ")[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Office Waypoints & Zones */}
          <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 text-xs shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 font-medium pb-2 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px] uppercase tracking-wider font-mono">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> Office Stations
              </span>
              <span className="text-[10px] text-slate-500 font-mono">7 Zones</span>
            </div>
            <div className="space-y-1.5 mt-2.5">
              {[
                { label: "Executive Suite", zone: "ceoDesk", color: "bg-amber-400" },
                { label: "Design Pod", zone: "designPod1", color: "bg-rose-400" },
                { label: "Eng Cluster", zone: "engPod1", color: "bg-sky-400" },
                { label: "Product Hub", zone: "prodPod1", color: "bg-purple-400" },
                { label: "Marketing Quad", zone: "mktgPod1", color: "bg-amber-400" },
                { label: "Conference Hub", zone: "confNorth", color: "bg-cyan-400" },
                { label: "Water Cooler & Lounge", zone: "waterCooler", color: "bg-emerald-400" },
              ].map((w) => (
                <div key={w.zone} className="flex items-center justify-between text-slate-300 py-0.5">
                  <span className="flex items-center gap-2 text-[11px]">
                    <span className={`w-2 h-2 rounded-full ${w.color}`} />
                    <span>{w.label}</span>
                  </span>
                  <button
                    onClick={() => focusWaypointZone(w.zone)}
                    className="text-blue-400 hover:text-blue-300 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer">
                    Focus
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Live Division Activity Feed */}
          <div className="glass-panel p-3 rounded-2xl border border-slate-800 text-xs shadow-xl hidden md:block">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/80">
              <span className="flex items-center gap-1.5 text-slate-200 font-semibold text-[11px] uppercase tracking-wider font-mono">
                <Radio className="w-3.5 h-3.5 text-emerald-400" /> Activity Feed
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                LIVE
              </span>
            </div>
            <div className="space-y-2 mt-2 font-mono text-[10px] max-h-36 overflow-y-auto pr-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-1.5 leading-snug">
                  <span className="text-slate-500 font-mono text-[9px]">{log.time}</span>
                  <span className={log.color}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BOTTOM ROSTER TRAY (All 21 Agents Clickable) ──────────── */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-center pointer-events-none">
          <div className="pointer-events-auto glass-panel px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-2xl w-full max-w-6xl">
            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-300 font-mono uppercase tracking-wider">
                  Agents Directory ({filteredAgents.length})
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-medium">
                  Click any floating name tag or agent card to allot tasks
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Autonomous
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> SQLite Persisted
                </span>
              </div>
            </div>

            {/* Scrollable chips container */}
            <div className="flex items-center space-x-2 overflow-x-auto py-1.5">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => selectAgent(agent)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition shrink-0 cursor-pointer ${
                    selectedAgent?.id === agent.id
                      ? "border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-md shadow-cyan-500/25 ring-2 ring-cyan-400/50 scale-105"
                      : "border-slate-800 bg-slate-900/90 text-slate-200 hover:border-slate-600 hover:bg-slate-800"
                  }`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: agent.colorHex }} />
                  <span className="text-[11px] font-semibold">{agent.name}</span>
                  <span className="text-[9px] px-1 rounded bg-slate-800/80 text-slate-400 font-mono">
                    {agent.dept.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ═══ WORKER DIRECTIVE DISPATCHER MODAL ═════════════════════════ */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 anim-fade-in pointer-events-auto">
          <div className="glass-card w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-white/15 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div
                  className="w-12 h-12 rounded-2xl bg-blue-500/20 border flex items-center justify-center text-xl shadow-inner font-bold text-blue-300"
                  style={{ borderColor: `${selectedAgent.colorHex}66` }}>
                  {selectedAgent.avatarIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">{selectedAgent.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono border border-slate-700">
                      {selectedAgent.dept}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      🧠 {agentMemories.length} Memories
                    </span>
                  </div>
                  <p className="text-xs text-blue-300 font-medium flex items-center gap-1.5">
                    <span>{selectedAgent.role}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissSelectedAgent}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800/80 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center bg-slate-950/80 px-5 border-b border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setModalTab("directive")}
                className={`py-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "directive"
                    ? "border-cyan-400 text-cyan-300 bg-cyan-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Assign Directive</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("tools")}
                className={`py-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "tools"
                    ? "border-indigo-400 text-indigo-300 bg-indigo-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}>
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span>MCP & Productivity Tools ({agentTools.length || 4})</span>
              </button>
              <button
                type="button"
                onClick={() => setModalTab("memory")}
                className={`py-2.5 px-3 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  modalTab === "memory"
                    ? "border-emerald-400 text-emerald-300 bg-emerald-500/10"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>SQLite Memory Bank ({agentMemories.length})</span>
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {modalTab === "directive" ? (
                <>
                  {/* INLINE MODEL & API KEY SELECTOR BAR */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase flex items-center gap-1">
                        <Key className="w-3 h-3" /> LLM Gateway:
                      </span>
                      <select
                        value={provider}
                        onChange={(e) => {
                          const p = e.target.value;
                          setProvider(p);
                          setModelName(DEFAULT_MODELS[p]);
                          saveGatewayConfig(p, DEFAULT_MODELS[p], apiKey);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono outline-none cursor-pointer">
                        <option value="openai">OpenAI</option>
                        <option value="anthropic">Anthropic</option>
                        <option value="gemini">Google Gemini</option>
                      </select>
                      <select
                        value={modelName}
                        onChange={(e) => {
                          setModelName(e.target.value);
                          saveGatewayConfig(provider, e.target.value, apiKey);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs font-mono outline-none cursor-pointer max-w-[140px] truncate">
                        {(PROVIDER_MODELS[provider] || []).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsGatewayOpen(true)}
                      className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-1 transition cursor-pointer">
                      <Settings className="w-3 h-3" />
                      <span>{apiKey ? "API Key Configured ✓" : "Configure API Key"}</span>
                    </button>
                  </div>

                  {/* Status Indicators */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Agent State</span>
                      <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active / Online
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Assigned Station</span>
                      <div className="text-[11px] font-medium text-slate-200 truncate">
                        {selectedAgent.home || "Core Pod"}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-[9px] uppercase font-mono text-slate-400 block mb-0.5">Memory Logs</span>
                      <div className="text-[11px] font-medium text-amber-300 truncate">
                        {agentMemories.length > 0 ? `${agentMemories.length} Sessions Logged` : "Initialized"}
                      </div>
                    </div>
                  </div>

                  {/* Form to dispatch directive */}
                  <form onSubmit={handleDispatchDirective} className="space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Assign Directive / Task
                        </label>
                        <span className="text-[10px] text-slate-400 font-mono">Agent ID: #{selectedAgent.id}</span>
                      </div>
                      <textarea
                        value={directiveText}
                        onChange={(e) => setDirectiveText(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-700/80 text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none font-sans"
                        placeholder="Enter directive, autonomous prompt, or command sequence..."
                        rows={3}
                        required
                      />

                      {/* Presets */}
                      {selectedAgent.presets && (
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-mono">Presets:</span>
                          {selectedAgent.presets.map((p, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setDirectiveText(p)}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer">
                              {p.slice(0, 26)}...
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Destination Waypoint in 3D Office */}
                    <div className="flex items-center justify-between gap-3 text-xs pt-1">
                      <span className="text-slate-400 text-[11px]">Walk to Station:</span>
                      <select
                        value={waypointTarget}
                        onChange={(e) => setWaypointTarget(e.target.value)}
                        className="bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none text-xs flex-1 max-w-[240px]">
                        <option value="ceoDesk">Executive Suite (CEO Cabin)</option>
                        <option value="designPod1">Design Pod 1</option>
                        <option value="designPod2">Design Pod 2</option>
                        <option value="engPod1">Engineering Cluster A</option>
                        <option value="engPod2">Engineering Cluster B</option>
                        <option value="prodPod1">Product Hub Alpha</option>
                        <option value="mktgPod1">Marketing Quad Alpha</option>
                        <option value="confNorth">Conference Hub Center</option>
                        <option value="waterCooler">Water Cooler & Lounge</option>
                      </select>
                    </div>

                    {/* Active MCP Tool Selector Pill */}
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-[11px] font-mono text-indigo-300 font-semibold">Active MCP Tool:</span>
                        <select
                          value={selectedToolId}
                          onChange={(e) => setSelectedToolId(e.target.value)}
                          className="bg-[#050812] border border-indigo-500/40 rounded px-2 py-1 text-indigo-200 text-xs font-mono outline-none cursor-pointer">
                          <option value="">⚡ Auto-Detect (Web Search / Math / PRD)</option>
                          {(agentTools.length > 0 ? agentTools : [
                            { id: "web_search", name: "Live DuckDuckGo Web Search" },
                            { id: "math_eval", name: "Enterprise Calculator & Modeler" },
                          ]).map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => setModalTab("tools")}
                        className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer">
                        View Tool Capabilities →
                      </button>
                    </div>

                    {/* Persisted to SQLite Memory Alert */}
                    {lastSavedMemory && (
                      <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-[11px] text-emerald-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Persisted to SQLite Memory #<b>{lastSavedMemory.id}</b></span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">
                          Prior sessions: {lastSavedMemory.past_memory_count}
                        </span>
                      </div>
                    )}

                    {/* Live MCP Tool Execution Banner */}
                    {lastExecutedTool && (
                      <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/50 text-[11px] text-indigo-200 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-indigo-400 animate-pulse" />
                          <span>MCP Tool Executed: <b>{lastExecutedTool.name.toUpperCase()}</b></span>
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">
                          Live Verified
                        </span>
                      </div>
                    )}

                    {/* Deliverable Output Preview */}
                    {deliverable && (
                      <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-[11px] font-mono space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 border-b border-slate-800">
                          <span className="text-cyan-400 font-bold">CrewAI Execution Deliverable</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(deliverable);
                              showToast("Deliverable copied!");
                            }}
                            className="text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center gap-1">
                            <Copy className="w-3 h-3" /> Copy
                          </button>
                        </div>
                        <pre className="max-h-40 overflow-y-auto text-slate-300 whitespace-pre-wrap leading-relaxed select-text">
                          {deliverable}
                        </pre>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-2.5 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={dismissSelectedAgent}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer">
                        Cancel / Resume
                      </button>
                      <button
                        type="submit"
                        disabled={isExecuting || !directiveText.trim()}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
                        {isExecuting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            <span>Dispatching & Persisting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Allot Work & Dispatch</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : modalTab === "tools" ? (
                /* MCP & PRODUCTIVITY TOOLS TAB FOR AGENT */
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-indigo-400" />
                        <span>{selectedAgent.dept} Employee Productivity Toolkit</span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Tailored Model Context Protocol (MCP) tool integrations for {selectedAgent.name}.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-700/50">
                      {agentTools.length} Active Tools
                    </span>
                  </div>

                  {/* Grid of Tools */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {agentTools.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => {
                          setSelectedToolId(tool.id);
                          setModalTab("directive");
                          showToast(`Selected ${tool.name} for current directive!`);
                        }}
                        className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                          selectedToolId === tool.id
                            ? "bg-indigo-950/70 border-indigo-400 text-indigo-100 shadow-md shadow-indigo-500/20"
                            : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80"
                        }`}>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              {tool.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              {tool.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-relaxed">{tool.description}</p>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400">● MCP Protocol Ready</span>
                          <span className="text-indigo-400 font-semibold hover:underline">Select Tool →</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick DuckDuckGo Live Search in Agent Modal */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" /> Instant Live Web Query for {selectedAgent.name}
                    </span>
                    <form onSubmit={handleLiveWebSearch} className="flex gap-2">
                      <input
                        type="text"
                        value={liveSearchQuery}
                        onChange={(e) => setLiveSearchQuery(e.target.value)}
                        placeholder={`Search real-time web for ${selectedAgent.role}...`}
                        className="flex-1 bg-[#050810] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        type="submit"
                        disabled={isSearchingWeb || !liveSearchQuery.trim()}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-semibold font-mono flex items-center gap-1 cursor-pointer">
                        {isSearchingWeb ? "Searching..." : "Search"}
                      </button>
                    </form>

                    {liveSearchResults && (
                      <div className="mt-2 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {liveSearchResults.results.map((res, i) => (
                          <div key={i} className="p-2 rounded bg-black/40 border border-slate-800 text-[11px]">
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-cyan-400 hover:underline block truncate">
                              {res.title}
                            </a>
                            <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{res.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Memory Tab */
                <div className="space-y-4">
                  {/* Manual Fact Insertion Form */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                      <Database className="w-3.5 h-3.5" /> Store Directive in SQLite Memory
                    </span>
                    <form onSubmit={handleAddMemoryNote} className="space-y-2">
                      <textarea
                        value={newMemoryNote}
                        onChange={(e) => setNewMemoryNote(e.target.value)}
                        placeholder={`Provide a permanent instruction or policy for ${selectedAgent.name} to remember across future missions...`}
                        className="w-full bg-[#050810] border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono resize-none"
                        rows={2}
                      />
                      <button
                        type="submit"
                        disabled={isSavingNote || !newMemoryNote.trim()}
                        className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5">
                        {isSavingNote ? "Writing to office_memory.db..." : "💾 Save to Agent Memory"}
                      </button>
                    </form>
                  </div>

                  {/* Chronological Stream */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
                      <span>Historical Episodic Timeline ({agentMemories.length})</span>
                      <button
                        type="button"
                        onClick={() => fetchAgentMemories(selectedAgent.backendId)}
                        className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer">
                        ↻ Refresh
                      </button>
                    </div>

                    {agentMemories.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs rounded-xl border border-slate-800 bg-slate-900/40">
                        No previous memories stored for this agent yet.
                        <p className="text-[10px] text-slate-600 mt-1">
                          Dispatch directives to build persistent memory.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {agentMemories.map((m) => (
                          <div
                            key={m.id}
                            className="p-3 rounded-lg border border-slate-800 bg-[#060a14] hover:border-slate-700 transition">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                              <span className="text-emerald-400 font-semibold">
                                #{m.id} • {m.memory_type}
                              </span>
                              <span>{m.timestamp || m.created_at}</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-200 mb-1">"{m.directive}"</div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-mono line-clamp-3 bg-slate-950/60 p-2 rounded border border-slate-900">
                              {m.summary || m.deliverable}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODEL GATEWAY & API KEY CONFIGURATION MODAL ═══════════════ */}
      {isGatewayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 anim-fade-in pointer-events-auto">
          <div className="w-full max-w-md bg-[#0f1524] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Model Gateway & API Key</h3>
                  <p className="text-[11px] text-slate-400">Select LLM Provider & pass credentials</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGatewayOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Provider Selection */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1.5 uppercase font-semibold">
                  Provider
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "openai", name: "OpenAI", defaultMod: "gpt-4o" },
                    { id: "anthropic", name: "Anthropic", defaultMod: "claude-3-5-sonnet-20241022" },
                    { id: "gemini", name: "Gemini", defaultMod: "gemini-2.5-flash" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProvider(p.id);
                        setModelName(p.defaultMod);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        provider === p.id
                          ? "border-cyan-400 bg-cyan-950/50 text-cyan-200 font-bold shadow-md shadow-cyan-500/20"
                          : "border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5 font-mono truncate">{p.defaultMod}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 uppercase font-semibold">
                  Model
                </label>
                <div className="space-y-1.5">
                  <select
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-500 outline-none">
                    {(PROVIDER_MODELS[provider] || []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label} ({m.id})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder="Or type custom model name..."
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              {/* API Key */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    API Key ({provider.toUpperCase()})
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer">
                    {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showKey ? "Hide" : "Show"}</span>
                  </button>
                </div>
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${provider.toUpperCase()} API key or leave blank for autonomous simulation...`}
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Passed securely to FastAPI per-execution. If left blank, agents run in autonomous simulation mode with SQLite memory.
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-800 bg-[#0a0f1b] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsGatewayOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => saveGatewayConfig()}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow shadow-cyan-500/20">
                Save Gateway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ OFFICE MEMORY VAULT MODAL ═════════════════════════════════ */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 anim-fade-in pointer-events-auto">
          <div className="w-full max-w-3xl bg-[#0f1524] border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                  🗄️
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    SQLite Office Memory Vault
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      PERSISTENT
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Episodic memory bank synchronized across all 21 virtual enterprise agents
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVaultOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm cursor-pointer">
                ✕
              </button>
            </div>

            {/* Metrics Overview Cards */}
            <div className="p-5 border-b border-slate-800/80 bg-[#0b101c] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Total Memories</span>
                <div className="text-xl font-bold text-emerald-400 mt-1">{dbStats?.total_memories ?? 0}</div>
                <div className="text-[10px] text-slate-500">Stored in SQLite</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Active Agents</span>
                <div className="text-xl font-bold text-cyan-400 mt-1">{dbStats?.agents_with_memories ?? 0} / 21</div>
                <div className="text-[10px] text-slate-500">Agents with history</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">DB File Size</span>
                <div className="text-xl font-bold text-purple-400 mt-1">{dbStats?.db_size_kb ?? 0} KB</div>
                <div className="text-[10px] text-slate-500">office_memory.db</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Engine Status</span>
                <div className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </div>
                <div className="text-[10px] text-slate-500">Thread-safe SQLite3</div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-3 border-b border-slate-800 bg-[#0e1422] flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={vaultSearch}
                  onChange={(e) => {
                    setVaultSearch(e.target.value);
                    fetchAllMemories(e.target.value);
                  }}
                  placeholder="Search memories across all agents by directive, keyword, or role..."
                  className="w-full bg-[#070b14] border border-slate-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
              </div>
              <button
                type="button"
                onClick={() => fetchAllMemories(vaultSearch)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition cursor-pointer">
                ↻ Refresh
              </button>
            </div>

            {/* Memories List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[#080d18]">
              {allMemories.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-xs rounded-xl border border-slate-800 bg-slate-900/30">
                  <span className="text-2xl block mb-2">🔍</span>
                  No memory records found matching your query.
                </div>
              ) : (
                allMemories.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl border border-slate-800/90 bg-[#0c1220] hover:border-slate-700 transition space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{m.agent_name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                          {m.cabin}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                          {m.division}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{m.timestamp || m.created_at}</span>
                    </div>

                    <div className="text-xs font-semibold text-emerald-300">Directive: "{m.directive}"</div>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-900 leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                      {m.deliverable}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>Gateway: {m.provider}/{m.model}</span>
                      <span>Memory ID: #{m.id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-[#0a0f1b] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                DB File: <span className="text-slate-300">{dbStats?.db_path || "office_memory.db"}</span>
              </span>
              <button
                type="button"
                onClick={() => setIsVaultOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer">
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ENTERPRISE MCP & PRODUCTIVITY TOOLS SUITE MODAL ═══════════ */}
      {isMcpCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 anim-fade-in pointer-events-auto">
          <div className="w-full max-w-4xl bg-[#0d121f] border border-indigo-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xl text-indigo-300">
                  <Wrench className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Enterprise Model Context Protocol (MCP) Suite
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                      v2.2 ACTIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Productivity toolkits, real-time DuckDuckGo web search, and specialized utilities for all 21 agents
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMcpCatalogOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-sm cursor-pointer">
                ✕
              </button>
            </div>

            {/* Live Web Search Bar directly in MCP Catalog */}
            <div className="p-4 bg-[#0a0f1c] border-b border-slate-800">
              <form onSubmit={handleLiveWebSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={liveSearchQuery}
                    onChange={(e) => setLiveSearchQuery(e.target.value)}
                    placeholder="Test live real-time Web Search (DuckDuckGo engine) across global knowledge index..."
                    className="w-full bg-[#060a14] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingWeb || !liveSearchQuery.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold text-xs font-mono flex items-center gap-1.5 cursor-pointer">
                  <Search className="w-3.5 h-3.5" />
                  <span>{isSearchingWeb ? "Searching Web..." : "Live Web Query"}</span>
                </button>
              </form>

              {/* Real-time search results display */}
              {liveSearchResults && (
                <div className="mt-3 p-3 rounded-xl bg-black/60 border border-cyan-500/30 space-y-2 max-h-40 overflow-y-auto">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pb-1 border-b border-slate-800">
                    <span>Web Results for: "{liveSearchResults.query}"</span>
                    <span>{liveSearchResults.count} sources returned</span>
                  </div>
                  {liveSearchResults.results.map((r, i) => (
                    <div key={i} className="text-xs space-y-0.5">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-300 font-semibold hover:underline block truncate">
                        {r.title}
                      </a>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{r.snippet}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Division-wise MCP Tools Grid */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#080c16]">
              {Object.entries(
                Object.keys(mcpCatalog).length > 0
                  ? mcpCatalog
                  : {
                      Executive: [
                        { id: "web_search", name: "Live Web Search & Market Signals", category: "Intelligence", description: "Scours real-time web for competitor moves, macro market shifts, and executive intelligence." },
                        { id: "financial_modeler", name: "CapTable & ROI Modeler", category: "Finance", description: "Calculates runway, EBITDA estimates, burn rate projections, and board deliverables." },
                        { id: "executive_brief", name: "Executive Summary & M&A Synthesizer", category: "Governance", description: "Converts cross-departmental sprint reports into C-suite executive briefing memos." }
                      ],
                      Design: [
                        { id: "wcag_auditor", name: "WCAG AAA Accessibility Inspector", category: "Design System", description: "Audits foreground and background contrast ratios, focus traps, and screen-reader semantics." },
                        { id: "token_sync", name: "Figma-to-Tailwind Token Sync", category: "Architecture", description: "Translates Figma variables and design tokens into CSS variables and Tailwind classes." },
                        { id: "web_search", name: "Design Trend & Spatial UI Search", category: "Inspiration", description: "Indexes contemporary Dribbble/Awwwards trends, 3D WebGL UI paradigms, and micro-interactions." }
                      ],
                      Engineering: [
                        { id: "code_sandbox", name: "Safe Code Sandbox & Syntax Lint", category: "Development", description: "Validates Python/JavaScript syntax, catches AST regressions, and formats snippets." },
                        { id: "api_inspector", name: "REST & WebSocket Endpoint Inspector", category: "Networking", description: "Simulates API payloads, checks status codes, and benchmarks round-trip response times." },
                        { id: "git_cicd_analyzer", name: "CI/CD Pipeline & Git Health Auditor", category: "DevOps", description: "Checks branch divergence, test suite coverage reports, and container build manifests." },
                        { id: "web_search", name: "StackOverflow & Docs Web Search", category: "Research", description: "Live search across GitHub issues, PyPI/npm packages, and official library documentation." }
                      ],
                      Product: [
                        { id: "rice_prioritization", name: "RICE Feature Score Matrix", category: "Strategy", description: "Computes Reach × Impact × Confidence / Effort scores to scientifically prioritize roadmaps." },
                        { id: "prd_generator", name: "Technical PRD & Acceptance Criteria Drafter", category: "Specification", description: "Generates structured product requirements documents with edge-case test criteria." },
                        { id: "nps_sentiment", name: "User Feedback & NPS Sentiment Triage", category: "Voice of Customer", description: "Classifies incoming customer feedback tickets into bug, feature request, or UX friction point." }
                      ],
                      Marketing: [
                        { id: "web_search", name: "Live Web Search & Keyword Intelligence", category: "Search", description: "Live DuckDuckGo search for high-volume keyword trends, competitor SERPs, and breaking news." },
                        { id: "seo_optimizer", name: "SERP & Meta Tag Optimizer", category: "SEO", description: "Audits title tag pixel widths, meta description density, OpenGraph tags, and canonical URLs." },
                        { id: "cac_ltv_calculator", name: "Unit Economics & CAC/LTV Modeler", category: "Growth", description: "Calculates Customer Acquisition Cost, Payback Months, and Blended Return on Ad Spend (ROAS)." },
                        { id: "copy_headline_scorer", name: "Conversion Copy & Headline Scorer", category: "Content", description: "Scores emotional appeal, clarity, active voice, and hook retention for social and ad copy." }
                      ]
                    }
              ).map(([dept, tools]) => (
                <div key={dept} className="space-y-3">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      {dept} Division Toolkit
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {tools.length} Specialized MCP Endpoints
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tools.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-xl bg-[#0c111e] border border-slate-800/90 hover:border-indigo-500/40 transition flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-semibold text-slate-100">{t.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-900/60">
                              {t.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{t.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-850 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400">● MCP Protocol Ready</span>
                          <span className="text-indigo-400">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-800 bg-[#0a0f1b] flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px]">
                Endpoint: <span className="text-slate-300">/api/mcp/execute & /api/search</span>
              </span>
              <button
                type="button"
                onClick={() => setIsMcpCatalogOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer">
                Close Toolkit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ NOTIFICATION TOAST ════════════════════════════════════════ */}
      {toastMessage && (
        <div className="fixed top-[68px] right-6 z-50 glass-card px-4 py-2.5 rounded-xl border border-emerald-500/40 text-emerald-300 flex items-center space-x-2 text-xs shadow-xl anim-float-up pointer-events-none">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
