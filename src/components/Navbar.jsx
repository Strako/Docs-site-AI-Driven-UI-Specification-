import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/tutorial', label: 'Tutorial' },
  { to: '/docs', label: 'Docs' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <NavLink to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">⬡</span>
          <span className="logo-text">
            <span className="logo-name">UI Spec</span>
            <span className="logo-badge">QA Suite</span>
          </span>
        </NavLink>

        <nav className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `nav-link ${isActive || (link.to === '/docs' && location.pathname.startsWith('/docs')) ? 'active' : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="nav-divider" />
          <a
            href="https://github.com/Strako/AI-Driven-UI-Specification-QA-Automation-Suite"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link nav-link-github"
            title="View on GitHub"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span className="github-label">GitHub</span>
          </a>
        </nav>

        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
