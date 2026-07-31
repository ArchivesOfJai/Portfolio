import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Edit3, ArrowLeft, RefreshCw, CheckCircle, Mail, Code2, FolderGit2, Cpu, ShieldCheck, Lock, LogOut, Key, Calendar, GitCommit, Upload, Image, Loader2, X, Search, Send, Activity } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { sfx } from '../utils/audio';

export default function AdminDashboard({ onBackToPortfolio, onDataChanged }) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('adminToken'));
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState(null);

  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [statsList, setStatsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Full Stack',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    stars: 0,
    coverImage: '/images/project_cyber_ai.png',
    geekRating: '98%',
    featured: false,
    features: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend',
    level: 90,
    geekRating: 'S-Tier',
    description: '',
    icon: 'Code2'
  });
  const [editingSkillId, setEditingSkillId] = useState(null);

  const [timelineForm, setTimelineForm] = useState({
    period: '2024 - PRESENT',
    role: '',
    company: '',
    description: '',
    techTags: ''
  });
  const [editingTimelineId, setEditingTimelineId] = useState(null);

  const [statForm, setStatForm] = useState({
    commits: '3,842',
    uptime: '99.99%',
    repos: '48',
    codeLines: '420,000+',
    activeStatus: 'ONLINE // READY FOR HIRE'
  });
  const [editingStatId, setEditingStatId] = useState(null);

  const [messageForm, setMessageForm] = useState({
    name: '',
    email: '',
    subject: 'Admin Entry',
    message: ''
  });
  const [showAddMessage, setShowAddMessage] = useState(false);

  const handleCoverImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file (PNG, JPG, WebP, SVG)");
      return;
    }

    setUploadingCover(true);
    sfx.playClick();

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target.result;
        const res = await fetchApi('/api/upload', {
          method: 'POST',
          body: JSON.stringify({
            image: base64Data,
            filename: file.name
          })
        });

        if (res && res.success && res.url) {
          setProjectForm((prev) => ({ ...prev, coverImage: res.url }));
          notifySuccess("Cover image uploaded successfully!");
        } else {
          setProjectForm((prev) => ({ ...prev, coverImage: event.target.result }));
          notifySuccess("Cover image loaded locally!");
        }
      } catch (err) {
        console.error("Cover upload error", err);
        setProjectForm((prev) => ({ ...prev, coverImage: event.target.result }));
        notifySuccess("Cover image buffered!");
      } finally {
        setUploadingCover(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [msgData, projData, skillData, expData, statData] = await Promise.all([
        fetchApi('/api/messages').catch(() => fetchApi('/api/contact').catch(() => ({ data: [] }))),
        fetchApi('/api/projects').catch(() => ({ data: [] })),
        fetchApi('/api/skills').catch(() => ({ data: [] })),
        fetchApi('/api/experiences').catch(() => ({ data: [] })),
        fetchApi('/api/stats').catch(() => ({ data: null }))
      ]);
      if (msgData && msgData.data) setMessages(msgData.data);
      if (projData && projData.data) setProjects(projData.data);
      if (skillData && skillData.data) setSkills(skillData.data);
      if (expData && expData.data) setExperiences(expData.data);
      if (statData && statData.data) {
        const sData = Array.isArray(statData.data) ? statData.data : [statData.data];
        setStatsList(sData);
      }
    } catch (e) {
      console.error('Failed to load CRUD data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    sfx.playClick();
    setLoginError(null);
    try {
      const res = await fetchApi('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });
      if (res && (res.success || res.token)) {
        sfx.playSuccess();
        localStorage.setItem('adminToken', res.token || 'token_auth_granted');
        setIsAuthenticated(true);
      } else {
        // Fallback login validation if server returns error or offline fallback mode
        if (loginForm.username === 'admin' && loginForm.password === 'cybergeek123') {
          sfx.playSuccess();
          localStorage.setItem('adminToken', 'token_auth_granted');
          setIsAuthenticated(true);
        } else {
          setLoginError(res?.error || 'Invalid admin credentials');
        }
      }
    } catch (err) {
      if (loginForm.username === 'admin' && loginForm.password === 'cybergeek123') {
        sfx.playSuccess();
        localStorage.setItem('adminToken', 'token_auth_granted');
        setIsAuthenticated(true);
      } else {
        setLoginError('Server error: ' + err.message);
      }
    }
  };

  const handleLogout = () => {
    sfx.playClick();
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    onBackToPortfolio();
  };

  const notifySuccess = (msg) => {
    sfx.playSuccess();
    setStatusMsg({ type: 'success', text: msg });
    setTimeout(() => setStatusMsg(null), 4000);
    loadAllData();
    if (onDataChanged) onDataChanged();
  };

  // ==================== MESSAGES CRUD ====================
  const handleSaveMessage = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      await fetchApi('/api/contact', {
        method: 'POST',
        body: JSON.stringify(messageForm)
      });
      notifySuccess("New contact message logged to database!");
      setMessageForm({ name: '', email: '', subject: 'Admin Entry', message: '' });
      setShowAddMessage(false);
    } catch (e) {
      alert("Error submitting message: " + e.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Confirm delete message document from database?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/messages/${id}`, { method: 'DELETE' }).catch(() => 
        fetchApi(`/api/contact/${id}`, { method: 'DELETE' })
      );
      notifySuccess("Message record deleted successfully!");
    } catch (e) {
      alert("Error deleting message: " + e.message);
    }
  };

  // ==================== PROJECTS CRUD ====================
  const handleSaveProject = async (e) => {
    e.preventDefault();
    sfx.playClick();
    
    // Normalize properties for dual-schema compatibility (Project/backend & Portfolio)
    const payload = {
      ...projectForm,
      image: projectForm.coverImage,
      tech_stack: typeof projectForm.techStack === 'string' 
        ? projectForm.techStack.split(',').map(s => s.trim()).filter(Boolean)
        : projectForm.techStack,
      features: typeof projectForm.features === 'string'
        ? projectForm.features.split(',').map(f => f.trim()).filter(Boolean)
        : projectForm.features,
      github_link: projectForm.githubUrl,
      live_link: projectForm.liveUrl
    };

    try {
      if (editingProjectId) {
        await fetchApi(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        notifySuccess("Project updated in database!");
      } else {
        await fetchApi('/api/projects', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        notifySuccess("New Project added to database!");
      }
      resetProjectForm();
    } catch (e) {
      alert("Project Save Error: " + e.message);
    }
  };

  const resetProjectForm = () => {
    setProjectForm({
      title: '', tagline: '', description: '', category: 'Full Stack',
      techStack: '', githubUrl: '', liveUrl: '', stars: 0,
      coverImage: '/images/project_cyber_ai.png', geekRating: '98%',
      featured: false, features: ''
    });
    setEditingProjectId(null);
  };

  const handleEditProject = (p) => {
    sfx.playClick();
    setEditingProjectId(p._id || p.id);
    const stack = p.techStack || p.tech_stack || [];
    const feats = p.features || [];
    setProjectForm({
      title: p.title || '',
      tagline: p.tagline || p.description || '',
      description: p.description || '',
      category: p.category || 'Full Stack',
      techStack: Array.isArray(stack) ? stack.join(', ') : stack || '',
      githubUrl: p.githubUrl || p.github_link || '',
      liveUrl: p.liveUrl || p.live_link || '',
      stars: p.stars || 0,
      coverImage: p.coverImage || p.image || '/images/project_cyber_ai.png',
      geekRating: p.geekRating || '98%',
      featured: Boolean(p.featured),
      features: Array.isArray(feats) ? feats.join(', ') : feats || ''
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Confirm delete project record from database?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/projects/${id}`, { method: 'DELETE' });
      notifySuccess("Project record deleted!");
    } catch (e) {
      alert("Error deleting project: " + e.message);
    }
  };

  // ==================== SKILLS CRUD ====================
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    sfx.playClick();

    // Map proficiency score (1-5) and level (1-100) seamlessly for Project/backend & Portfolio backend
    const numLevel = Number(skillForm.level) || 80;
    const mappedProficiency = Math.min(5, Math.max(1, Math.round(numLevel / 20)));

    const payload = {
      ...skillForm,
      level: numLevel,
      proficiency: mappedProficiency
    };

    try {
      if (editingSkillId) {
        await fetchApi(`/api/skills/${editingSkillId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        notifySuccess("Skill updated in database!");
      } else {
        await fetchApi('/api/skills', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        notifySuccess("New Skill added to database!");
      }
      resetSkillForm();
    } catch (e) {
      alert("Skill Save Error: " + e.message);
    }
  };

  const resetSkillForm = () => {
    setSkillForm({ name: '', category: 'Frontend', level: 90, geekRating: 'S-Tier', description: '', icon: 'Code2' });
    setEditingSkillId(null);
  };

  const handleEditSkill = (s) => {
    sfx.playClick();
    setEditingSkillId(s._id || s.id);
    const lvl = s.level || (s.proficiency ? s.proficiency * 20 : 80);
    setSkillForm({
      name: s.name || '',
      category: s.category || 'Frontend',
      level: lvl,
      geekRating: s.geekRating || 'S-Tier',
      description: s.description || '',
      icon: s.icon || 'Code2'
    });
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Confirm delete skill record from database?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/skills/${id}`, { method: 'DELETE' });
      notifySuccess("Skill document deleted!");
    } catch (e) {
      alert("Error deleting skill: " + e.message);
    }
  };

  // ==================== TIMELINE / EXPERIENCES CRUD ====================
  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      if (editingTimelineId) {
        await fetchApi(`/api/experiences/${editingTimelineId}`, {
          method: 'PUT',
          body: JSON.stringify(timelineForm)
        });
        notifySuccess("Timeline entry updated in database!");
      } else {
        await fetchApi('/api/experiences', {
          method: 'POST',
          body: JSON.stringify(timelineForm)
        });
        notifySuccess("New Timeline milestone added to database!");
      }
      resetTimelineForm();
    } catch (e) {
      alert("Timeline Save Error: " + e.message);
    }
  };

  const resetTimelineForm = () => {
    setTimelineForm({ period: '2024 - PRESENT', role: '', company: '', description: '', techTags: '' });
    setEditingTimelineId(null);
  };

  const handleEditTimeline = (exp) => {
    sfx.playClick();
    setEditingTimelineId(exp._id || exp.id);
    setTimelineForm({
      period: exp.period || '2024 - PRESENT',
      role: exp.role || '',
      company: exp.company || '',
      description: exp.description || '',
      techTags: Array.isArray(exp.techTags) ? exp.techTags.join(', ') : exp.techTags || ''
    });
  };

  const handleDeleteTimeline = async (id) => {
    if (!window.confirm("Confirm delete timeline entry from database?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/experiences/${id}`, { method: 'DELETE' });
      notifySuccess("Timeline milestone deleted!");
    } catch (e) {
      alert("Error deleting timeline entry: " + e.message);
    }
  };

  // ==================== TELEMETRY STATS CRUD ====================
  const handleSaveStat = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      if (editingStatId) {
        await fetchApi(`/api/stats/${editingStatId}`, {
          method: 'PUT',
          body: JSON.stringify(statForm)
        });
        notifySuccess("Telemetry stats updated in database!");
      } else {
        await fetchApi('/api/stats', {
          method: 'POST',
          body: JSON.stringify(statForm)
        });
        notifySuccess("New telemetry stat added to database!");
      }
      resetStatForm();
    } catch (e) {
      alert("Stat Save Error: " + e.message);
    }
  };

  const resetStatForm = () => {
    setStatForm({
      commits: '3,842',
      uptime: '99.99%',
      repos: '48',
      codeLines: '420,000+',
      activeStatus: 'ONLINE // READY FOR HIRE'
    });
    setEditingStatId(null);
  };

  const handleEditStat = (st) => {
    sfx.playClick();
    setEditingStatId(st._id || st.id);
    setStatForm({
      commits: st.commits || '0',
      uptime: st.uptime || '100%',
      repos: st.repos || '0',
      codeLines: st.codeLines || '0',
      activeStatus: st.activeStatus || 'ONLINE // READY FOR HIRE'
    });
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm("Confirm delete telemetry stat record from database?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/stats/${id}`, { method: 'DELETE' });
      notifySuccess("Telemetry stat record deleted!");
    } catch (e) {
      alert("Error deleting stat: " + e.message);
    }
  };

  // Filter Search Lists
  const filteredMessages = messages.filter(m => 
    !searchTerm || 
    (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.email && m.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (m.message && m.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredProjects = projects.filter(p => 
    !searchTerm || 
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredSkills = skills.filter(s => 
    !searchTerm || 
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredExperiences = experiences.filter(exp => 
    !searchTerm || 
    (exp.role && exp.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exp.company && exp.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStats = statsList.filter(st => 
    !searchTerm || 
    (st.commits && String(st.commits).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (st.uptime && String(st.uptime).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (st.repos && String(st.repos).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (st.codeLines && String(st.codeLines).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (st.activeStatus && String(st.activeStatus).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ==================== RENDER LOGIN SCREEN IF UNAUTHENTICATED ====================
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 10 }}>
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '460px',
            padding: '40px',
            borderRadius: '24px',
            borderColor: 'var(--cyber-purple)',
            boxShadow: '0 0 50px rgba(157, 78, 221, 0.35)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { sfx.playClick(); onBackToPortfolio(); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <span className="glass-pill" style={{ borderColor: 'var(--cyber-purple)', color: 'var(--cyber-purple)' }}>
              <Lock size={12} /> ADMIN GATEWAY
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(157, 78, 221, 0.15)', border: '1px solid var(--cyber-purple)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <Key size={28} color="var(--cyber-purple)" />
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Sign-In</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Authenticate session to manage database CRUD operations.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                ADMIN USERNAME
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="username"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(5, 7, 10, 0.8)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '10px', color: '#fff', outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                ADMIN PASSWORD
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Password"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(5, 7, 10, 0.8)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '10px', color: '#fff', outline: 'none'
                }}
              />
            </div>

            {loginError && (
              <div style={{ padding: '10px', background: 'rgba(255, 0, 127, 0.12)', border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)', borderRadius: '8px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn-cyber" style={{ justifyContent: 'center', borderColor: 'var(--cyber-purple)' }}>
              <Lock size={16} />
              <span>AUTHENTICATE SESSION</span>
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
            Default Credentials: <strong>admin</strong> / <strong>cybergeek123</strong>
          </div>
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATED ADMIN DASHBOARD STUDIO ====================
  return (
    <div style={{ minHeight: '100vh', padding: 'clamp(20px, 4vw, 40px) clamp(12px, 3vw, 24px)', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { sfx.playClick(); onBackToPortfolio(); }}
            className="btn-cyber-outline"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={22} color="var(--matrix-green)" />
              <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800 }}>Database Cyber Studio</h1>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AUTHENTICATED SESSION // FULL CRUD OPERATIONS
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div className="glass-pill" style={{ borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
            <ShieldCheck size={14} />
            <span>● DB CONNECTED</span>
          </div>

          <button onClick={loadAllData} className="glass-panel" style={{ padding: '7px 12px', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center',borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>Sync DB</span>
          </button>

          <button
            onClick={handleLogout}
            style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)', padding: '7px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '10px 16px', borderRadius: '10px', background: 'rgba(0, 255, 102, 0.15)', border: '1px solid var(--matrix-green)', color: 'var(--matrix-green)', marginBottom: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <CheckCircle size={16} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs & Search Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { sfx.playClick(); setActiveTab('messages'); setSearchTerm(''); }}
            className="glass-panel"
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${activeTab === 'messages' ? 'var(--matrix-green)' : 'transparent'}`, color: activeTab === 'messages' ? 'var(--matrix-green)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
            }}
          >
            <Mail size={16} />
            <span>Messages ({messages.length})</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setActiveTab('projects'); setSearchTerm(''); }}
            className="glass-panel"
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${activeTab === 'projects' ? 'var(--neon-cyan)' : 'transparent'}`, color: activeTab === 'projects' ? 'var(--neon-cyan)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
            }}
          >
            <FolderGit2 size={16} />
            <span>Projects CRUD ({projects.length})</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setActiveTab('skills'); setSearchTerm(''); }}
            className="glass-panel"
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${activeTab === 'skills' ? 'var(--cyber-purple)' : 'transparent'}`, color: activeTab === 'skills' ? 'var(--cyber-purple)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
            }}
          >
            <Cpu size={16} />
            <span>Skills CRUD ({skills.length})</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setActiveTab('timeline'); setSearchTerm(''); }}
            className="glass-panel"
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${activeTab === 'timeline' ? 'var(--neon-amber)' : 'transparent'}`, color: activeTab === 'timeline' ? 'var(--neon-amber)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
            }}
          >
            <GitCommit size={16} />
            <span>Changelog CRUD ({experiences.length})</span>
          </button>

          <button
            onClick={() => { sfx.playClick(); setActiveTab('stats'); setSearchTerm(''); }}
            className="glass-panel"
            style={{
              padding: '8px 16px', borderRadius: '10px', border: `1px solid ${activeTab === 'stats' ? 'var(--matrix-green)' : 'transparent'}`, color: activeTab === 'stats' ? 'var(--matrix-green)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem'
            }}
          >
            <Activity size={16} />
            <span>Stats CRUD ({statsList.length})</span>
          </button>
        </div>

        {/* Live Search Bar */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter records..."
            style={{
              width: '100%', padding: '6px 12px 6px 30px', background: 'rgba(5, 7, 10, 0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '0.8rem', fontFamily: 'var(--font-mono)'
            }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: MESSAGES CRUD */}
      {activeTab === 'messages' && (
        <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--matrix-green)' }}>
              // CONTACT SUBMISSIONS (COLLECTION: messages / contact)
            </h2>
            <button
              onClick={() => setShowAddMessage(!showAddMessage)}
              className="glass-panel"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--matrix-green)', borderColor: 'var(--matrix-green)', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              {showAddMessage ? <X size={14} /> : <Plus size={14} />}
              <span>{showAddMessage ? 'Cancel' : 'Create Message Entry'}</span>
            </button>
          </div>

          {/* Add Message Form Modal / Drawer */}
          {showAddMessage && (
            <form onSubmit={handleSaveMessage} style={{ marginBottom: '24px', padding: '16px', background: 'rgba(5, 7, 10, 0.8)', border: '1px dashed var(--matrix-green)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NAME *</label>
                  <input type="text" value={messageForm.name} onChange={(e) => setMessageForm({ ...messageForm, name: e.target.value })} placeholder="Sender name" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EMAIL *</label>
                  <input type="email" value={messageForm.email} onChange={(e) => setMessageForm({ ...messageForm, email: e.target.value })} placeholder="user@example.com" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUBJECT</label>
                <input type="text" value={messageForm.subject} onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })} placeholder="Subject line" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MESSAGE CONTENT *</label>
                <textarea value={messageForm.message} onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })} rows={3} placeholder="Message body..." required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>
              <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
                <Send size={14} />
                <span>Log Message to DB</span>
              </button>
            </form>
          )}

          {/* List Messages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredMessages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                {messages.length === 0 ? "No submissions found in database collection." : "No messages match your filter query."}
              </p>
            ) : (
              filteredMessages.map((m, idx) => (
                <div key={m._id || m.id || idx} className="glass-panel" style={{ padding: '16px', background: 'rgba(5, 7, 10, 0.7)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ color: 'var(--neon-cyan)' }}>{m.name}</strong> &lt;{m.email}&gt;
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Recent'}
                      </span>
                      <button onClick={() => handleDeleteMessage(m._id || m.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer' }} title="Delete Message">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--matrix-green)', marginBottom: '4px' }}>Subject: {m.subject || "General Inquiry"}</div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.88rem', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px', wordBreak: 'break-word' }}>{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS VAULT CRUD */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="admin-grid">
          {/* Add / Edit Project Form */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--neon-cyan)' }}>
                {editingProjectId ? '// EDIT PROJECT' : '// ADD NEW PROJECT TO ATLAS'}
              </h2>
              {editingProjectId && (
                <button onClick={resetProjectForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.78rem' }}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TITLE *</label>
                <input
                  type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Quantum IDE Studio" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TAGLINE *</label>
                <input
                  type="text" value={projectForm.tagline} onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} placeholder="Brief 1-line summary" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION *</label>
                <textarea
                  value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <input type="text" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STARS</label>
                  <input type="number" value={projectForm.stars} onChange={(e) => setProjectForm({ ...projectForm, stars: e.target.value })} style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GITHUB REPO URL</label>
                  <input type="text" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} placeholder="https://github.com/username/repo" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LIVE DEMO URL</label>
                  <input type="text" value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} placeholder="https://demo.dev" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
                  PROJECT COVER IMAGE * (UPLOAD FILE OR ENTER URL)
                </label>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px dashed rgba(0, 243, 255, 0.4)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  flexWrap: 'wrap'
                }}>
                  {/* Live Thumbnail */}
                  <div style={{
                    width: '70px',
                    height: '46px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    background: '#000',
                    border: '1px solid rgba(0, 243, 255, 0.3)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {projectForm.coverImage ? (
                      <img
                        src={projectForm.coverImage}
                        alt="Cover Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.currentTarget.src = '/images/project_cyber_ai.png'; }}
                      />
                    ) : (
                      <Image size={20} color="var(--text-muted)" />
                    )}
                  </div>

                  {/* Controls */}
                  <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <label
                        htmlFor="coverImageUploadInput"
                        className="glass-panel"
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.76rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--neon-cyan)',
                          borderColor: 'var(--neon-cyan)',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {uploadingCover ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        <span>{uploadingCover ? 'Uploading...' : 'Choose File'}</span>
                      </label>
                      <input
                        id="coverImageUploadInput"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageFileChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        PNG, JPG, WebP, SVG
                      </span>
                    </div>

                    <input
                      type="text"
                      value={projectForm.coverImage}
                      onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                      placeholder="Image URL or uploaded path..."
                      style={{
                        width: '100%',
                        padding: '5px 8px',
                        background: '#05070a',
                        border: '1px solid rgba(0,243,255,0.2)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '0.76rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TECH STACK (comma separated)</label>
                <input type="text" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, Node.js, Express, MongoDB" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="btn-cyber" style={{ flex: 1 }}>
                  <Plus size={16} />
                  <span>{editingProjectId ? 'Update Project' : 'Save Project to DB'}</span>
                </button>
                {editingProjectId && (
                  <button type="button" onClick={resetProjectForm} className="btn-cyber-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stored Projects List */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)', maxHeight: '750px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--neon-cyan)' }}>
              // STORED PROJECTS ({filteredProjects.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredProjects.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                  {projects.length === 0 ? "No projects found in database collection." : "No projects match your filter query."}
                </p>
              ) : (
                filteredProjects.map((p) => (
                  <div key={p._id || p.id} className="glass-panel" style={{ padding: '14px', background: 'rgba(5, 7, 10, 0.7)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={p.coverImage || p.image || '/images/project_cyber_ai.png'}
                        alt={p.title}
                        style={{ width: '56px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,243,255,0.3)' }}
                        onError={(e) => { e.currentTarget.src = '/images/project_cyber_ai.png'; }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '0.98rem', color: 'var(--neon-cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h3>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.tagline || p.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button onClick={() => handleEditProject(p)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer', padding: '2px' }} title="Edit Project"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteProject(p._id || p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer', padding: '2px' }} title="Delete Project"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS MATRIX CRUD */}
      {activeTab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="admin-grid">
          {/* Add / Edit Skill Form */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--cyber-purple)' }}>
                {editingSkillId ? '// EDIT SKILL' : '// ADD NEW SKILL TO ATLAS'}
              </h2>
              {editingSkillId && (
                <button onClick={resetSkillForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.78rem' }}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SKILL NAME *</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. MongoDB Atlas & Mongoose" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }}>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Tools">Tools</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROFICIENCY % (1-100)</label>
                  <input type="number" min="1" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION</label>
                <input type="text" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="Skill details or stack highlights" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--cyber-purple)', flex: 1 }}>
                  <Plus size={16} />
                  <span>{editingSkillId ? 'Update Skill' : 'Save Skill to DB'}</span>
                </button>
                {editingSkillId && (
                  <button type="button" onClick={resetSkillForm} className="btn-cyber-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stored Skills List */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--cyber-purple)' }}>
              // STORED SKILLS ({filteredSkills.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredSkills.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                  {skills.length === 0 ? "No skills found in database collection." : "No skills match your filter query."}
                </p>
              ) : (
                filteredSkills.map((s) => (
                  <div key={s._id || s.id} className="glass-panel" style={{ padding: '14px', background: 'rgba(5, 7, 10, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontSize: '0.95rem', color: 'var(--matrix-green)' }}>
                        {s.name} ({s.level || (s.proficiency ? s.proficiency * 20 : 80)}%)
                      </h3>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.category}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEditSkill(s)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer', padding: '2px' }} title="Edit Skill"><Edit3 size={16} /></button>
                      <button onClick={() => handleDeleteSkill(s._id || s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer', padding: '2px' }} title="Delete Skill"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHANGELOG & TIMELINE CRUD */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="admin-grid">
          {/* Add / Edit Timeline Form */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--neon-amber)' }}>
                {editingTimelineId ? '// EDIT TIMELINE MILESTONE' : '// ADD TIMELINE MILESTONE TO ATLAS'}
              </h2>
              {editingTimelineId && (
                <button onClick={resetTimelineForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.78rem' }}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveTimeline} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PERIOD *</label>
                  <input
                    type="text" value={timelineForm.period} onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })} placeholder="e.g. 2024 - PRESENT" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMPANY / ORG *</label>
                  <input
                    type="text" value={timelineForm.company} onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })} placeholder="e.g. CyberNetix Labs" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ROLE / TITLE *</label>
                <input
                  type="text" value={timelineForm.role} onChange={(e) => setTimelineForm({ ...timelineForm, role: e.target.value })} placeholder="e.g. Lead Full-Stack Architect" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION *</label>
                <textarea
                  value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} rows={3} required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TECH TAGS (comma separated)</label>
                <input
                  type="text" value={timelineForm.techTags} onChange={(e) => setTimelineForm({ ...timelineForm, techTags: e.target.value })} placeholder="React, Node.js, Express, MongoDB" style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--neon-amber)', flex: 1 }}>
                  <Plus size={16} />
                  <span>{editingTimelineId ? 'Update Milestone' : 'Save Milestone to DB'}</span>
                </button>
                {editingTimelineId && (
                  <button type="button" onClick={resetTimelineForm} className="btn-cyber-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stored Timeline List */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--neon-amber)' }}>
              // STORED CHANGELOG & HISTORY ({filteredExperiences.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredExperiences.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                  {experiences.length === 0 ? "No timeline milestones found in database." : "No milestones match your filter query."}
                </p>
              ) : (
                filteredExperiences.map((exp) => (
                  <div key={exp._id || exp.id} className="glass-panel" style={{ padding: '14px', background: 'rgba(5, 7, 10, 0.7)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="glass-pill" style={{ fontSize: '0.74rem' }}>{exp.period}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditTimeline(exp)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer', padding: '2px' }} title="Edit Milestone"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteTimeline(exp._id || exp.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer', padding: '2px' }} title="Delete Milestone"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '0.98rem', color: 'var(--neon-cyan)' }}>{exp.role}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--matrix-green)', fontFamily: 'var(--font-mono)' }}>{exp.company}</span>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>{exp.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELEMETRY STATS CRUD */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }} className="admin-grid">
          {/* Add / Edit Stat Form */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--matrix-green)' }}>
                {editingStatId ? '// EDIT TELEMETRY METRICS' : '// CREATE TELEMETRY RECORD IN ATLAS'}
              </h2>
              {editingStatId && (
                <button onClick={resetStatForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', gap: '4px', alignItems: 'center', fontSize: '0.78rem' }}>
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveStat} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GIT COMMITS *</label>
                  <input
                    type="text" value={statForm.commits} onChange={(e) => setStatForm({ ...statForm, commits: e.target.value })} placeholder="e.g. 3,842" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SYSTEM UPTIME *</label>
                  <input
                    type="text" value={statForm.uptime} onChange={(e) => setStatForm({ ...statForm, uptime: e.target.value })} placeholder="e.g. 99.99%" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ACTIVE REPOSITORIES *</label>
                  <input
                    type="text" value={statForm.repos} onChange={(e) => setStatForm({ ...statForm, repos: e.target.value })} placeholder="e.g. 48" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LINES OF CODE *</label>
                  <input
                    type="text" value={statForm.codeLines} onChange={(e) => setStatForm({ ...statForm, codeLines: e.target.value })} placeholder="e.g. 420,000+" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SYSTEM ACTIVE STATUS *</label>
                <input
                  type="text" value={statForm.activeStatus} onChange={(e) => setStatForm({ ...statForm, activeStatus: e.target.value })} placeholder="e.g. ONLINE // READY FOR HIRE" required style={{ width: '100%', padding: '8px 12px', background: '#05070a', border: '1px solid rgba(0,255,102,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--matrix-green)', flex: 1 }}>
                  <Plus size={16} />
                  <span>{editingStatId ? 'Update Telemetry' : 'Save Telemetry to DB'}</span>
                </button>
                {editingStatId && (
                  <button type="button" onClick={resetStatForm} className="btn-cyber-outline" style={{ padding: '8px 16px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Stored Stats List */}
          <div className="glass-panel" style={{ padding: 'clamp(18px, 4vw, 28px)', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--matrix-green)' }}>
              // STORED TELEMETRY METRICS ({filteredStats.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredStats.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem' }}>
                  {statsList.length === 0 ? "No telemetry stats found in database." : "No stats match your filter query."}
                </p>
              ) : (
                filteredStats.map((st) => (
                  <div key={st._id || st.id || 'stat_item'} className="glass-panel" style={{ padding: '14px', background: 'rgba(5, 7, 10, 0.7)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="glass-pill" style={{ fontSize: '0.74rem', color: 'var(--matrix-green)', borderColor: 'var(--matrix-green)' }}>
                        {st.activeStatus || 'ONLINE'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEditStat(st)} style={{ background: 'transparent', border: 'none', color: 'var(--matrix-green)', cursor: 'pointer', padding: '2px' }} title="Edit Stat"><Edit3 size={16} /></button>
                        {st._id && (
                          <button onClick={() => handleDeleteStat(st._id || st.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer', padding: '2px' }} title="Delete Stat"><Trash2 size={16} /></button>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                      <div><span style={{ color: 'var(--text-muted)' }}>Commits:</span> <strong style={{ color: '#fff' }}>{st.commits}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Uptime:</span> <strong style={{ color: '#fff' }}>{st.uptime}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Repos:</span> <strong style={{ color: '#fff' }}>{st.repos}</strong></div>
                      <div><span style={{ color: 'var(--text-muted)' }}>Lines:</span> <strong style={{ color: '#fff' }}>{st.codeLines}</strong></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 850px) {
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
