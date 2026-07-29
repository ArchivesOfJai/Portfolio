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
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
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
              padding: '6px 16px',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {(filteredSkills || []).map((skill, idx) => (
          <div
            key={skill.id || idx}
            className="glass-panel"
            style={{
              padding: '24px',
              borderRadius: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(0, 243, 255, 0.1)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Code2 size={20} color="var(--neon-cyan)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{skill.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {skill.category}
                  </span>
                </div>
              </div>

              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--matrix-green)',
                  background: 'rgba(0, 255, 102, 0.1)',
                  border: '1px solid rgba(0, 255, 102, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '12px'
                }}
              >
                {skill.geekRating || 'A-Tier'}
              </span>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
              {skill.description}
            </p>

            {/* Meter Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Proficiency</span>
                <span style={{ color: 'var(--neon-cyan)' }}>{skill.level}%</span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
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
