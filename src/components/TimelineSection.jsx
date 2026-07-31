import React from 'react';
import { GitCommit, Calendar, Briefcase, Sparkles } from 'lucide-react';

export default function TimelineSection({ experiences }) {
  return (
    <section id="timeline" className="section-wrapper">
      <div className="section-title-badge">
        <GitCommit size={14} />
        <span>CAREER & OPEN SOURCE TIMELINE</span>
      </div>

      <h2 className="section-heading">Academics & Professional Journey</h2>
      <p className="section-subheading">
        Tracing career milestones, system refactors, and full-stack achievements.
      </p>

      <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', paddingLeft: 'clamp(20px, 4vw, 32px)' }}>
        {/* Laser Illuminated Connector Line */}
        <div
          style={{
            position: 'absolute',
            left: 'clamp(6px, 1.5vw, 12px)',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, var(--neon-cyan) 0%, var(--matrix-green) 50%, var(--cyber-purple) 100%)',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.8)'
          }}
        />

        {(experiences || []).map((exp, idx) => (
          <div
            key={exp.id || idx}
            style={{
              position: 'relative',
              marginBottom: '32px'
            }}
          >
            {/* Glowing Laser Node */}
            <div
              style={{
                position: 'absolute',
                left: 'calc(-1 * clamp(20px, 4vw, 32px) + clamp(0px, 0.5vw, 4px))',
                top: '20px',
                width: '15px',
                height: '15px',
                borderRadius: '50%',
                background: '#07090e',
                border: '2px solid var(--neon-cyan)',
                boxShadow: '0 0 12px var(--neon-cyan)',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--matrix-green)' }} />
            </div>

            {/* Glass Timeline Card */}
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(16px, 4vw, 28px)',
                borderRadius: '16px'
              }}
            >
              <h3 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.3rem)', fontWeight: 700, marginBottom: '8px' }}>
                {exp.role}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                <span className="glass-pill">
                  <Calendar size={14} />
                  <span>{exp.period}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--matrix-green)' }}>
                  {exp.company}
                </span>
              </div>


              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                {exp.description}
              </p>

              {/* Tech Tags */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {exp.techTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      background: 'rgba(0, 243, 255, 0.08)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      color: 'var(--neon-cyan)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
