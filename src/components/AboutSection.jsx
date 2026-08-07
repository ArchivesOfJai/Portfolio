import React, { useState } from 'react';
import { User, Code2, Terminal, Cpu, Zap, Laptop, Layers } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function AboutSection() {
  
  return (
    <section id="about" className="section-wrapper">
      <div className="section-title-badge">
        <User size={14} />
        <span>ABOUT</span>
      </div>

      <h2 className="section-heading">Jai Prakash Singh</h2>
      <p className="section-subheading">
        A motivated full-stack developer with a passion for creating immersive web experiences. Skilled in React, Node.js, and modern web technologies, I thrive on building applications that are both functional and visually engaging.
      </p>      
    </section>
  );
}
