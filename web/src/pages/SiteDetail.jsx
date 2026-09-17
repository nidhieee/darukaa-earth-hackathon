import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSite, getSiteAnalytics } from '../api/sites';
import HealthBadge from '../components/shared/HealthBadge';
import SiteChart from '../components/dashboard/SiteChart';
import { motion } from 'framer-motion';
import GlareHover from '../components/GlareHover';

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
      <div className="flex-row" style={{ marginBottom: '32px', justifyContent: 'space-between' }}>
        <div className="flex-row" style={{ alignItems: 'center' }}>
          <h2 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '28px' }}>{site.name}</h2>
          <HealthBadge score={site.health_score} />
        </div>
        {/* BUX FIX: Using site.project_id from backend response to properly link to ProjectMap */}
        <GlareHover>
          <Link to={`/projects/${site.project_id}/map`} className="btn">Back to Map</Link>
        </GlareHover>
      </div>

      <div className="card flex-row site-detail-stats" style={{ justifyContent: 'space-around', marginBottom: '32px', padding: '32px' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <p style={{ color: 'var(--color-text-muted)', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>Total Area</p>
          <h3 style={{ margin: 0, fontSize: '32px', color: 'var(--color-primary)' }}>
            {site.area_hectares.toFixed(2)} <span style={{fontSize: '16px', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>ha</span>
          </h3>
        </div>
        <div className="site-detail-divider" style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch' }}></div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <p style={{ color: 'var(--color-text-muted)', margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>Carbon Estimate</p>
          <h3 style={{ margin: 0, fontSize: '32px', color: 'var(--color-health-green)' }}>
            {site.carbon_estimate_tons.toFixed(2)} <span style={{fontSize: '16px', color: 'var(--color-text-muted)', fontWeight: 'normal'}}>tons</span>
          </h3>
        </div>
      </div>

      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ marginTop: 0, color: 'var(--color-primary)' }}>Analytics Trends</h3>
        <div style={{ position: 'relative', height: '400px', width: '100%' }}>
          <SiteChart analytics={analytics} />
        </div>
      </div>
    </div>
  );
}
