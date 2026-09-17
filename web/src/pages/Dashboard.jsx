import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
import { getProjects, createProject } from '../api/projects';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlareHover from '../components/GlareHover';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    const handleOpenModal = () => setShowModal(true);
    window.addEventListener('open-new-project-modal', handleOpenModal);
    return () => window.removeEventListener('open-new-project-modal', handleOpenModal);
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject({ name: newProjectName, description: newProjectDesc });
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
      toast.success('Project created');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create project');
    }
  };

  if (loading) return <div className="main-content">Loading projects...</div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>My Projects</h2>
      </div>

      {showModal && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Name</label>
              <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} />
            </div>
            <div className="flex-row" style={{ marginTop: '24px' }}>
              <GlareHover>
                <button type="submit" className="btn">Create</button>
              </GlareHover>
              <motion.button whileTap={{ scale: 0.97 }} type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</motion.button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No projects yet. Create one to get started.</p>
      ) : (
        <div className="projects-grid">
          {projects.map((p, index) => (
            <motion.div 
              key={p.id} 
              className="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <h3 style={{ color: 'var(--color-primary)', marginTop: 0, marginBottom: '8px' }}>{p.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>
                {p.description || 'No description provided.'}
              </p>
              <p style={{ marginBottom: '24px', fontWeight: '500' }}>Sites: {p.sites?.length || 0}</p>
              <GlareHover style={{ display: 'block', width: '100%' }}>
                <Link to={`/projects/${p.id}/map`} className="btn" style={{ display: 'block', width: '100%', boxSizing: 'border-box', padding: '14px 16px', textAlign: 'center' }}>
                  Open Map
                </Link>
              </GlareHover>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
