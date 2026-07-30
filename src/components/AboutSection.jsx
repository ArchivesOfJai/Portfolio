import React, { useState } from 'react';
import { User, Code2, Terminal, Cpu, Zap, Laptop, Layers } from 'lucide-react';
import CodeRunner from './CodeRunner';
import { sfx } from '../utils/audio';

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('mindset');

  return (
    <section id="about" className="section-wrapper">
      <div className="section-title-badge">
        <User size={14} />
        <span>// ABOUT & ARCHITECTURE</span>
      </div>

      <h2 className="section-heading">Geek Engineering Mindset</h2>
      <p className="section-subheading">
        Merging algorithmic rigor with pixel-perfect glassmorphism and 60FPS fluid animations.
      </p>

      {/* Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}
      >
        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('mindset');
          }}
          className="glass-panel"
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1px solid ${activeTab === 'mindset' ? 'var(--neon-cyan)' : 'transparent'}`,
            color: activeTab === 'mindset' ? 'var(--neon-cyan)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}
        >
          <Zap size={16} />
          <span>Core Philosophy</span>
        </button>

        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('sandbox');
          }}
          className="glass-panel"
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1px solid ${activeTab === 'sandbox' ? 'var(--matrix-green)' : 'transparent'}`,
            color: activeTab === 'sandbox' ? 'var(--matrix-green)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}
        >
          <Code2 size={16} />
          <span>Interactive JS Sandbox</span>
        </button>

        <button
          onClick={() => {
            sfx.playClick();
            setActiveTab('setup');
          }}
          className="glass-panel"
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: `1px solid ${activeTab === 'setup' ? 'var(--cyber-purple)' : 'transparent'}`,
            color: activeTab === 'setup' ? 'var(--cyber-purple)' : 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}
        >
          <Laptop size={16} />
          <span>Battlestation & Setup</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'mindset' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
            <div style={{ color: 'var(--neon-cyan)', marginBottom: '14px' }}>
              <Layers size={30} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Glassmorphism UI Engine</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Using modern CSS variable design tokens, multi-layered backdrop blur filters, and 3D card tilt matrices to create an interface that feels tactile and alive.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
            <div style={{ color: 'var(--matrix-green)', marginBottom: '14px' }}>
              <Cpu size={30} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>MERN Full-Stack Power</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Deep experience crafting Express RESTful endpoints, Mongoose schema validation, React hooks state machines, and Node.js asynchronous event streams.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 28px)' }}>
            <div style={{ color: 'var(--cyber-purple)', marginBottom: '14px' }}>
              <Terminal size={30} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Geek Terminal Focus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Bridging standard web navigation with interactive CLI terminals, offering instant command execution and telemetry insights.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'sandbox' && <CodeRunner />}

      {activeTab === 'setup' && (
        <div className="glass-panel" style={{ padding: 'clamp(20px, 4vw, 32px)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '18px', color: 'var(--neon-cyan)' }}>
            // DEV BATTLESTATION TELEMETRY
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Main Rig</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>AMD Ryzen 9 7900X // 64GB DDR5 RAM // NVMe Gen4 4TB</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>IDE & Environment</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>VS Code Cyberpunk Theme // Fira Code Font // Windows + WSL2 Linux</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Monitors</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Dual 4K IPS 144Hz Monitors with Vertical Code Terminal Display</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '4px' }}>Peripherals</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Custom Mechanical Keyboard (Gateron Oil Kings) + Glass Mousepad</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
