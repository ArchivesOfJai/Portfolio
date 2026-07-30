import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Database, RefreshCw, X, Mail, User, Clock, Search, ShieldCheck } from 'lucide-react';
import { sfx } from '../utils/audio';
import { fetchApi } from '../utils/api';

export default function DatabaseViewerModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchDbMessages = async () => {
    setLoading(true);
    try {
      const data = await fetchApi('/api/messages');
      if (data.data) {
        setMessages(data.data);
      }
    } catch (e) {
      console.error('Failed to fetch DB messages', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchDbMessages();
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = messages.filter(
    (m) =>
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(search.toLowerCase())
  );

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
        padding: 'clamp(10px, 3vw, 24px)'
      }}
      onClick={() => {
        sfx.playClick();
        onClose();
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          padding: 'clamp(16px, 4vw, 28px)',
          borderColor: 'var(--matrix-green)',
          boxShadow: '0 0 60px rgba(0, 255, 102, 0.3), 0 20px 40px rgba(0,0,0,0.8)',
          background: 'rgba(13, 17, 24, 0.96)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: '1px solid rgba(0, 255, 102, 0.2)',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 255, 102, 0.15)',
                border: '1px solid var(--matrix-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Database size={20} color="var(--matrix-green)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 800 }}>MongoDB Database Inspector</h2>
                <span className="glass-pill" style={{ borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
                  {messages.length} Docs
                </span>
              </div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} className="hide-on-mobile-xs">
                URI: mongodb://127.0.0.1/geek_portfolio (Collection: messages)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => {
                sfx.playClick();
                fetchDbMessages();
              }}
              style={{
                background: 'rgba(0, 255, 102, 0.1)',
                border: '1px solid var(--matrix-green)',
                color: 'var(--matrix-green)',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh DB</span>
            </button>

            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, or content..."
            style={{
              width: '100%',
              background: 'rgba(5, 7, 10, 0.8)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              borderRadius: '8px',
              padding: '8px 12px 8px 36px',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Messages List Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', WebkitOverflowScrolling: 'touch' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '30px 16px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            >
              // No MongoDB documents found in collection. Try submitting a message on the contact form!
            </div>
          ) : (
            filtered.map((msg, index) => (
              <div
                key={msg._id || msg.id || index}
                className="glass-panel"
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  borderColor: 'rgba(0, 255, 102, 0.2)',
                  background: 'rgba(7, 9, 14, 0.8)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="glass-pill" style={{ fontSize: '0.74rem', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
                      <User size={12} />
                      <span>{msg.name}</span>
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', overflowWrap: 'anywhere' }}>
                      &lt;{msg.email}&gt;
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--matrix-green)', marginBottom: '6px' }}>
                  Subject: {msg.subject}
                </div>

                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    background: 'rgba(5, 7, 10, 0.6)',
                    padding: '10px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
