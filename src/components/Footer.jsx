import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const currentDate = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <span className="footer-logo">⬡ UI Spec QA Suite</span>
          <p className="footer-tagline">
            Claude-native agents for end-to-end UI test automation.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Product</span>
            <NavLink to="/" className="footer-link">
              Home
            </NavLink>
            <NavLink to="/tutorial" className="footer-link">
              Tutorial
            </NavLink>
            <NavLink to="/docs" className="footer-link">
              Documentation
            </NavLink>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Docs</span>
            <NavLink to="/docs#architecture" className="footer-link">
              Architecture
            </NavLink>
            <NavLink to="/docs#agents" className="footer-link">
              Agents
            </NavLink>
            <NavLink to="/docs#hooks" className="footer-link">
              Hooks
            </NavLink>
            <NavLink to="/docs#contributing" className="footer-link">
              Contributing
            </NavLink>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Resources</span>
            <a
              href="https://github.com/Strako/AI-Driven-UI-Specification-QA-Automation-Suite"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <a
              href="https://docs.anthropic.com/en/docs/claude-code"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Claude Code Docs
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span className="footer-made">{currentDate}</span>
        </div>
      </div>
    </footer>
  );
}
