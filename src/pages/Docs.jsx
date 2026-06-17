import { useEffect, useRef, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import './Docs.css'

const FLOWCHART = `flowchart TD
    USER(["User"]) -->|"Invokes spec-wizard-generate"| SWG

    subgraph SPEC_CREATION["STAGE 1 - Spec Creation"]
        SWG[/"spec-wizard-generate\\nAgent Opus"/]
        SWG -->|"Reads"| SKILL_AG["spec-wizard:auto-generate\\nSKILL.md"]
        SKILL_AG -->|"Instructions"| SWG
        SWG -->|"MCP Tool Calls"| PW1["Playwright MCP headed"]
        PW1 -->|"DOM + Screenshots"| SWG
        SWG -->|"Spec in memory"| REQ_PROMPT

        REQ_PROMPT{{"Requirements\\nenrichment?"}}
        REQ_PROMPT -->|"file path"| REQ_FILE["Reads requirements file"]
        REQ_PROMPT -->|"docs"| REQ_DOCS["Scans docs/ folder"]
        REQ_PROMPT -->|"skip"| WRITE_SPEC
        REQ_FILE --> WRITE_SPEC
        REQ_DOCS --> WRITE_SPEC

        WRITE_SPEC["Write tool → module-description.md"]
        WRITE_SPEC -->|"Writes enriched spec"| SPEC_FILE["module-description.md"]
    end

    SPEC_FILE -->|"PostToolUse Write"| HOOK_SPEC["pipeline-on-spec-created.sh"]
    HOOK_SPEC -->|"State: SPEC_AUTO_GENERATED"| STATE_FILE[".pipeline-state"]

    SWG -->|"Asks: improvement wizard?"| USER_CHOICE{{"yes / no"}}
    USER_CHOICE -->|"yes"| SWI
    USER_CHOICE -->|"no"| SWP

    subgraph SPEC_IMPROVE["STAGE 1b - Spec Improvement"]
        SWI[/"spec-wizard-improve\\nAgent Opus"/]
        SWI -->|"9 interactive sections"| SWI
        SWI -->|"Overwrites"| SPEC_FILE
    end

    SWI --> SWP

    subgraph PIPELINE_OFFER["STAGE 1c - Pipeline Offer"]
        SWP[/"spec-wizard-pipeline\\nAgent Opus"/]
        SWP -->|"Summary + Offer"| SWP
    end

    SWP -->|"Run QA Pipeline?"| PIPELINE_CHOICE{{"yes / no"}}
    PIPELINE_CHOICE -->|"no"| DONE_SPEC(["Spec complete"])
    PIPELINE_CHOICE -->|"yes"| QAC

    subgraph QA_PIPELINE["STAGE 2 - QA Pipeline"]
        QAC[/"qa-coordinator\\nAgent Opus"/]
        QAC -->|"Dispatch sub-agent"| TG

        subgraph TEST_GEN["Test Generation"]
            TG[/"test-generation\\nAgent Sonnet"/]
            TG -->|"Write"| TC["test-cases.md"]
            TG -->|"Write"| TD["test-data.md"]
        end
    end

    TC -->|"PostToolUse Write"| HOOK_TG["pipeline-on-tests-generated.sh"]
    HOOK_TG -->|"State: GENERATION_COMPLETE"| STATE_FILE

    QAC -->|"PAUSE"| USER_FILL(["User fills test-data.md"])
    USER_FILL -->|"done"| HOOK_PROMPT["pipeline-on-user-prompt.sh"]
    HOOK_PROMPT -->|"State: TEST_DATA_READY"| QAC

    QAC -->|"Dispatch sub-agent"| TE

    subgraph TEST_EXEC["STAGE 3 - Test Execution"]
        TE[/"test-execution\\nAgent Sonnet"/]
        TE -->|"MCP Tool Calls"| PW2["Playwright MCP headed"]
        TE -->|"Design Comparison"| DESIGN_MCP{"Design Reference?"}
        DESIGN_MCP -->|"Figma URL"| FIGMA_MCP["Figma MCP"]
        DESIGN_MCP -->|"Pencil name"| PENCIL_MCP["Pencil MCP"]
        TE -->|"Write"| REPORT["test-report-module.md"]
        TE -->|"Write"| SCREENSHOTS["TC-screenshots.png"]
    end

    REPORT -->|"PostToolUse Write"| HOOK_RPT["pipeline-on-report-written.sh"]
    HOOK_RPT -->|"State: EXECUTION_COMPLETE"| STATE_FILE

    QAC --> DONE_PIPELINE(["Pipeline complete — report delivered"])`

const STATE_DIAGRAM = `stateDiagram-v2
    [*] --> SPEC_AUTO_GENERATED : spec written to disk
    SPEC_AUTO_GENERATED --> WIZARD_REQUESTED : user says yes (improve)
    SPEC_AUTO_GENERATED --> PIPELINE_OFFER_REQUESTED : user says no (skip)
    WIZARD_REQUESTED --> WIZARD_COMPLETE : spec-wizard-improve saves spec
    WIZARD_COMPLETE --> GENERATION_COMPLETE : test-generation writes test-cases.md
    PIPELINE_OFFER_REQUESTED --> GENERATION_COMPLETE : test-generation writes test-cases.md
    GENERATION_COMPLETE --> TEST_DATA_READY : user says done / ready
    TEST_DATA_READY --> EXECUTION_COMPLETE : test-execution writes test-report
    EXECUTION_COMPLETE --> [*]`

function MermaidDiagram({ id, chart }) {
  const ref = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    import('mermaid').then(m => {
      if (cancelled) return
      const mermaid = m.default
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          darkMode: true,
          background: '#0d1117',
          primaryColor: '#161b22',
          primaryTextColor: '#c9d1d9',
          primaryBorderColor: '#30363d',
          lineColor: '#8b949e',
          secondaryColor: '#161b22',
          tertiaryColor: '#0d1117',
          edgeLabelBackground: '#0d1117',
          clusterBkg: '#161b22',
          clusterBorder: '#30363d',
          titleColor: '#c9d1d9',
          nodeBorder: '#30363d',
          mainBkg: '#161b22',
          nodeTextColor: '#c9d1d9',
          fontFamily: 'JetBrains Mono, monospace',
        },
        flowchart: { curve: 'basis' },
      })
      mermaid.render(id, chart).then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      }).catch(e => {
        if (!cancelled) setError(e.message)
      })
    })
    return () => { cancelled = true }
  }, [id, chart])

  if (error) {
    return (
      <div className="mermaid-error">
        <span>Diagram render error: {error}</span>
      </div>
    )
  }

  return (
    <div className="mermaid-wrapper">
      <div ref={ref} className="mermaid-inner" />
    </div>
  )
}

function CodeBlock({ code, lang = 'bash' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="lang">{lang}</span>
        <button className="copy-btn" onClick={handleCopy}>{copied ? '✓ copied' : 'copy'}</button>
      </div>
      <pre>{code}</pre>
    </div>
  )
}

const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'flowchart', label: '↳ Flow Diagram' },
  { id: 'state-machine', label: '↳ State Machine' },
  { id: 'agents', label: 'Agents' },
  { id: 'skills', label: 'Skills' },
  { id: 'hooks', label: 'Hooks' },
  { id: 'varsmd', label: 'vars.md & docs/' },
  { id: 'design-comparison', label: 'Design Comparison' },
  { id: 'contributing', label: 'Contributing' },
]

export default function Docs() {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const handler = () => {
      const sections = NAV_SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
      const scrollY = window.scrollY + 120
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i].offsetTop <= scrollY) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="docs">
      <div className="docs-layout container">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-inner">
            <div className="sidebar-section-title">Documentation</div>
            {NAV_SECTIONS.map(s => (
              <button
                key={s.id}
                className={`docs-nav-item ${activeSection === s.id ? 'active' : ''} ${s.label.startsWith('↳') ? 'sub' : ''}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="docs-content prose">

          {/* Overview */}
          <section id="overview">
            <h2>Overview</h2>
            <p>
              The AI-Driven-UI-Specification QA Automation Suite is a Claude Code plugin that
              automates the full UI testing lifecycle: from analyzing a live web page with Playwright
              to generating structured specs, test cases, and executing them — all through Claude agents.
            </p>
            <p>
              The system is built around three core primitives: <strong>Agents</strong> (isolated Claude
              instances), <strong>Skills</strong> (step-by-step playbooks agents follow), and <strong>Hooks</strong>{' '}
              (deterministic shell scripts that coordinate pipeline transitions). These three layers work
              together in a pipeline state machine.
            </p>

            <div className="info-box">
              <div className="info-box-title">Three-Layer Design</div>
              <pre>{`┌──────────────────────────────────────────────────────────┐
│  HOOKS (Infrastructure layer)                            │
│  • Deterministic — always execute on the event           │
│  • Observe file writes and user messages                 │
│  • Can block, inject context, or update state            │
└──────────────────────────────────────────────────────────┘
         ▲ fire when events occur ▲
┌──────────────────────────────────────────────────────────┐
│  AGENTS (Orchestration layer)                            │
│  • Isolated Claude instances with own context            │
│  • Decide what to do based on their system prompt        │
│  • Can dispatch other agents (sub-agents)                │
│  • Their actions TRIGGER hooks                           │
└──────────────────────────────────────────────────────────┘
         ▲ load and follow ▲
┌──────────────────────────────────────────────────────────┐
│  SKILLS (Knowledge layer)                                │
│  • Step-by-step instructions agents follow               │
│  • Loaded on-demand via the Read tool                    │
│  • Define the exact procedure — the playbook             │
└──────────────────────────────────────────────────────────┘`}</pre>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture">
            <h2>Architecture</h2>
            <p>
              The repository root is the plugin root. When a user runs{' '}
              <code>claude plugin install AI-Driven-UI-Specification</code>, Claude Code reads{' '}
              <code>.claude-plugin/plugin.json</code> and copies files to the right places in the project.
            </p>

            <CodeBlock lang="text" code={`./                                   ← repo root = plugin root
├── .claude-plugin/
│   ├── plugin.json                  Plugin manifest
│   └── marketplace.json             Marketplace catalog
├── agents/                          → .claude/agents/
│   ├── spec-wizard-generate.md
│   ├── spec-wizard-improve.md
│   ├── spec-wizard-pipeline.md
│   ├── qa-coordinator.md
│   ├── test-generation.md
│   └── test-execution.md
├── skills/                          → .claude/skills/
│   ├── spec-wizard:auto-generate/SKILL.md
│   ├── spec-wizard:improve/SKILL.md
│   ├── spec-wizard:pipeline-offer/SKILL.md
│   ├── test-generation:process/SKILL.md
│   └── test-execution:process/SKILL.md
├── hooks/                           → .claude/hooks/
│   ├── pipeline-on-user-prompt.sh
│   ├── pipeline-on-spec-created.sh
│   ├── pipeline-on-tests-generated.sh
│   └── pipeline-on-report-written.sh
├── TEMPLATE.md                      → project root
├── vars.md                          → project root
├── settings.json                    → merged into .claude/settings.json
└── .mcp.json                        → merged into .mcp.json`} />
          </section>

          {/* Flowchart */}
          <section id="flowchart">
            <h2>Full Pipeline Flow Diagram</h2>
            <p>
              This diagram shows the complete execution flow from the user invoking{' '}
              <code>spec-wizard-generate</code> through spec creation, test generation, and test execution.
              Hooks fire at key transitions to update the pipeline state.
            </p>
            <MermaidDiagram id="flowchart-main" chart={FLOWCHART} />
          </section>

          {/* State machine */}
          <section id="state-machine">
            <h2>Pipeline State Machine</h2>
            <p>
              Hooks implement a state machine using the <code>.claude/.pipeline-state</code> file.
              Each hook reads the current state, and when it detects a relevant event, updates it.
              Agents don't know about hooks — they follow their skills, and hooks coordinate transitions
              invisibly between them.
            </p>
            <MermaidDiagram id="state-diagram" chart={STATE_DIAGRAM} />

            <h3>State transitions explained</h3>
            <table>
              <thead>
                <tr>
                  <th>State</th>
                  <th>Trigger</th>
                  <th>Hook</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['SPEC_AUTO_GENERATED', 'spec file written to Platform/', 'pipeline-on-spec-created.sh'],
                  ['WIZARD_REQUESTED', 'user says "yes" to improvement wizard', 'pipeline-on-user-prompt.sh'],
                  ['PIPELINE_OFFER_REQUESTED', 'user says "no" (skip wizard)', 'pipeline-on-user-prompt.sh'],
                  ['WIZARD_COMPLETE', 'spec-wizard-improve writes the spec', 'pipeline-on-spec-created.sh'],
                  ['GENERATION_COMPLETE', 'test-cases.md is written', 'pipeline-on-tests-generated.sh'],
                  ['TEST_DATA_READY', 'user says "done" / "ready"', 'pipeline-on-user-prompt.sh'],
                  ['EXECUTION_COMPLETE', 'test-report-*.md is written', 'pipeline-on-report-written.sh'],
                ].map(([state, trigger, hook]) => (
                  <tr key={state}>
                    <td><code>{state}</code></td>
                    <td>{trigger}</td>
                    <td><code>{hook}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Agents */}
          <section id="agents">
            <h2>Agents</h2>
            <p>
              An <strong>Agent</strong> is an isolated Claude instance with its own context window,
              system prompt, tool access, and permissions. Defined as markdown files with YAML frontmatter.
            </p>

            <CodeBlock lang="markdown" code={`---
name: my-agent
description: Description of when to use this agent. Claude uses this to decide when to delegate.
model: claude-sonnet-4-6
color: "#16A34A"
tools: Read, Write, Bash, Glob, Grep, mcp__playwright_headed
---

This is the agent's system prompt.
Everything here is what the agent "knows" and follows as instructions.`} />

            <h3>Key frontmatter fields</h3>
            <table>
              <thead>
                <tr><th>Field</th><th>Required</th><th>Description</th></tr>
              </thead>
              <tbody>
                {[
                  ['name', 'Yes', 'Unique kebab-case identifier'],
                  ['description', 'Yes', 'When Claude should delegate to this agent'],
                  ['tools', 'No', 'Allowed tools (inherits all if omitted)'],
                  ['model', 'No', 'opus, sonnet, haiku, or full model ID'],
                  ['permissionMode', 'No', 'default, acceptEdits, auto, or bypassPermissions'],
                  ['maxTurns', 'No', 'Maximum turns before stopping'],
                  ['color', 'No', 'Background color in the UI'],
                ].map(([f, r, d]) => (
                  <tr key={f}><td><code>{f}</code></td><td>{r}</td><td>{d}</td></tr>
                ))}
              </tbody>
            </table>

            <h3>How sub-agents work</h3>
            <p>
              The <code>qa-coordinator</code> agent dispatches <code>test-generation</code> and{' '}
              <code>test-execution</code> using the <code>Agent()</code> tool declaration:
            </p>
            <CodeBlock lang="markdown" code={`---
name: qa-coordinator
tools: Read, Glob, Agent(test-generation, test-execution)
---`} />

            <h3>All agents in this plugin</h3>
            <table>
              <thead>
                <tr><th>Agent</th><th>Model</th><th>Purpose</th></tr>
              </thead>
              <tbody>
                {[
                  ['spec-wizard-generate', 'Opus', 'Auto-generates spec from live DOM via Playwright'],
                  ['spec-wizard-improve', 'Opus', 'Interactive 9-section spec refinement wizard'],
                  ['spec-wizard-pipeline', 'Opus', 'Shows spec summary and offers QA pipeline'],
                  ['qa-coordinator', 'Opus', 'Orchestrates test-generation + test-execution'],
                  ['test-generation', 'Sonnet', 'Produces test-cases.md and test-data.md'],
                  ['test-execution', 'Sonnet', 'Runs all tests via Playwright MCP, writes report'],
                  ['spec-wizard', 'Opus', 'Legacy entry point — delegates to spec-wizard-generate'],
                ].map(([name, model, purpose]) => (
                  <tr key={name}>
                    <td><code>{name}</code></td>
                    <td><code>{model}</code></td>
                    <td>{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Skills */}
          <section id="skills">
            <h2>Skills</h2>
            <p>
              A <strong>Skill</strong> is a <code>SKILL.md</code> file with step-by-step instructions
              that an agent loads and follows. Unlike agents, skills have no intelligence of their own —
              they are text that a model reads and acts on. Unlike <code>CLAUDE.md</code> (always in context),
              a skill is loaded only when needed.
            </p>

            <blockquote>
              Think of a Skill as a procedure manual. The Agent is the employee who reads it and executes
              the steps. The Skill defines the "how" — the exact procedure.
            </blockquote>

            <h3>Skill location</h3>
            <CodeBlock lang="text" code={`skills/
└── my-skill:process/       ← namespace:variant naming convention
    └── SKILL.md`} />

            <h3>How agents load skills</h3>
            <p>Every agent in this plugin loads its skill at startup using the Read tool:</p>
            <CodeBlock lang="markdown" code={`## Skill Loading

Before doing anything else, read your skill file:

1. Use the \`Read\` tool to load: \`.claude/skills/my-skill:process/SKILL.md\`
2. Follow every step in the skill file completely and in order.`} />

            <h3>Skill vs Agent comparison</h3>
            <table>
              <thead>
                <tr><th>Aspect</th><th>Skill</th><th>Agent</th></tr>
              </thead>
              <tbody>
                {[
                  ['Context', 'Loaded IN the current conversation', 'Has its OWN isolated context'],
                  ['Intelligence', 'No — it\'s text a model reads', 'Yes — it\'s a full LLM instance'],
                  ['Tools', 'Uses the session\'s tools', 'Has its own defined tools'],
                  ['Interactivity', 'Multi-turn in the same conversation', 'Works autonomously'],
                  ['Ideal use', 'Detailed procedures to follow', 'Isolated tasks with significant output'],
                ].map(([a, b, c]) => (
                  <tr key={a}><td><strong>{a}</strong></td><td>{b}</td><td>{c}</td></tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Hooks */}
          <section id="hooks">
            <h2>Hooks</h2>
            <p>
              A <strong>Hook</strong> is a shell script that runs automatically at specific points in the
              Claude Code lifecycle. Hooks are <strong>deterministic</strong> — they always execute when
              the triggering condition is met, regardless of what the LLM decides.
            </p>

            <h3>Hook configuration (settings.json)</h3>
            <CodeBlock lang="json" code={`{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pipeline-on-spec-created.sh"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pipeline-on-user-prompt.sh"
          }
        ]
      }
    ]
  }
}`} />

            <h3>Available hook events</h3>
            <table>
              <thead>
                <tr><th>Event</th><th>When it fires</th><th>Matcher filters by</th></tr>
              </thead>
              <tbody>
                {[
                  ['SessionStart', 'Session start or resume', 'startup, resume, clear, compact'],
                  ['UserPromptSubmit', 'When the user sends a message', '(no matcher)'],
                  ['PreToolUse', 'Before a tool executes', 'Tool name'],
                  ['PostToolUse', 'After a tool executes', 'Tool name'],
                  ['PermissionRequest', 'When a permission dialog appears', 'Tool name'],
                  ['Stop', 'When Claude finishes responding', '(no matcher)'],
                  ['SubagentStart', 'When a sub-agent is created', 'Agent type'],
                  ['SubagentStop', 'When a sub-agent finishes', 'Agent type'],
                ].map(([e, w, m]) => (
                  <tr key={e}><td><code>{e}</code></td><td>{w}</td><td>{m}</td></tr>
                ))}
              </tbody>
            </table>

            <h3>Exit codes</h3>
            <table>
              <thead>
                <tr><th>Exit Code</th><th>Meaning</th></tr>
              </thead>
              <tbody>
                <tr><td><code>0</code></td><td>Action permitted. stdout is added to context.</td></tr>
                <tr><td><code>2</code></td><td>Action blocked. stderr is sent as feedback to Claude.</td></tr>
                <tr><td>Other</td><td>Error — action continues, warning shown in transcript.</td></tr>
              </tbody>
            </table>

            <h3>Example: spec-created hook</h3>
            <CodeBlock lang="bash" code={`#!/bin/bash
# Fires after every Write tool call.
# Detects when a spec file is written inside Platform/ and updates pipeline state.

SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_FILE="$PROJECT/.claude/.pipeline-state"

INPUT=$(cat)
FILE=$(echo "$INPUT" | python3 -c \\
  "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('file_path',''))" \\
  2>/dev/null || echo "")

[[ -z "$FILE" ]] && exit 0

# Match: Platform/**/*-description.md
if [[ "$FILE" == "$PROJECT/Platform/"* ]] && \\
   [[ "$FILE" =~ \\-description\\.md$ ]]; then
  MODULE_DIR=$(dirname "$FILE")
  MODULE=$(basename "$MODULE_DIR")
  printf "SPEC_AUTO_GENERATED\\n%s\\n%s\\n" "$MODULE" "$FILE" > "$STATE_FILE"
fi

exit 0`} />

            <h3>Hook portability</h3>
            <p>
              All hooks use the same pattern to find the project root without hardcoding any paths.
              Because hooks are always installed at <code>.claude/hooks/</code>, this works in any project:
            </p>
            <CodeBlock lang="bash" code={`SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "$SCRIPT_DIR/../.." && pwd)"
STATE_FILE="$PROJECT/.claude/.pipeline-state"`} />
          </section>

          {/* vars.md */}
          <section id="varsmd">
            <h2>vars.md &amp; docs/</h2>
            <p>
              <code>vars.md</code> is the single project-level configuration file. Every agent reads it
              at startup to resolve <code>BASE_URL</code> and credential variable names. Credentials are
              never typed into chat — only variable names are referenced.
            </p>

            <CodeBlock lang="text" code={`BASE_URL = https://your-app.example.com
AUTH_EMAIL = admin@your-app.example.com
AUTH_PASSWORD = your-password`} />

            <h3>Multiple environments</h3>
            <CodeBlock lang="text" code={`BASE_URL       = https://staging.myapp.com
ADMIN_EMAIL    = admin@myapp.com
ADMIN_PASSWORD = admin-secret
USER_EMAIL     = testuser@myapp.com
USER_PASSWORD  = user-secret`} />

            <h3>docs/ folder for requirements enrichment</h3>
            <p>
              Place project requirement files as <code>.md</code> or <code>.csv</code> in a{' '}
              <code>docs/</code> folder at your project root. When invoking{' '}
              <code>spec-wizard-generate</code>, type <code>docs</code> at the requirements enrichment
              prompt to have the agent scan and apply relevant requirements automatically.
            </p>
            <CodeBlock lang="text" code={`docs/
├── requirements.md          ← scanned automatically
├── user-stories.md          ← scanned automatically
└── acceptance-criteria.csv  ← scanned automatically`} />
            <p>
              The agent locates "project root" by finding <code>vars.md</code> via a Glob search —
              so the <code>docs/</code> folder just needs to sit next to <code>vars.md</code>.
            </p>
          </section>

          {/* Design comparison */}
          <section id="design-comparison">
            <h2>Design Comparison</h2>
            <p>
              Design comparison is an optional feature that compares the live web page against the
              original design (Figma or Pencil) and produces a discrepancy report classified by severity.
            </p>

            <CodeBlock lang="text" code={`1. User provides a "Design Reference" when creating the spec:
   - Figma: https://www.figma.com/design/abc123/App?node-id=1234-5678
   - Pencil: "Login Screen" (slide name in a .pen file)

2. spec-wizard-generate saves it in Screen Identification:
   "Pencil slide name / Figma frame URL: <value>"

3. test-generation creates exactly one TC-DC-01 test case
   (type: Design Comparison)

4. test-execution runs TC-DC-01:
   a. Navigates to the page and takes a full screenshot
   b. Retrieves the original design:
      - Figma URL → Figma MCP get_design_context
      - Pencil name → Pencil MCP batch_get
   c. Compares: structure, typography, colors, spacing, components, images
   d. Classifies by severity: Critical / Major / Minor / Cosmetic

5. TC-DC result:
   ✅ PASS  — zero Critical or Major discrepancies
   ❌ FAIL  — one or more Critical or Major discrepancies
   ⚠️ BLOCKED — design reference could not be retrieved`} />

            <h3>Setting up Figma access</h3>
            <CodeBlock lang="bash" code={`# Add to ~/.zshrc or ~/.bashrc
export FIGMA_ACCESS_TOKEN=fig_xxxxxxxxxxxxx

# Reload
source ~/.zshrc

# Generate token at: Figma → Settings → Personal access tokens`} />
          </section>

          {/* Contributing */}
          <section id="contributing">
            <h2>Contributing</h2>
            <p>
              Every modifiable part of the system lives in one of four directories at the repo root.
              No build step is required — the repo files are the plugin files.
            </p>

            <h3>Forking the plugin</h3>
            <CodeBlock lang="bash" code={`git clone https://github.com/Strako/AI-Driven-UI-Specification-QA-Automation-Suite.git my-fork
cd my-fork`} />

            <h3>Modifying an agent</h3>
            <p>
              Open <code>agents/{'{'}{'}'}agent-name{'}'}.md</code>. The frontmatter controls the model,
              tools, and behavior. The markdown body is the system prompt.
            </p>

            <h3>Adding a new agent</h3>
            <CodeBlock lang="markdown" code={`# 1. Create agents/my-new-agent.md
---
name: my-new-agent
description: What this agent does and when Claude should use it.
model: claude-sonnet-4-6
color: "#4a90d9"
tools: Read, Write, Glob
---

Your system prompt here.

## Skill Loading
Before doing anything else, read your skill file:
1. Use the \`Read\` tool to load: \`.claude/skills/my-new-agent:process/SKILL.md\`
2. Follow every step completely and in order.`} />
            <CodeBlock lang="markdown" code={`# 2. Create skills/my-new-agent:process/SKILL.md

# Skill: my-new-agent:process

## Step 1 — ...
## Step 2 — ...`} />

            <h3>Adding a new hook</h3>
            <CodeBlock lang="bash" code={`#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
PROJECT="$(cd "$SCRIPT_DIR/../.." && pwd)"

INPUT=$(cat)
# ... your logic ...
exit 0`} />
            <p>Then register it in <code>settings.json</code> under the appropriate event, and add it to the plugin manifest in <code>.claude-plugin/plugin.json</code>.</p>

            <h3>Releasing an update</h3>
            <CodeBlock lang="bash" code={`# Bump version in .claude-plugin/plugin.json
git add .
git commit -m "feat: describe your change"
git push

# Users update with:
claude plugin update AI-Driven-UI-Specification`} />

            <h3>References</h3>
            <ul>
              <li><a href="https://docs.anthropic.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-2)'}}>Claude Code — Sub-agents Documentation</a></li>
              <li><a href="https://docs.anthropic.com/en/docs/claude-code/hooks" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-2)'}}>Claude Code — Hooks Guide</a></li>
              <li><a href="https://docs.anthropic.com/en/docs/claude-code/skills" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-2)'}}>Claude Code — Skills Documentation</a></li>
              <li><a href="https://docs.anthropic.com/en/docs/claude-code/mcp" target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-2)'}}>Claude Code — MCP Configuration</a></li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}
