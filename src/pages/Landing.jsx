import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TerminalWindow from "../components/TerminalWindow";
import "./Landing.css";

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
    color: "#818cf8",
    desc: "Auto-generates spec from live DOM",
  },
  {
    name: "spec-wizard-improve",
    model: "Opus",
    color: "#a78bfa",
    desc: "Interactive 9-section refinement",
  },
  {
    name: "spec-wizard-pipeline",
    model: "Opus",
    color: "#c084fc",
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
    color: "#22d3ee",
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
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="container">
          <div className="hero-inner animate-fade-in-up">
            <div className="badge animate-fade-in-up animate-delay-1">
              <span>Claude Code Plugin</span>
              <span className="badge-sep">·</span>
              <span className="badge-version">v1.0</span>
            </div>

            <h1 className="hero-title animate-fade-in-up animate-delay-2">
              AI-Driven UI <span className="gradient-text">Specification</span>
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
                onClick={() => navigate("/tutorial")}
              >
                <span>Start Tutorial</span>
                <span className="btn-arrow">→</span>
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => navigate("/docs")}
              >
                Read the Docs
              </button>
            </div>

            <div className="hero-stats animate-fade-in-up animate-delay-4">
              <div className="stat">
                <span className="stat-number">7</span>
                <span className="stat-label">Agents</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Skills</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">4</span>
                <span className="stat-label">Hooks</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-number">6</span>
                <span className="stat-label">Test Types</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline overview */}
      <section className="pipeline-overview">
        <div className="container">
          <div className="pipeline-flow">
            {[
              {
                step: "1",
                label: "Generate Spec",
                desc: "DOM analysis via Playwright",
                color: "#818cf8",
              },
              {
                step: "1.5",
                label: "Enrich",
                desc: "Apply requirements (optional)",
                color: "#a78bfa",
              },
              {
                step: "2",
                label: "Improve Spec",
                desc: "9-section interactive wizard",
                color: "#c084fc",
              },
              {
                step: "3",
                label: "Generate Tests",
                desc: "test-cases.md + test-data.md",
                color: "#10b981",
              },
              {
                step: "4",
                label: "Execute Tests",
                desc: "Browser automation + report",
                color: "#22d3ee",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="pipeline-step"
                style={{ "--step-color": item.color }}
              >
                <div className="pipeline-step-num">{item.step}</div>
                <div className="pipeline-step-content">
                  <div className="pipeline-step-label">{item.label}</div>
                  <div className="pipeline-step-desc">{item.desc}</div>
                </div>
                {i < 4 && <div className="pipeline-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="section-install">
        <div className="container">
          <div className="install-layout">
            <div className="install-text">
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
            <div className="install-terminal">
              <TerminalWindow title="Terminal" lines={INSTALL_LINES} />
            </div>
          </div>
        </div>
      </section>

      {/* Prompt examples */}
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

      {/* Features */}
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

      {/* Agents */}
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

      {/* CTA */}
      <section className="section-cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="cta-title">Ready to automate your UI testing?</h2>
            <p className="cta-subtitle">
              Follow the step-by-step tutorial to go from zero to a full test
              execution report in one session.
            </p>
            <div className="cta-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/tutorial")}
              >
                Read the Tutorial →
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => navigate("/docs")}
              >
                Explore the Docs
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
