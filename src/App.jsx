import React, { useState, useEffect } from 'react';
import { Loader2, Database } from 'lucide-react';
import Navbar from './components/Navbar';
import ParallaxCanvas from './components/ParallaxCanvas';
import Hero from './components/Hero';
import TerminalWidget from './components/TerminalWidget';
import AboutSection from './components/AboutSection';
import SkillsMatrix from './components/SkillsMatrix';
import ProjectsVault from './components/ProjectsVault';
import TimelineSection from './components/TimelineSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { fetchApi } from './utils/api';
import './styles/glassmorphism.css';

export default function App() {
  const [view, setView] = useState('portfolio'); // 'portfolio' | 'admin'
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [backendStatus, setBackendStatus] = useState('CHECKING...');
  
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [stats, setStats] = useState({
    commits:0,
    uptime:0,
    repos:0,
    codeLines:0,
  });

  const loadPortfolioData = () => {
    setIsLoading(true);
    const p1 = fetchApi('/api/projects')
      .then(data => {
        if (data.data) {
          setProjects(data.data);
          setBackendStatus('ONLINE');
        }
      })
      .catch(() => setBackendStatus('HYBRID MODE'));

    const p2 = fetchApi('/api/skills')
      .then(data => {
        if (data.data) setSkills(data.data);
      })
      .catch(() => {});

    const p3 = fetchApi('/api/experiences')
      .then(data => {
        if (data.data) setExperiences(data.data);
      })
      .catch(() => {});

    const p4 = fetchApi('/api/stats')
      .then(data => {
        if (data.data) setStats(data.data);
      })
      .catch(() => {});

    Promise.allSettled([p1, p2, p3, p4]).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

  if (isLoading) {
    return (
      <div className="parallax-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <ParallaxCanvas isMatrixMode={isMatrixMode} />
        <div className="glass-panel" style={{ padding: '40px 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin text-cyan" size={56} style={{ animationDuration: '1.5s' }} />
            <Database size={24} className="text-cyan" style={{ position: 'absolute' }} />
          </div>
          <div>
            <h3 className="font-mono text-cyan" style={{ letterSpacing: '2px', fontSize: '1.2rem', marginBottom: '8px' }}>
              INITIALIZING DATABASE & TELEMETRY
            </h3>
            <p className="font-mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Fetching latest system records, skills, and projects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="parallax-container">
        <ParallaxCanvas isMatrixMode={isMatrixMode} />
        <AdminDashboard
          onBackToPortfolio={() => {
            setView('portfolio');
            loadPortfolioData();
          }}
          onDataChanged={loadPortfolioData}
        />
      </div>
    );
  }

  return (
    <div className="parallax-container">
      {/* 60FPS Interactive Parallax Canvas Background */}
      <ParallaxCanvas isMatrixMode={isMatrixMode} />

      {/* Top Glass Navbar */}
      <Navbar
        isMatrixMode={isMatrixMode}
        setIsMatrixMode={setIsMatrixMode}
        backendStatus={backendStatus}
        onOpenAdmin={() => setView('admin')}
      />

      {/* Hero Section */}
      <Hero
        stats={stats}
        onLaunchTerminal={() => setIsTerminalOpen(true)}
      />

      {/* About & Code Runner Section */}
      <AboutSection />

      {/* Skills Matrix */}
      <SkillsMatrix skills={skills} />

      {/* Projects Vault */}
      <ProjectsVault projects={projects} />

      {/* Career Timeline */}
      <TimelineSection experiences={experiences} />

      {/* Contact Command Center */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Interactive CLI Terminal Widget */}
      <TerminalWidget
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
}
