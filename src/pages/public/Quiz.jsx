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
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qz-root {
    min-height: 100vh;
    background: #FDF6F0;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 20px;
  }

  
  .qz-hint {
    margin-top: -10px;
    margin-bottom: 18px;
    font-size: 13px;
    color: #7b6873;
    line-height: 1.5;
    background: #fff7fb;
    border: 1px solid #f2dde8;
    border-radius: 12px;
    padding: 10px 12px;
  }
  .qz-wrap {
    max-width: 720px;
    margin: 0 auto;
  }

  
  .qz-opt:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .qz-opt-ok {
    border-color: #22c55e !important;
    background: #f0fdf4 !important;
    color: #166534 !important;
  }
  
  .qz-opt-ko {
    border-color: #ef4444 !important;
    background: #fef2f2 !important;
    color: #b91c1c !important;
  }
  .qz-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .qz-title {
    font-family: 'DM Serif Display', serif;
    font-size: 42px;
    color: #1a0a12;
    margin-bottom: 10px;
  }

  .qz-sub {
    font-size: 15px;
    color: #6f5965;
    line-height: 1.6;
  }

  .qz-age-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-top: 25px;
  }

  .qz-age-card {
    background: white;
    border: 1px solid #f2dde8;
    border-radius: 18px;
    padding: 22px;
    cursor: pointer;
    transition: 0.2s;
  }

  .qz-age-card:hover {
    border-color: #EC7FA7;
    transform: translateY(-2px);
  }

  .qz-age-title {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #231019;
  }

  .qz-age-desc {
    font-size: 14px;
    color: #6e5864;
    line-height: 1.5;
  }

  .qz-progress {
    margin-bottom: 20px;
  }

  .qz-progress-top {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: #C4547D;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .qz-progress-bar {
    height: 8px;
    background: #f1e5ec;
    border-radius: 999px;
    overflow: hidden;
  }

  .qz-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #EC7FA7, #C4547D);
    transition: width 0.35s ease;
  }

  .qz-card {
    background: white;
    border: 1px solid #f2dde8;
    border-radius: 22px;
    padding: 28px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.04);
  }

  .qz-num {
    font-size: 12px;
    color: #EC7FA7;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }

  .qz-q {
    font-size: 20px;
    font-weight: 600;
    color: #1d0f17;
    line-height: 1.6;
    margin-bottom: 22px;
  }

  .qz-opts {
    display: flex;
    gap: 14px;
  }

  .qz-opt {
    flex: 1;
    border: 1.5px solid #eddce7;
    background: #fdf8fb;
    border-radius: 14px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s;
  }

  .qz-opt:hover {
    border-color: #EC7FA7;
    background: #fff1f7;
    color: #C4547D;
  }

  .qz-result {
    background: linear-gradient(135deg, #1a0a12, #341924);
    color: white;
    border-radius: 24px;
    padding: 36px 24px;
    text-align: center;
  }

  .qz-score {
    font-size: 64px;
    font-family: 'DM Serif Display', serif;
    color: #EC7FA7;
    margin-bottom: 8px;
  }

  .qz-msg {
    font-size: 18px;
    line-height: 1.5;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .qz-list {
    text-align: left;
    background: rgba(255,255,255,0.08);
    padding: 18px;
    border-radius: 16px;
    margin-top: 18px;
  }

  .qz-list-title {
    color: #EC7FA7;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .qz-item {
    margin-bottom: 8px;
    line-height: 1.5;
    font-size: 14px;
  }

  .qz-btn {
    margin-top: 22px;
    border: none;
    background: #EC7FA7;
    color: white;
    border-radius: 12px;
    padding: 12px 24px;
    font-weight: 700;
    cursor: pointer;
  }

  .qz-btn:hover {
    background: #d96590;
  }

  @media (max-width: 640px) {
    .qz-opts {
      flex-direction: column;
    }

    .qz-title {
      font-size: 32px;
    }

    .qz-q {
      font-size: 18px;
    }
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
        <div className="qz-wrap">
          <div className="qz-header">
            <h1 className="qz-title">Quiz prévention</h1>
            <p className="qz-sub">
              Les questions changent automatiquement après chaque réponse.
            </p>
          </div>

          {!ageGroup ? (
            <div className="qz-age-grid">
              <button className="qz-age-card" onClick={() => handleAgeSelect("18-30")}>
                <div className="qz-age-title">18 – 30 ans</div>
                <div className="qz-age-desc">
                  Questions sur la prévention, l’alimentation et l’auto-surveillance.
                </div>
              </button>

              <button className="qz-age-card" onClick={() => handleAgeSelect("30-45")}>
                <div className="qz-age-title">30 – 45 ans</div>
                <div className="qz-age-desc">
                  Questions sur le suivi médical, les signes d’alerte et les facteurs de risque.
                </div>
              </button>
            </div>
          ) : finished ? (
            <div className="qz-result">
              <div className="qz-score">{finalScore}/{questions.length}</div>
              <div className="qz-msg">
                {getRisk(finalScore, questions.length)} — {getMessage(finalScore, questions.length)}
              </div>

              <div className="qz-list">
                <div className="qz-list-title">Que faire</div>
                <div className="qz-item">• Faire une auto-palpation régulièrement</div>
                <div className="qz-item">• Consulter un médecin si vous remarquez un changement</div>
                <div className="qz-item">• Faire un suivi médical si vous avez des antécédents</div>
              </div>

              <div className="qz-list">
                <div className="qz-list-title">Quoi manger</div>
                <div className="qz-item">• Fruits et légumes</div>
                <div className="qz-item">• Poisson, légumineuses, noix</div>
                <div className="qz-item">• Réduire sucre, friture, alcool et tabac</div>
              </div>

              <button className="qz-btn" onClick={resetQuiz}>
                Recommencer
              </button>
            </div>
          ) : (
            <>
              <div className="qz-progress">
                <div className="qz-progress-top">
                  <span>{quizByAge[ageGroup].label}</span>
                  <span>Question {currentQuestion + 1}/{questions.length}</span>
                </div>
                <div className="qz-progress-bar">
                  <div
                    className="qz-progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="qz-card">
                <div className="qz-num">
                  Question {currentQuestion + 1}
                </div>

                <div className="qz-q">
                  {questions[currentQuestion].question}
                </div>

                <div className="qz-hint">
                  {questions[currentQuestion].hint}
                </div>

                <div className="qz-opts">
                  <button
                    className={`qz-opt ${
                      selectedAnswer === "oui"
                        ? questions[currentQuestion].answer === "oui"
                          ? "qz-opt-ok"
                          : "qz-opt-ko"
                        : ""
                    }`}
                    onClick={() => handleAnswer("oui")}
                    disabled={locked}
                  >
                    ✓ Oui
                  </button>
                  <button
                    className={`qz-opt ${
                      selectedAnswer === "non"
                        ? questions[currentQuestion].answer === "non"
                          ? "qz-opt-ok"
                          : "qz-opt-ko"
                        : ""
                    }`}
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