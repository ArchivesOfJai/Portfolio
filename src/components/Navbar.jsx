import React, { useState, useEffect } from 'react';
import { Terminal, Code2, Cpu, Volume2, VolumeX, Eye, Activity, ShieldCheck, Settings } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Navbar({ isMatrixMode, setIsMatrixMode, backendStatus, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMuteToggle = () => {
    const isNowMuted = sfx.toggleMute();
    setMuted(isNowMuted);
  };

  const handleNavClick = (e, targetId) => {
    sfx.playClick();
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: scrolled ? '12px 24px' : '20px 32px',
        transition: 'all 0.4s ease',
        background: scrolled ? 'rgba(7, 9, 14, 0.88)' : 'rgba(13, 17, 24, 0.4)',
        backdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(0, 243, 255, 0.25)' : '1px solid transparent',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, 'hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#fff'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(157, 78, 221, 0.3))',
              border: '1px solid var(--neon-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
            }}
          >
            <Terminal size={20} color="var(--neon-cyan)" />
          </div>
          <span>
            &lt;<span className="text-cyan">Geek</span>.Architect /&gt;
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem'
          }}
          className="desktop-nav"
        >
          <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="nav-link">
            // About
          </a>
          <a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="nav-link">
            // Skills
          </a>
          <a href="#projects" onClick={(e) => handleNavClick(e, 'projects')} className="nav-link">
            // Vault
          </a>
          <a href="#timeline" onClick={(e) => handleNavClick(e, 'timeline')} className="nav-link">
            // Timeline
          </a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="nav-link">
            // Contact
          </a>
        </div>

        {/* Controls & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Admin Dashboard Page Switcher Button */}
          <button
            onClick={() => {
              sfx.playClick();
              onOpenAdmin();
            }}
            title="Open Admin DB Management Page"
            style={{
              background: 'rgba(157, 78, 221, 0.15)',
              border: '1px solid var(--cyber-purple)',
              color: 'var(--cyber-purple)',
              padding: '7px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Settings size={14} />
            <span>Admin Studio</span>
          </button>

          {/* MERN Backend API Status Badge */}
          <div
            className="glass-pill"
            title={`Backend Status: ${backendStatus}`}
            style={{
              padding: '5px 12px',
              fontSize: '0.78rem',
              borderColor: backendStatus === 'ONLINE' ? 'rgba(0, 255, 102, 0.4)' : 'rgba(255, 170, 0, 0.4)',
              background: backendStatus === 'ONLINE' ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 170, 0, 0.08)'
            }}
          >
            <Activity
              size={12}
              color={backendStatus === 'ONLINE' ? 'var(--matrix-green)' : 'var(--neon-amber)'}
            />
            <span style={{ color: backendStatus === 'ONLINE' ? 'var(--matrix-green)' : 'var(--neon-amber)' }}>
              {backendStatus === 'ONLINE' ? 'ATLAS MERN' : 'HYBRID MODE'}
            </span>
          </div>

          {/* Matrix FX Toggle */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsMatrixMode(!isMatrixMode);
            }}
            title="Toggle Matrix FX Rain"
            style={{
              background: isMatrixMode ? 'rgba(0, 255, 102, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${isMatrixMode ? 'var(--matrix-green)' : 'rgba(255, 255, 255, 0.15)'}`,
              color: isMatrixMode ? 'var(--matrix-green)' : 'var(--text-muted)',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Eye size={14} />
            <span>{isMatrixMode ? 'MATRIX: ON' : 'FX'}</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={handleMuteToggle}
            title={muted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: muted ? 'var(--cyber-magenta)' : 'var(--neon-cyan)',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      <style>{`
        .nav-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-link:hover {
          color: var(--neon-cyan);
          text-shadow: 0 0 10px rgba(0, 243, 255, 0.6);
        }
        @media (max-width: 820px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
