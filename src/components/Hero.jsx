import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Sparkles, ArrowRight, Code, Database, Server, Cpu, ShieldCheck } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Hero({ stats, onLaunchTerminal }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [textIndex, setTextIndex] = useState(0);
  const titles = [
    '< Full-Stack MERN Architect />',
    '< Cyber-Glass UI Designer />',
    '< Real-Time API Developer />',
    '< Autonomous Code Geek />'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % titles.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="hero"
      className="section-wrapper"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'clamp(90px, 12vw, 130px)'
      }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="glass-panel"
        style={{
          width: '100%',
          padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 40px)',
          transform: tilt.x !== 0 ? `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)` : 'none',
          transition: tilt.x === 0 ? 'transform 0.6s ease' : 'none',
          background: 'linear-gradient(135deg, rgba(13, 17, 24, 0.85) 0%, rgba(20, 27, 40, 0.75) 100%)',
          borderColor: 'rgba(0, 243, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 243, 255, 0.15)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '36px', alignItems: 'center' }} className="hero-grid">
          {/* Left Column: Intro & Typewriter */}
          <div>
            <div className="glass-pill" style={{ marginBottom: '18px' }}>
              <ShieldCheck size={14} color="var(--matrix-green)" />
              <span>SYSTEM ONLINE</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: '16px',
                letterSpacing: '-0.5px'
              }}
            >
              Crafting <span className="text-cyan glow-text-cyan">Scalable</span> & <br />
              <span className="text-green glow-text-green">Futuristic</span> Web Apps
            </h1>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1rem, 3.2vw, 1.35rem)',
                color: 'var(--neon-cyan)',
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                flexWrap: 'wrap'
              }}
            >
              <span>{titles[textIndex]}</span>
              <span className="cursor-blink">|</span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.92rem, 2.8vw, 1.1rem)', marginBottom: '28px', maxWidth: '580px' }}>
              Welcome to my digital sanctuary. Built with MongoDB, Express, React, and Node.js. 
              Featuring smooth 60fps parallax depth layers, interactive dev CLI, and frosted glass design system.
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }} className="hero-actions">
              <button
                onClick={() => {
                  sfx.playClick();
                  onLaunchTerminal();
                }}
                className="btn-cyber"
              >
                <TerminalIcon size={18} />
                <span>Launch Interactive CLI</span>
              </button>

              <a
                href="#projects"
                onClick={() => sfx.playClick()}
                className="btn-cyber-outline"
              >
                <span>Explore Vault</span>
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Floating Cyber Orb & Telemetry Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            {/* Interactive Holographic Core */}
            <div
              className="animate-float"
              style={{
                width: 'clamp(130px, 30vw, 180px)',
                height: 'clamp(130px, 30vw, 180px)',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 243, 255, 0.25) 0%, rgba(157, 78, 221, 0.1) 70%, transparent 100%)',
                border: '2px solid var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(0, 243, 255, 0.5), inset 0 0 20px rgba(0, 255, 102, 0.3)',
                position: 'relative'
              }}
            >
              <Cpu size={56} color="var(--neon-cyan)" />
              <div
                style={{
                  position: 'absolute',
                  inset: '-8px',
                  borderRadius: '50%',
                  border: '1px stroke rgba(0, 255, 102, 0.4)',
                  animation: 'spin 12s linear infinite'
                }}
              />
            </div>

            {/* Telemetry Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '10px',
                width: '100%',
                marginTop: '12px'
              }}
            >
              <div className="glass-panel" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
                <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--neon-cyan)' }}>
                  {stats?.commits || '3,842'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  COMMITS
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
                <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--matrix-green)' }}>
                  {stats?.uptime || '99.99%'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  UPTIME
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
                <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--cyber-purple)' }}>
                  {stats?.repos || '48'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  REPOSITORIES
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '12px 10px', textAlign: 'center', borderRadius: '12px' }}>
                <div style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 800, color: 'var(--cyber-magenta)' }}>
                  {stats?.codeLines || '420K+'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  LINES OF CODE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 540px) {
          .hero-actions { flex-direction: column; width: 100%; }
          .hero-actions .btn-cyber, .hero-actions .btn-cyber-outline { width: 100%; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
