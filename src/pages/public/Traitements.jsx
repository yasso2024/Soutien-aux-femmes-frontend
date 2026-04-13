import React from "react";
import temoignageVideo from "../../assets/videos/temoignage.mp4.mp4";

const PINK_DARK = "#9D174D";
const PINK = "#BE185D";
const PINK_LIGHT = "#FCE7F3";
const PINK_BG = "#FFF5F8";
const SLATE = "#4A0020";
const MUTED = "#9D174D";

const SELF_CHECK_IMAGE =
  "https://csf.be/wp-content/uploads/2022/10/2022_cancerdusein.png";
const STAGES_IMAGE =
  "https://maternite.chl.lu/sites/default/files/inline-images/Capture%20d%E2%80%99e%CC%81cran%202024-04-26%20a%CC%80%2011.11.56.png";

const autoSurveillanceConseils = [
  "Faire l'auto-palpation une fois par mois, de préférence à la même période du cycle.",
  "Observer les seins devant un miroir : forme, peau, mamelon et rougeurs.",
  "Signaler rapidement toute anomalie : boule, douleur persistante, écoulement, changement de peau.",
  "Compléter l'auto-surveillance par un examen clinique et une mammographie selon l'âge.",
];

const etapesCancerSein = [
  "Étape 0 : cellules anormales localisées (in situ).",
  "Étapes I-II : tumeur localisée dans le sein, parfois ganglions proches atteints.",
  "Étape III : maladie localement avancée (sein et ganglions régionaux).",
  "Étape IV : métastases à distance, nécessitant une prise en charge systémique.",
];

const stats = [
  { numero: "1/8", label: "femmes affectées", icon: "👩" },
  { numero: "90%", label: "survie à 5 ans", icon: "✅" },
  { numero: "40K+", label: "nouveaux cas/an", icon: "📊" },
  { numero: "50+", label: "taux de guérison", icon: "💪" },
];

const buttonBaseStyle = {
  borderRadius: 12,
  padding: "14px 32px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default function Traitements() {
  return (
    <div
      style={{
        fontFamily: "'Manrope', 'Trebuchet MS', sans-serif",
        minHeight: "100vh",
        background: PINK_BG,
        padding: "40px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span
            style={{
              display: "inline-block",
              background: PINK_LIGHT,
              color: PINK_DARK,
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            💗 CANCER DU SEIN
          </span>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: 34,
              fontWeight: 800,
              color: SLATE,
            }}
          >
            Témoignage vidéo
          </h1>

          <p style={{ margin: 0, color: MUTED, fontSize: 15 }}>
            Découvrez le témoignage d'une femme atteinte du cancer du sein.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#fff",
                borderRadius: 14,
                padding: "18px 16px",
                textAlign: "center",
                border: `1.5px solid ${PINK_LIGHT}`,
                boxShadow: "0 4px 16px rgba(190,24,93,0.08)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: PINK,
                  marginBottom: 4,
                }}
              >
                {stat.numero}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748B",
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: `linear-gradient(135deg, ${PINK_DARK}, ${PINK})`,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 40,
            boxShadow: "0 10px 30px rgba(157,23,77,0.18)",
          }}
        >
          <div style={{ padding: "32px 32px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: 26 }}>💬</span>
              <div
                style={{
                  background: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: 999,
                  padding: "5px 14px",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  TÉMOIGNAGE
                </span>
              </div>
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                fontSize: 26,
                fontWeight: 800,
                color: "#fff",
              }}
            >
              Son combat, sa victoire 💗
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: 15,
                color: "rgba(255,255,255,0.85)",
                lineHeight: 1.7,
                maxWidth: 580,
              }}
            >
              Une femme partage son parcours face au cancer du sein : le
              diagnostic, les traitements, les doutes et l'espoir.
            </p>
          </div>

          <video
            controls
            aria-label="Témoignage vidéo sur le cancer du sein"
            style={{
              width: "100%",
              display: "block",
              maxHeight: 500,
              background: "#000",
            }}
          >
            <source src={temoignageVideo} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>

          <div
            style={{
              padding: "18px 32px 26px",
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {[
              "🎗️ Survivante du cancer du sein",
              "💪 Courage et espoir",
              "🏥 Parcours de soin complet",
            ].map((tag) => (
              <span
                key={tag}
                style={{ color: "rgba(255,255,255,0.82)", fontSize: 13.5 }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            border: `1px solid ${PINK_LIGHT}`,
            boxShadow: "0 8px 30px rgba(190,24,93,0.07)",
            padding: 28,
          }}
        >
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: 22,
              fontWeight: 800,
              color: SLATE,
            }}
          >
            Comment vous contrôler et les étapes du cancer du sein
          </h2>

          <p style={{ margin: "0 0 24px", color: MUTED, fontSize: 14 }}>
            Comprendre comment faire l'auto-surveillance et connaître les étapes
            de la maladie.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            <div
              style={{
                border: `1.5px solid ${PINK_LIGHT}`,
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 18px rgba(190,24,93,0.07)",
              }}
            >
              <img
                src={SELF_CHECK_IMAGE}
                alt="Illustration de l'auto-surveillance du sein"
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: "18px 18px 20px" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: PINK_LIGHT,
                    color: PINK_DARK,
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  AUTO-SURVEILLANCE
                </div>

                <h3
                  style={{
                    margin: "0 0 12px",
                    color: PINK,
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  Comment vous contrôler
                </h3>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    color: "#334155",
                    lineHeight: 1.75,
                    fontSize: 13.5,
                  }}
                >
                  {autoSurveillanceConseils.map((conseil) => (
                    <li key={conseil} style={{ marginBottom: 4 }}>
                      {conseil}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              style={{
                border: `1.5px solid ${PINK_LIGHT}`,
                borderRadius: 16,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 4px 18px rgba(190,24,93,0.07)",
              }}
            >
              <img
                src={STAGES_IMAGE}
                alt="Illustration des étapes du cancer du sein"
                style={{
                  width: "100%",
                  height: 260,
                  objectFit: "cover",
                  display: "block",
                }}
              />

              <div style={{ padding: "18px 18px 20px" }}>
                <div
                  style={{
                    display: "inline-block",
                    background: "#FFF0F6",
                    color: PINK_DARK,
                    borderRadius: 6,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  STADES DE LA MALADIE
                </div>

                <h3
                  style={{
                    margin: "0 0 12px",
                    color: PINK_DARK,
                    fontSize: 17,
                    fontWeight: 700,
                  }}
                >
                  Les étapes du cancer du sein
                </h3>

                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 18,
                    color: "#334155",
                    lineHeight: 1.75,
                    fontSize: 13.5,
                  }}
                >
                  {etapesCancerSein.map((etape) => (
                    <li key={etape} style={{ marginBottom: 4 }}>
                      {etape}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            background: `linear-gradient(135deg, ${PINK_LIGHT} 0%, #FFF0F6 100%)`,
            borderRadius: 20,
            border: `1.5px solid ${PINK}`,
            padding: 40,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: 24,
              fontWeight: 800,
              color: SLATE,
            }}
          >
            Besoin d'aide ? Consultez un professionnel 💗
          </h2>

          <p
            style={{
              margin: "0 0 28px",
              color: MUTED,
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Si vous avez des symptômes ou des préoccupations, ne tardez pas à
            consulter. La détection précoce sauve des vies.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={{
                ...buttonBaseStyle,
                background: PINK,
                color: "#fff",
                border: "none",
                boxShadow: "0 6px 20px rgba(190,24,93,0.3)",
              }}
            >
              📞 Prendre rendez-vous
            </button>

            <button
              type="button"
              style={{
                ...buttonBaseStyle,
                background: "#fff",
                color: PINK,
                border: `2px solid ${PINK}`,
              }}
            >
              📚 En savoir plus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}