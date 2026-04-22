import React, { useState, useEffect } from "react";
import temoignageVideo from "../../assets/videos/temoignage.mp4.mp4";

/* ─── NEW DESIGN ─── */

const COL_PRUNE   = "#7C2D52";
const COL_ROSE    = "#C2185B";
const COL_CLAIR   = "#FCE4EC";
const COL_BEIGE   = "#FFF8F4";
const COL_BLANC   = "#FFFFFF";
const COL_TEXTE   = "#2D1B2E";
const COL_GRIS    = "#6B5B6E";

const CITATIONS = [
  { texte: "Tu n'as pas à être forte chaque seconde. Tu as seulement à continuer.", auteur: "Message de soutien" },
  { texte: "Ton courage ne se voit pas toujours, mais il est là, chaque jour.", auteur: "Message de soutien" },
  { texte: "Tu portes en toi une force plus grande que tes peurs.", auteur: "Message de soutien" },
  { texte: "Même dans les jours difficiles, tu restes une femme de valeur et de lumière.", auteur: "Message de soutien" },
  { texte: "Ton corps traverse une bataille, mais ton âme reste magnifique.", auteur: "Message de soutien" },
  { texte: "Chaque petit pas est une victoire.", auteur: "Message de soutien" },
  { texte: "Tu mérites l'amour, l'attention et la tendresse pendant tout ton parcours.", auteur: "Message de soutien" },
];

const CONFIANCE = [
  { emoji: "💗", titre: "Ma valeur",  texte: "Tu es importante, aimée et digne de respect. La maladie ne définit pas qui tu es." },
  { emoji: "🌷", titre: "Ma force",   texte: "Même fatiguée, tu avances avec courage. Chaque jour que tu traverses est une victoire." },
  { emoji: "✨", titre: "Mon espoir", texte: "Chaque jour peut porter une nouvelle lumière. Demain existe et il t'appartient." },
];

const SOINS = [
  { icon: "💉", titre: "Chimiothérapie",  tag: "Traitement systémique", texte: "Des médicaments puissants qui combattent les cellules cancéreuses. Chaque séance est un pas vers la guérison.", bg: "#FFF0F7", border: "#F8BBD9" },
  { icon: "☢️", titre: "Radiothérapie",   tag: "Traitement local",      texte: "Des rayons ciblés pour éliminer les cellules cancéreuses restantes avec une précision remarquable.", bg: "#FFF8F0", border: "#FFD9B5" },
  { icon: "🔬", titre: "Hormonothérapie", tag: "Traitement ciblé",      texte: "Pour les cancers hormono-sensibles, ce traitement réduit les hormones favorisant la croissance tumorale.", bg: "#F5FFF5", border: "#BBDFBB" },
  { icon: "🏥", titre: "Chirurgie",        tag: "Intervention locale",   texte: "Tumorectomie ou mastectomie selon le stade. Une étape courageuse vers la liberté.", bg: "#FCE4EC", border: "#F48FB1" },
  { icon: "🧬", titre: "Immunothérapie",  tag: "Traitement innovant",   texte: "Une approche innovante qui renforce ton propre système immunitaire pour combattre le cancer.", bg: "#F5F3FF", border: "#D1C4E9" },
  { icon: "🧘", titre: "Soins de soutien", tag: "Bien-être",            texte: "Psychologie, nutrition, sport adapté… Parce que guérir le corps et l'âme est tout aussi important.", bg: "#F0FFF5", border: "#A5D6A7" },
];

const AUTOSURVEIL = [
  "Faire l'auto-palpation une fois par mois, de préférence à la même période du cycle.",
  "Observer les seins devant un miroir : forme, peau, mamelon, rougeurs.",
  "Signaler rapidement toute anomalie : boule, douleur persistante, écoulement.",
  "Compléter par un examen clinique et une mammographie selon l'âge.",
];

const STADES = [
  "Stade 0 : cellules anormales localisées (in situ).",
  "Stades I–II : tumeur localisée, parfois ganglions proches atteints.",
  "Stade III : maladie localement avancée.",
  "Stade IV : métastases à distance, prise en charge systémique.",
];

const LABEL_STYLE = {
  margin: "0 0 12px",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: 2.5,
  color: COL_ROSE,
  textTransform: "uppercase",
  fontFamily: "'Helvetica Neue', sans-serif",
};

const HEADING_STYLE = {
  margin: "0 0 14px",
  fontWeight: 400,
  color: COL_TEXTE,
  fontStyle: "italic",
  lineHeight: 1.3,
};

const BODY_STYLE = {
  margin: "0 auto",
  color: COL_GRIS,
  fontSize: 15,
  lineHeight: 1.75,
  fontFamily: "'Helvetica Neue', sans-serif",
  fontWeight: 300,
};

export default function Traitements() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [lightboxImg, setLightboxImg] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % CITATIONS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const quote = CITATIONS[quoteIdx];

  return (
    <div style={{ fontFamily: "'Georgia', 'Palatino', serif", background: COL_BEIGE, minHeight: "100vh", color: COL_TEXTE }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cite-anim { animation: fadeInUp 0.5s ease forwards; }
        .img-zoom:hover { transform: scale(1.04); }
        .img-zoom { transition: transform 0.35s ease; }
      `}</style>

      {/* ── LIGHTBOX ────────────────────────────────── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(20,5,15,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out", padding: 24,
          }}
        >
          <img
            src={lightboxImg}
            alt="Agrandissement"
            style={{ maxWidth: "90vw", maxHeight: "88vh", borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.7)", objectFit: "contain" }}
          />
          <button
            onClick={() => setLightboxImg(null)}
            style={{ position: "absolute", top: 20, right: 24, background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", borderRadius: "50%", width: 40, height: 40, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Fermer"
          >✕</button>
        </div>
      )}

      {/* ── HERO ───────────────────────────────────── */}
      <div style={{
        background: `linear-gradient(160deg, ${COL_PRUNE} 0%, ${COL_ROSE} 100%)`,
        padding: "80px 24px 100px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)",
        }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <p style={{ margin: "0 0 20px", fontSize: 11, fontWeight: 600, letterSpacing: 3, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", fontFamily: "'Helvetica Neue', sans-serif" }}>
            Cancer du sein · Information &amp; Soutien
          </p>
          <h1 style={{ margin: "0 0 24px", fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 400, color: "#FFFFFF", lineHeight: 1.25, fontStyle: "italic" }}>
            Tu es forte, précieuse<br />et pleine de lumière.
          </h1>
          <p style={{ margin: "0 auto 44px", maxWidth: 520, color: "rgba(255,255,255,0.82)", fontSize: 17, lineHeight: 1.8, fontFamily: "'Helvetica Neue', sans-serif", fontWeight: 300 }}>
            Chaque étape de ton parcours mérite douceur, soutien et espoir.
            Ici, tu trouveras des mots qui rassurent, des informations qui aident,
            et une présence qui te rappelle que tu n'es jamais seule.
          </p>
          
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 80px" }}>

        {/* ── CITATION DU JOUR ──────────────────────── */}
        <div style={{ margin: "64px 0 0", background: COL_BLANC, borderRadius: 20, padding: "52px 40px", textAlign: "center", boxShadow: "0 4px 40px rgba(124,45,82,0.07)", border: `1px solid ${COL_CLAIR}` }}>
          <p style={LABEL_STYLE}>Citation du jour</p>
          <div style={{ width: 32, height: 2, background: COL_ROSE, margin: "0 auto 28px", borderRadius: 2 }} />
          <p key={quoteIdx} className="cite-anim" style={{ margin: "0 auto 20px", maxWidth: 560, fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 400, color: COL_TEXTE, lineHeight: 1.7, fontStyle: "italic" }}>
            "{quote.texte}"
          </p>
          <p style={{ margin: "0 0 28px", color: COL_GRIS, fontSize: 13, fontFamily: "'Helvetica Neue', sans-serif" }}>
            — {quote.auteur}
          </p>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            {CITATIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                aria-label={`Citation ${i + 1}`}
                style={{ width: i === quoteIdx ? 24 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer", background: i === quoteIdx ? COL_ROSE : "#E8C5D4", transition: "all 0.3s", padding: 0 }}
              />
            ))}
          </div>
        </div>

        {/* ── CONFIANCE EN SOI ──────────────────────── */}
        <div style={{ marginTop: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={LABEL_STYLE}>Confiance en soi</p>
            <h2 style={{ ...HEADING_STYLE, fontSize: "clamp(22px, 4vw, 32px)" }}>Retrouver confiance en toi, un jour à la fois</h2>
            <p style={{ ...BODY_STYLE, maxWidth: 520 }}>
              Ton parcours ne diminue ni ta beauté, ni ta féminité, ni ta valeur.
              Tu restes une femme entière, digne, belle et importante.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {CONFIANCE.map((card) => (
              <div
                key={card.titre}
                style={{ background: COL_BLANC, borderRadius: 18, padding: "36px 28px", textAlign: "center", boxShadow: "0 4px 30px rgba(124,45,82,0.07)", border: `1px solid ${COL_CLAIR}`, transition: "transform 0.25s, box-shadow 0.25s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(194,24,91,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 30px rgba(124,45,82,0.07)"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>{card.emoji}</div>
                <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 500, color: COL_PRUNE, fontStyle: "italic" }}>{card.titre}</h3>
                <p style={{ margin: 0, color: COL_GRIS, fontSize: 14, lineHeight: 1.7, fontFamily: "'Helvetica Neue', sans-serif" }}>{card.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── LES TRAITEMENTS ───────────────────────── */}
        <div style={{ marginTop: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <p style={LABEL_STYLE}>Les traitements</p>
            <h2 style={{ ...HEADING_STYLE, fontSize: "clamp(22px, 4vw, 32px)" }}>Comprendre ton traitement, c'est reprendre le contrôle</h2>
            <p style={{ ...BODY_STYLE, maxWidth: 480 }}>
              Chaque traitement est une arme dans ton arsenal. Voici ce que tu dois savoir.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
            {SOINS.map((t) => (
              <div
                key={t.titre}
                style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: 16, padding: "28px 24px", transition: "transform 0.25s, box-shadow 0.25s", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(194,24,91,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{t.icon}</div>
                <span style={{ display: "inline-block", background: "rgba(255,255,255,0.7)", color: COL_PRUNE, borderRadius: 4, padding: "2px 9px", fontSize: 10, fontWeight: 600, letterSpacing: 0.8, marginBottom: 10, fontFamily: "'Helvetica Neue', sans-serif" }}>
                  {t.tag}
                </span>
                <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: COL_TEXTE, fontFamily: "'Helvetica Neue', sans-serif" }}>{t.titre}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: COL_GRIS, lineHeight: 1.7, fontFamily: "'Helvetica Neue', sans-serif" }}>{t.texte}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── TÉMOIGNAGE ────────────────────────────── */}
        <div style={{ marginTop: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={LABEL_STYLE}>Témoignage</p>
            <h2 style={{ ...HEADING_STYLE, fontSize: "clamp(22px, 4vw, 32px)" }}>Son combat, sa victoire</h2>
            <p style={{ ...BODY_STYLE, maxWidth: 440 }}>
              Une femme partage son parcours avec sincérité, ses forces et ses espoirs.
            </p>
          </div>
          <div style={{ background: COL_BLANC, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(124,45,82,0.1)", border: `1px solid ${COL_CLAIR}` }}>
            <video controls aria-label="Témoignage vidéo sur le cancer du sein" style={{ width: "100%", display: "block", maxHeight: 480, background: "#1a0a12" }}>
              <source src={temoignageVideo} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            <div style={{ padding: "20px 28px 24px", borderTop: `1px solid ${COL_CLAIR}` }}>
              <p style={{ margin: 0, color: COL_GRIS, fontSize: 14, fontStyle: "italic", fontFamily: "'Helvetica Neue', sans-serif" }}>
                "Survivante du cancer du sein — son parcours de soin, ses doutes et son espoir."
              </p>
            </div>
          </div>
        </div>

        {/* ── AUTO-SURVEILLANCE + STADES ────────────── */}
        <div style={{ marginTop: 72 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={LABEL_STYLE}>Connaissance &amp; Prévention</p>
            <h2 style={{ ...HEADING_STYLE, fontSize: "clamp(22px, 4vw, 32px)" }}>Se connaître pour mieux se protéger</h2>
            <p style={{ ...BODY_STYLE, maxWidth: 440 }}>
              L'information est le premier outil de la guérison.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { label: "Auto-surveillance", title: "Comment prendre soin de toi", img: "https://csf.be/wp-content/uploads/2022/10/2022_cancerdusein.png", items: AUTOSURVEIL, accent: COL_ROSE },
              { label: "Stades de la maladie", title: "Comprendre les étapes", img: "https://maternite.chl.lu/sites/default/files/inline-images/Capture%20d%E2%80%99e%CC%81cran%202024-04-26%20a%CC%80%2011.11.56.png", items: STADES, accent: COL_PRUNE },
            ].map((section) => (
              <div key={section.label} style={{ background: COL_BLANC, borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 24px rgba(124,45,82,0.07)", border: `1px solid ${COL_CLAIR}` }}>
                <div
                  style={{ position: "relative", height: 220, overflow: "hidden", cursor: "zoom-in" }}
                  onClick={() => setLightboxImg(section.img)}
                  title="Cliquer pour agrandir"
                >
                  <img src={section.img} alt={section.label} className="img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(45,27,46,0.65))", padding: "30px 20px 14px" }}>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Helvetica Neue', sans-serif" }}>
                      {section.label}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "20px 22px 26px" }}>
                  <h3 style={{ margin: "0 0 14px", color: section.accent, fontSize: 16, fontWeight: 500, fontStyle: "italic" }}>{section.title}</h3>
                  <ul style={{ margin: 0, paddingLeft: 18, color: COL_GRIS, lineHeight: 1.8, fontSize: 13.5, fontFamily: "'Helvetica Neue', sans-serif" }}>
                    {section.items.map((item) => (
                      <li key={item} style={{ marginBottom: 5 }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MESSAGE FINAL ─────────────────────────── */}


      </div>
    </div>
  );
}

// ── NEW DESIGN END ──


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
  { numero: "90%", label: "survie à 5 ans si détecté tôt", icon: "✅" },
  { numero: "40K+", label: "nouveaux cas / an", icon: "📊" },
  { numero: "75%", label: "taux de guérison global", icon: "💪" },
];

const citations = [
  {
    texte: "Tu es plus forte que tu ne le crois. Chaque jour que tu traverses est une victoire.",
    auteur: "— Message de l'équipe Courage Rose",
    emoji: "🌸",
  },
  {
    texte: "Le courage ne signifie pas l'absence de peur, mais avancer malgré elle.",
    auteur: "— Nelson Mandela",
    emoji: "💗",
  },
  {
    texte: "Tu n'as pas choisi cette épreuve, mais tu as choisi de te battre. Et ça fait toute la différence.",
    auteur: "— Survivante, 42 ans",
    emoji: "🎗️",
  },
  {
    texte: "Chaque femme qui se bat contre cette maladie est une guerrière digne d'admiration infinie.",
    auteur: "— Message de soutien",
    emoji: "🦋",
  },
];

const traitements = [
  {
    icon: "💉",
    titre: "Chimiothérapie",
    description:
      "Des médicaments puissants qui combattent les cellules cancéreuses. Chaque séance est un pas de plus vers la guérison. Tu n'es pas seule dans cette salle de traitement.",
    couleur: "#EFF6FF",
    bordure: "#BFDBFE",
    tag: "Traitement systémique",
  },
  {
    icon: "☢️",
    titre: "Radiothérapie",
    description:
      "Des rayons ciblés pour éliminer les cellules cancéreuses restantes. Un traitement de précision qui protège tes tissus sains autant que possible.",
    couleur: "#FFF7ED",
    bordure: "#FED7AA",
    tag: "Traitement local",
  },
  {
    icon: "🔬",
    titre: "Hormonothérapie",
    description:
      "Pour les cancers hormono-sensibles, ce traitement réduit les hormones qui favorisent la croissance tumorale. Simple à prendre, efficace sur le long terme.",
    couleur: "#F0FDF4",
    bordure: "#BBF7D0",
    tag: "Traitement ciblé",
  },
  {
    icon: "🏥",
    titre: "Chirurgie",
    description:
      "Tumorectomie ou mastectomie selon le stade. La chirurgie est souvent la première étape — et une étape courageuse vers la liberté.",
    couleur: PINK_LIGHT,
    bordure: "#FBCFE8",
    tag: "Intervention locale",
  },
  {
    icon: "🧬",
    titre: "Immunothérapie",
    description:
      "Une approche innovante qui renforce ton propre système immunitaire pour combattre le cancer. L'avenir de la médecine, aujourd'hui à ta portée.",
    couleur: "#F5F3FF",
    bordure: "#DDD6FE",
    tag: "Traitement innovant",
  },
  {
    icon: "🧘",
    titre: "Soins de soutien",
    description:
      "Psychologie, nutrition, sport adapté, sophrologie... Parce que guérir le corps ET l'âme est aussi important. Prends soin de toi entièrement.",
    couleur: "#ECFDF5",
    bordure: "#A7F3D0",
    tag: "Bien-être",
  },
];

const affirmations = [
  "Je suis forte. Je suis courageuse. Je mérite de guérir. 🌸",
  "Chaque matin est une nouvelle victoire. Je suis toujours là. 💪",
  "Ma beauté ne dépend pas de ma maladie. Je suis bien plus que ça. ✨",
  "J'ai le droit de pleurer, de douter, et de recommencer. C'est ça, le courage. 💗",
  "Je ne suis pas seule. Des milliers de femmes marchent à mes côtés. 🤝",
];

const buttonBaseStyle = {
  borderRadius: 12,
  padding: "14px 32px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: "none",
};

// Legacy component (no longer exported)
function _TraitementsLegacy() {
  const [citationIdx, setCitationIdx] = useState(0);
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  const citation = citations[citationIdx];

  return (
    <div
      style={{
        fontFamily: "'Manrope', 'Trebuchet MS', sans-serif",
        minHeight: "100vh",
        background: PINK_BG,
        padding: "0 0 60px",
        boxSizing: "border-box",
      }}
    >
      {/* ── HERO ─────────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${PINK_DARK} 0%, ${PINK} 60%, #F472B6 100%)`,
          padding: "64px 24px 72px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
          <span style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
            color: "#fff",
            borderRadius: 999,
            padding: "6px 20px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.5,
            marginBottom: 22,
          }}>
            💗 CANCER DU SEIN · INFORMATION & SOUTIEN
          </span>

          <h1 style={{ margin: "0 0 18px", fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>
            Tu es une guerrière.<br />
            <span style={{ color: "#FDE68A" }}>Ne l'oublie jamais.</span>
          </h1>

          <p style={{ margin: "0 0 32px", color: "rgba(255,255,255,0.88)", fontSize: 17, lineHeight: 1.75 }}>
            Cette page est faite pour toi — pour t'informer, t'encourager,<br />
            et te rappeler que tu n'es <strong style={{ color: "#FDE68A" }}>jamais seule</strong> dans ce combat.
          </p>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
            maxWidth: 640,
            margin: "0 auto",
          }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 14,
                padding: "16px 12px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
              }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#FDE68A", marginBottom: 4 }}>{stat.numero}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px" }}>

        {/* ── AFFIRMATION DU JOUR ──────────────────────────────── */}
        <div style={{
          marginTop: 36,
          background: `linear-gradient(135deg, #FFF0F6, ${PINK_LIGHT})`,
          border: `2px solid ${PINK}`,
          borderRadius: 20,
          padding: "28px 32px",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: PINK, letterSpacing: 1.5, marginBottom: 12 }}>
            🌟 AFFIRMATION DU JOUR
          </div>
          <p style={{
            margin: "0 0 18px",
            fontSize: 18,
            fontWeight: 700,
            color: SLATE,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}>
            "{affirmations[affirmationIdx]}"
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {affirmations.map((_, i) => (
              <button
                key={i}
                onClick={() => setAffirmationIdx(i)}
                style={{
                  width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: i === affirmationIdx ? PINK : "#FBCFE8",
                  transition: "background 0.2s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>

        {/* ── TYPES DE TRAITEMENTS ─────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span style={{
              display: "inline-block",
              background: PINK_LIGHT,
              color: PINK_DARK,
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              marginBottom: 10,
            }}>
              🏥 LES TRAITEMENTS
            </span>
            <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: SLATE }}>
              Comprendre ton traitement, c'est reprendre le contrôle
            </h2>
            <p style={{ color: MUTED, fontSize: 15, maxWidth: 560, margin: "0 auto" }}>
              Chaque traitement est une arme dans ton arsenal. Voici ce que tu dois savoir.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 18,
          }}>
            {traitements.map((t) => (
              <div key={t.titre} style={{
                background: t.couleur,
                border: `1.5px solid ${t.bordure}`,
                borderRadius: 18,
                padding: "22px 22px 24px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(190,24,93,0.13)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.05)"; }}
              >
                <div style={{ fontSize: 34, marginBottom: 12 }}>{t.icon}</div>
                <div style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.7)",
                  color: PINK_DARK,
                  borderRadius: 6,
                  padding: "2px 10px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}>
                  {t.tag}
                </div>
                <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 800, color: SLATE }}>{t.titre}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: "#475569", lineHeight: 1.7 }}>{t.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CITATION TOURNANTE ───────────────────────────────── */}
        <div style={{
          marginTop: 48,
          background: `linear-gradient(135deg, ${PINK_DARK}, ${PINK})`,
          borderRadius: 22,
          padding: "40px 36px",
          textAlign: "center",
          boxShadow: "0 12px 36px rgba(157,23,77,0.22)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>{citation.emoji}</div>
            <p style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.7,
              fontStyle: "italic",
              maxWidth: 640,
              margin: "0 auto 14px",
            }}>
              "{citation.texte}"
            </p>
            <p style={{ margin: "0 0 24px", color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{citation.auteur}</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {citations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCitationIdx(i)}
                  style={{
                    width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer",
                    background: i === citationIdx ? "#FDE68A" : "rgba(255,255,255,0.35)",
                    transition: "background 0.2s",
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── TÉMOIGNAGE VIDÉO ─────────────────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{
              display: "inline-block",
              background: PINK_LIGHT,
              color: PINK_DARK,
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              marginBottom: 10,
            }}>
              💬 TÉMOIGNAGE
            </span>
            <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: SLATE }}>
              Son combat, sa victoire 💗
            </h2>
            <p style={{ margin: 0, color: MUTED, fontSize: 15 }}>
              Une femme partage son parcours avec sincérité, ses forces et ses espoirs.
            </p>
          </div>

          <div style={{
            background: "#fff",
            borderRadius: 22,
            overflow: "hidden",
            border: `1.5px solid ${PINK_LIGHT}`,
            boxShadow: "0 8px 32px rgba(190,24,93,0.1)",
          }}>
            <video
              controls
              aria-label="Témoignage vidéo sur le cancer du sein"
              style={{ width: "100%", display: "block", maxHeight: 500, background: "#000" }}
            >
              <source src={temoignageVideo} type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
            <div style={{ padding: "18px 28px 22px", display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["🎗️ Survivante du cancer du sein", "💪 Courage et espoir", "🏥 Parcours de soin complet"].map((tag) => (
                <span key={tag} style={{
                  background: PINK_LIGHT, color: PINK_DARK,
                  borderRadius: 999, padding: "5px 14px",
                  fontSize: 12.5, fontWeight: 600,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── AUTO-SURVEILLANCE + STADES ───────────────────────── */}
        <div style={{ marginTop: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span style={{
              display: "inline-block",
              background: PINK_LIGHT,
              color: PINK_DARK,
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              marginBottom: 10,
            }}>
              🔍 CONNAISSANCE & PRÉVENTION
            </span>
            <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: SLATE }}>
              Se connaître pour mieux se protéger
            </h2>
            <p style={{ margin: 0, color: MUTED, fontSize: 15 }}>
              L'information est le premier outil de la guérison. Tu mérites de tout savoir.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {/* Auto-surveillance */}
            <div style={{
              border: `1.5px solid ${PINK_LIGHT}`,
              borderRadius: 18,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 18px rgba(190,24,93,0.07)",
            }}>
              <img
                src={SELF_CHECK_IMAGE}
                alt="Illustration de l'auto-surveillance du sein"
                style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{
                  display: "inline-block", background: PINK_LIGHT, color: PINK_DARK,
                  borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 10,
                }}>
                  AUTO-SURVEILLANCE
                </div>
                <h3 style={{ margin: "0 0 6px", color: PINK, fontSize: 17, fontWeight: 700 }}>
                  Comment prendre soin de toi
                </h3>
                <p style={{ margin: "0 0 12px", color: "#64748B", fontSize: 13 }}>
                  Un geste simple chaque mois peut tout changer. Tu en vaux la peine.
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.8, fontSize: 13.5 }}>
                  {autoSurveillanceConseils.map((conseil) => (
                    <li key={conseil} style={{ marginBottom: 4 }}>{conseil}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stades */}
            <div style={{
              border: `1.5px solid ${PINK_LIGHT}`,
              borderRadius: 18,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 4px 18px rgba(190,24,93,0.07)",
            }}>
              <img
                src={STAGES_IMAGE}
                alt="Illustration des étapes du cancer du sein"
                style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
              />
              <div style={{ padding: "20px 20px 24px" }}>
                <div style={{
                  display: "inline-block", background: "#FFF0F6", color: PINK_DARK,
                  borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginBottom: 10,
                }}>
                  STADES DE LA MALADIE
                </div>
                <h3 style={{ margin: "0 0 6px", color: PINK_DARK, fontSize: 17, fontWeight: 700 }}>
                  Comprendre les étapes
                </h3>
                <p style={{ margin: "0 0 12px", color: "#64748B", fontSize: 13 }}>
                  Comprendre ne fait pas peur — ça aide à avancer avec confiance.
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.8, fontSize: 13.5 }}>
                  {etapesCancerSein.map((etape) => (
                    <li key={etape} style={{ marginBottom: 4 }}>{etape}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

          </div>
        </div>

     
  );
}

