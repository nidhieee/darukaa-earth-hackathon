import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjects } from "../api/projects";
import { createSite, updateSite, deleteSite } from "../api/sites";
import MapView from "../components/map/ProjectMapView";
import HealthBadge from "../components/shared/HealthBadge";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import GlareHover from "../components/GlareHover";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import NameSiteModal from "../components/shared/NameSiteModal";
import ActionMenu from "../components/shared/ActionMenu";
import EditModal from "../components/shared/EditModal";
import ConfirmDeleteModal from "../components/shared/ConfirmDeleteModal";

export default function ProjectMap() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingSiteGeojson, setPendingSiteGeojson] = useState(null);
  const [editingSite, setEditingSite] = useState(null);
  const [deletingSite, setDeletingSite] = useState(null);
  const [error, setError] = useState(null);

  const loadProject = async () => {
    try {
      setError(null);
      const projects = await getProjects();
      const proj = projects.find((p) => p.id === id);
      setProject(proj);
    } catch (err) {
      console.error(err);
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError(
          "Can't reach the server. Please check your connection or try again shortly.",
        );
      } else {
        setError("Failed to load project map.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const handleSiteDrawn = async (geojson) => {
    setPendingSiteGeojson(geojson);
  };

  const handleSaveSite = async ({ name, description }) => {
    try {
      await createSite(id, { name, description, geom: pendingSiteGeojson });
      setPendingSiteGeojson(null);
      toast.success("Site created successfully");
      loadProject();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create site");
    }
  };

  const handleEditSave = async (data) => {
    try {
      await updateSite(editingSite.id, data);
      toast.success("Site updated");
      setEditingSite(null);
      loadProject();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update site");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSite(deletingSite.id);
      toast.success("Site deleted");
      setDeletingSite(null);
      loadProject();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete site");
    }
  };

  if (loading)
    return (
      <div className="main-content">
        <LoadingSpinner text="Loading map..." />
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
        <button className="btn" onClick={loadProject}>
          Retry
        </button>
      </div>
    );
  }

  if (!project) return <div className="main-content">Project not found.</div>;

  return (
    <div
      className="main-content"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div
        className="page-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "var(--color-primary)",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              padding: 0,
              flexShrink: 0,
            }}
            className="back-btn"
          >
            <ArrowLeft size={20} className="back-icon" />
          </button>
          <div>
            <h2 style={{ color: "var(--color-primary)", margin: "0 0 8px 0" }}>
              {project.name}
            </h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              Use the polygon tool on the map to draw new sites.
            </p>
          </div>
        </div>
      </div>

      <div
        className="project-map-layout"
        style={{ display: "flex", gap: "24px", flex: 1, minHeight: 0 }}
      >
        <div
          style={{
            flex: "0 0 70%",
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              flex: 1,
              borderRadius: "var(--radius)",
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <MapView sites={project.sites} onSiteDrawn={handleSiteDrawn} />
          </div>
        </div>

        <div
          style={{ flex: "0 0 30%", overflowY: "auto", paddingRight: "4px" }}
        >
          <h3 style={{ marginTop: 0, color: "var(--color-primary)" }}>
            Sites ({project.sites?.length || 0})
          </h3>

          {!project.sites || project.sites.length === 0 ? (
            <p style={{ color: "var(--color-text-muted)" }}>
              No sites exist yet. Draw one on the map.
            </p>
          ) : (
            project.sites.map((site, index) => (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                key={site.id}
                className="card"
                style={{
                  cursor: "pointer",
                  padding: "16px",
                  marginBottom: "16px",
                  position: "relative",
                }}
                onClick={() => navigate(`/sites/${site.id}`)}
                whileHover={{
                  scale: 1.01,
                  boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ActionMenu
                  onEdit={() => setEditingSite(site)}
                  onDelete={() => setDeletingSite(site)}
                />
                <div
                  className="flex-row"
                  style={{
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    paddingRight: "24px",
                  }}
                >
                  <h4 style={{ margin: 0, color: "var(--color-primary)" }}>
                    {site.name}
                  </h4>
                  <HealthBadge score={site.health_score} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <span>
                    Area: <strong>{site.area_hectares.toFixed(2)} ha</strong>
                  </span>
                  <span>
                    Carbon:{" "}
                    <strong>{site.carbon_estimate_tons.toFixed(2)} t</strong>
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {pendingSiteGeojson && (
        <NameSiteModal
          onSave={handleSaveSite}
          onCancel={() => setPendingSiteGeojson(null)}
        />
      )}

      {editingSite && (
        <EditModal
          title="Edit Site"
          initialName={editingSite.name}
          initialDescription={editingSite.description}
          onSave={handleEditSave}
          onCancel={() => setEditingSite(null)}
        />
      )}

      {deletingSite && (
        <ConfirmDeleteModal
          itemName={deletingSite.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingSite(null)}
        />
      )}
    </div>
  );
}
