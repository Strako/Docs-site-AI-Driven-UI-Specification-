import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TerminalWindow from "../components/TerminalWindow";
import { slides, phases } from "../data/slides";
import "./Tutorial.css";

export default function Tutorial() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right");
  const [animKey, setAnimKey] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];
  const total = slides.length;

  const goTo = useCallback(
    (index) => {
      if (index < 0 || index >= total) return;
      setDirection(index > current ? "right" : "left");
      setAnimKey((k) => k + 1);
      setCurrent(index);
    },
    [current, total],
  );

  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  const currentPhase = phases.find((p) => p.steps.includes(slide.id));

  return (
    <div className="tutorial">
      {/* Top bar */}
      <div className="tutorial-topbar">
        <div className="tutorial-topbar-inner container">
          <div className="tutorial-breadcrumb">
            <button className="tutorial-back" onClick={() => navigate("/")}>
              ← Back
            </button>
            <span className="bc-sep">/</span>
            <span className="bc-label">Full Pipeline Tutorial</span>
          </div>

          <div className="tutorial-progress-label">
            {slide.step} of {total}
          </div>
        </div>

        {/* Phase progress */}
        <div className="phase-bar">
          {phases.map((phase) => {
            const isActive = phase.steps.includes(slide.id);
            const isComplete = phase.steps[phase.steps.length - 1] < slide.id;
            const progress = isActive
              ? ((phase.steps.indexOf(slide.id) + 1) / phase.steps.length) * 100
              : isComplete
                ? 100
                : 0;
            return (
              <div
                key={phase.name}
                className={`phase-segment ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}
                title={phase.name}
                style={{ flex: phase.steps.length }}
              >
                <div
                  className="phase-fill"
                  style={{
                    width: `${progress}%`,
                    background: phase.color,
                    boxShadow: isActive ? `0 0 8px ${phase.color}60` : "none",
                  }}
                />
                <span className="phase-label">{phase.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="tutorial-main container-tutorial">
        <div className="tutorial-layout">
          {/* Sidebar — slide navigator */}
          <aside className="tutorial-sidebar">
            <div className="sidebar-title">Slides</div>
            {slides.map((s, i) => {
              const isActive = i === current;
              const ph = phases.find((p) => p.steps.includes(s.id));
              return (
                <button
                  key={s.id}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  style={{ "--ph-color": ph?.color || "#888" }}
                >
                  <span className="sidebar-step">
                    {String(s.id).padStart(2, "0")}
                  </span>
                  <span className="sidebar-label">{s.title}</span>
                </button>
              );
            })}
          </aside>

          {/* Slide content */}
          <div className="tutorial-content">
            <div
              key={animKey}
              className={`slide-wrapper slide-enter-${direction}`}
            >
              {/* Slide header */}
              <div className="slide-header">
                <div
                  className="slide-phase"
                  style={{ color: currentPhase?.color }}
                >
                  {currentPhase?.name}
                </div>
                <h1 className="slide-title">{slide.title}</h1>
                <p className="slide-description">{slide.description}</p>
              </div>

              {/* Terminal */}
              <TerminalWindow
                title={slide.terminalTitle}
                lines={slide.lines}
                className="slide-terminal"
              />

              {/* Navigation */}
              <div className="slide-nav">
                <button
                  className="btn btn-secondary slide-nav-btn"
                  onClick={prev}
                  disabled={current === 0}
                >
                  ← Previous
                </button>

                <div className="slide-dots">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      className={`dot-btn ${i === current ? "active" : ""}`}
                      onClick={() => goTo(i)}
                      title={`Slide ${i + 1}`}
                    />
                  ))}
                </div>

                {current < total - 1 ? (
                  <button
                    className="btn btn-primary slide-nav-btn"
                    onClick={next}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    className="btn btn-primary slide-nav-btn"
                    onClick={() => navigate("/docs")}
                  >
                    Read the Docs →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="keyboard-hint">
        Use <kbd>←</kbd> <kbd>→</kbd> arrow keys to navigate
      </div>
    </div>
  );
}
