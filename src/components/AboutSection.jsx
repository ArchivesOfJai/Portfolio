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
        Full-Stack Systems Architect & High-Performance Web Engineer with expertise in scalable microservices, low-latency React architectures, and cloud-native solutions. Dedicated to engineering robust, clean codebases that bridge backend algorithmic precision with immersive digital interfaces.
      </p>      
    </section>
  );
}
