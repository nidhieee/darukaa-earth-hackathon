import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjects } from '../api/projects';
import { createSite } from '../api/sites';
import MapView from '../components/map/MapView';

export default function ProjectMap() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProject = async () => {
    try {
      const projects = await getProjects();
      const proj = projects.find(p => p.id === id);
      setProject(proj);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleSiteDrawn = async (geojson) => {
    const siteName = window.prompt("Enter a name for this new site:");
    if (!siteName) return;

    try {
      await createSite(id, { name: siteName, geom: geojson });
      loadProject(); 
    } catch (err) {
      console.error('Failed to create site', err);
      alert('Failed to save site.');
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;
  if (!project) return <div className="main-content">Project not found.</div>;

  return (
    <div className="main-content" style={{ maxWidth: '100%' }}>
      <div className="flex-row" style={{ marginBottom: '1rem', justifyContent: 'space-between' }}>
        <h2>{project.name} - Map</h2>
        <Link to="/dashboard" className="btn" style={{ textDecoration: 'none', background: '#4b5563' }}>Back to Dashboard</Link>
      </div>
      <p style={{ marginBottom: '1rem' }}>Use the polygon tool on the right side of the map to draw new sites.</p>
      
      <MapView sites={project.sites} onSiteDrawn={handleSiteDrawn} />
    </div>
  );
}
