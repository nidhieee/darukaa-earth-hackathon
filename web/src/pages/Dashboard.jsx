import { useState, useEffect } from 'react';
import { getProjects, createProject } from '../api/projects';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlareHover from '../components/GlareHover';
import LoadingSpinner from '../components/shared/LoadingSpinner';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  

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
  }, []);

  if (loading) return <div className="main-content"><LoadingSpinner text="Loading projects..." /></div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>My Projects</h2>
      </div>


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
