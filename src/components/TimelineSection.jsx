import React from 'react';
import { GitCommit, Calendar, Briefcase, Sparkles } from 'lucide-react';

export default function TimelineSection({ experiences }) {
  return (
    <section id="timeline" className="section-wrapper">
      <div className="section-title-badge">
        <GitCommit size={14} />
        <span>// CAREER & OPEN SOURCE TIMELINE</span>
      </div>

      <h2 className="section-heading">System Changelog & History</h2>
      <p className="section-subheading">
        Tracing career milestones, system refactors, and full-stack achievements.
      </p>

      <div style={{ position: 'relative', maxWidth: '900px', margin: '0 auto', paddingLeft: '32px' }}>
        {/* Laser Illuminated Connector Line */}
        <div
          style={{
            position: 'absolute',
            left: '12px',
            top: 0,
            bottom: 0,
            width: '3px',
            background: 'linear-gradient(to bottom, var(--neon-cyan) 0%, var(--matrix-green) 50%, var(--cyber-purple) 100%)',
            boxShadow: '0 0 15px rgba(0, 243, 255, 0.8)'
          }}
        />

        {(experiences || []).map((exp, idx) => (
          <div
            key={exp.id || idx}
            style={{
              position: 'relative',
              marginBottom: '40px'
            }}
          >
            {/* Glowing Laser Node */}
            <div
              style={{
                position: 'absolute',
                left: '-32px',
                top: '24px',
                width: '19px',
                height: '19px',
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
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--matrix-green)' }} />
            </div>

            {/* Glass Timeline Card */}
            <div
              className="glass-panel"
              style={{
                padding: '28px',
                borderRadius: '18px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <span className="glass-pill">
                  <Calendar size={12} />
                  <span>{exp.period}</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--matrix-green)' }}>
                  {exp.company}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '10px' }}>
                {exp.role}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '18px' }}>
                {exp.description}
              </p>

              {/* Tech Tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {exp.techTags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.76rem',
                      background: 'rgba(0, 243, 255, 0.08)',
                      border: '1px solid rgba(0, 243, 255, 0.2)',
                      color: 'var(--neon-cyan)',
                      padding: '3px 10px',
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
