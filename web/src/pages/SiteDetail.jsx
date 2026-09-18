import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getSite } from "../api/sites";
import HealthBadge from "../components/shared/HealthBadge";
import SiteChart from "../components/dashboard/SiteChart";
import MapView from "../components/map/MapView";
import { motion } from "framer-motion";
import GlareHover from "../components/GlareHover";
import LoadingSpinner from "../components/shared/LoadingSpinner";

export default function SiteDetail() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setError(null);
      const siteData = await getSite(id);
      console.log("[DEBUG] Fetched siteData:", siteData); // Temporary log to confirm fields
      setSite(siteData);
      setAnalytics(siteData.analytics || []);
    } catch (err) {
      console.error(err);
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError(
          "Can't reach the server. Please check your connection or try again shortly.",
        );
      } else {
        setError("Failed to load site data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="main-content">
        <LoadingSpinner text="Loading site data..." />
      </div>
    );

  if (error) {
    return (
      <div
        className="main-content"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "var(--color-primary)", marginBottom: "16px" }}>
          {error}
        </h3>
        <button className="btn" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  if (!site) return <div className="main-content">Site not found.</div>;

  return (
    <div className="main-content">
      <div
        className="flex-row site-detail-header"
        style={{ marginBottom: "32px", justifyContent: "space-between" }}
      >
        <div className="flex-row" style={{ alignItems: "center" }}>
          <h2
            style={{
              color: "var(--color-primary)",
              margin: 0,
              fontSize: "28px",
            }}
          >
            {site.name}
          </h2>
          <HealthBadge score={site.health_score} />
        </div>
        {/* BUX FIX: Using site.project_id from backend response to properly link to ProjectMap */}
        <GlareHover>
          <Link to={`/projects/${site.project_id}/map`} className="btn">
            Back to Map
          </Link>
        </GlareHover>
      </div>

      <div
        className="card flex-row site-detail-stats"
        style={{
          justifyContent: "space-around",
          marginBottom: "32px",
          padding: "32px",
        }}
      >
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px 0", color: "var(--color-text-muted)" }}>
            Area (Hectares)
          </p>
          <h3
            style={{
              margin: 0,
              fontSize: "28px",
              color: "var(--color-primary)",
            }}
          >
            {site.area_hectares?.toFixed(2)}
          </h3>
        </div>
        <div
          style={{ width: "1px", background: "#e5e7eb", alignSelf: "stretch" }}
        />
        <div style={{ flex: 1, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px 0", color: "var(--color-text-muted)" }}>
            Carbon Estimate (Tons)
          </p>
          <h3
            style={{ margin: 0, fontSize: "28px", color: "var(--color-brand)" }}
          >
            {site.carbon_estimate_tons?.toFixed(2)}
          </h3>
        </div>
      </div>

      <div
        className="site-detail-bottom"
        style={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}
      >
        <div
          className="card"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "var(--color-primary)" }}>
            Analytics Trend
          </h3>
          <div style={{ flex: 1, minHeight: "300px" }}>
            <SiteChart data={analytics} />
          </div>
        </div>
        <div
          className="card"
          style={{
            width: "400px",
            display: "flex",
            flexDirection: "column",
            padding: "16px",
          }}
        >
          <h3 style={{ margin: "0 0 16px 0", color: "var(--color-primary)" }}>
            Location
          </h3>
          <div
            style={{
              flex: 1,
              minHeight: "300px",
              borderRadius: "var(--radius)",
              overflow: "hidden",
            }}
          >
            <MapView sites={[site]} disableInteractions={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
