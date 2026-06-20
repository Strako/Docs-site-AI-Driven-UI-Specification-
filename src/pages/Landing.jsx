import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TerminalWindow from "../components/TerminalWindow";
import "./Landing.css";

const HERO_LINES = [
  { type: "user", text: "Create a spec for /dashboard" },
  {
    type: "user",
    text: "Login at /login — email: AUTH_EMAIL, password: AUTH_PASSWORD",
  },
  { type: "blank" },
  { type: "output", text: "Activating spec-wizard-generate…" },
  { type: "output", text: "Connecting Playwright to localhost:3000…" },
  { type: "output", text: "Analyzing DOM, forms, navigation…" },
  {
    type: "success",
    text: "✓  spec written → Platform/Dashboard/spec.md",
  },
  { type: "cursor" },
];

const INSTALL_LINES = [
  { type: "comment", text: "Add the marketplace (one-time per machine)" },
  {
    type: "command",
    text: "claude plugin marketplace add Strako/AI-Driven-UI-Specification-QA-Automation-Suite",
  },
  { type: "blank" },
  { type: "comment", text: "Install the plugin into your project" },
  { type: "command", text: "claude plugin install AI-Driven-UI-Specification" },
  { type: "blank" },
  {
    type: "success",
    text: "✅  AI-Driven-UI-Specification installed successfully!",
  },
];

const PIPELINE_STEPS = [
  {
    num: "01",
    label: "Generate Spec",
    desc: "Playwright analyzes your live page — DOM, screenshots, navigation.",
    color: "#3b82f6",
  },
  {
    num: "02",
    label: "Enrich",
    desc: "Optionally apply existing requirements docs to the spec.",
    color: "#0ea5e9",
  },
  {
    num: "03",
    label: "Improve Spec",
    desc: "Walk through 9 spec sections with the interactive wizard.",
    color: "#06b6d4",
  },
  {
    num: "04",
    label: "Generate Tests",
    desc: "Produce test-cases.md + test-data.md with full coverage.",
    color: "#10b981",
  },
  {
    num: "05",
    label: "Execute Tests",
    desc: "Run via Playwright MCP and receive a full test report.",
    color: "#61dafb",
  },
];

const PROMPT_EXAMPLES = [
  {
    label: "Basic spec from a page",
    lines: [
      { type: "user", text: "Create a spec for /dashboard." },
      {
        type: "user",
        text: "Login at /login — email: AUTH_EMAIL, password: AUTH_PASSWORD",
      },
      { type: "user", text: "Module name: dashboard" },
    ],
  },
  {
    label: "With design comparison",
    lines: [
      { type: "user", text: "Create a spec for /login" },
      {
        type: "user",
        text: "Design reference: https://figma.com/design/abc123?node-id=1234-5678",
      },
    ],
  },
  {
    label: "Run the full pipeline on existing spec",
    lines: [
      {
        type: "user",
        text: "Run the full QA pipeline for Platform/Login/login-description.md",
      },
    ],
  },
];

const FEATURES = [
  {
    icon: "🔍",
    title: "Auto Spec Generation",
    desc: "Playwright MCP analyzes your live page — DOM, screenshots, tabs, scroll — and produces a complete UI spec in one pass.",
  },
  {
    icon: "✏️",
    title: "Interactive Refinement",
    desc: "Walk through all 9 spec sections with the improvement wizard. Confirm, correct, or add content section by section.",
  },
  {
    icon: "📋",
    title: "Requirements Enrichment",
    desc: "Before saving, enrich the spec with existing docs or requirement files. Relevant items are matched and applied automatically.",
  },
  {
    icon: "🧪",
    title: "Full Coverage Test Cases",
    desc: "Smoke, Happy Path, Functional, Edge Case, Exploratory — all generated from the spec with ${field-name} placeholders.",
  },
  {
    icon: "🎨",
    title: "Design Comparison",
    desc: "Provide a Figma URL or Pencil slide name to get a pixel-level comparison against the live implementation.",
  },
  {
    icon: "⚙️",
    title: "Hook-Based State Machine",
    desc: "Shell hooks coordinate pipeline transitions deterministically — agents are isolated and stateless, hooks handle the rest.",
  },
];

const AGENTS = [
  {
    name: "spec-wizard-generate",
    model: "Opus",
    color: "#3b82f6",
    desc: "Auto-generates spec from live DOM",
  },
  {
    name: "spec-wizard-improve",
    model: "Opus",
    color: "#0ea5e9",
    desc: "Interactive 9-section refinement",
  },
  {
    name: "spec-wizard-pipeline",
    model: "Opus",
    color: "#06b6d4",
    desc: "Spec summary + pipeline offer",
  },
  {
    name: "qa-coordinator",
    model: "Opus",
    color: "#10b981",
    desc: "Orchestrates gen + exec agents",
  },
  {
    name: "test-generation",
    model: "Sonnet",
    color: "#61dafb",
    desc: "Produces test-cases.md + test-data.md",
  },
  {
    name: "test-execution",
    model: "Sonnet",
    color: "#38bdf8",
    desc: "Runs tests via Playwright MCP",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeExample, setActiveExample] = useState(0);

  return (
    <div className="landing">
      {/* 1. Hero — value prop + live demo */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <p className="hero-kicker animate-fade-in-up">v1.1.0</p>
              <h1 className="hero-title animate-fade-in-up animate-delay-2">
                AI-Driven UI{" "}
                <span className="gradient-text">Specification</span>
                <br />
                &amp; QA Automation
              </h1>
              <p className="hero-subtitle animate-fade-in-up animate-delay-3">
                From a live page URL to a complete test execution report — spec
                generation, interactive refinement, and browser-driven test
                automation powered by Claude agents.
              </p>
              <div className="hero-actions animate-fade-in-up animate-delay-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() =>
                    document
                      .getElementById("getstarted")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get Started
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => navigate("/tutorial")}
                >
                  Start Tutorial →
                </button>
              </div>
              <p className="hero-meta animate-fade-in-up animate-delay-4">
                7 Agents · 5 Skills · 4 Hooks · 6 Test Types
              </p>
            </div>
            <div className="hero-visual animate-fade-in-up animate-delay-3">
              <TerminalWindow title="spec-wizard-generate" lines={HERO_LINES} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. How it works — pipeline steps */}
      <section className="section-pipeline">
        <div className="container">
          <div className="pipeline-header">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-title">
              From URL to test report in one session
            </h2>
          </div>
          <div className="pipeline-steps">
            {PIPELINE_STEPS.map((step, i) => (
              <div
                key={i}
                className="pipeline-item"
                style={{ "--step-color": step.color }}
              >
                <div className="pipeline-item-num">{step.num}</div>
                <div className="pipeline-item-label">{step.label}</div>
                <div className="pipeline-item-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section className="section-features">
        <div className="container">
          <div className="features-header">
            <div className="section-eyebrow">Features</div>
            <h2 className="section-title">Everything the pipeline needs</h2>
          </div>
          <div className="grid-3 features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="card feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Prompt examples */}
      <section className="section-prompts">
        <div className="container">
          <div className="prompts-header">
            <div className="section-eyebrow">Prompt Examples</div>
            <h2 className="section-title">Say it naturally</h2>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              Invoke agents with plain language. Front-load all inputs or let
              the wizard ask — both work.
            </p>
          </div>
          <div className="prompts-tabs">
            {PROMPT_EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className={`prompt-tab ${activeExample === i ? "active" : ""}`}
                onClick={() => setActiveExample(i)}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <TerminalWindow
            title={`spec-wizard-generate — ${PROMPT_EXAMPLES[activeExample].label}`}
            lines={[
              ...PROMPT_EXAMPLES[activeExample].lines,
              { type: "blank" },
              { type: "output", text: "Agent activating…" },
              { type: "cursor" },
            ]}
            className="prompts-terminal"
          />
        </div>
      </section>

      {/* 5. Agents */}
      <section className="section-agents">
        <div className="container">
          <div className="agents-header">
            <div className="section-eyebrow">Agents</div>
            <h2 className="section-title">
              Specialized agents, isolated context
            </h2>
            <p className="section-subtitle" style={{ marginTop: 12 }}>
              Each agent runs in its own Claude instance with its own tools and
              system prompt. qa-coordinator orchestrates the others
              automatically.
            </p>
          </div>
          <div className="agents-grid">
            {AGENTS.map((agent, i) => (
              <div
                key={i}
                className="agent-card"
                style={{ "--agent-color": agent.color }}
              >
                <div className="agent-dot" />
                <div className="agent-info">
                  <div className="agent-name mono">{agent.name}</div>
                  <div className="agent-desc">{agent.desc}</div>
                </div>
                <div className="agent-model">{agent.model}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Get started — install + CTA combined */}
      <section id="getstarted" className="section-getstarted">
        <div className="container">
          <div className="getstarted-layout">
            <div className="getstarted-copy">
              <div className="section-eyebrow">Quick Install</div>
              <h2 className="section-title">
                Two commands.
                <br />
                Fully configured.
              </h2>
              <p className="section-subtitle" style={{ marginTop: 16 }}>
                The plugin installer copies all agents, skills, hooks, MCP
                config, and root files directly into your project. No manual
                setup needed.
              </p>
              <div className="install-checklist">
                {[
                  "7 agent definitions",
                  "5 skill playbooks",
                  "4 pipeline hooks",
                  "Playwright MCP server config",
                  "vars.md template",
                ].map((item) => (
                  <div key={item} className="checklist-item">
                    <span className="check">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <TerminalWindow title="Terminal" lines={INSTALL_LINES} />
          </div>
        </div>
      </section>
    </div>
  );
}
