import { useState } from "react";

const quizByAge = {
  "18-30": { 
    label: "18 à 30 ans",
    questions: [
      {
        id: 1,
        question: "Faites-vous l’auto-palpation des seins une fois par mois ?",
        answer: "oui",
        hint: "L’auto-palpation régulière aide à remarquer rapidement un changement inhabituel."
      },
      {
        id: 2,
        question: "Avez-vous une alimentation équilibrée riche en fruits et légumes ?",
        answer: "oui",
        hint: "Une bonne alimentation contribue à réduire plusieurs facteurs de risque."
      },
      {
        id: 3,
        question: "Pratiquez-vous une activité physique au moins 3 fois par semaine ?",
        answer: "oui",
        hint: "Le sport aide à maintenir un poids sain et diminue le risque de plusieurs maladies."
      },
      {
        id: 4,
        question: "Avez-vous des antécédents familiaux de cancer du sein ?",
        answer: "non",
        hint: "Les antécédents familiaux peuvent augmenter le risque et justifient une surveillance renforcée."
      }
    ]
  },
  "30-45": {
    label: "30 à 45 ans",
    questions: [
      {
        id: 1,
        question: "Faites-vous un suivi médical régulier pour la santé des seins ?",
        answer: "oui",
        hint: "Le suivi médical régulier aide à détecter tôt un éventuel problème."
      },
      {
        id: 2,
        question: "Considérez-vous la mammographie inutile avant 45 ans si vous avez des facteurs de risque ?",
        answer: "non",
        hint: "En présence de facteurs de risque, le médecin peut recommander un dépistage plus tôt."
      },
      {
        id: 3,
        question: "Avez-vous déjà remarqué un nodule, un écoulement ou un changement de forme du sein sans consulter ?",
        answer: "non",
        hint: "Il faut consulter rapidement en cas de changement inhabituel."
      },
      {
        id: 4,
        question: "Consommez-vous souvent de l’alcool ou du tabac ?",
        answer: "non",
        hint: "Le tabac et l’alcool augmentent le risque de plusieurs cancers."
      }
    ]
  }
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap');

  * { box-sizing: border-box; }

  .qz-root {
    min-height: 100vh;
    background: linear-gradient(160deg, #FFF0F5 0%, #FFF8F4 50%, #FDF6F0 100%);
    font-family: 'DM Sans', 'Segoe UI', sans-serif;
  }

  .qz-hero {
    background: linear-gradient(135deg, #7C2D52 0%, #C2185B 60%, #E91E63 100%);
    padding: 40px 20px 52px;
    text-align: center;
    position: relative;
  }

  .qz-hero::before {
    content: '';
    position: absolute;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.05);
    top: -80px; left: -60px;
    pointer-events: none;
  }

  .qz-hero::after {
    content: '';
    position: absolute;
    width: 180px; height: 180px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    bottom: -50px; right: -30px;
    pointer-events: none;
  }

  .qz-hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 999px;
    padding: 4px 16px;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.9);
    letter-spacing: 0.1em;
    margin-bottom: 14px;
    position: relative;
    z-index: 1;
  }

  .qz-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 44px;
    font-weight: 900;
    color: #fff;
    margin: 0 0 12px;
    line-height: 1.1;
    position: relative;
    z-index: 1;
  }

  .qz-sub {
    font-size: 15px;
    color: rgba(255,255,255,0.82);
    line-height: 1.65;
    max-width: 420px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    font-style: italic;
  }

  .qz-wrap {
    max-width: 680px;
    margin: 0 auto;
    padding: 28px 20px 80px;
    position: relative;
    z-index: 2;
  }

  .qz-age-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 18px;
  }

  .qz-age-card {
    background: #fff;
    border: 1.5px solid #f5e0ec;
    border-radius: 24px;
    padding: 28px 24px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 24px rgba(194,24,91,0.07);
    text-align: left;
  }

  .qz-age-card:hover {
    border-color: #E91E63;
    transform: translateY(-8px);
    box-shadow: 0 24px 64px rgba(194,24,91,0.18);
  }

  .qz-age-emoji {
    font-size: 36px;
    margin-bottom: 12px;
    display: block;
  }

  .qz-age-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #7C2D52;
  }

  .qz-age-desc {
    font-size: 14px;
    color: #7a5868;
    line-height: 1.6;
    margin-bottom: 18px;
  }

  .qz-age-arrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #E91E63;
  }

  .qz-progress {
    margin-bottom: 24px;
  }

  .qz-progress-top {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #7C2D52;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .qz-progress-bar {
    height: 10px;
    background: rgba(194,24,91,0.1);
    border-radius: 999px;
    overflow: hidden;
  }

  .qz-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #E91E63, #7C2D52);
    transition: width 0.4s ease;
    border-radius: 999px;
  }

  .qz-card {
    background: #fff;
    border-radius: 28px;
    padding: 40px 36px;
    box-shadow: 0 12px 48px rgba(194,24,91,0.10), 0 2px 8px rgba(0,0,0,0.04);
  }

  .qz-num {
    font-size: 11px;
    color: #E91E63;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .qz-num::before {
    content: '';
    width: 28px;
    height: 2px;
    background: linear-gradient(90deg, #E91E63, transparent);
    display: inline-block;
    border-radius: 2px;
  }

  .qz-q {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: #1d0a14;
    line-height: 1.55;
    margin-bottom: 20px;
  }

  .qz-hint {
    margin-bottom: 30px;
    font-size: 13.5px;
    color: #8c6472;
    line-height: 1.65;
    background: linear-gradient(135deg, #FFF5F9, #FFF0F5);
    border-left: 3px solid #E91E63;
    border-radius: 0 14px 14px 0;
    padding: 12px 18px;
  }

  .qz-opts {
    display: flex;
    gap: 16px;
  }

  .qz-opt {
    flex: 1;
    border: 2px solid #f0dce6;
    background: #fdf8fb;
    border-radius: 16px;
    padding: 18px 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    color: #4a2535;
    letter-spacing: 0.02em;
  }

  .qz-opt:hover:not(:disabled) {
    border-color: #E91E63;
    background: linear-gradient(135deg, #FFF0F5, #FFE4EE);
    color: #C2185B;
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(233,30,99,0.15);
  }

  .qz-opt:disabled { cursor: not-allowed; }

  .qz-opt-ok {
    border-color: #22c55e !important;
    background: linear-gradient(135deg, #f0fdf4, #dcfce7) !important;
    color: #166534 !important;
    box-shadow: 0 4px 16px rgba(34,197,94,0.2) !important;
  }

  .qz-opt-ko {
    border-color: #ef4444 !important;
    background: linear-gradient(135deg, #fef2f2, #fee2e2) !important;
    color: #991b1b !important;
    box-shadow: 0 4px 16px rgba(239,68,68,0.18) !important;
  }

  .qz-result {
    background: linear-gradient(145deg, #2d0a1e, #5a1035, #7C2D52);
    color: #fff;
    border-radius: 32px;
    padding: 52px 40px;
    text-align: center;
    box-shadow: 0 20px 64px rgba(124,45,82,0.4);
  }

  .qz-score {
    font-family: 'Playfair Display', serif;
    font-size: 88px;
    font-weight: 900;
    background: linear-gradient(135deg, #FFD6E5, #FF94BF, #FF6BA8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
    margin-bottom: 6px;
  }

  .qz-score-label {
    font-size: 12px;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .qz-risk-badge {
    display: inline-block;
    padding: 8px 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 20px;
    background: rgba(255,255,255,0.12);
    border: 1.5px solid rgba(255,255,255,0.25);
    letter-spacing: 0.04em;
  }

  .qz-msg {
    font-size: 15px;
    line-height: 1.75;
    margin-bottom: 28px;
    color: rgba(255,255,255,0.85);
    max-width: 380px;
    margin-left: auto;
    margin-right: auto;
  }

  .qz-list {
    text-align: left;
    background: rgba(255,255,255,0.08);
    padding: 20px 24px;
    border-radius: 20px;
    margin-bottom: 14px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .qz-list-title {
    color: #FFD6E5;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }

  .qz-item {
    margin-bottom: 8px;
    line-height: 1.6;
    font-size: 14px;
    color: rgba(255,255,255,0.82);
  }

  .qz-btn {
    margin-top: 28px;
    border: none;
    background: linear-gradient(135deg, #E91E63, #C2185B);
    color: #fff;
    border-radius: 16px;
    padding: 16px 40px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    box-shadow: 0 8px 28px rgba(233,30,99,0.4);
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.02em;
  }

  .qz-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 40px rgba(233,30,99,0.5);
  }

  @media (max-width: 640px) {
    .qz-opts { flex-direction: column; }
    .qz-title { font-size: 32px; }
    .qz-q { font-size: 19px; }
    .qz-score { font-size: 64px; }
    .qz-card { padding: 28px 22px; }
    .qz-result { padding: 40px 24px; }
  }
`;

function getRisk(score, total) {
  const ratio = score / total;

  if (ratio >= 0.75) {
    return "Faible risque";
  }
  if (ratio >= 0.5) {
    return "Risque modéré";
  }
  return "Risque élevé";
}

function getMessage(score, total) {
  const ratio = score / total;

  if (ratio >= 0.75) {
    return "Bon niveau de prévention. Continuez à prendre soin de votre santé.";
  }
  if (ratio >= 0.5) {
    return "Vous avez de bonnes bases, mais il faut améliorer certaines habitudes.";
  }
  return "Une meilleure prévention est recommandée. Consultez un professionnel de santé en cas de doute.";
}

export default function BreastQuizOneByOne() {
  const [ageGroup, setAgeGroup] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [locked, setLocked] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = ageGroup ? quizByAge[ageGroup].questions : [];
  const finished = ageGroup && currentQuestion >= questions.length;

  const handleAgeSelect = (group) => {
    setAgeGroup(group);
    setCurrentQuestion(0);
    setAnswers([]);
    setLocked(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (value) => {
    if (locked || finished) return;

    setLocked(true);
    setSelectedAnswer(value);

    const updatedAnswers = [...answers, value];
    setAnswers(updatedAnswers);

    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      setLocked(false);
      setSelectedAnswer(null);
    }, 450);
  };

  const resetQuiz = () => {
    setAgeGroup(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setLocked(false);
    setSelectedAnswer(null);
  };

  const finalScore = answers.reduce((acc, answer, idx) => {
    const expected = questions[idx]?.answer;
    return acc + (answer === expected ? 1 : 0);
  }, 0);
  const progress = ageGroup ? (currentQuestion / questions.length) * 100 : 0;

  return (
    <>
      <style>{css}</style>

      <div className="qz-root">
        {/* Hero */}
        <div className="qz-hero">
          <div className="qz-hero-badge">🌸 PRÉVENTION CANCER DU SEIN</div>
          <h1 className="qz-title">Quiz de prévention</h1>
          <p className="qz-sub">
            Évaluez vos habitudes et découvrez vos points d'amélioration.<br />
            Répondez honnêtement pour des conseils personnalisés.
          </p>
        </div>

        <div className="qz-wrap">

          {!ageGroup ? (
            <div className="qz-age-grid">
              <button className="qz-age-card" onClick={() => handleAgeSelect("18-30")}>
                <span className="qz-age-emoji">🌱</span>
                <div className="qz-age-title">18 – 30 ans</div>
                <div className="qz-age-desc">
                  Prévention, alimentation saine et gestes d'auto-surveillance au quotidien.
                </div>
                <div className="qz-age-arrow">Commencer le quiz →</div>
              </button>
              <button className="qz-age-card" onClick={() => handleAgeSelect("30-45")}>
                <span className="qz-age-emoji">🌺</span>
                <div className="qz-age-title">30 – 45 ans</div>
                <div className="qz-age-desc">
                  Suivi médical, signes d'alerte et facteurs de risque à connaître.
                </div>
                <div className="qz-age-arrow">Commencer le quiz →</div>
              </button>
            </div>
          ) : finished ? (
            <div className="qz-result">
              <div className="qz-score">{finalScore}/{questions.length}</div>
              <div className="qz-score-label">Score de prévention</div>
              <div className="qz-risk-badge">{getRisk(finalScore, questions.length)}</div>
              <p className="qz-msg">{getMessage(finalScore, questions.length)}</p>

              <div className="qz-list">
                <div className="qz-list-title">Que faire</div>
                <div className="qz-item">• Faire une auto-palpation une fois par mois</div>
                <div className="qz-item">• Consulter un médecin si vous remarquez un changement</div>
                <div className="qz-item">• Renforcer le suivi médical si vous avez des antécédents</div>
              </div>

              <div className="qz-list">
                <div className="qz-list-title">Quoi manger</div>
                <div className="qz-item">• Fruits et légumes frais variés</div>
                <div className="qz-item">• Poisson, légumineuses et noix</div>
                <div className="qz-item">• Réduire sucre, friture, alcool et tabac</div>
              </div>

              <button className="qz-btn" onClick={resetQuiz}>↺ Recommencer le quiz</button>
            </div>
          ) : (
            <>
              <div className="qz-progress">
                <div className="qz-progress-top">
                  <span>{quizByAge[ageGroup].label}</span>
                  <span>Question {currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="qz-progress-bar">
                  <div
                    className="qz-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="qz-card">
                <div className="qz-num">Question {currentQuestion + 1}</div>
                <div className="qz-q">{questions[currentQuestion].question}</div>
                <div className="qz-hint">{questions[currentQuestion].hint}</div>

                <div className="qz-opts">
                  <button
                    className={`qz-opt ${selectedAnswer === "oui" ? questions[currentQuestion].answer === "oui" ? "qz-opt-ok" : "qz-opt-ko" : ""}`}
                    onClick={() => handleAnswer("oui")}
                    disabled={locked}
                  >
                    ✓ Oui
                  </button>
                  <button
                    className={`qz-opt ${selectedAnswer === "non" ? questions[currentQuestion].answer === "non" ? "qz-opt-ok" : "qz-opt-ko" : ""}`}
                    onClick={() => handleAnswer("non")}
                    disabled={locked}
                  >
                    ✗ Non
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}