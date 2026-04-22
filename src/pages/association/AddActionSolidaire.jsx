import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createActionSolidaire } from "../../api/actionSolidaires";

const TEAL = "#0F9488";
const TEAL_DARK = "#085041";
const TEAL_LIGHT = "#E1F5EE";

function IconArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 3L5 8l5 5" />
    </svg>
  );
}
function IconHandshake() {
  return <span style={{ fontSize: 28 }}>🤝</span>;
}

export default function AddActionSolidaire() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ titre: "", description: "", dateAction: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function validate() {
    const e = {};
    if (!form.titre.trim()) e.titre = "Le titre est obligatoire";
    else if (form.titre.trim().length < 5) e.titre = "Titre trop court (min. 5 caractères)";
    if (!form.description.trim()) e.description = "La description est obligatoire";
    else if (form.description.trim().length < 10) e.description = "Description trop courte (min. 10 caractères)";
    if (!form.dateAction) e.dateAction = "La date est obligatoire";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await createActionSolidaire(form);
      showToast(response.data?.message || "Action créée avec succès !");
      setTimeout(() => navigate("/association/actions-solidaires"), 1500);
    } catch (err) {
      showToast(err?.message || "Erreur lors de la création", false);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif", paddingBottom: 48, color: "#1a1a1a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');`}</style>

      {/* toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, right: 24, zIndex: 9999,
          background: toast.ok ? "#14532D" : "#991B1B",
          color: "#fff", borderRadius: 12, padding: "12px 20px",
          fontSize: 14, fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
        }}>
          {toast.msg}
        </div>
      )}

      {/* back button */}
      <button
        onClick={() => navigate("/association/actions-solidaires")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: TEAL,
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          padding: 0, marginBottom: 20, fontFamily: "inherit",
        }}
      >
        <IconArrowLeft /> Retour aux actions
      </button>

      {/* card */}
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        maxWidth: 640, margin: "0 auto",
      }}>
        {/* card header */}
        <div style={{
          background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          padding: "32px 32px 28px",
          display: "flex", flexDirection: "column", alignItems: "center",
          textAlign: "center", gap: 12,
          borderRadius: "20px 20px 0 0",
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconHandshake />
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Association
            </p>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Nouvelle action solidaire
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", maxWidth: 400 }}>
              Publiez une action et invitez des bénévoles à rejoindre votre cause
            </p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 32px" }}>
          {/* titre */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Titre de l'action <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.titre}
              onChange={(e) => handleChange("titre", e.target.value)}
              placeholder="Ex : Distribution de repas, collecte de vêtements…"
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.titre ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.target.style.borderColor = TEAL; }}
              onBlur={(e) => { e.target.style.borderColor = errors.titre ? "#EF4444" : "#e2e8f0"; }}
            />
            {errors.titre && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.titre}</p>
            )}
          </div>

          {/* description */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Description <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Décrivez l'objectif, le déroulement et ce que vous attendez des bénévoles…"
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.description ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                resize: "vertical", boxSizing: "border-box",
                transition: "border-color 0.15s", lineHeight: 1.6,
              }}
              onFocus={(e) => { e.target.style.borderColor = TEAL; }}
              onBlur={(e) => { e.target.style.borderColor = errors.description ? "#EF4444" : "#e2e8f0"; }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {errors.description ? (
                <p style={{ margin: 0, fontSize: 12, color: "#EF4444" }}>{errors.description}</p>
              ) : <span />}
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{form.description.length} car.</span>
            </div>
          </div>

          {/* date */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Date de l'action <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <input
              type="date"
              value={form.dateAction}
              min={today}
              onChange={(e) => handleChange("dateAction", e.target.value)}
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.dateAction ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                boxSizing: "border-box", background: "#fff",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) => { e.target.style.borderColor = TEAL; }}
              onBlur={(e) => { e.target.style.borderColor = errors.dateAction ? "#EF4444" : "#e2e8f0"; }}
            />
            {errors.dateAction && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.dateAction}</p>
            )}
          </div>

          {/* info banner */}
          <div style={{
            background: TEAL_LIGHT, borderRadius: 10,
            padding: "12px 16px", marginBottom: 24,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: 13, color: TEAL_DARK, lineHeight: 1.5 }}>
              Votre action sera soumise à validation par un administrateur avant d'être publiée aux bénévoles.
            </p>
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/association/actions-solidaires")}
              style={{
                padding: "10px 22px", borderRadius: 10,
                border: "1.5px solid #e2e8f0", background: "#fff",
                color: "#475569", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 28px", borderRadius: 10,
                background: submitting ? "#94a3b8" : TEAL,
                color: "#fff", border: "none",
                fontSize: 14, fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.15s",
              }}
            >
              {submitting ? "Création…" : "✦ Créer l'action"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}