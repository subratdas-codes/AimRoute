import { useState } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    question: "What is your current education level?",
    options: [
      { text: "I have completed 10th", category: "After10th" },
      { text: "I have completed 12th (Science)", category: "After12thScience" },
      { text: "I have completed 12th (Commerce)", category: "After12thCommerce" },
      { text: "I have completed 12th (Arts)", category: "After12thArts" }
    ]
  },
  {
    question: "Which subject do you enjoy the most?",
    options: [
      { text: "Mathematics", category: "Technology" },
      { text: "Biology", category: "Healthcare" },
      { text: "Business Studies", category: "Business" },
      { text: "Fine Arts / Literature", category: "Creative" }
    ]
  },
  {
    question: "What type of problems do you enjoy solving?",
    options: [
      { text: "Technical or coding problems", category: "Technology" },
      { text: "Health-related issues", category: "Healthcare" },
      { text: "Business or money problems", category: "Business" },
      { text: "Creative design challenges", category: "Creative" }
    ]
  },
  {
    question: "Which activity sounds more exciting?",
    options: [
      { text: "Developing an app", category: "Technology" },
      { text: "Working in a hospital", category: "Healthcare" },
      { text: "Starting your own company", category: "Business" },
      { text: "Designing a brand logo", category: "Creative" }
    ]
  },
  {
    question: "How do people describe you?",
    options: [
      { text: "Logical and analytical", category: "Technology" },
      { text: "Kind and empathetic", category: "Healthcare" },
      { text: "Confident and leadership-oriented", category: "Business" },
      { text: "Creative and imaginative", category: "Creative" }
    ]
  },
  {
    question: "What kind of work environment do you prefer?",
    options: [
      { text: "Office with computers", category: "Technology" },
      { text: "Hospital or clinic", category: "Healthcare" },
      { text: "Corporate office", category: "Business" },
      { text: "Studio or creative workspace", category: "Creative" }
    ]
  },
  {
    question: "What motivates you the most?",
    options: [
      { text: "Building innovative solutions", category: "Technology" },
      { text: "Helping people recover", category: "Healthcare" },
      { text: "Achieving financial success", category: "Business" },
      { text: "Expressing ideas artistically", category: "Creative" }
    ]
  },
  {
    question: "Do you enjoy leadership roles?",
    options: [
      { text: "Yes, I love leading projects", category: "Business" },
      { text: "I prefer technical roles", category: "Technology" },
      { text: "I guide and support people", category: "Healthcare" },
      { text: "I lead creative teams", category: "Creative" }
    ]
  },
  {
    question: "Are you interested in serving the nation?",
    options: [
      { text: "Yes, through civil services", category: "Government" },
      { text: "Through technology development", category: "Technology" },
      { text: "Through healthcare service", category: "Healthcare" },
      { text: "Through administration", category: "Government" }
    ]
  },
  {
    question: "Which skill are you strongest in?",
    options: [
      { text: "Coding and logical thinking", category: "Technology" },
      { text: "Understanding human behavior", category: "Healthcare" },
      { text: "Negotiation and management", category: "Business" },
      { text: "Designing and storytelling", category: "Creative" }
    ]
  },
  {
    question: "What kind of future do you imagine?",
    options: [
      { text: "Working in a tech company", category: "Technology" },
      { text: "Becoming a doctor or nurse", category: "Healthcare" },
      { text: "Running my own business", category: "Business" },
      { text: "Working in media or design", category: "Creative" }
    ]
  },
  {
    question: "Do you enjoy analyzing data?",
    options: [
      { text: "Yes, I love numbers", category: "Technology" },
      { text: "Sometimes, for patient care", category: "Healthcare" },
      { text: "Yes, for financial planning", category: "Business" },
      { text: "Not really", category: "Creative" }
    ]
  },
  {
    question: "Would you prefer job stability or creativity?",
    options: [
      { text: "Stable tech job", category: "Technology" },
      { text: "Stable healthcare career", category: "Healthcare" },
      { text: "Stable business career", category: "Business" },
      { text: "Creative freedom", category: "Creative" }
    ]
  }
];

// Map education level to level key
const EDUCATION_LEVEL_MAP = {
  After10th:           { level: "10th",  level_label: "10TH" },
  After12thScience:    { level: "12th",  level_label: "12TH" },
  After12thCommerce:   { level: "12th",  level_label: "12TH" },
  After12thArts:       { level: "12th",  level_label: "12TH" },
};

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores]   = useState({});
  const navigate              = useNavigate();

  const handleAnswer = (category) => {
    let updatedScores = { ...scores };

    if (category.startsWith("After")) {
      updatedScores.educationLevel = category;
    } else {
      updatedScores[category] = (scores[category] || 0) + 1;
    }

    setScores(updatedScores);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      // ── Compute dominant category ──
      const categoryScores = { ...updatedScores };
      delete categoryScores.educationLevel;

      const dominant_category = Object.keys(categoryScores).length > 0
        ? Object.keys(categoryScores).reduce((a, b) =>
            categoryScores[a] >= categoryScores[b] ? a : b
          )
        : "Technology";

      // ── Compute level from education answer ──
      const eduLevel = EDUCATION_LEVEL_MAP[updatedScores.educationLevel];
      const level       = eduLevel?.level       || "12th";
      const level_label = eduLevel?.level_label || "12TH";

      // ── Save to localStorage so ChatBot picks it up ──
      const career_result = {
        dominant_category,
        level,
        level_label,
        percentage: null, // quiz doesn't ask percentage — kept null
        scores: categoryScores,
      };

      localStorage.setItem("career_result", JSON.stringify(career_result));

      navigate("/result", { state: { scores: updatedScores } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-2xl">

        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {current + 1}</span>
            <span>{questions.length} Total</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* QUESTION */}
        <h2 className="text-2xl font-bold mb-8 text-center">
          {questions[current].question}
        </h2>

        {/* OPTIONS */}
        <div className="space-y-4">
          {questions[current].options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(opt.category)}
              className="w-full text-left px-6 py-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-400 transition duration-200"
            >
              {opt.text}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Quiz;