import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Terminal as TerminalIcon, X, Maximize2, Minus, Send, Sparkles } from 'lucide-react';
import { sfx } from '../utils/audio';
import { fetchApi } from '../utils/api';

export default function TerminalWidget({ isOpen, onClose }) {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState([
    "============================================================",
    " GEEK PORTFOLIO CLI INTERACTION SYSTEM (MERN REST API ENGINE)",
    " Type 'help' to view available system commands.",
    "============================================================"
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, loading]);

  const handleCommandSubmit = async (e) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    sfx.playKeypress();
    const parts = raw.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Local clear command
    if (command === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    const userLine = `visitor@geek:~$ ${raw}`;
    setHistory((prev) => [...prev, userLine]);
    setInputVal('');
    setLoading(true);

    try {
      const data = await fetchApi('/api/terminal/exec', {
        method: 'POST',
        body: JSON.stringify({ command, args })
      });

      if (data.output) {
        setHistory((prev) => [...prev, ...data.output]);
      }
      if (data.action === 'TRIGGER_HIRE') {
        const contactElem = document.getElementById('contact');
        if (contactElem) {
          contactElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      // Local fallback parser if offline
      setHistory((prev) => [
        ...prev,
        `[OFFLINE MODE] Command '${command}' processed locally. Type 'help' for guidance.`
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 7, 10, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(10px, 3vw, 20px)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '850px',
          height: 'clamp(420px, 85vh, 560px)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '16px',
          borderColor: 'var(--neon-cyan)',
          boxShadow: '0 0 50px rgba(0, 243, 255, 0.35)',
          overflow: 'hidden'
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            background: 'rgba(13, 17, 24, 0.95)',
            borderBottom: '1px solid rgba(0, 243, 255, 0.2)',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56', flexShrink: 0 }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e', flexShrink: 0 }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.72rem, 2.5vw, 0.84rem)', color: 'var(--text-muted)', marginLeft: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              MERN_CLI://geek_terminal.sh
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--matrix-green)' }} className="hide-on-mobile-xs">
              ● LIVE REST API
            </span>
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div
          style={{
            flex: 1,
            padding: 'clamp(12px, 3vw, 20px)',
            overflowY: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.78rem, 2.5vw, 0.88rem)',
            lineHeight: 1.5,
            background: 'rgba(5, 7, 10, 0.92)',
            color: 'var(--matrix-green)',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {history.map((line, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '4px',
                color: line.startsWith('visitor@geek')
                  ? 'var(--neon-cyan)'
                  : line.startsWith('==')
                  ? 'var(--cyber-purple)'
                  : 'var(--matrix-green)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {line}
            </div>
          ))}

          {loading && (
            <div style={{ color: 'var(--neon-amber)', fontStyle: 'italic' }}>
              Execute API call... [processing payload]
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleCommandSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(13, 17, 24, 0.95)',
            borderTop: '1px solid rgba(0, 243, 255, 0.2)',
            padding: '10px 14px',
            gap: '8px'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', fontWeight: 'bold', fontSize: '0.82rem', flexShrink: 0 }}>
            visitor@geek:~$
          </span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help', 'skills', 'projects'..."
            autoFocus
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              minWidth: 0
            }}
          />
          <button
            type="submit"
            style={{
              background: 'rgba(0, 243, 255, 0.15)',
              border: '1px solid var(--neon-cyan)',
              color: 'var(--neon-cyan)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              flexShrink: 0
            }}
          >
            <Send size={12} />
            <span>RUN</span>
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
