import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSite, getSiteAnalytics } from '../api/sites';
import HealthBadge from '../components/shared/HealthBadge';
import SiteChart from '../components/dashboard/SiteChart';

export default function SiteDetail() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [siteData, analyticsData] = await Promise.all([
          getSite(id),
          getSiteAnalytics(id)
        ]);
        setSite(siteData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="main-content">Loading site data...</div>;
  if (!site) return <div className="main-content">Site not found.</div>;

  return (
    <div className="main-content">
      <div className="flex-row" style={{ marginBottom: '2rem', justifyContent: 'space-between' }}>
        <div className="flex-row">
          <h2>{site.name}</h2>
          <HealthBadge score={site.health_score} />
        </div>
        <Link to={`/projects/${site.project_id}/map`} className="btn" style={{ textDecoration: 'none', background: '#4b5563' }}>Back to Map</Link>
      </div>

      <div className="card flex-row" style={{ justifyContent: 'space-around', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Area (Hectares)</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{site.area_hectares.toFixed(2)}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0' }}>Current Carbon (Tons)</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#059669' }}>{site.carbon_estimate_tons.toFixed(2)}</h3>
        </div>
      </div>

      <div className="card">
        <h3>Analytics Trends</h3>
        <SiteChart analytics={analytics} />
      </div>
    </div>
  );
}
