import React, { useEffect, useRef } from 'react';

export default function ParallaxCanvas({ isMatrixMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking for parallax drift
    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particles setup
    const particleCount = Math.min(Math.floor(width / 22), 65);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      depth: Math.random() * 0.8 + 0.2, // Parallax depth layer factor
      color: Math.random() > 0.4 ? 'rgba(0, 243, 255, ' : 'rgba(0, 255, 102, '
    }));

    // Matrix Rain setup
    const matrixChars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]=$#';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -100));

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY || 0;

      if (isMatrixMode) {
        // Matrix Digital Rain Mode
        ctx.fillStyle = 'rgba(7, 9, 14, 0.15)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#00ff66';
        ctx.font = `${fontSize}px Fira Code, monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      } else {
        // Futuristic Cyber Grid Particle Parallax
        const mouseOffX = (mouseX - width / 2) * 0.03;
        const mouseOffY = (mouseY - height / 2) * 0.03;

        particles.forEach((p, idx) => {
          // Calculate parallax movement based on scroll and mouse position
          const depthFactor = p.depth;
          const py = (p.y - scrollY * depthFactor * 0.25 + mouseOffY * depthFactor) % height;
          const adjustedY = py < 0 ? py + height : py;
          const px = (p.x + mouseOffX * depthFactor) % width;
          const adjustedX = px < 0 ? px + width : px;

          p.x += p.speedX;
          p.y += p.speedY;

          // Draw particle
          ctx.beginPath();
          ctx.arc(adjustedX, adjustedY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.depth * 0.75})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(0, 243, 255, 0.8)';
          ctx.fill();

          // Connect neighboring particles with vector lines
          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const p2Y = (p2.y - scrollY * p2.depth * 0.25 + mouseOffY * p2.depth) % height;
            const adj2Y = p2Y < 0 ? p2Y + height : p2Y;
            const p2X = (p2.x + mouseOffX * p2.depth) % width;
            const adj2X = p2X < 0 ? p2X + width : p2X;

            const dx = adjustedX - adj2X;
            const dy = adjustedY - adj2Y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(adjustedX, adjustedY);
              ctx.lineTo(adj2X, adj2Y);
              ctx.strokeStyle = `rgba(0, 243, 255, ${(1 - dist / 120) * 0.15})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMatrixMode]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: isMatrixMode ? 0.9 : 0.65,
        transition: 'opacity 0.5s ease'
      }}
    />
  );
}
