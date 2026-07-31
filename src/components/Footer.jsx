import React from 'react';
import { Terminal, ArrowUp, Heart } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    sfx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        background: 'rgba(7, 9, 14, 0.95)',
        borderTop: '1px solid rgba(0, 243, 255, 0.2)',
        padding: 'clamp(24px, 4vw, 40px) 16px',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)' }}>
          <Terminal size={16} color="var(--neon-cyan)" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 'clamp(0.78rem, 2.5vw, 0.88rem)', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Geek.Jai 
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="glass-pill" style={{ fontSize: '0.72rem' }}>
            BUILD: v2.4.0-RELEASE
          </span>

          <button
            onClick={scrollToTop}
            title="Return to top"
            style={{
              background: 'rgba(0, 243, 255, 0.1)',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
