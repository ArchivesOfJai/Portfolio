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
        padding: '24px'
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
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          padding: '32px',
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
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(0, 255, 102, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(0, 255, 102, 0.15)',
                border: '1px solid var(--matrix-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Database size={22} color="var(--matrix-green)" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>MongoDB Database Inspector</h2>
                <span className="glass-pill" style={{ borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
                  {messages.length} Documents Stored
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                URI: mongodb://127.0.0.1/geek_portfolio (Collection: messages)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                sfx.playClick();
                fetchDbMessages();
              }}
              style={{
                background: 'rgba(0, 255, 102, 0.1)',
                border: '1px solid var(--matrix-green)',
                color: 'var(--matrix-green)',
                padding: '8px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
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
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages by name, email, or content..."
            style={{
              width: '100%',
              background: 'rgba(5, 7, 10, 0.8)',
              border: '1px solid rgba(0, 243, 255, 0.2)',
              borderRadius: '10px',
              padding: '10px 14px 10px 40px',
              color: '#fff',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Messages List Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem'
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
                  padding: '20px',
                  borderRadius: '14px',
                  borderColor: 'rgba(0, 255, 102, 0.2)',
                  background: 'rgba(7, 9, 14, 0.8)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="glass-pill" style={{ fontSize: '0.76rem', borderColor: 'var(--neon-cyan)', color: 'var(--neon-cyan)' }}>
                      <User size={12} />
                      <span>{msg.name}</span>
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      &lt;{msg.email}&gt;
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Recent'}
                    </span>
                    <span className="glass-pill" style={{ fontSize: '0.72rem' }}>
                      ObjectID: {msg._id ? String(msg._id).slice(-6) : 'Memory'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--matrix-green)', marginBottom: '6px' }}>
                  Subject: {msg.subject}
                </div>

                <p
                  style={{
                    color: 'var(--text-main)',
                    fontSize: '0.92rem',
                    lineHeight: 1.5,
                    background: 'rgba(5, 7, 10, 0.6)',
                    padding: '12px',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-sans)',
                    whiteSpace: 'pre-wrap'
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
