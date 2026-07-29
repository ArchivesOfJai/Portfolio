import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react';
import { sfx } from '../utils/audio';

const defaultSnippet = `// GEEK CODE PLAYGROUND - Live Execution Sandbox
const developer = {
  name: "Full-Stack Architect",
  stack: ["MongoDB", "Express", "React", "Node.js"],
  philosophy: "60fps Parallax + Clean Code Architecture",
  getBio() {
    return \`Hello World! Building high-performance MERN web apps.\`;
  }
};

console.log("-> Developer Status:", developer.getBio());
console.log("-> Core Technologies:", developer.stack.join(" | "));
`;

export default function CodeRunner() {
  const [code, setCode] = useState(defaultSnippet);
  const [logs, setLogs] = useState([
    "// Console output initialized...",
    "// Press 'Execute Sandbox' to test the code snippet!"
  ]);
  const [hasError, setHasError] = useState(false);

  const runCode = () => {
    sfx.playSuccess();
    setHasError(false);
    const capturedLogs = [];

    const customConsole = {
      log: (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
      warn: (...args) => capturedLogs.push(`[WARN] ${args.join(' ')}`),
      error: (...args) => capturedLogs.push(`[ERROR] ${args.join(' ')}`)
    };

    try {
      const runFn = new Function('console', code);
      runFn(customConsole);
      setLogs(capturedLogs.length > 0 ? capturedLogs : ["Code executed with 0 console logs."]);
    } catch (err) {
      setHasError(true);
      setLogs([`[RUNTIME ERROR] ${err.message}`]);
    }
  };

  const resetCode = () => {
    sfx.playClick();
    setCode(defaultSnippet);
    setLogs(["// Sandbox reset to default snippet."]);
    setHasError(false);
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: '16px',
        borderColor: 'rgba(0, 243, 255, 0.3)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--matrix-green)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', color: 'var(--neon-cyan)' }}>
            SANDBOX://js_executor.js
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={resetCode}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'var(--text-muted)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem'
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={runCode}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 255, 102, 0.2), rgba(0, 243, 255, 0.2))',
              border: '1px solid var(--matrix-green)',
              color: 'var(--matrix-green)',
              padding: '6px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            <Play size={14} />
            <span>Execute Sandbox</span>
          </button>
        </div>
      </div>

      {/* Code Editor Area */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={8}
        style={{
          width: '100%',
          background: 'rgba(5, 7, 10, 0.9)',
          border: '1px solid rgba(0, 243, 255, 0.15)',
          borderRadius: '8px',
          padding: '14px',
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.88rem',
          outline: 'none',
          resize: 'vertical',
          lineHeight: 1.5,
          marginBottom: '16px'
        }}
      />

      {/* Console Output */}
      <div
        style={{
          background: 'rgba(5, 7, 10, 0.95)',
          border: `1px solid ${hasError ? 'rgba(255, 0, 127, 0.5)' : 'rgba(0, 255, 102, 0.25)'}`,
          borderRadius: '8px',
          padding: '14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.84rem'
        }}
      >
        <div style={{ color: 'var(--text-muted)', marginBottom: '8px', fontSize: '0.76rem' }}>
          LIVE OUTPUT CONSOLE:
        </div>
        {logs.map((log, i) => (
          <div
            key={i}
            style={{
              color: hasError ? 'var(--cyber-magenta)' : 'var(--matrix-green)',
              marginBottom: '4px'
            }}
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
