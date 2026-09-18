import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { createProject } from "../api/projects";
import { createSite } from "../api/sites";
import MapView from "../components/map/MapView";
import GlareHover from "../components/GlareHover";
import NameSiteModal from "../components/shared/NameSiteModal";

export default function CreateProjectWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sites, setSites] = useState([]); // Array of { name, description, geom }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingSiteGeojson, setPendingSiteGeojson] = useState(null);

  const handleNext = () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }
    setStep(2);
  };

  const handleSiteDrawn = (geojson) => {
    setPendingSiteGeojson(geojson);
  };

  const handleSaveSite = ({ name, description }) => {
    setSites([...sites, { name, description, geom: pendingSiteGeojson }]);
    setPendingSiteGeojson(null);
    toast.success("Site added to queue");
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create project
      const project = await createProject({ name, description });

      // 2. Create sites
      for (const site of sites) {
        await createSite(project.id, {
          name: site.name,
          description: site.description,
          geom: site.geom,
        });
      }

      toast.success("Project and sites created successfully!");
      navigate(`/projects/${project.id}/map`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project and sites");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="main-content"
      style={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
        className="page-header-row"
      >
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
            Create New Project
          </h2>
          <p style={{ color: "var(--color-text-muted)", margin: 0 }}>
            {step === 1 ? "Step 1 of 2: Details" : "Step 2 of 2: Add Sites"}
          </p>
        </div>
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card"
          style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}
        >
          <div className="form-group" style={{ marginBottom: "16px" }}>
            <label>Project Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: "24px" }}>
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                minHeight: "100px",
                padding: "12px 16px",
                borderRadius: "var(--radius)",
                border: "1px solid #d1d5db",
                width: "100%",
                fontSize: "15px",
              }}
            />
          </div>
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
            <GlareHover>
              <button type="button" className="btn" onClick={handleNext}>
                Next
              </button>
            </GlareHover>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "16px",
            minHeight: "400px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ margin: 0 }}>
              Use the polygon tool to draw sites. Sites drawn: {sites.length}
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </button>
              <GlareHover>
                <button
                  type="button"
                  className="btn"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Finish"}
                </button>
              </GlareHover>
            </div>
          </div>
          <div
            className="card"
            style={{
              flex: 1,
              padding: 0,
              overflow: "hidden",
              minHeight: "500px",
            }}
          >
            <MapView
              sites={sites.map((s, i) => ({
                ...s,
                id: `temp-${i}`,
                health_score: "unknown",
              }))}
              onSiteDrawn={handleSiteDrawn}
            />
          </div>
        </motion.div>
      )}

      {pendingSiteGeojson && (
        <NameSiteModal
          onSave={handleSaveSite}
          onCancel={() => setPendingSiteGeojson(null)}
        />
      )}
    </div>
  );
}
