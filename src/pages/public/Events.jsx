// Events.jsx — Calendrier + Recherche + CTA inscription visiteurs
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createEvenement, inscrireEvenement, listEvenements } from "../../api/events";
import { AuthContext } from "../../contexts/AuthContext";

const PINK = "#e91e63";
const PINK_DARK = "#c2185b";
const PINK_LIGHT = "#FCE4EC";

const EVENT_TYPE_OPTIONS = [
  { value: "RENDEZ_VOUS_MEDICAL", label: "Rendez-vous médical" },
  { value: "TRAITEMENT", label: "Traitement" },
  { value: "ACTION_SOLIDAIRE", label: "Solidarité" },
  { value: "REUNION_ASSOCIATION", label: "Réunion association" },
  { value: "RAPPEL", label: "Rappel" },
];

const EVENT_TYPE_LABEL_MAP = Object.fromEntries(
  EVENT_TYPE_OPTIONS.map((opt) => [opt.value, opt.label])
);

// ─── Mini Calendar Component ─────────────────────────────────────────────────
function MiniCalendar({ events, selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const startOffset = firstDay === 0 ? 6 : firstDay - 1; // Mon-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map event dates to day numbers for highlighting
  const eventDays = new Set(
    events
      .filter((e) => {
        const d = new Date(e.date || e.dateDebut || e.createdAt);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .map((e) => new Date(e.date || e.dateDebut || e.createdAt).getDate())
  );

  const weeks = [];
  let cells = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const today = new Date();
  const isToday = (d) => d && today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
  const isSelected = (d) => {
    if (!d || !selectedDate) return false;
    return selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #FCE4EC", overflow: "hidden", boxShadow: "0 4px 20px rgba(233,30,99,0.08)" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        >‹</button>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, textTransform: "capitalize" }}>{monthName}</span>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, width: 30, height: 30, color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        >›</button>
      </div>

      {/* Day labels */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "10px 10px 4px", gap: 2 }}>
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#9CA3AF", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Weeks */}
      <div style={{ padding: "0 10px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
            {week.map((d, di) => (
              <button
                key={di}
                onClick={() => d && onSelectDate(new Date(year, month, d))}
                disabled={!d}
                style={{
                  height: 32, borderRadius: 8, border: "none",
                  background: isSelected(d) ? PINK : isToday(d) ? PINK_LIGHT : "transparent",
                  color: isSelected(d) ? "#fff" : isToday(d) ? PINK_DARK : d ? "#374151" : "transparent",
                  cursor: d ? "pointer" : "default",
                  fontSize: 12.5,
                  fontWeight: isToday(d) || isSelected(d) ? 700 : 400,
                  position: "relative",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { if (d && !isSelected(d)) e.currentTarget.style.background = PINK_LIGHT; }}
                onMouseLeave={(e) => { if (d && !isSelected(d)) e.currentTarget.style.background = "transparent"; }}
              >
                {d}
                {d && eventDays.has(d) && (
                  <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isSelected(d) ? "#fff" : PINK }} />
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ padding: "8px 14px 12px", borderTop: "1px solid #f5f5f5", display: "flex", gap: 14, fontSize: 10.5, color: "#9CA3AF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, display: "inline-block" }} />
          Événement planifié
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 16, height: 16, borderRadius: 4, background: PINK_LIGHT, display: "inline-block" }} />
          Aujourd'hui
        </div>
      </div>
    </div>
  );
}

// ─── Visitor CTA Banner ───────────────────────────────────────────────────────
function VisitorCTA({ navigate, isLoggedIn }) {
  if (isLoggedIn) return null;
  return (
    <div style={{
      background: `linear-gradient(135deg, ${PINK} 0%, ${PINK_DARK} 100%)`,
      borderRadius: 20,
      padding: "32px 36px",
      margin: "0 0 36px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 24,
      flexWrap: "wrap",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(233,30,99,0.3)",
    }}>
      {/* Decorative */}
      <div style={{ position: "absolute", right: -30, top: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
      <div style={{ position: "absolute", right: 60, bottom: -40, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 28 }}>🌸</span>
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600, background: "rgba(255,255,255,0.15)", padding: "3px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)" }}>
            REJOINDRE LA COMMUNAUTÉ
          </span>
        </div>
        <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
          Participez aux événements Courage Rose
        </h3>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: 0, maxWidth: 420, lineHeight: 1.6 }}>
          Créez votre compte pour vous inscrire aux événements, recevoir des rappels,
          et rejoindre notre réseau de solidarité pour les femmes atteintes du cancer du sein.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 1, flexShrink: 0 }}>
        <button
          onClick={() => navigate("/login")}
          style={{ padding: "12px 22px", borderRadius: 12, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.5)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", backdropFilter: "blur(10px)", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.28)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
        >
          Se connecter
        </button>
        <button
          onClick={() => navigate("/inscription")}
          style={{ padding: "12px 22px", borderRadius: 12, background: "#fff", border: "none", color: PINK_DARK, fontWeight: 800, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"; }}
        >
          Créer un compte ✨
        </button>
      </div>
    </div>
  );
}

// ─── Main Events Page ─────────────────────────────────────────────────────────
export default function Events() {
  const navigate = useNavigate();
  const { token, user } = useContext(AuthContext);
  const isLoggedIn = !!token;

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "calendar"

  // ── Real API data
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [inscriptionLoadingId, setInscriptionLoadingId] = useState("");
  const [inscriptionMessage, setInscriptionMessage] = useState("");
  const [createForm, setCreateForm] = useState({
    titre: "",
    description: "",
    lieu: "",
    type: "ACTION_SOLIDAIRE",
    dateDebut: "",
    dateFin: "",
  });

  const getEventDateValue = useCallback(
    (event) => event?.date || event?.dateDebut || event?.createdAt,
    []
  );

  const fetchEvents = useCallback(async (query = "") => {
    try {
      setLoadingEvents(true);
      setError(null);
      const res = await listEvenements(query);
      // Support both { data: [...] } and { data: { evenements: [...] } }
      const data = res?.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.evenements)
        ? data.evenements
        : Array.isArray(data?.data)
        ? data.data
        : [];
      setEvents(list);
    } catch (err) {
      setError("Impossible de charger les événements. Veuillez réessayer.");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const categorieColors = {
    Sensibilisation: { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
    "Bien-être": { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    Médical: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    Solidarité: { bg: PINK_LIGHT, color: PINK, border: "#F48FB1" },
    Formation: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" },
    Famille: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    RENDEZ_VOUS_MEDICAL: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
    TRAITEMENT: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    ACTION_SOLIDAIRE: { bg: PINK_LIGHT, color: PINK, border: "#F48FB1" },
    REUNION_ASSOCIATION: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
    RAPPEL: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" },
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    // Also pass search term to the API (backend search)
    fetchEvents(searchInput);
  };

  const handleCreateFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.titre || !createForm.type || !createForm.dateDebut || !createForm.dateFin) {
      setCreateError("Veuillez remplir les champs obligatoires.");
      return;
    }

    if (new Date(createForm.dateFin) < new Date(createForm.dateDebut)) {
      setCreateError("La date de fin doit être après la date de début.");
      return;
    }

    try {
      setCreating(true);
      await createEvenement(createForm);
      setShowCreateForm(false);
      setCreateForm({
        titre: "",
        description: "",
        lieu: "",
        type: "ACTION_SOLIDAIRE",
        dateDebut: "",
        dateFin: "",
      });
      await fetchEvents(searchQuery);
    } catch (err) {
      setCreateError(err?.response?.data?.message || "Impossible de créer l'événement.");
    } finally {
      setCreating(false);
    }
  };

  const handleInscription = async (eventId) => {
    if (!eventId) return;
    setInscriptionMessage("");

    try {
      setInscriptionLoadingId(eventId);
      const res = await inscrireEvenement(eventId);
      setInscriptionMessage(
        res?.data?.message || "Inscription à l'événement réussie."
      );
      await fetchEvents(searchQuery);
    } catch (err) {
      setInscriptionMessage(
        err?.response?.data?.message ||
          "Impossible de vous inscrire à cet événement."
      );
    } finally {
      setInscriptionLoadingId("");
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchSearch = !searchQuery ||
      e.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lieu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.categorie?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDate = !selectedDate || (() => {
      const ed = new Date(getEventDateValue(e));
      return ed.getFullYear() === selectedDate.getFullYear() &&
        ed.getMonth() === selectedDate.getMonth() &&
        ed.getDate() === selectedDate.getDate();
    })();

    return matchSearch && matchDate;
  });

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  };

  const getDayNumber = (dateStr) => new Date(dateStr).getDate();
  const getMonthShort = (dateStr) => new Date(dateStr).toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#FFF5F7" }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${PINK} 0%, #9C1843 100%)`,
        padding: "50px 40px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 800, margin: "0 0 10px" }}>
            🎪 Événements
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, margin: "0 0 28px" }}>
            Participez à nos actions solidaires, conférences et ateliers bien-être
          </p>

          {/* Search bar */}
          <div style={{ display: "flex", gap: 10, maxWidth: 560 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.7 }}>🔍</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Rechercher par titre, lieu, catégorie..."
                style={{
                  width: "100%", padding: "13px 16px 13px 44px", borderRadius: 12,
                  border: "1.5px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.18)",
                  color: "#fff", fontSize: 14, outline: "none", backdropFilter: "blur(10px)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{
                padding: "13px 24px", borderRadius: 12, background: "#fff", border: "none",
                color: PINK_DARK, fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)", transition: "all 0.2s", flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Rechercher
            </button>
            {(searchQuery || selectedDate) && (
              <button
                onClick={() => { setSearchQuery(""); setSearchInput(""); setSelectedDate(null); fetchEvents(""); }}
                style={{ padding: "13px 18px", borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", fontSize: 13 }}
              >
                ✕ Réinitialiser
              </button>
            )}
          </div>

          {isLoggedIn && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-start" }}>
              <button
                onClick={() => {
                  setShowCreateForm((prev) => !prev);
                  setCreateError("");
                }}
                style={{
                  padding: "11px 18px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.2)",
                  border: "1.5px solid rgba(255,255,255,0.45)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {showCreateForm ? "Fermer le formulaire" : "+ Écrire un événement"}
              </button>
            </div>
          )}

          {isLoggedIn && showCreateForm && (
            <form
              onSubmit={handleCreateEvent}
              style={{
                marginTop: 14,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 14,
                padding: 14,
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
              }}
            >
              <input
                value={createForm.titre}
                onChange={(ev) => handleCreateFormChange("titre", ev.target.value)}
                placeholder="Titre *"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13 }}
              />
              <input
                value={createForm.lieu}
                onChange={(ev) => handleCreateFormChange("lieu", ev.target.value)}
                placeholder="Lieu"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13 }}
              />
              <select
                value={createForm.type}
                onChange={(ev) => handleCreateFormChange("type", ev.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13 }}
              >
                {EVENT_TYPE_OPTIONS.map((typeOpt) => (
                  <option key={typeOpt.value} value={typeOpt.value}>{typeOpt.label}</option>
                ))}
              </select>
              <input
                type="datetime-local"
                value={createForm.dateDebut}
                onChange={(ev) => handleCreateFormChange("dateDebut", ev.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13 }}
              />
              <input
                type="datetime-local"
                value={createForm.dateFin}
                onChange={(ev) => handleCreateFormChange("dateFin", ev.target.value)}
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13 }}
              />
              <input
                value={createForm.description}
                onChange={(ev) => handleCreateFormChange("description", ev.target.value)}
                placeholder="Description"
                style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.95)", fontSize: 13, gridColumn: "1 / -1" }}
              />

              {createError && (
                <div style={{ color: "#FECACA", fontWeight: 700, fontSize: 12, gridColumn: "1 / -1" }}>
                  {createError}
                </div>
              )}

              <button
                type="submit"
                disabled={creating}
                style={{
                  gridColumn: "1 / -1",
                  padding: "11px 16px",
                  borderRadius: 10,
                  background: "#fff",
                  border: "none",
                  color: PINK_DARK,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: creating ? "not-allowed" : "pointer",
                  opacity: creating ? 0.7 : 1,
                }}
              >
                {creating ? "Création..." : "Publier l'événement"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 20px" }}>
        {/* Visitor CTA */}
        <VisitorCTA navigate={navigate} isLoggedIn={isLoggedIn} />

        {/* Main content: calendar sidebar + events grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24, alignItems: "start" }}>

          {/* Events list/grid */}
          <div>
            {/* Results header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 16 }}>
                  {filteredEvents.length} événement{filteredEvents.length > 1 ? "s" : ""}
                  {selectedDate && ` · ${selectedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`}
                  {searchQuery && ` · "${searchQuery}"`}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {["grid", "list"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={{
                      padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${viewMode === mode ? PINK : "#E5E7EB"}`,
                      background: viewMode === mode ? PINK_LIGHT : "#fff", color: viewMode === mode ? PINK_DARK : "#6B7280",
                      cursor: "pointer", fontSize: 13, fontWeight: 600,
                    }}
                  >
                    {mode === "grid" ? "⊞ Grille" : "☰ Liste"}
                  </button>
                ))}
              </div>
            </div>

            {inscriptionMessage && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #FBCFE8",
                  background: "#FFF1F7",
                  color: PINK_DARK,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {inscriptionMessage}
              </div>
            )}

            {loadingEvents ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1.5px solid #F5E7EC" }}>
                <div style={{ fontSize: 36, marginBottom: 12, display: "inline-block", animation: "spin 1.2s linear infinite" }}>🌸</div>
                <p style={{ color: "#94A3B8", fontSize: 14 }}>Chargement des événements...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#FFF5F5", borderRadius: 16, border: "1.5px solid #FECACA" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
                <p style={{ color: "#EF4444", fontSize: 14, marginBottom: 12 }}>{error}</p>
                <button
                  onClick={() => fetchEvents()}
                  style={{ padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${PINK}`, background: "transparent", color: PINK, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                >
                  Réessayer
                </button>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: 16, border: "1.5px solid #F5E7EC" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
                <p style={{ color: "#94A3B8", fontSize: 15 }}>Aucun événement trouvé</p>
                <button onClick={() => { setSearchQuery(""); setSearchInput(""); setSelectedDate(null); fetchEvents(""); }} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 8, border: `1.5px solid ${PINK}`, background: "transparent", color: PINK, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Voir tous les événements
                </button>
              </div>
            ) : (
              <div
                style={
                  viewMode === "grid"
                    ? {
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 16,
                      }
                    : { display: "flex", flexDirection: "column", gap: 16 }
                }
              >
                {filteredEvents.map((event) => {
                  const categoryKey = event.categorie || event.type || "Solidarité";
                  const catStyle = categorieColors[categoryKey] || categorieColors["Solidarité"];
                  const categoryLabel = EVENT_TYPE_LABEL_MAP[categoryKey] || categoryKey;
                  const eventDate = getEventDateValue(event);
                  const eventId = event._id || event.id;
                  const isGrid = viewMode === "grid";
                  const isAlreadyRegistered = Boolean(
                    event.participants?.some((participantId) => {
                      const currentUserId = user?._id || user?.id;
                      if (!currentUserId) return false;
                      return participantId?.toString() === currentUserId.toString();
                    })
                  );
                  const isRegistering = inscriptionLoadingId === eventId;
                  return (
                    <div
                      key={eventId || `${event.titre}-${eventDate}`}
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: "1.5px solid #FCE4EC",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: isGrid ? "column" : "row",
                        gap: 0,
                        boxShadow: "0 3px 14px rgba(233,30,99,0.07)",
                        transition: "all 0.25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = viewMode === "grid" ? "translateY(-3px)" : "translateX(4px)";
                        e.currentTarget.style.boxShadow = "0 6px 24px rgba(233,30,99,0.14)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = viewMode === "grid" ? "translateY(0)" : "translateX(0)";
                        e.currentTarget.style.boxShadow = "0 3px 14px rgba(233,30,99,0.07)";
                      }}
                    >
                      {/* Date badge */}
                      <div
                        style={{
                          background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
                          minWidth: isGrid ? "100%" : 72,
                          width: isGrid ? "100%" : "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: isGrid ? "12px 10px" : "16px 10px",
                        }}
                      >
                        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>{getMonthShort(eventDate)}</span>
                        <span style={{ color: "#fff", fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{getDayNumber(eventDate)}</span>
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1E293B", lineHeight: 1.3 }}>{event.titre}</h3>
                          <span style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}`, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>
                            {categoryLabel}
                          </span>
                        </div>
                        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{event.description}</p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", gap: 14 }}>
                            <span style={{ color: "#94A3B8", fontSize: 12 }}>📅 {formatDate(eventDate)}</span>
                            {event.lieu && <span style={{ color: "#94A3B8", fontSize: 12 }}>📍 {event.lieu}</span>}
                          </div>
                          {isLoggedIn ? (
                            <button
                              onClick={() => handleInscription(eventId)}
                              disabled={!eventId || isAlreadyRegistered || isRegistering}
                              style={{
                                padding: "6px 16px",
                                borderRadius: 8,
                                background: isAlreadyRegistered ? "#CBD5E1" : PINK,
                                border: "none",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: 12,
                                cursor: !eventId || isAlreadyRegistered || isRegistering ? "not-allowed" : "pointer",
                                opacity: isRegistering ? 0.8 : 1,
                              }}
                            >
                              {isAlreadyRegistered ? "Déjà inscrit" : isRegistering ? "Inscription..." : "S'inscrire"}
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate("/inscription")}
                              style={{ padding: "6px 16px", borderRadius: 8, background: PINK_LIGHT, border: `1px solid ${PINK}50`, color: PINK_DARK, fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                            >
                              Créer un compte pour participer →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar: Calendar */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>📅 Calendrier</span>
              {selectedDate && (
                <button onClick={() => setSelectedDate(null)} style={{ background: "none", border: "none", color: PINK, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  Tout afficher
                </button>
              )}
            </div>
            <MiniCalendar events={events} selectedDate={selectedDate} onSelectDate={setSelectedDate} />

            {/* Stats */}
            <div style={{ marginTop: 16, background: "#fff", borderRadius: 14, padding: 18, border: "1.5px solid #FCE4EC" }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: "#1E293B" }}>📊 Ce mois-ci</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Événements prévus", value: events.length, color: PINK },
                  { label: "Catégories", value: new Set(events.map((e) => e.categorie || e.type).filter(Boolean)).size, color: "#7C3AED" },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{s.label}</span>
                    <span style={{ fontWeight: 800, color: s.color, fontSize: 18 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
