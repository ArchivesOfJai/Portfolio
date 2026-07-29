import React, { useState, useEffect } from 'react';
import { Database, Plus, Trash2, Edit3, ArrowLeft, RefreshCw, CheckCircle, Mail, Code2, FolderGit2, Cpu, ShieldCheck, Lock, LogOut, Key, Calendar, GitCommit, Upload, Image, Loader2 } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form States
  const [projectForm, setProjectForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    stars: 0,
    coverImage: '',
    geekRating: ''
  });
  const [editingProjectId, setEditingProjectId] = useState(null);

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

        if (res.success && res.url) {
          setProjectForm((prev) => ({ ...prev, coverImage: res.url }));
          notifySuccess("Cover image uploaded successfully!");
        } else {
          alert("Upload failed: " + (res.error || 'Unknown error'));
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

  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'Frontend Core',
    level: 90,
    geekRating: 'S-Tier',
    description: ''
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

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [msgData, projData, skillData, expData] = await Promise.all([
        fetchApi('/api/messages'),
        fetchApi('/api/projects'),
        fetchApi('/api/skills'),
        fetchApi('/api/experiences')
      ]);
      if (msgData.data) setMessages(msgData.data);
      if (projData.data) setProjects(projData.data);
      if (skillData.data) setSkills(skillData.data);
      if (expData.data) setExperiences(expData.data);
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
      if (res.success && res.token) {
        sfx.playSuccess();
        localStorage.setItem('adminToken', res.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setLoginError('Server error: ' + err.message);
    }
  };

  const handleLogout = () => {
    sfx.playClick();
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  const notifySuccess = (msg) => {
    sfx.playSuccess();
    setStatusMsg({ type: 'success', text: msg });
    setTimeout(() => setStatusMsg(null), 4000);
    loadAllData();
    if (onDataChanged) onDataChanged();
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Confirm delete message document from MongoDB Atlas?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/messages/${id}`, { method: 'DELETE' });
      notifySuccess("Message document deleted from MongoDB Atlas!");
    } catch (e) {
      alert("Error deleting message: " + e.message);
    }
  };

  // Save Project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      if (editingProjectId) {
        await fetchApi(`/api/projects/${editingProjectId}`, {
          method: 'PUT',
          body: JSON.stringify(projectForm)
        });
        notifySuccess("Project updated in MongoDB Atlas!");
      } else {
        await fetchApi('/api/projects', {
          method: 'POST',
          body: JSON.stringify(projectForm)
        });
        notifySuccess("New Project added to MongoDB Atlas!");
      }
      setProjectForm({
        title: '', tagline: '', description: '', category: 'Full Stack',
        techStack: '', githubUrl: '', liveUrl: '', stars: 0,
        coverImage: '/images/project_cyber_ai.png', geekRating: '98%'
      });
      setEditingProjectId(null);
    } catch (e) {
      alert("Project Save Error: " + e.message);
    }
  };

  const handleEditProject = (p) => {
    sfx.playClick();
    setEditingProjectId(p._id || p.id);
    setProjectForm({
      title: p.title || '',
      tagline: p.tagline || '',
      description: p.description || '',
      category: p.category || 'Full Stack',
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack || '',
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      stars: p.stars || 0,
      coverImage: p.coverImage || '/images/project_cyber_ai.png',
      geekRating: p.geekRating || '98%'
    });
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Confirm delete project from MongoDB Atlas?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/projects/${id}`, { method: 'DELETE' });
      notifySuccess("Project record deleted!");
    } catch (e) {
      alert("Error deleting project: " + e.message);
    }
  };

  // Save Skill
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      if (editingSkillId) {
        await fetchApi(`/api/skills/${editingSkillId}`, {
          method: 'PUT',
          body: JSON.stringify(skillForm)
        });
        notifySuccess("Skill updated in MongoDB Atlas!");
      } else {
        await fetchApi('/api/skills', {
          method: 'POST',
          body: JSON.stringify(skillForm)
        });
        notifySuccess("New Skill added to MongoDB Atlas!");
      }
      setSkillForm({ name: '', category: 'Frontend Core', level: 90, geekRating: 'S-Tier', description: '' });
      setEditingSkillId(null);
    } catch (e) {
      alert("Skill Save Error: " + e.message);
    }
  };

  const handleEditSkill = (s) => {
    sfx.playClick();
    setEditingSkillId(s._id || s.id);
    setSkillForm({
      name: s.name || '',
      category: s.category || 'Frontend Core',
      level: s.level || 90,
      geekRating: s.geekRating || 'S-Tier',
      description: s.description || ''
    });
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Confirm delete skill document from MongoDB Atlas?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/skills/${id}`, { method: 'DELETE' });
      notifySuccess("Skill document deleted!");
    } catch (e) {
      alert("Error deleting skill: " + e.message);
    }
  };

  // Save Experience / Timeline Milestone
  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    sfx.playClick();
    try {
      if (editingTimelineId) {
        await fetchApi(`/api/experiences/${editingTimelineId}`, {
          method: 'PUT',
          body: JSON.stringify(timelineForm)
        });
        notifySuccess("Timeline entry updated in MongoDB Atlas!");
      } else {
        await fetchApi('/api/experiences', {
          method: 'POST',
          body: JSON.stringify(timelineForm)
        });
        notifySuccess("New Timeline milestone added to MongoDB Atlas!");
      }
      setTimelineForm({ period: '2024 - PRESENT', role: '', company: '', description: '', techTags: '' });
      setEditingTimelineId(null);
    } catch (e) {
      alert("Timeline Save Error: " + e.message);
    }
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
    if (!window.confirm("Confirm delete timeline entry from MongoDB Atlas?")) return;
    sfx.playClick();
    try {
      await fetchApi(`/api/experiences/${id}`, { method: 'DELETE' });
      notifySuccess("Timeline milestone deleted!");
    } catch (e) {
      alert("Error deleting timeline entry: " + e.message);
    }
  };

  // ==================== RENDER ADMIN LOGIN SCREEN IF NOT AUTHENTICATED ====================
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
              Authenticate session to manage MongoDB Atlas CRUD operations.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // ADMIN USERNAME
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Default: admin"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(5, 7, 10, 0.8)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '10px', color: '#fff', outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px' }}>
                // ADMIN PASSWORD
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Default: cybergeek123"
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
    <div style={{ minHeight: '100vh', padding: '40px 24px', maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => { sfx.playClick(); onBackToPortfolio(); }}
            className="btn-cyber-outline"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Database size={24} color="var(--matrix-green)" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>MongoDB Atlas Cyber Studio</h1>
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AUTHENTICATED SESSION // FULL CRUD OPERATIONS
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="glass-pill" style={{ borderColor: 'var(--matrix-green)', color: 'var(--matrix-green)' }}>
            <ShieldCheck size={14} />
            <span>● ATLAS CONNECTED</span>
          </div>

          <button onClick={loadAllData} className="glass-panel" style={{ padding: '8px 14px', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>Sync DB</span>
          </button>

          <button
            onClick={handleLogout}
            style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1px solid var(--cyber-magenta)', color: 'var(--cyber-magenta)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', display: 'flex', gap: '6px', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          style={{
            padding: '12px 20px', borderRadius: '10px', background: 'rgba(0, 255, 102, 0.15)', border: '1px solid var(--matrix-green)', color: 'var(--matrix-green)', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px'
          }}
        >
          <CheckCircle size={18} />
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { sfx.playClick(); setActiveTab('messages'); }}
          className="glass-panel"
          style={{
            padding: '10px 20px', borderRadius: '10px', border: `1px solid ${activeTab === 'messages' ? 'var(--matrix-green)' : 'transparent'}`, color: activeTab === 'messages' ? 'var(--matrix-green)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)'
          }}
        >
          <Mail size={16} />
          <span>Messages ({messages.length})</span>
        </button>

        <button
          onClick={() => { sfx.playClick(); setActiveTab('projects'); }}
          className="glass-panel"
          style={{
            padding: '10px 20px', borderRadius: '10px', border: `1px solid ${activeTab === 'projects' ? 'var(--neon-cyan)' : 'transparent'}`, color: activeTab === 'projects' ? 'var(--neon-cyan)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)'
          }}
        >
          <FolderGit2 size={16} />
          <span>Projects Vault CRUD ({projects.length})</span>
        </button>

        <button
          onClick={() => { sfx.playClick(); setActiveTab('skills'); }}
          className="glass-panel"
          style={{
            padding: '10px 20px', borderRadius: '10px', border: `1px solid ${activeTab === 'skills' ? 'var(--cyber-purple)' : 'transparent'}`, color: activeTab === 'skills' ? 'var(--cyber-purple)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)'
          }}
        >
          <Cpu size={16} />
          <span>Skills Matrix CRUD ({skills.length})</span>
        </button>

        <button
          onClick={() => { sfx.playClick(); setActiveTab('timeline'); }}
          className="glass-panel"
          style={{
            padding: '10px 20px', borderRadius: '10px', border: `1px solid ${activeTab === 'timeline' ? 'var(--neon-amber)' : 'transparent'}`, color: activeTab === 'timeline' ? 'var(--neon-amber)' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-mono)'
          }}
        >
          <GitCommit size={16} />
          <span>Changelog & Timeline CRUD ({experiences.length})</span>
        </button>
      </div>

      {/* TAB 1: MESSAGES CRUD */}
      {activeTab === 'messages' && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--matrix-green)' }}>
            // CONTACT SUBMISSIONS (COLLECTION: messages)
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>No submissions found in MongoDB Atlas collection.</p>
            ) : (
              messages.map((m, idx) => (
                <div key={m._id || m.id || idx} className="glass-panel" style={{ padding: '20px', background: 'rgba(5, 7, 10, 0.7)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ color: 'var(--neon-cyan)' }}>{m.name}</strong> &lt;{m.email}&gt;
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Recent'}
                      </span>
                      <button onClick={() => handleDeleteMessage(m._id || m.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer' }} title="Delete Message">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--matrix-green)', marginBottom: '4px' }}>Subject: {m.subject}</div>
                  <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', background: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '6px' }}>{m.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS VAULT CRUD */}
      {activeTab === 'projects' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="admin-grid">
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--neon-cyan)' }}>
              {editingProjectId ? '// EDIT PROJECT' : '// ADD NEW PROJECT TO ATLAS'}
            </h2>
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TITLE *</label>
                <input
                  type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="e.g. Quantum IDE Studio" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TAGLINE *</label>
                <input
                  type="text" value={projectForm.tagline} onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} placeholder="Brief 1-line summary" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION *</label>
                <textarea
                  value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} rows={3} required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <input type="text" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STARS</label>
                  <input type="number" value={projectForm.stars} onChange={(e) => setProjectForm({ ...projectForm, stars: e.target.value })} style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GITHUB REPO URL</label>
                  <input type="text" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} placeholder="https://github.com/username/repo" style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>LIVE DEMO URL</label>
                  <input type="text" value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} placeholder="https://demo.dev" style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '6px' }}>
                  PROJECT COVER IMAGE * (UPLOAD FILE OR ENTER URL)
                </label>

                <div style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  background: 'rgba(5, 7, 10, 0.8)',
                  border: '1px dashed rgba(0, 243, 255, 0.4)',
                  borderRadius: '10px',
                  padding: '12px 14px'
                }}>
                  {/* Live Thumbnail */}
                  <div style={{
                    width: '84px',
                    height: '56px',
                    borderRadius: '8px',
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
                      <Image size={24} color="var(--text-muted)" />
                    )}
                  </div>

                  {/* Controls */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <label
                        htmlFor="coverImageUploadInput"
                        className="glass-panel"
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
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
                        <span>{uploadingCover ? 'Uploading Image...' : 'Choose Image File'}</span>
                      </label>
                      <input
                        id="coverImageUploadInput"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageFileChange}
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        PNG, JPG, WebP, SVG
                      </span>
                    </div>

                    <input
                      type="text"
                      value={projectForm.coverImage}
                      onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                      placeholder="Image URL or uploaded path e.g. /uploads/image.png"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        background: '#05070a',
                        border: '1px solid rgba(0,243,255,0.2)',
                        color: '#fff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TECH STACK (comma separated)</label>
                <input type="text" value={projectForm.techStack} onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })} placeholder="React, Node.js, Express, MongoDB" style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(0,243,255,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <button type="submit" className="btn-cyber">
                <Plus size={16} />
                <span>{editingProjectId ? 'Update Project' : 'Save Project to Atlas'}</span>
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '28px', maxHeight: '750px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--neon-cyan)' }}>
              // STORED PROJECTS ({projects.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {projects.map((p) => (
                <div key={p._id || p.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(5, 7, 10, 0.7)' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={p.coverImage || '/images/project_cyber_ai.png'}
                      alt={p.title}
                      style={{ width: '64px', height: '44px', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(0,243,255,0.3)' }}
                      onError={(e) => { e.currentTarget.src = '/images/project_cyber_ai.png'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '1.05rem', color: 'var(--neon-cyan)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.tagline}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                      <button onClick={() => handleEditProject(p)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer' }}><Edit3 size={16} /></button>
                      <button onClick={() => handleDeleteProject(p._id || p.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SKILLS MATRIX CRUD */}
      {activeTab === 'skills' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="admin-grid">
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--cyber-purple)' }}>
              {editingSkillId ? '// EDIT SKILL' : '// ADD NEW SKILL TO ATLAS'}
            </h2>
            <form onSubmit={handleSaveSkill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SKILL NAME *</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. MongoDB Atlas & Mongoose" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <input type="text" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PROFICIENCY % (1-100)</label>
                  <input type="number" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })} style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION</label>
                <input type="text" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="Skill details" style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(157,78,221,0.3)', color: '#fff', borderRadius: '8px' }} />
              </div>

              <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--cyber-purple)' }}>
                <Plus size={16} />
                <span>{editingSkillId ? 'Update Skill' : 'Save Skill to Atlas'}</span>
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '28px', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--cyber-purple)' }}>
              // STORED SKILLS ({skills.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {skills.map((s) => (
                <div key={s._id || s.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(5, 7, 10, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', color: 'var(--matrix-green)' }}>{s.name} ({s.level}%)</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{s.category}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEditSkill(s)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer' }}><Edit3 size={16} /></button>
                    <button onClick={() => handleDeleteSkill(s._id || s.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHANGELOG & TIMELINE CRUD */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }} className="admin-grid">
          {/* Add / Edit Timeline Form */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--neon-amber)' }}>
              {editingTimelineId ? '// EDIT TIMELINE MILESTONE' : '// ADD TIMELINE MILESTONE TO ATLAS'}
            </h2>
            <form onSubmit={handleSaveTimeline} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PERIOD *</label>
                  <input
                    type="text" value={timelineForm.period} onChange={(e) => setTimelineForm({ ...timelineForm, period: e.target.value })} placeholder="e.g. 2024 - PRESENT" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMPANY / ORG *</label>
                  <input
                    type="text" value={timelineForm.company} onChange={(e) => setTimelineForm({ ...timelineForm, company: e.target.value })} placeholder="e.g. CyberNetix Labs" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ROLE / TITLE *</label>
                <input
                  type="text" value={timelineForm.role} onChange={(e) => setTimelineForm({ ...timelineForm, role: e.target.value })} placeholder="e.g. Lead Full-Stack Architect" required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DESCRIPTION *</label>
                <textarea
                  value={timelineForm.description} onChange={(e) => setTimelineForm({ ...timelineForm, description: e.target.value })} rows={3} required style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TECH TAGS (comma separated)</label>
                <input
                  type="text" value={timelineForm.techTags} onChange={(e) => setTimelineForm({ ...timelineForm, techTags: e.target.value })} placeholder="React, Node.js, Express, MongoDB" style={{ width: '100%', padding: '10px', background: '#05070a', border: '1px solid rgba(255,170,0,0.3)', color: '#fff', borderRadius: '8px' }}
                />
              </div>

              <button type="submit" className="btn-cyber" style={{ borderColor: 'var(--neon-amber)' }}>
                <Plus size={16} />
                <span>{editingTimelineId ? 'Update Timeline Milestone' : 'Save Milestone to Atlas'}</span>
              </button>
            </form>
          </div>

          {/* Existing Timeline List */}
          <div className="glass-panel" style={{ padding: '28px', maxHeight: '600px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '20px', color: 'var(--neon-amber)' }}>
              // STORED CHANGELOG & HISTORY ({experiences.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {experiences.map((exp) => (
                <div key={exp._id || exp.id} className="glass-panel" style={{ padding: '16px', background: 'rgba(5, 7, 10, 0.7)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span className="glass-pill" style={{ fontSize: '0.76rem' }}>{exp.period}</span>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={() => handleEditTimeline(exp)} style={{ background: 'transparent', border: 'none', color: 'var(--neon-amber)', cursor: 'pointer' }}><Edit3 size={16} /></button>
                      <button onClick={() => handleDeleteTimeline(exp._id || exp.id)} style={{ background: 'transparent', border: 'none', color: 'var(--cyber-magenta)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--neon-cyan)' }}>{exp.role}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--matrix-green)', fontFamily: 'var(--font-mono)' }}>{exp.company}</span>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '6px' }}>{exp.description}</p>
                </div>
              ))}
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
