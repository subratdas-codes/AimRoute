// CareerQuestions.jsx
// Place at: frontend/src/pages/CareerQuestions.jsx
// Replace your existing CareerQuestions.jsx with this

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function CareerQuestions() {
  const { level } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions]           = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [scores, setScores]                 = useState({});
  const [reasons, setReasons]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState(null);
  const [stepCount, setStepCount]           = useState(0);

  // ── Percentage gate before quiz starts ───────────────────
  const [percentage, setPercentage]         = useState("");
  const [percentageConfirmed, setPercentageConfirmed] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await API.get(`/quiz/?level=${level}`);
        const allQuestions = response.data;
        const startQ = allQuestions.find(q => q.is_start) || allQuestions[0];
        setQuestions(allQuestions);
        setCurrentQuestion(startQ);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [level]);

  // ── Submit to backend ─────────────────────────────────────
  const submitToBackend = async (finalScores, finalReasons) => {
    setSubmitting(true);
    try {
      const response = await API.post("/ml/predict", {
        level:            level,
        category_scores:  finalScores,
        percentage:       parseFloat(percentage) || 60,
      });

      const { top_careers, dominant_category } = response.data;

      localStorage.setItem("career_result", JSON.stringify({
        top_careers,
        dominant_category,
        reasons:    finalReasons,
        level:      level,
        percentage: parseFloat(percentage) || 60,
      }));

      navigate("/result");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // ── Answer handler ────────────────────────────────────────
  const handleAnswer = (opt) => {
    const updatedScores  = { ...scores };
    updatedScores[opt.category_tag] = (scores[opt.category_tag] || 0) + 1;
    const updatedReasons = [...reasons, opt.option_text];

    setScores(updatedScores);
    setReasons(updatedReasons);
    setStepCount(prev => prev + 1);

    // Step 1 — follow next_question_id if set
    if (opt.next_question_id) {
      const nextQ = questions.find(q => q.id === opt.next_question_id);
      if (nextQ) { setCurrentQuestion(nextQ); return; }
    }

    // Step 2 — sequential fallback by order_index
    const nextByOrder = questions
      .filter(q => q.order_index > currentQuestion.order_index)
      .sort((a, b) => a.order_index - b.order_index)[0];

    if (nextByOrder) { setCurrentQuestion(nextByOrder); return; }

    // Step 3 — no more questions, submit
    submitToBackend(updatedScores, updatedReasons);
  };

  // ── Level display name ────────────────────────────────────
  const levelNames = {
    "10th": "10th Grade",
    "12th": "12th Grade",
    "grad": "Graduation",
    "pg":   "Post Graduation",
  };

  // ─────────────────────────────────────────────────────────
  // PERCENTAGE GATE SCREEN
  // ─────────────────────────────────────────────────────────
  if (!loading && !percentageConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Before we start
          </h2>
          <p className="text-gray-500 mb-2">
            {levelNames[level] || level} Career Quiz
          </p>
          <p className="text-gray-500 mb-8">
            What was your percentage in your last exam?
            <br />
            <span className="text-sm text-gray-400">
              (This helps us suggest colleges and realistic paths)
            </span>
          </p>

          <input
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 78"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full border-2 border-gray-200 focus:border-purple-400 outline-none rounded-xl px-4 py-3 text-center text-2xl font-bold mb-2 transition"
          />
          <p className="text-xs text-gray-400 mb-6">Enter a number between 0 and 100</p>

          <button
            onClick={() => setPercentageConfirmed(true)}
            disabled={!percentage || percentage < 0 || percentage > 100}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-40 transition"
          >
            Start Quiz →
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // LOADING
  // ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading your questions...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // ERROR
  // ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // SUBMITTING
  // ─────────────────────────────────────────────────────────
  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-800">Analysing your answers...</h2>
          <p className="text-gray-500 mt-2">Finding the best path for you</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-10 text-center text-gray-500">No questions found for this level.</div>;
  }

  // ─────────────────────────────────────────────────────────
  // QUIZ SCREEN
  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-center">

        {/* Progress */}
        <p className="text-sm text-gray-400 mb-1">
          {levelNames[level] || level} · Question {stepCount + 1}
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Answer honestly — there are no right or wrong answers
        </p>

        {/* Question */}
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(opt)}
              className="w-full py-3 px-4 rounded-xl border border-gray-300 hover:bg-purple-100 hover:border-purple-400 transition text-left font-medium text-gray-700"
            >
              {opt.option_text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default CareerQuestions;
