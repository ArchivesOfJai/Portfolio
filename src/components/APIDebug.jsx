import { useState, useEffect } from 'react';
import { projectAPI, skillAPI, contactAPI, healthAPI } from '../services/api';

const APIDebug = () => {
  const [connections, setConnections] = useState({
    health: null,
    projects: null,
    featured: null,
    skills: null,
    contact: null,
  });
  const [loading, setLoading] = useState(true);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    testAllConnections();
  }, []);

  const testAllConnections = async () => {
    setLoading(true);
    const results = {
      health: null,
      projects: null,
      featured: null,
      skills: null,
      contact: null,
    };

    try {
      const healthRes = await healthAPI.check();
      results.health = {
        status: 'success',
        message: healthRes.data.message,
      };
    } catch (err) {
      results.health = { status: 'error', message: err.message };
    }

    try {
      const projectsRes = await projectAPI.getAll();
      results.projects = {
        status: 'success',
        count: projectsRes.data.length,
        data: projectsRes.data,
      };
    } catch (err) {
      results.projects = { status: 'error', message: err.message };
    }

    try {
      const featuredRes = await projectAPI.getFeatured();
      results.featured = {
        status: 'success',
        count: featuredRes.data.length,
        data: featuredRes.data,
      };
    } catch (err) {
      results.featured = { status: 'error', message: err.message };
    }

    try {
      const skillsRes = await skillAPI.getAll();
      results.skills = {
        status: 'success',
        count: skillsRes.data.length,
        data: skillsRes.data,
      };
    } catch (err) {
      results.skills = { status: 'error', message: err.message };
    }

    try {
      const contactRes = await contactAPI.getAll();
      results.contact = {
        status: 'success',
        count: contactRes.data.length,
        data: contactRes.data,
      };
    } catch (err) {
      results.contact = { status: 'error', message: err.message };
    }

    setConnections(results);
    setLoading(false);
  };

  const testContactSubmit = async () => {
    try {
      setTestMessage('Sending test message...');
      await contactAPI.submit({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from the debug panel',
      });
      setTestMessage('✅ Test message sent successfully!');
    } catch (err) {
      setTestMessage(`❌ Error: ${err.message}`);
    }
  };

  const statusColor = (status) => {
    if (status === 'success') return 'text-green-400';
    if (status === 'error') return 'text-red-400';
    return 'text-yellow-400';
  };

  const bgColor = (status) => {
    if (status === 'success') return 'bg-green-900/20 border-green-600';
    if (status === 'error') return 'bg-red-900/20 border-red-600';
    return 'bg-yellow-900/20 border-yellow-600';
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-netflix-light border-2 border-red-600 rounded-lg p-4 overflow-y-auto z-40 shadow-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-red-600">🔧 API Debug</h3>
        <button
          onClick={testAllConnections}
          className="text-xs bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Testing connections...</p>
      ) : (
        <div className="space-y-2">
          {/* Health Check */}
          <div className={`border rounded p-2 text-sm ${bgColor(connections.health?.status)}`}>
            <p className={`font-semibold ${statusColor(connections.health?.status)}`}>
              💓 Backend: {connections.health?.status === 'success' ? '✅' : '❌'}
            </p>
            {connections.health?.status === 'error' && (
              <p className="text-xs text-red-300">Cannot reach backend</p>
            )}
          </div>

          {/* Projects */}
          <div className={`border rounded p-2 text-sm ${bgColor(connections.projects?.status)}`}>
            <p className={`font-semibold ${statusColor(connections.projects?.status)}`}>
              📦 Projects: {connections.projects?.status === 'success' ? '✅' : '❌'}
            </p>
            {connections.projects?.status === 'success' && (
              <p className="text-xs text-gray-300">Count: {connections.projects.count}</p>
            )}
          </div>

          {/* Featured Projects */}
          <div className={`border rounded p-2 text-sm ${bgColor(connections.featured?.status)}`}>
            <p className={`font-semibold ${statusColor(connections.featured?.status)}`}>
              ⭐ Featured: {connections.featured?.status === 'success' ? '✅' : '❌'}
            </p>
            {connections.featured?.status === 'success' && (
              <p className="text-xs text-gray-300">Count: {connections.featured.count}</p>
            )}
          </div>

          {/* Skills */}
          <div className={`border rounded p-2 text-sm ${bgColor(connections.skills?.status)}`}>
            <p className={`font-semibold ${statusColor(connections.skills?.status)}`}>
              🎯 Skills: {connections.skills?.status === 'success' ? '✅' : '❌'}
            </p>
            {connections.skills?.status === 'success' && (
              <p className="text-xs text-gray-300">Count: {connections.skills.count}</p>
            )}
          </div>

          {/* Contact */}
          <div className={`border rounded p-2 text-sm ${bgColor(connections.contact?.status)}`}>
            <p className={`font-semibold ${statusColor(connections.contact?.status)}`}>
              📧 Contact: {connections.contact?.status === 'success' ? '✅' : '❌'}
            </p>
            {connections.contact?.status === 'success' && (
              <p className="text-xs text-gray-300">Messages: {connections.contact.count}</p>
            )}
          </div>

          {/* Test Button */}
          <button
            onClick={testContactSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 rounded font-semibold mt-2"
          >
            Test Contact Form
          </button>

          {testMessage && <p className="text-xs text-center mt-2">{testMessage}</p>}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3 text-center">Debug Panel (Remove in prod)</p>
    </div>
  );
};

export default APIDebug;

