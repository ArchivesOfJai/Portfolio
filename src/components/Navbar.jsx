import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Terminal, Code2, Cpu, Volume2, VolumeX, Eye, Activity, ShieldCheck, Settings, Menu, X, ChevronRight } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Navbar({ isMatrixMode, setIsMatrixMode, backendStatus, onOpenAdmin }) {
  const [scrolled, setScrolled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { id: 'about', label: '// About', mobileLabel: '// About & Architecture' },
    { id: 'skills', label: '// Skills', mobileLabel: '// Skills Matrix' },
    { id: 'projects', label: '// Vault', mobileLabel: '// Repository Vault' },
    { id: 'timeline', label: '// Timeline', mobileLabel: '// Career Changelog' },
    { id: 'contact', label: '// Contact', mobileLabel: '// Contact Command Center' }
  ];

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const scrollPosition = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleMuteToggle = () => {
    const isNowMuted = sfx.toggleMute();
    setMuted(isNowMuted);
  };

  const handleNavClick = (e, targetId) => {
    if (e) e.preventDefault();
    sfx.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
          padding: scrolled ? '10px 16px' : '16px 20px',
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(7, 9, 14, 0.94)' : 'rgba(13, 17, 24, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0, 243, 255, 0.25)' : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.6)' : 'none'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          {/* Brand Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, 'hero')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.05rem, 3vw, 1.25rem)',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(157, 78, 221, 0.3))',
                border: '1px solid var(--neon-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 243, 255, 0.4)'
              }}
            >
              <Terminal size={18} color="var(--neon-cyan)" />
            </div>
            <span>
              &lt;<span className="text-cyan">Geek</span>.Jai_Prakash_Singh/&gt;
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem'
            }}
            className="desktop-nav"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
                    textShadow: isActive ? '0 0 10px rgba(0, 243, 255, 0.6)' : 'none',
                    fontWeight: isActive ? 600 : 400
                  }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Controls & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="desktop-only-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Admin Dashboard Switcher Button */}
              <button
                onClick={() => {
                  sfx.playClick();
                  onOpenAdmin();
                }}
                title="Open Admin DB Management Studio"
                style={{
                  background: 'rgba(157, 78, 221, 0.15)',
                  border: '1px solid var(--cyber-purple)',
                  color: 'var(--cyber-purple)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
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
                  padding: '4px 10px',
                  fontSize: '0.74rem',
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
                  padding: '7px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
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
                  padding: '7px',
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

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => {
                sfx.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="mobile-hamburger-btn"
              title="Toggle Navigation Menu"
              style={{
                background: mobileMenuOpen ? 'rgba(0, 243, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${mobileMenuOpen ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.2)'}`,
                color: mobileMenuOpen ? 'var(--neon-cyan)' : 'var(--text-main)',
                padding: '7px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              <span>MENU</span>
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
          .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--neon-cyan);
            box-shadow: 0 0 8px var(--neon-cyan);
            border-radius: 2px;
          }
          @media (max-width: 1250px) {
            .desktop-nav { display: none !important; }
            .desktop-only-controls { display: none !important; }
            .mobile-hamburger-btn { display: flex !important; }
          }
          @media (max-width: 480px) {
            .hide-on-mobile-xs { display: none !important; }
          }
        `}</style>
      </nav>

      {/* Portalled Full-Screen Mobile Drawer Overlay */}
      {createPortal(
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          {/* Drawer Top Header Bar */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0, 243, 255, 0.25)',
              background: 'rgba(13, 17, 24, 0.98)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: '#fff'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.2), rgba(157, 78, 221, 0.3))',
                  border: '1px solid var(--neon-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(0, 243, 255, 0.4)'
                }}
              >
                <Terminal size={16} color="var(--neon-cyan)" />
              </div>
              <span>
                &lt;<span className="text-cyan">Geek</span>.Architect /&gt;
              </span>
            </a>

            {/* Explicit Close Button inside Drawer Header */}
            <button
              onClick={() => {
                sfx.playClick();
                setMobileMenuOpen(false);
              }}
              style={{
                background: 'rgba(255, 0, 127, 0.15)',
                border: '1px solid var(--cyber-magenta)',
                color: 'var(--cyber-magenta)',
                padding: '7px 14px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 700,
                boxShadow: '0 0 15px rgba(255, 0, 127, 0.3)'
              }}
            >
              <X size={18} />
              <span>CLOSE</span>
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div style={{ padding: '24px 20px 40px', flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', paddingLeft: '6px', marginBottom: '4px' }}>
                // NAVIGATION MENU
              </div>

              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                    style={{
                      borderColor: isActive ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.08)',
                      background: isActive ? 'rgba(0, 243, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? 'var(--neon-cyan)' : 'var(--text-main)',
                      fontSize: '1.05rem',
                      padding: '14px 16px'
                    }}
                  >
                    <span>{item.mobileLabel}</span>
                    <ChevronRight size={18} color={isActive ? 'var(--neon-cyan)' : 'var(--text-muted)'} />
                  </a>
                );
              })}
            </div>

            {/* System Controls in Mobile Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '1px solid rgba(0, 243, 255, 0.15)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', paddingLeft: '6px' }}>
                // SYSTEM CONTROLS
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  sfx.playClick();
                  onOpenAdmin();
                }}
                className="mobile-nav-link"
                style={{ color: 'var(--cyber-purple)', borderColor: 'rgba(157, 78, 221, 0.3)', fontSize: '1rem', padding: '14px 16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={18} />
                  <span>Admin Studio Dashboard</span>
                </div>
                <ChevronRight size={18} />
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setIsMatrixMode(!isMatrixMode);
                  }}
                  className="btn-cyber-outline"
                  style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}
                >
                  <Eye size={16} />
                  <span>{isMatrixMode ? 'MATRIX: ON' : 'FX RAIN'}</span>
                </button>

                <button
                  onClick={handleMuteToggle}
                  className="btn-cyber-outline"
                  style={{ flex: 1, padding: '12px', fontSize: '0.85rem' }}
                >
                  {muted ? <VolumeX size={16} color="var(--cyber-magenta)" /> : <Volume2 size={16} color="var(--neon-cyan)" />}
                  <span>{muted ? 'MUTED' : 'AUDIO ON'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

