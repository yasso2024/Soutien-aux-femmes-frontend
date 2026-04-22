import { useNavigate } from "react-router-dom";
import { createPropositionAide } from "../../api/propositionsAide";
import { listDemandes } from "../../api/demandes";
import { useEffect, useState, useRef } from "react";

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

function _AddPropositionAide_v1() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [form, setForm] = useState({ demande: "", description: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    async function loadDemandes() {
      try {
        const response = await listDemandes();
        const all = response?.data?.demandes || [];
        setDemandes(all.filter((d) => d.statut !== "REFUSEE" && d.statut !== "TERMINEE"));
      } catch {
        setDemandes([]);
      } finally {
        setLoadingDemandes(false);
      }
    }
    loadDemandes();
  }, []);

  function validate() {
    const e = {};
    if (!form.demande) e.demande = "Veuillez sélectionner une demande";
    if (!form.description.trim()) e.description = "La description est obligatoire";
    else if (form.description.trim().length < 10) e.description = "Description trop courte (min. 10 caractères)";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await createPropositionAide(form);
      showToast(response?.data?.message || "Proposition créée avec succès !");
      setTimeout(() => navigate("/association/propositions-aide"), 1500);
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

      {/* back */}
      <button
        onClick={() => navigate("/association/propositions-aide")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: TEAL,
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          padding: 0, marginBottom: 20, fontFamily: "inherit",
        }}
      >
        <IconArrowLeft /> Retour aux propositions
      </button>

      {/* card */}
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        maxWidth: 640, margin: "0 auto",
      }}>
        {/* card header — centré */}
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
            fontSize: 28,
          }}>
            💝
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Association
            </p>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Nouvelle proposition d'aide
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", maxWidth: 400 }}>
              Proposez votre soutien à une femme dans le besoin
            </p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 32px" }}>

          {/* demande selector — native select */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Demande concernée <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              value={form.demande}
              onChange={(e) => handleChange("demande", e.target.value)}
              disabled={loadingDemandes}
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10,
                border: errors.demande ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit",
                background: "#fff", color: form.demande ? "#0f172a" : "#94a3b8",
                outline: "none", cursor: "pointer",
                boxSizing: "border-box", appearance: "auto",
              }}
              onFocus={(e) => { e.target.style.borderColor = TEAL; }}
              onBlur={(e) => { e.target.style.borderColor = errors.demande ? "#EF4444" : "#e2e8f0"; }}
            >
              <option value="" disabled>
                {loadingDemandes ? "Chargement…" : "Choisir une demande existante…"}
              </option>
              {demandes.map((d) => {
                const label = `${d.titre || d.description?.slice(0, 60) || d._id}${d.femme ? ` — ${d.femme.firstName || ""} ${d.femme.lastName || ""}`.trim() : ""}`;
                return (
                  <option key={d._id} value={d._id}>{label}</option>
                );
              })}
            </select>
            {errors.demande && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.demande}</p>
            )}
          </div>

          {/* description */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Description de votre proposition <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Décrivez comment vous pouvez aider cette personne…"
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.description ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                resize: "vertical", boxSizing: "border-box", lineHeight: 1.6,
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

          {/* info banner */}
          <div style={{
            background: TEAL_LIGHT, borderRadius: 10,
            padding: "12px 16px", marginBottom: 24,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: 13, color: TEAL_DARK, lineHeight: 1.5 }}>
              Votre proposition sera transmise à la femme concernée et examinée par un administrateur.
            </p>
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/association/propositions-aide")}
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
              {submitting ? "Envoi…" : "💝 Envoyer la proposition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddPropositionAide() {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loadingDemandes, setLoadingDemandes] = useState(true);
  const [form, setForm] = useState({ demande: "", description: "" });
  const [propositionMode, setPropositionMode] = useState("linked");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    async function loadDemandes() {
      try {
        const response = await listDemandes();
        const all = response?.data?.demandes || [];
        setDemandes(all.filter((d) => d.statut !== "REFUSEE" && d.statut !== "TERMINEE"));
      } catch {
        setDemandes([]);
      } finally {
        setLoadingDemandes(false);
      }
    }
    loadDemandes();
  }, []);

  function validate() {
    const e = {};
    if (propositionMode === "linked" && !form.demande) {
      e.demande = "Veuillez sélectionner une demande";
    }
    if (!form.description.trim()) e.description = "La description est obligatoire";
    else if (form.description.trim().length < 10) e.description = "Description trop courte (min. 10 caractères)";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const payload = {
        description: form.description.trim(),
        ...(propositionMode === "linked" && form.demande ? { demande: form.demande } : {}),
      };
      const response = await createPropositionAide(payload);
      showToast(response?.data?.message || "Proposition créée avec succès !");
      setTimeout(() => navigate("/association/propositions-aide"), 1500);
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

  // filtered demandes for dropdown
  const filteredDemandes = demandes.filter((d) => {
    const label = `${d.titre || d.description || ""} ${d.femme ? (d.femme.firstName || "") + " " + (d.femme.lastName || "") : ""}`;
    return label.toLowerCase().includes(search.toLowerCase());
  });

  const selectedDemande = demandes.find((d) => d._id === form.demande);
  const selectedLabel = selectedDemande
    ? `${selectedDemande.titre || selectedDemande.description || selectedDemande._id}${selectedDemande.femme ? ` — ${selectedDemande.femme.firstName || ""} ${selectedDemande.femme.lastName || ""}`.trim() : ""}`
    : propositionMode === "general"
      ? "Proposition générale (sans demande liée)"
      : "";

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

      {/* back */}
      <button
        onClick={() => navigate("/association/propositions-aide")}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "none", border: "none", color: TEAL,
          fontSize: 14, fontWeight: 600, cursor: "pointer",
          padding: 0, marginBottom: 20, fontFamily: "inherit",
        }}
      >
        <IconArrowLeft /> Retour aux propositions
      </button>

      {/* card */}
      <div style={{
        background: "#fff", borderRadius: 20,
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        maxWidth: 640, margin: "0 auto",
      }}>
        {/* card header — centré */}
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
            fontSize: 28,
          }}>
            💝
          </div>
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Association
            </p>
            <h1 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Nouvelle proposition d'aide
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", maxWidth: 400 }}>
              Proposez votre soutien à une femme dans le besoin
            </p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 32px" }}>

          {/* mode selector */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
              Type de proposition
            </label>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setPropositionMode("linked");
                  if (errors.demande) setErrors((prev) => ({ ...prev, demande: undefined }));
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: propositionMode === "linked" ? `1.5px solid ${TEAL}` : "1.5px solid #e2e8f0",
                  background: propositionMode === "linked" ? TEAL_LIGHT : "#fff",
                  color: propositionMode === "linked" ? TEAL_DARK : "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Liée à une demande
              </button>
              <button
                type="button"
                onClick={() => {
                  setPropositionMode("general");
                  setForm((prev) => ({ ...prev, demande: "" }));
                  setDropdownOpen(false);
                  setSearch("");
                  if (errors.demande) setErrors((prev) => ({ ...prev, demande: undefined }));
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: propositionMode === "general" ? `1.5px solid ${TEAL}` : "1.5px solid #e2e8f0",
                  background: propositionMode === "general" ? TEAL_LIGHT : "#fff",
                  color: propositionMode === "general" ? TEAL_DARK : "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Proposition générale
              </button>
            </div>
          </div>

          {/* demande selector */}
          <div style={{ marginBottom: 20, position: "relative" }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Demande concernée {propositionMode === "linked" && <span style={{ color: "#EF4444" }}>*</span>}
            </label>

            <div ref={dropdownRef} style={{ position: "relative" }}>
            {/* custom select trigger */}
            <button
              type="button"
              disabled={propositionMode === "general"}
              onClick={() => setDropdownOpen((o) => !o)}
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.demande ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                background: "#fff", textAlign: "left",
                fontSize: 14, fontFamily: "inherit", cursor: propositionMode === "general" ? "not-allowed" : "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                color: selectedLabel ? "#0f172a" : "#94a3b8",
                boxSizing: "border-box",
                opacity: propositionMode === "general" ? 0.7 : 1,
              }}
            >
              <span style={{
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
              }}>
                {selectedLabel || (propositionMode === "general" ? "Aucune demande (proposition générale)" : "Choisir une demande existante…")}
              </span>
              <span style={{ marginLeft: 8, color: "#94a3b8", transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>

            {/* dropdown */}
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
                background: "#fff", borderRadius: 12,
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                maxHeight: 260, overflow: "hidden",
                display: "flex", flexDirection: "column",
              }}>
                {/* search inside dropdown */}
                <div style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9" }}>
                  <input
                    type="text"
                    placeholder="Rechercher…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%", padding: "7px 10px",
                      borderRadius: 8, border: "1.5px solid #e2e8f0",
                      fontSize: 13, fontFamily: "inherit", outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
                <div style={{ overflowY: "auto", flex: 1 }}>
                  {loadingDemandes ? (
                    <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Chargement…</div>
                  ) : filteredDemandes.length === 0 ? (
                    <div style={{ padding: "16px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Aucune demande trouvée</div>
                  ) : filteredDemandes.map((d) => {
                    const label = `${d.titre || d.description || d._id}${d.femme ? ` — ${d.femme.firstName || ""} ${d.femme.lastName || ""}`.trim() : ""}`;
                    const active = form.demande === d._id;
                    return (
                      <button
                        key={d._id}
                        type="button"
                        onClick={() => {
                          setPropositionMode("linked");
                          handleChange("demande", d._id);
                          setDropdownOpen(false);
                          setSearch("");
                        }}
                        style={{
                          width: "100%", padding: "10px 14px",
                          textAlign: "left", background: active ? TEAL_LIGHT : "transparent",
                          border: "none", cursor: "pointer", fontFamily: "inherit",
                          fontSize: 13, color: active ? TEAL_DARK : "#0f172a",
                          fontWeight: active ? 700 : 400,
                          borderBottom: "1px solid #f8fafc",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {errors.demande && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#EF4444" }}>{errors.demande}</p>
            )}
            </div>
          </div>

          {/* description */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
              Description de votre proposition <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Décrivez comment vous pouvez aider cette personne…"
              style={{
                width: "100%", padding: "10px 14px",
                borderRadius: 10, border: errors.description ? "1.5px solid #EF4444" : "1.5px solid #e2e8f0",
                fontSize: 14, fontFamily: "inherit", outline: "none",
                resize: "vertical", boxSizing: "border-box",
                lineHeight: 1.6,
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

          {/* info banner */}
          <div style={{
            background: TEAL_LIGHT, borderRadius: 10,
            padding: "12px 16px", marginBottom: 24,
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <p style={{ margin: 0, fontSize: 13, color: TEAL_DARK, lineHeight: 1.5 }}>
              Votre proposition sera transmise à la femme concernée et examinée par un administrateur.
            </p>
          </div>

          {/* buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => navigate("/association/propositions-aide")}
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
              {submitting ? "Envoi…" : "💝 Envoyer la proposition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}