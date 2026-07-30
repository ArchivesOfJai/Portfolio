import React, { useState } from 'react';
import { Cpu, Code2, Server, Database, Layers, Terminal, Filter } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function SkillsMatrix({ skills }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set((skills || []).map((s) => s.category))];

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="section-wrapper">
      <div className="section-title-badge">
        <Cpu size={14} />
        <span>// SKILLS & PROFICIENCY MATRIX</span>
      </div>

      <h2 className="section-heading">Technical Capabilities</h2>
      <p className="section-subheading">
        Real-time proficiency metrics fetched directly from MERN backend REST API endpoints.
      </p>

      {/* Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sfx.playClick();
              setSelectedCategory(cat);
            }}
            className="glass-pill"
            style={{
              cursor: 'pointer',
              background: selectedCategory === cat ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: selectedCategory === cat ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.15)',
              color: selectedCategory === cat ? 'var(--neon-cyan)' : 'var(--text-muted)',
              padding: '6px 14px',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {(filteredSkills || []).map((skill, idx) => (
          <div
            key={skill.id || idx}
            className="glass-panel"
            style={{
              padding: 'clamp(18px, 4vw, 24px)',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'rgba(0, 243, 255, 0.1)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Code2 size={18} color="var(--neon-cyan)" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{skill.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {skill.category}
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--matrix-green)',
                  background: 'rgba(0, 255, 102, 0.1)',
                  border: '1px solid rgba(0, 255, 102, 0.3)',
                  padding: '3px 8px',
                  borderRadius: '10px',
                  flexShrink: 0
                }}
              >
                {skill.geekRating || 'A-Tier'}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '14px', lineHeight: 1.5 }}>
              {skill.description}
            </p>

            {/* Meter Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Proficiency</span>
                <span style={{ color: 'var(--neon-cyan)' }}>{skill.level}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '7px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${skill.level}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--neon-cyan) 0%, var(--matrix-green) 100%)',
                    borderRadius: '4px',
                    boxShadow: '0 0 10px rgba(0, 243, 255, 0.6)',
                    transition: 'width 1s ease'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
