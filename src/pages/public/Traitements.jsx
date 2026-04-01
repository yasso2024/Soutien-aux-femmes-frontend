// Traitements.jsx — Nouvelle palette : teal/bleu médical + blanc
import React, { useState } from "react";

const TEAL = "#0D9488";
const TEAL_DARK = "#0F766E";
const TEAL_LIGHT = "#CCFBF1";
const TEAL_MID = "#14B8A6";
const BLUE = "#0EA5E9";
const INDIGO = "#6366F1";

const traitements = [
  {
    id: 1,
    categorie: "Chirurgie",
    icon: "🏥",
    color: TEAL,
    bg: "#F0FDFA",
    border: "#99F6E4",
    items: [
      {
        titre: "Tumorectomie",
        description:
          "Ablation partielle du sein : seule la tumeur et une marge de tissu sain sont retirées. Préserve l'essentiel du sein.",
        duree: "1–2h",
        hospitalisation: "1–2 jours",
        details: [
          "Conserve la forme du sein",
          "Souvent suivie de radiothérapie",
          "Recommandée pour tumeurs < 3 cm",
          "Cicatrice discrète",
        ],
      },
      {
        titre: "Mastectomie",
        description:
          "Ablation totale du sein. Peut être simple (un sein) ou bilatérale. La reconstruction mammaire est possible après.",
        duree: "2–4h",
        hospitalisation: "2–5 jours",
        details: [
          "Option si tumeur large ou multifocale",
          "Reconstruction possible immédiate ou différée",
          "Mastectomie prophylactique pour haut risque génétique",
          "Résultats oncologiques excellents",
        ],
      },
      {
        titre: "Curage ganglionnaire",
        description:
          "Prélèvement des ganglions lymphatiques axillaires pour évaluer la propagation du cancer.",
        duree: "30–60 min",
        hospitalisation: "1 jour",
        details: [
          "Réalisé souvent avec la chirurgie principale",
          "Ganglion sentinelle : technique moins invasive",
          "Important pour le staging",
          "Risque de lymphœdème si curage complet",
        ],
      },
    ],
  },
  {
    id: 2,
    categorie: "Chimiothérapie",
    icon: "💊",
    color: BLUE,
    bg: "#F0F9FF",
    border: "#BAE6FD",
    items: [
      {
        titre: "Chimiothérapie néoadjuvante",
        description:
          "Administrée avant la chirurgie pour réduire la taille de la tumeur et améliorer les chances de chirurgie conservatrice.",
        duree: "3–6 mois",
        hospitalisation: "Ambulatoire",
        details: [
          "Évalue la réponse tumorale",
          "Peut rendre opérable une tumeur non résécable",
          "Protocoles AC-T, FEC-D fréquents",
          "Suivi par imagerie régulier",
        ],
      },
      {
        titre: "Chimiothérapie adjuvante",
        description:
          "Administrée après la chirurgie pour éliminer les cellules cancéreuses résiduelles microscopiques.",
        duree: "3–6 mois",
        hospitalisation: "Ambulatoire",
        details: [
          "Réduit le risque de récidive",
          "Basée sur le profil moléculaire de la tumeur",
          "Effets secondaires gérables",
          "Port-à-cath facilite les perfusions",
        ],
      },
    ],
  },
  {
    id: 3,
    categorie: "Radiothérapie",
    icon: "⚡",
    color: INDIGO,
    bg: "#F5F3FF",
    border: "#C4B5FD",
    items: [
      {
        titre: "Radiothérapie externe",
        description:
          "Utilise des rayons X de haute énergie ciblés sur la zone opérée pour détruire les cellules résiduelles.",
        duree: "3–6 semaines",
        hospitalisation: "Ambulatoire",
        details: [
          "5 séances/semaine en général",
          "Indolore pendant la séance",
          "Fatigue progressive au fil des séances",
          "Protège la peau avec crèmes adaptées",
        ],
      },
      {
        titre: "Curiethérapie",
        description:
          "Source radioactive placée directement dans ou près de la tumeur. Traitement plus court et ciblé.",
        duree: "1–5 jours",
        hospitalisation: "Variable",
        details: [
          "Dose concentrée sur la tumeur",
          "Moins d'irradiation des tissus sains",
          "Technique à haut débit de dose (HDR)",
          "Suivi rapproché nécessaire",
        ],
      },
    ],
  },
  {
    id: 4,
    categorie: "Thérapies ciblées & Hormonothérapie",
    icon: "🔬",
    color: "#D97706",
    bg: "#FFFBEB",
    border: "#FDE68A",
    items: [
      {
        titre: "Hormonothérapie",
        description:
          "Bloque les hormones (œstrogènes) qui stimulent la croissance des tumeurs hormonosensibles (ER+).",
        duree: "5–10 ans",
        hospitalisation: "Ambulatoire",
        details: [
          "Tamoxifène ou inhibiteurs d'aromatase",
          "Efficace pour cancers ER+/PR+",
          "Comprimés quotidiens",
          "Réduit le risque de récidive de 40–50%",
        ],
      },
      {
        titre: "Thérapie ciblée HER2",
        description:
          "Médicaments spécifiques (Trastuzumab/Herceptin) ciblant les cellules HER2+ avec haute précision.",
        duree: "12 mois",
        hospitalisation: "Ambulatoire",
        details: [
          "Pour tumeurs HER2 positives",
          "Perfusions IV toutes les 3 semaines",
          "Survie significativement améliorée",
          "Moins d'effets secondaires que la chimio",
        ],
      },
      {
        titre: "Immunothérapie",
        description:
          "Stimule le système immunitaire pour reconnaître et attaquer les cellules cancéreuses.",
        duree: "Variable",
        hospitalisation: "Ambulatoire",
        details: [
          "Pembrolizumab pour triple négatif",
          "Associée à la chimiothérapie",
          "Effets immunologiques à surveiller",
          "Avancée majeure pour cancers agressifs",
        ],
      },
    ],
  },
];

const soutiens = [
  { icon: "🧠", titre: "Soutien psychologique", desc: "Accompagnement thérapeutique individuel ou en groupe pour traverser l'épreuve avec sérénité." },
  { icon: "🥗", titre: "Nutrition adaptée", desc: "Conseils diététiques pour maintenir la force et réduire les effets secondaires des traitements." },
  { icon: "🏃‍♀️", titre: "Activité physique adaptée", desc: "Programme d'exercices doux pour maintenir la mobilité, réduire la fatigue et améliorer le moral." },
  { icon: "💆‍♀️", titre: "Soins de support", desc: "Gestion de la douleur, nausées, fatigue : des équipes dédiées pour votre confort quotidien." },
];

export default function Traitements() {
  const [activeCategorie, setActiveCategorie] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = traitements
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          item.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const visibleCategories = filtered.filter(
    (cat) => activeCategorie === null || cat.id === activeCategorie
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", minHeight: "100vh", background: "#F8FFFE" }}>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(135deg, ${TEAL_DARK} 0%, ${TEAL} 50%, ${TEAL_MID} 100%)`,
          padding: "60px 40px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -20, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 16px", border: "1px solid rgba(255,255,255,0.2)" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>GUIDE MÉDICAL</span>
            </div>
          </div>
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2 }}>
            Traitements du<br />cancer du sein
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, maxWidth: 560, margin: "0 0 32px", lineHeight: 1.7 }}>
            Un guide complet et accessible pour comprendre les différentes approches thérapeutiques,
            du diagnostic à la guérison.
          </p>

          {/* Search */}
          <div style={{ display: "flex", gap: 10, maxWidth: 480 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.6 }}>🔍</span>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un traitement..."
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 42px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  backdropFilter: "blur(10px)",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                style={{ padding: "12px 18px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: 13 }}
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2F8F5", padding: "16px 40px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 2px 12px rgba(13,148,136,0.08)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => setActiveCategorie(null)}
            style={{
              padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${activeCategorie === null ? TEAL : "#E5E7EB"}`,
              background: activeCategorie === null ? TEAL : "#fff", color: activeCategorie === null ? "#fff" : "#6B7280",
              cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            }}
          >
            Tous
          </button>
          {traitements.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategorie(activeCategorie === cat.id ? null : cat.id)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${activeCategorie === cat.id ? cat.color : "#E5E7EB"}`,
                background: activeCategorie === cat.id ? cat.color : "#fff", color: activeCategorie === cat.id ? "#fff" : "#6B7280",
                cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              {cat.icon} {cat.categorie}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        {visibleCategories.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 48 }}>
              {/* Category Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: cat.bg, border: `2px solid ${cat.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {cat.icon}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1E293B" }}>{cat.categorie}</h2>
                  <div style={{ width: 40, height: 3, background: cat.color, borderRadius: 2, marginTop: 6 }} />
                </div>
              </div>

              {/* Treatment Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {cat.items.map((item) => {
                  const key = `${cat.id}-${item.titre}`;
                  const isExpanded = expandedItem === key;
                  return (
                    <div
                      key={key}
                      style={{
                        background: "#fff",
                        borderRadius: 16,
                        border: `1.5px solid ${isExpanded ? cat.color : cat.border}`,
                        overflow: "hidden",
                        boxShadow: isExpanded ? `0 8px 28px ${cat.color}22` : "0 2px 10px rgba(0,0,0,0.05)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div style={{ padding: 20 }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#1E293B" }}>{item.titre}</h3>
                        <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#64748B", lineHeight: 1.6 }}>{item.description}</p>

                        {/* Duration badges */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                          <span style={{ background: cat.bg, color: cat.color, padding: "3px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, border: `1px solid ${cat.border}` }}>
                            ⏱ {item.duree}
                          </span>
                          <span style={{ background: "#F8FAFC", color: "#475569", padding: "3px 10px", borderRadius: 8, fontSize: 11.5, fontWeight: 600, border: "1px solid #E2E8F0" }}>
                            🏥 {item.hospitalisation}
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedItem(isExpanded ? null : key)}
                          style={{
                            background: isExpanded ? cat.color : "transparent",
                            border: `1.5px solid ${cat.color}`,
                            color: isExpanded ? "#fff" : cat.color,
                            padding: "7px 14px",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontSize: 12.5,
                            fontWeight: 600,
                            transition: "all 0.2s",
                            width: "100%",
                          }}
                        >
                          {isExpanded ? "Masquer les détails ▲" : "Voir les détails ▼"}
                        </button>

                        {isExpanded && (
                          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${cat.border}` }}>
                            <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: 0.5 }}>Points clés</p>
                            {item.details.map((d, i) => (
                              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                                <span style={{ color: cat.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                                <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{d}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {visibleCategories.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <p style={{ fontSize: 16 }}>
              {searchTerm
                ? `Aucun traitement trouvé pour « ${searchTerm} »`
                : "Aucun traitement disponible pour cette catégorie."}
            </p>
          </div>
        )}

        {/* Support Section */}
        <div style={{ marginTop: 60, padding: 32, background: `linear-gradient(135deg, ${TEAL_LIGHT} 0%, #EFF6FF 100%)`, borderRadius: 20, border: `1px solid ${TEAL_MID}30` }}>
          <h2 style={{ textAlign: "center", color: TEAL_DARK, marginBottom: 8, fontSize: 24, fontWeight: 800 }}>
            Soins complémentaires
          </h2>
          <p style={{ textAlign: "center", color: "#475569", marginBottom: 28, fontSize: 14 }}>
            Au-delà des traitements médicaux, prendre soin de vous dans votre globalité
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {soutiens.map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 20, textAlign: "center", boxShadow: "0 2px 12px rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.1)" }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>{s.icon}</div>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{s.titre}</h4>
                <p style={{ margin: 0, fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
