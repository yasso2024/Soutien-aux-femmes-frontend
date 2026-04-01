import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Divider, Row, Tag, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../api/admin";
import associationImg from "../../assets/association.jpg";
import benevoleImg from "../../assets/benevole.jpg";
import donateurImg from "../../assets/donateur.jpg";
import imageFemme from "../../assets/image1.jpeg";
import courageImg from "../../assets/courage.jpeg";
import videoTemoignage from "../../assets/videos/video1.mp4";

const { Title, Paragraph, Text } = Typography;
const PINK = "#e91e63";
const PINK_DARK = "#c2185b";
const PINK_LIGHT = "#fff0f6";

/* ─── Animation hook (fade-in on scroll) ─── */
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

/* ─── Animated counter ─── */
function Counter({ target, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useFadeIn();

  useEffect(() => {
    if (!visible) return;

    const num = parseInt(String(target).replace(/\D/g, ""), 10);
    const step = Math.ceil(num / 60);
    let cur = 0;

    const t = setInterval(() => {
      cur += step;
      if (cur >= num) {
        setCount(num);
        clearInterval(t);
      } else {
        setCount(cur);
      }
    }, 24);

    return () => clearInterval(t);
  }, [visible, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

/* ─── Roles section ─── */
function Roles() {
  const navigate = useNavigate();

  const roles = [
    {
      e: "💗",
      r: "FEMME MALADE",
      t: "Femme malade",
      c: PINK,
      bg: PINK_LIGHT,
      avantages: [
        "Déposer une demande",
        "Recevoir des propositions",
        "Messagerie directe",
        "Suivi de votre dossier",
      ],
      cta: "Chercher de l'aide",
    },
    {
      e: "🤝",
      r: "BENEVOLE",
      t: "Bénévole",
      c: "#7c3aed",
      bg: "#f5f3ff",
      avantages: [
        "Consulter les demandes",
        "Proposer votre aide",
        "Participer aux actions",
        "Calendrier d'activités",
      ],
      cta: "Aider maintenant",
    },
    {
      e: "🎁",
      r: "DONTEUR",
      t: "Donateur",
      c: "#059669",
      bg: "#ecfdf5",
      avantages: [
        "Faire des dons ciblés",
        "Suivi de vos dons",
        "Impact mesurable",
        "Historique complet",
      ],
      cta: "Faire un don",
    },
    {
      e: "🏛️",
      r: "ASSOCIATION",
      t: "Association",
      c: "#0891b2",
      bg: "#ecfeff",
      avantages: [
        "Organiser des actions",
        "Coordonner les bénévoles",
        "Proposer de l'aide",
        "Visibilité étendue",
      ],
      cta: "Rejoindre la plateforme",
    },
  ];

  const [ref, visible] = useFadeIn();

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #fafafa 0%, #fff5f8 100%)",
        padding: "88px 48px",
        borderTop: "1px solid #fce4ec",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 52,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "all 0.6s ease",
          }}
        >
          <Tag
            color="pink"
            style={{
              marginBottom: 12,
              fontSize: 13,
              padding: "4px 16px",
              borderRadius: 20,
            }}
          >
            Rejoindre la communauté
          </Tag>

          <Title level={2} style={{ margin: 0, color: "#1a0a0f" }}>
            Quel est votre rôle ?
          </Title>

          <Paragraph type="secondary" style={{ marginTop: 10, fontSize: 16 }}>
            Chaque profil a sa place dans notre écosystème solidaire.
          </Paragraph>
        </div>

        <Row gutter={[20, 20]}>
          {roles.map((r, i) => (
            <Col xs={24} sm={12} lg={6} key={r.r}>
              <div
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transition: `all 0.6s ease ${i * 0.1}s`,
                }}
              >
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderTop: `3px solid ${r.c}`,
                    borderRadius: 16,
                    border: `1px solid ${r.c}20`,
                    boxShadow: `0 4px 20px ${r.c}10`,
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  }}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      padding: 24,
                    },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = `0 16px 40px ${r.c}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 4px 20px ${r.c}10`;
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: r.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      marginBottom: 16,
                      border: `1px solid ${r.c}25`,
                    }}
                  >
                    {r.e}
                  </div>

                  <Title
                    level={5}
                    style={{ marginBottom: 14, color: r.c, marginTop: 0 }}
                  >
                    {r.t}
                  </Title>

                  <div style={{ flex: 1 }}>
                    {r.avantages.map((a, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 9,
                        }}
                      >
                        <CheckCircleOutlined
                          style={{ color: r.c, fontSize: 13, flexShrink: 0 }}
                        />
                        <Text style={{ fontSize: 13, color: "#444" }}>{a}</Text>
                      </div>
                    ))}
                  </div>

                  <Button
                    block
                    style={{
                      marginTop: 18,
                      borderColor: r.c,
                      color: r.c,
                      fontWeight: 600,
                      borderRadius: 10,
                      height: 40,
                    }}
                    onClick={() =>
                      navigate(`/signup?role=${encodeURIComponent(r.r)}`)
                    }
                  >
                    {r.cta}
                  </Button>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ─── */
const HomePage = () => {
  const navigate = useNavigate();

  const [impactCounts, setImpactCounts] = useState({
    benevoles: 12000,
    associations: 1200,
    femmes: 8500,
  });

  const actors = [
    {
      title: "Association",
      img: associationImg,
      description: "Soutien social et médical.",
    },
    {
      title: "Bénévole",
      img: benevoleImg,
      description: "Accompagnement moral et humain.",
    },
    {
      title: "Donateur",
      img: donateurImg,
      description: "Soutien financier aux actions solidaires.",
    },
  ];

  const stats = [
    { number: impactCounts.benevoles, text: "Bénévoles", icon: "🤝" },
    { number: impactCounts.associations, text: "Associations", icon: "🏛️" },
    { number: impactCounts.femmes, text: "Femmes aidées", icon: "💗" },
  ];

  const [heroRef, heroVisible] = useFadeIn();
  const [statsRef, statsVisible] = useFadeIn();
  const [actorsRef, actorsVisible] = useFadeIn();
  const [videoRef, videoVisible] = useFadeIn();

  useEffect(() => {
    let isMounted = true;

    async function fetchImpactCounts() {
      try {
        const res = await getDashboardStats();
        const data = res?.data?.stats;

        if (!isMounted || !data) return;

        setImpactCounts({
          benevoles: Number(data.totalBenevoles) || 0,
          associations: Number(data.totalAssociations) || 0,
          femmes: Number(data.totalFemmes) || 0,
        });
      } catch {
        // Keep fallback values when stats API is unavailable.
      }
    }

    fetchImpactCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      {/* ── HERO ── */}
      <section
        style={{
          position: "relative",
          background:
            "linear-gradient(135deg, #1a0a0f 0%, #3d0b1c 50%, #1a0a0f 100%)",
          minHeight: 540,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: [120, 80, 160, 60, 100, 140][i],
              height: [120, 80, 160, 60, 100, 140][i],
              borderRadius: "50%",
              background: `radial-gradient(circle, ${PINK}${
                ["15", "10", "08", "18", "12", "06"][i]
              } 0%, transparent 70%)`,
              top: ["10%", "60%", "20%", "70%", "5%", "45%"][i],
              left: ["5%", "8%", "80%", "75%", "55%", "90%"][i],
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />

        <div
          ref={heroRef}
          style={{
            position: "relative",
            zIndex: 2,
            textAlign: "center",
            padding: "80px 40px",
            maxWidth: 780,
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <div style={{ fontSize: 56, marginBottom: 20, lineHeight: 1 }}>🌸</div>

          <Title
            level={1}
            style={{
              color: "#fff",
              fontSize: "clamp(28px, 5vw, 52px)",
              lineHeight: 1.2,
              marginBottom: 20,
              fontFamily: "Georgia, serif",
              fontWeight: 700,
            }}
          >
            Soutien aux femmes atteintes
            <br />
            <span
              style={{
                background: `linear-gradient(90deg, ${PINK}, #ff6b9d)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              du cancer du sein
            </span>{" "}
            en Tunisie 💓
          </Title>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: 18,
              marginBottom: 36,
              lineHeight: 1.7,
            }}
          >
            Une plateforme solidaire qui connecte femmes malades, bénévoles,
            donateurs et associations pour un accompagnement humain et efficace.
          </Paragraph>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              size="large"
              type="primary"
              onClick={() => navigate("/signup?role=FEMME%20MALADE")}
              style={{
                background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                height: 50,
                padding: "0 32px",
                fontSize: 16,
                boxShadow: `0 8px 28px ${PINK}50`,
              }}
            >
              Demander de l'aide
            </Button>

            <Button
              size="large"
              onClick={() => navigate("/signup")}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 600,
                height: 50,
                padding: "0 32px",
                fontSize: 16,
              }}
            >
              Rejoindre la communauté
            </Button>
          </div>
        </div>
      </section>

      {/* ── FEMME MALADE section ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <div
              style={{
                padding: "40px 44px",
                borderRadius: 28,
                background: "linear-gradient(145deg, #fff0f6 0%, #fff8fb 100%)",
                border: `2px solid ${PINK}30`,
                boxShadow: `0 20px 60px ${PINK}12`,
              }}
            >
              <Tag
                color="pink"
                style={{ borderRadius: 20, marginBottom: 16, padding: "4px 14px" }}
              >
                Pour les femmes malades
              </Tag>

              <Title level={2} style={{ color: PINK, marginBottom: 16 }}>
                Vous n'êtes pas seule.
              </Title>

              <Paragraph style={{ fontSize: 17, lineHeight: 1.75, color: "#444" }}>
                Courage Rose vous connecte avec un réseau de soutien — bénévoles,
                associations et donateurs — prêts à vous accompagner à chaque étape
                de votre parcours de soin.
              </Paragraph>

              <div
                style={{
                  marginTop: 24,
                  padding: "16px 20px",
                  background: "#fff",
                  borderRadius: 14,
                  border: `1px solid ${PINK}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 28 }}>💗</span>
                <div>
                  <Text strong style={{ color: PINK, display: "block" }}>
                    +8 500 femmes déjà accompagnées
                  </Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Rejoignez notre communauté solidaire
                  </Text>
                </div>
              </div>

              <Button
                type="primary"
                size="large"
                style={{
                  marginTop: 24,
                  background: `linear-gradient(135deg, ${PINK}, ${PINK_DARK})`,
                  border: "none",
                  borderRadius: 12,
                  fontWeight: 700,
                  boxShadow: `0 6px 20px ${PINK}40`,
                }}
                onClick={() => navigate("/signup?role=FEMME%20MALADE")}
              >
                Créer mon dossier
              </Button>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: `0 24px 60px ${PINK}25`,
                aspectRatio: "4/3",
              }}
            >
              <img
                src={imageFemme}
                alt="Femme malade - Courage Rose"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600x450/e91e63/ffffff?text=Courage+Rose";
                }}
              />
            </div>
          </Col>
        </Row>
      </section>

      <Divider style={{ borderColor: PINK, opacity: 0.15, margin: "0 40px" }} />

      {/* ── QUI SOMMES-NOUS ── */}
      <section style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                aspectRatio: "4/3",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"
                alt="Support"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Tag
              color="pink"
              style={{ borderRadius: 20, marginBottom: 16, padding: "4px 14px" }}
            >
              Notre mission
            </Tag>

            <Title level={2} style={{ color: "#1a0a0f" }}>
              Qui sommes-nous ?
            </Title>

            <Paragraph style={{ fontSize: 17, lineHeight: 1.75, color: "#555" }}>
              Courage Rose est une plateforme numérique qui accompagne les femmes
              atteintes du cancer du sein en Tunisie. Nous créons des ponts entre
              celles qui ont besoin d'aide et ceux qui souhaitent agir : bénévoles,
              donateurs et associations engagées.
            </Paragraph>

            <Paragraph style={{ fontSize: 17, lineHeight: 1.75, color: "#555" }}>
              Notre technologie au service de l'humain pour un soutien concret,
              rapide et digne.
            </Paragraph>
          </Col>
        </Row>
      </section>

      <Divider style={{ borderColor: PINK, opacity: 0.15, margin: "0 40px" }} />

      {/* ── ACTEURS SOLIDAIRES ── */}
      <section ref={actorsRef} style={{ padding: "80px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Tag
            color="pink"
            style={{ borderRadius: 20, marginBottom: 12, padding: "4px 16px" }}
          >
            Nos partenaires
          </Tag>

          <Title level={2} style={{ color: "#1a0a0f", margin: 0 }}>
            Nos Acteurs Solidaires
          </Title>
        </div>

        <Row gutter={[28, 28]}>
          {actors.map((item, i) => (
            <Col xs={24} md={8} key={i}>
              <div
                style={{
                  borderRadius: 22,
                  overflow: "hidden",
                  border: `1px solid ${PINK}20`,
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  height: "100%",
                  opacity: actorsVisible ? 1 : 0,
                  transform: actorsVisible ? "translateY(0)" : "translateY(28px)",
                  transition: `all 0.6s ease ${i * 0.12}s`,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 16px 40px ${PINK}18`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{ height: 220, overflow: "hidden" }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x220/e91e63/ffffff?text=${item.title}`;
                    }}
                  />
                </div>

                <div style={{ padding: "28px 28px 32px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 48,
                      height: 3,
                      background: `linear-gradient(90deg, ${PINK}, #ff6b9d)`,
                      borderRadius: 2,
                      margin: "0 auto 16px",
                    }}
                  />

                  <Title level={4} style={{ color: PINK, marginBottom: 10, marginTop: 0 }}>
                    {item.title}
                  </Title>

                  <Paragraph style={{ color: "#666", fontSize: 15, margin: 0 }}>
                    {item.description}
                  </Paragraph>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </section>

      {/* ── ROLES ── */}
      <Roles />

      {/* ── STATS ── */}
      <section
        ref={statsRef}
        style={{
          background: "linear-gradient(135deg, #1a0a0f 0%, #3d0b1c 100%)",
          padding: "80px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: `${PINK}10`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `${PINK}08`,
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Title level={2} style={{ color: "#fff", margin: 0 }}>
              Notre impact en chiffres
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.6)", marginTop: 10 }}>
              Des résultats concrets, une solidarité réelle.
            </Paragraph>
          </div>

          <Row gutter={[28, 28]}>
            {stats.map((s, i) => (
              <Col xs={24} md={8} key={i}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid ${PINK}30`,
                    borderRadius: 20,
                    padding: "40px 28px",
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `all 0.6s ease ${i * 0.15}s`,
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 16 }}>{s.icon}</div>
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 800,
                      color: "#fff",
                      fontFamily: "Georgia, serif",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {statsVisible ? <Counter target={s.number} prefix="+" /> : "0"}
                  </div>

                  <Text
                    style={{
                      color: `${PINK}cc`,
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {s.text}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* ── VIDEO ── */}
      <section ref={videoRef} style={{ padding: "88px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <Tag
            color="pink"
            style={{ borderRadius: 20, marginBottom: 12, padding: "4px 16px" }}
          >
            Témoignages
          </Tag>

          <Title level={2} style={{ color: "#1a0a0f", margin: 0 }}>
            Nos vidéos
          </Title>
        </div>

        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={13}>
            <div
              style={{
                borderRadius: 24,
                overflow: "hidden",
                boxShadow: `0 24px 60px ${PINK}20`,
                background: "#000",
                opacity: videoVisible ? 1 : 0,
                transform: videoVisible ? "translateX(0)" : "translateX(-30px)",
                transition: "all 0.7s ease",
              }}
            >
              <video
                controls
                poster={courageImg}
                style={{ width: "100%", height: "auto", display: "block" }}
              >
                <source src={videoTemoignage} type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          </Col>

          <Col xs={24} md={11}>
            <div
              style={{
                padding: "40px 36px",
                background: "linear-gradient(145deg, #fff0f6 0%, #fff8fb 100%)",
                borderRadius: 24,
                border: `2px solid ${PINK}25`,
                boxShadow: `0 16px 40px ${PINK}12`,
                textAlign: "center",
                opacity: videoVisible ? 1 : 0,
                transform: videoVisible ? "translateX(0)" : "translateX(30px)",
                transition: "all 0.7s ease 0.1s",
              }}
            >
              <Title level={3} style={{ color: PINK, marginBottom: 12 }}>
                You're strong... we are with you.
              </Title>

              <div
                style={{
                  width: 60,
                  height: 3,
                  background: `linear-gradient(90deg, ${PINK}, #ff6b9d)`,
                  borderRadius: 2,
                  margin: "0 auto 18px",
                }}
              />

              <Title level={2} style={{ color: PINK, fontSize: 28, margin: "0 0 24px" }}>
                آنت قوية.. ونحن معك
              </Title>

              <div
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  width: 180,
                  margin: "0 auto",
                  boxShadow: `0 8px 24px ${PINK}30`,
                }}
              >
                <img
                  src={courageImg}
                  alt="Courage Rose"
                  style={{ width: "100%", display: "block" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* ── CTA FINALE ── */}
      <section
        style={{
          margin: "0 40px 80px",
          borderRadius: 28,
          background: `linear-gradient(135deg, ${PINK} 0%, ${PINK_DARK} 100%)`,
          padding: "60px 48px",
          textAlign: "center",
          boxShadow: `0 20px 60px ${PINK}35`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: 60,
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌸</div>

          <Title level={2} style={{ color: "#fff", margin: "0 0 14px" }}>
            Ensemble, nous sommes plus forts
          </Title>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 17,
              maxWidth: 520,
              margin: "0 auto 32px",
            }}
          >
            Rejoignez des milliers de personnes qui font la différence chaque jour
            auprès des femmes qui en ont besoin.
          </Paragraph>

          <div
            style={{
              display: "flex",
              gap: 14,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              size="large"
              onClick={() => navigate("/signup")}
              style={{
                background: "#fff",
                border: "none",
                color: PINK,
                borderRadius: 12,
                fontWeight: 700,
                height: 50,
                padding: "0 36px",
                fontSize: 16,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              Commencer maintenant
            </Button>

            <Button
              size="large"
              onClick={() => navigate("/login")}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                borderRadius: 12,
                fontWeight: 600,
                height: 50,
                padding: "0 36px",
                fontSize: 16,
              }}
            >
              Se connecter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;