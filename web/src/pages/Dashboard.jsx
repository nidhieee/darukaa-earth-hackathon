import { useState, useEffect } from 'react';
import { getProjects, createProject } from '../api/projects';
import { Link } from 'react-router-dom';

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
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject({ name: newProjectName, description: newProjectDesc });
      setShowModal(false);
      setNewProjectName('');
      setNewProjectDesc('');
      loadProjects();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  if (loading) return <div className="main-content">Loading projects...</div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Projects</h2>
        <button className="btn" onClick={() => setShowModal(true)}>New Project</button>
      </div>

      {showModal && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label>Name</label>
              <input value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} />
            </div>
            <div className="flex-row">
              <button type="submit" className="btn">Create</button>
              <button type="button" className="btn" style={{ background: '#6b7280' }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {projects.length === 0 ? (
        <p>No projects yet. Create one to get started.</p>
      ) : (
        <div className="projects-grid">
          {projects.map(p => (
            <div key={p.id} className="card">
              <h3>{p.name}</h3>
              <p style={{ color: '#4b5563' }}>{p.description}</p>
              <p><strong>Sites:</strong> {p.sites?.length || 0}</p>
              <Link to={`/projects/${p.id}/map`} className="btn" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
                Open Map
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
