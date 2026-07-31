import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Mail, Github, Linkedin, Twitter, CheckCircle2, AlertCircle } from 'lucide-react';
import { sfx } from '../utils/audio';
import { fetchApi } from '../utils/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const popupTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    sfx.playClick();

    if (!formData.name || !formData.email || !formData.message) {
      setStatusMsg({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    // Trigger 3-second success popup notification
    setShowPopup(true);
    if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    popupTimerRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 3000);

    try {
      const data = await fetchApi('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ ...formData, source: 'web_form' })
      });

      if (data.success) {
        sfx.playSuccess();
        setStatusMsg({ type: 'success', text: data.message || 'Transmission saved in MongoDB Atlas database!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Transmission failed.' });
      }
    } catch (error) {
      setStatusMsg({
        type: 'error',
        text: `Transmission failed: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-wrapper" style={{ position: 'relative' }}>
      {/* 3-Second Pop-up Notification */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99999,
            background: 'rgba(10, 15, 26, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--matrix-green)',
            boxShadow: '0 0 25px rgba(0, 255, 102, 0.4), 0 10px 30px rgba(0, 0, 0, 0.6)',
            borderRadius: '12px',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.95rem',
            overflow: 'hidden',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <CheckCircle2 size={22} color="var(--matrix-green)" style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 600, letterSpacing: '0.5px' }}>successfully sent to Jai</span>
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: '3px',
              background: 'var(--matrix-green)',
              borderRadius: '0 0 12px 12px',
              animation: 'toastProgress 3s linear forwards'
            }}
          />
        </div>
      )}

      <div className="section-title-badge">
        <Mail size={14} />
        <span>CONTACT COMMAND CENTER</span>
      </div>

      <h2 className="section-heading">Initiate Communication</h2>
      <p className="section-subheading">
        Have a project, role, or architecture query? Transmit your payload directly to the API endpoint.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="contact-grid">
        {/* Left Column: Direct Glass Form */}
        <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px' }}>
          <h3 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Send size={18} color="var(--neon-cyan)" />
            <span>Encrypted Message Payload</span>
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // SENDER NAME *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Neo / Cyber Hiring Lead"
                required
                style={{
                  width: '100%',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // SENDER EMAIL *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. dev@matrix.io"
                required
                style={{
                  width: '100%',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // SUBJECT / REASON
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Full-Stack Role / Contract Project"
                style={{
                  width: '100%',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // MESSAGE PAYLOAD *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe project requirements or hiring inquiries..."
                rows={4}
                required
                style={{
                  width: '100%',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px solid rgba(0, 243, 255, 0.2)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* {statusMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: statusMsg.type === 'success' ? 'rgba(0, 255, 102, 0.12)' : 'rgba(255, 0, 127, 0.12)',
                  border: `1px solid ${statusMsg.type === 'success' ? 'var(--matrix-green)' : 'var(--cyber-magenta)'}`,
                  color: statusMsg.type === 'success' ? 'var(--matrix-green)' : 'var(--cyber-magenta)'
                }}
              >
                {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg.text}</span>
              </div>
            )} */}

            <button type="submit" disabled={loading} className="btn-cyber" style={{ marginTop: '6px', justifyContent: 'center' }}>
              <Send size={18} />
              <span>{loading ? 'DISPATCHING PAYLOAD...' : 'TRANSMIT MESSAGE'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Direct Channels & Telemetry Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: 700, marginBottom: '14px', color: 'var(--neon-cyan)' }}>
              DIRECT TELEMETRY CHANNELS
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Prefer direct developer communication? Reach out via direct channels or social networks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="mailto:iamjai2908@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  overflowWrap: 'anywhere'
                }}
              >
                <Mail size={18} color="var(--neon-cyan)" style={{ flexShrink: 0 }} />
                <span>iamjai2908@gmail.com</span>
              </a>

              <a
                href="https://github.com/ArchivesOfJai"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  overflowWrap: 'anywhere'
                }}
              >
                <Github size={18} color="var(--matrix-green)" style={{ flexShrink: 0 }} />
                <span>github.com/ArchivesOfJai</span>
              </a>

              <a
                href="https://www.linkedin.com/in/jaiiprakashsingh"
                target="_blank"
                rel="noreferrer"

                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.82rem, 2.5vw, 0.9rem)',
                  overflowWrap: 'anywhere'
                }}
              >
                <Linkedin size={18} color="var(--cyber-purple)" style={{ flexShrink: 0 }} />
                <span>linkedin.com/in/jaiiprakashsingh</span>
              </a>
            </div>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: 'clamp(18px, 4vw, 24px)',
              borderRadius: '16px',
              borderLeft: '4px solid var(--neon-cyan)',
              background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.05) 0%, rgba(13, 17, 24, 0.8) 100%)'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)', marginBottom: '4px' }}>
              LOCATION
            </div>
            <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>
              India &nbsp;&nbsp;//Available for remote or on-site engagements globally.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </section>
  );
}
