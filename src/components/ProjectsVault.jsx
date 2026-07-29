import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FolderGit2, ExternalLink, Github, Star, Sparkles, X, Eye, ShieldCheck } from 'lucide-react';
import { sfx } from '../utils/audio';

export default function ProjectsVault({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  const categories = ['All', ...new Set((projects || []).map((p) => p.category))];

  const filteredProjects =
    filterCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === filterCategory);

  const openModal = (project) => {
    sfx.playSuccess();
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    sfx.playClick();
    setSelectedProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="projects" className="section-wrapper">
      <div className="section-title-badge">
        <FolderGit2 size={14} />
        <span>// REPOSITORY VAULT</span>
      </div>

      <h2 className="section-heading">Featured Projects</h2>
      <p className="section-subheading">
        Selected high-impact software systems, AI frameworks, and Web3 canvas studios.
      </p>

      {/* Filter Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sfx.playClick();
              setFilterCategory(cat);
            }}
            className="glass-pill"
            style={{
              cursor: 'pointer',
              background: filterCategory === cat ? 'rgba(0, 243, 255, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: filterCategory === cat ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.15)',
              color: filterCategory === cat ? 'var(--neon-cyan)' : 'var(--text-muted)',
              padding: '6px 16px',
              fontSize: '0.85rem'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
        {(filteredProjects || []).map((project) => (
          <div
            key={project.id || project.slug}
            className="glass-panel"
            style={{
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer'
            }}
            onClick={() => openModal(project)}
          >
            {/* Image Preview Container with Parallax Hover */}
            <div
              style={{
                position: 'relative',
                height: '210px',
                overflow: 'hidden',
                background: '#05070a'
              }}
            >
              <img
                src={project.coverImage || '/images/project_cyber_ai.png'}
                alt={project.title}
                onError={(e) => { e.currentTarget.src = '/images/project_cyber_ai.png'; }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(13, 17, 24, 0.95) 0%, transparent 60%)'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px'
                }}
              >
                <span className="glass-pill" style={{ background: 'rgba(7, 9, 14, 0.85)', fontSize: '0.75rem' }}>
                  <Star size={12} color="var(--neon-amber)" />
                  <span>{project.stars}</span>
                </span>
                <span className="glass-pill" style={{ background: 'rgba(7, 9, 14, 0.85)', fontSize: '0.75rem' }}>
                  {project.geekRating}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                // {project.category}
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '8px' }}>
                {project.title}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', flex: 1, lineHeight: 1.5 }}>
                {project.tagline}
              </p>

              {/* Tech Tags */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--neon-cyan)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Eye size={14} /> Inspect Telemetry
                </span>

                <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'var(--neon-cyan)', textDecoration: 'none' }}
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Portal */}
      {selectedProject &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              background: 'rgba(5, 7, 10, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              overflowY: 'auto'
            }}
            onClick={closeModal}
          >
            <div
              className="glass-panel"
              style={{
                width: '100%',
                maxWidth: '750px',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '24px',
                padding: '36px',
                borderColor: 'var(--neon-cyan)',
                boxShadow: '0 0 60px rgba(0, 243, 255, 0.4), 0 20px 40px rgba(0,0,0,0.8)',
                background: 'rgba(13, 17, 24, 0.95)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span className="glass-pill" style={{ marginBottom: '8px' }}>
                    <ShieldCheck size={14} color="var(--matrix-green)" />
                    <span>VAULT INSPECTOR // {selectedProject.category}</span>
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{selectedProject.title}</h2>
                </div>
                <button
                  onClick={closeModal}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={24} />
                </button>
              </div>

              <img
                src={selectedProject.coverImage || '/images/project_cyber_ai.png'}
                alt={selectedProject.title}
                onError={(e) => { e.currentTarget.src = '/images/project_cyber_ai.png'; }}
                style={{
                  width: '100%',
                  height: '240px',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: '1px solid rgba(0, 243, 255, 0.3)'
                }}
              />

              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedProject.description}
              </p>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--neon-cyan)', marginBottom: '8px' }}>
                  SYSTEM ARCHITECTURE STACK:
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="glass-pill">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cyber"
                >
                  <ExternalLink size={18} />
                  <span>Launch Live Demo</span>
                </a>
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cyber-outline"
                >
                  <Github size={18} />
                  <span>View Repository</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

