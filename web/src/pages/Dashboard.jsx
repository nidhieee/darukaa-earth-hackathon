import { useState, useEffect } from 'react';
import { getProjects, updateProject, deleteProject } from '../api/projects';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import GlareHover from '../components/GlareHover';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ActionMenu from '../components/shared/ActionMenu';
import EditModal from '../components/shared/EditModal';
import ConfirmDeleteModal from '../components/shared/ConfirmDeleteModal';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

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

  const handleEditSave = async (data) => {
    try {
      await updateProject(editingProject.id, data);
      toast.success('Project updated');
      setEditingProject(null);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update project');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProject(deletingProject.id);
      toast.success('Project deleted');
      setDeletingProject(null);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="main-content"><LoadingSpinner text="Loading projects..." /></div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>My Projects</h2>
      </div>


      {projects.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', minHeight: '60vh', textAlign: 'center' 
          }}
        >
          <svg width="180" height="180" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '24px' }}>
            <circle cx="100" cy="100" r="98" fill="#F7F9F7" stroke="var(--color-brand)" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M100 40C77.9086 40 60 57.9086 60 80C60 110 100 160 100 160C100 160 140 110 140 80C140 57.9086 122.091 40 100 40Z" fill="var(--color-primary)" opacity="0.1" stroke="var(--color-primary)" strokeWidth="3" />
            <circle cx="100" cy="80" r="16" fill="var(--color-accent-lime)" />
            <path d="M100 160 L100 190 M70 190 L130 190" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round" />
            <path d="M120 70C125 75 125 85 120 90" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M80 70C75 75 75 85 80 90" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '24px', color: 'var(--color-primary)' }}>No projects yet</h3>
          <p style={{ margin: '0 0 32px 0', color: 'var(--color-text-muted)', maxWidth: '400px' }}>
            Create your first project to start mapping sites and tracking impact.
          </p>
          <GlareHover style={{ borderRadius: '9999px' }}>
            <button 
              onClick={() => navigate('/projects/new')}
              className="btn flex-row" 
              style={{ borderRadius: '9999px', padding: '12px 24px', gap: '8px', fontSize: '16px' }}
            >
              <Plus size={20} />
              Add Project
            </button>
          </GlareHover>
        </motion.div>
      ) : (
        <div className="projects-grid">
          {projects.map((p, index) => (
            <motion.div 
              key={p.id} 
              className="card"
              style={{ position: 'relative' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            >
              <ActionMenu 
                onEdit={() => setEditingProject(p)} 
                onDelete={() => setDeletingProject(p)} 
              />
              <h3 style={{ color: 'var(--color-primary)', margin: '0 0 8px 0', paddingRight: '24px' }}>{p.name}</h3>
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

      {editingProject && (
        <EditModal 
          title="Edit Project"
          initialName={editingProject.name}
          initialDescription={editingProject.description}
          onSave={handleEditSave}
          onCancel={() => setEditingProject(null)}
        />
      )}

      {deletingProject && (
        <ConfirmDeleteModal 
          itemName={deletingProject.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProject(null)}
        />
      )}
    </div>
  );
}
