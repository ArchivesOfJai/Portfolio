import React, { useState, useEffect } from 'react';
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
    // Fetch Projects
    fetchApi('/api/projects')
      .then(data => {
        if (data.data) {
          setProjects(data.data);
          setBackendStatus('ONLINE');
        }
      })
      .catch(() => setBackendStatus('HYBRID MODE'));

    // Fetch Skills
    fetchApi('/api/skills')
      .then(data => {
        if (data.data) setSkills(data.data);
      })
      .catch(() => {});

    // Fetch Experiences
    fetchApi('/api/experiences')
      .then(data => {
        if (data.data) setExperiences(data.data);
      })
      .catch(() => {});

    // Fetch Telemetry Stats
    fetchApi('/api/stats')
      .then(data => {
        if (data.data) setStats(data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadPortfolioData();
  }, []);

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
