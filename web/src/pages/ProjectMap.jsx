import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjects } from '../api/projects';
import MapView from '../components/map/MapView';
import HealthBadge from '../components/shared/HealthBadge';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlareHover from '../components/GlareHover';

export default function ProjectMap() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      toast.success('Site saved');
    } catch (err) {
      console.error('Failed to create site', err);
      toast.error('Failed to save site');
    }
  };

  if (loading) return <div className="main-content">Loading...</div>;
  if (!project) return <div className="main-content">Project not found.</div>;

  return (
    <div className="main-content" style={{ maxWidth: '100%', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)' }}>
      <div className="flex-row" style={{ marginBottom: '16px', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <h2 style={{ color: 'var(--color-primary)', margin: '0 0 8px 0' }}>{project.name}</h2>
          <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>Use the polygon tool on the map to draw new sites.</p>
        </div>
        <GlareHover>
          <Link to="/dashboard" className="btn">Back to Dashboard</Link>
        </GlareHover>
      </div>
      
      <div className="project-map-layout" style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
        <div style={{ flex: '0 0 70%', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
             <MapView sites={project.sites} onSiteDrawn={handleSiteDrawn} />
          </div>
        </div>
        
        <div style={{ flex: '0 0 30%', overflowY: 'auto', paddingRight: '4px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Sites ({project.sites?.length || 0})</h3>
          
          {(!project.sites || project.sites.length === 0) ? (
             <p style={{ color: 'var(--color-text-muted)' }}>No sites exist yet. Draw one on the map.</p>
          ) : (
            project.sites.map((site, index) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={site.id} 
                className="card" 
                style={{ cursor: 'pointer', padding: '16px', marginBottom: '16px' }}
                onClick={() => navigate(`/sites/${site.id}`)}
                whileHover={{ scale: 1.01, boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)' }}
              >
                <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>{site.name}</h4>
                  <HealthBadge score={site.health_score} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                  <span>Area: <strong>{site.area_hectares.toFixed(2)} ha</strong></span>
                  <span>Carbon: <strong>{site.carbon_estimate_tons.toFixed(2)} t</strong></span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
