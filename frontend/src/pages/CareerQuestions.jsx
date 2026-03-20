import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function CareerQuestions() {
  const { level } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [reasons, setReasons] = useState([]);

  // 🔥 QUESTIONS (10 each + input for grad)
  const questionSet = {

  // 🟣 AFTER 10TH
  "10th": [
    {
      question: "What is your percentage?",
      options: [
        { text: "Above 90%", category: "Technology" },
        { text: "70-90%", category: "Technology" },
        { text: "50-70%", category: "Business" },
        { text: "Below 50%", category: "Creative" },
      ],
    },
    {
      question: "Which subject do you enjoy most?",
      options: [
        { text: "Mathematics", category: "Technology" },
        { text: "Biology", category: "Healthcare" },
        { text: "Business Studies", category: "Business" },
        { text: "Arts", category: "Creative" },
      ],
    },
    {
      question: "What type of problems do you like?",
      options: [
        { text: "Logical", category: "Technology" },
        { text: "Helping people", category: "Healthcare" },
        { text: "Business ideas", category: "Business" },
        { text: "Creative design", category: "Creative" },
      ],
    },
    {
      question: "What motivates you?",
      options: [
        { text: "Innovation", category: "Technology" },
        { text: "Helping others", category: "Healthcare" },
        { text: "Money", category: "Business" },
        { text: "Creativity", category: "Creative" },
      ],
    },
    {
      question: "Your strength?",
      options: [
        { text: "Logical thinking", category: "Technology" },
        { text: "Empathy", category: "Healthcare" },
        { text: "Leadership", category: "Business" },
        { text: "Creativity", category: "Creative" },
      ],
    },
    {
      question: "Preferred work environment?",
      options: [
        { text: "Office", category: "Technology" },
        { text: "Hospital", category: "Healthcare" },
        { text: "Corporate", category: "Business" },
        { text: "Studio", category: "Creative" },
      ],
    },
    {
      question: "Do you like numbers?",
      options: [
        { text: "Yes", category: "Technology" },
        { text: "Sometimes", category: "Business" },
        { text: "No", category: "Creative" },
      ],
    },
    {
      question: "Your dream career?",
      options: [
        { text: "Engineer", category: "Technology" },
        { text: "Doctor", category: "Healthcare" },
        { text: "Entrepreneur", category: "Business" },
        { text: "Artist", category: "Creative" },
      ],
    },
  ],

  // 🔵 AFTER 12TH
  "12th": [
    {
      question: "Which stream did you choose?",
      options: [
        { text: "Science", category: "Technology" },
        { text: "Commerce", category: "Business" },
        { text: "Arts", category: "Creative" },
      ],
    },
    {
      question: "Your percentage in 12th?",
      options: [
        { text: "Above 90%", category: "Technology" },
        { text: "70-90%", category: "Technology" },
        { text: "50-70%", category: "Business" },
        { text: "Below 50%", category: "Creative" },
      ],
    },
    {
      question: "What interests you most?",
      options: [
        { text: "Coding", category: "Technology" },
        { text: "Medical", category: "Healthcare" },
        { text: "Finance", category: "Business" },
        { text: "Design", category: "Creative" },
      ],
    },
    {
      question: "Your strength?",
      options: [
        { text: "Logic", category: "Technology" },
        { text: "Helping people", category: "Healthcare" },
        { text: "Management", category: "Business" },
        { text: "Creativity", category: "Creative" },
      ],
    },
    {
      question: "Preferred career?",
      options: [
        { text: "Engineer", category: "Technology" },
        { text: "Doctor", category: "Healthcare" },
        { text: "Business", category: "Business" },
        { text: "Media", category: "Creative" },
      ],
    },
    {
      question: "Do you like leadership?",
      options: [
        { text: "Yes", category: "Business" },
        { text: "No", category: "Technology" },
      ],
    },
    {
      question: "Work environment?",
      options: [
        { text: "Office", category: "Technology" },
        { text: "Hospital", category: "Healthcare" },
        { text: "Corporate", category: "Business" },
        { text: "Studio", category: "Creative" },
      ],
    },
    {
      question: "Future goal?",
      options: [
        { text: "Tech job", category: "Technology" },
        { text: "Medical", category: "Healthcare" },
        { text: "Entrepreneur", category: "Business" },
        { text: "Designer", category: "Creative" },
      ],
    },
  ],

  // 🟢 GRADUATION
  "grad": [
    {
      question: "What is your graduation degree?",
      type: "input",
    },
    {
      question: "What is your percentage?",
      options: [
        { text: "Above 90%", category: "Technology" },
        { text: "70-90%", category: "Technology" },
        { text: "50-70%", category: "Business" },
        { text: "Below 50%", category: "Creative" },
      ],
    },
    {
      question: "Your main interest?",
      options: [
        { text: "Tech", category: "Technology" },
        { text: "Healthcare", category: "Healthcare" },
        { text: "Business", category: "Business" },
        { text: "Creative", category: "Creative" },
      ],
    },
    {
      question: "What are your skills?",
      options: [
        { text: "Coding", category: "Technology" },
        { text: "Communication", category: "Business" },
        { text: "Design", category: "Creative" },
        { text: "Care", category: "Healthcare" },
      ],
    },
    {
      question: "Your goal?",
      options: [
        { text: "Job", category: "Technology" },
        { text: "Higher study", category: "Technology" },
        { text: "Startup", category: "Business" },
      ],
    },
    {
      question: "Work preference?",
      options: [
        { text: "Corporate", category: "Business" },
        { text: "Tech company", category: "Technology" },
        { text: "Creative field", category: "Creative" },
      ],
    },
    {
      question: "Do you like leadership?",
      options: [
        { text: "Yes", category: "Business" },
        { text: "No", category: "Technology" },
      ],
    },
    {
      question: "Future vision?",
      options: [
        { text: "Engineer", category: "Technology" },
        { text: "Manager", category: "Business" },
        { text: "Artist", category: "Creative" },
      ],
    },
  ],

  // 🟡 POST GRADUATION (MASTERS)
  "pg": [
    {
      question: "What is your specialization?",
      type: "input",
    },
    {
      question: "Your main focus?",
      options: [
        { text: "Research", category: "Healthcare" },
        { text: "Corporate job", category: "Technology" },
        { text: "Business growth", category: "Business" },
      ],
    },
    {
      question: "Your strength?",
      options: [
        { text: "Technical", category: "Technology" },
        { text: "Management", category: "Business" },
        { text: "Creative", category: "Creative" },
      ],
    },
    {
      question: "Your goal?",
      options: [
        { text: "High salary job", category: "Technology" },
        { text: "Entrepreneur", category: "Business" },
        { text: "Researcher", category: "Healthcare" },
      ],
    },
    {
      question: "Work preference?",
      options: [
        { text: "Corporate", category: "Business" },
        { text: "Tech", category: "Technology" },
        { text: "Creative", category: "Creative" },
      ],
    },
    {
      question: "Leadership role?",
      options: [
        { text: "Yes", category: "Business" },
        { text: "No", category: "Technology" },
      ],
    },
    {
      question: "Future plan?",
      options: [
        { text: "Job", category: "Technology" },
        { text: "Startup", category: "Business" },
        { text: "Research", category: "Healthcare" },
      ],
    },
    {
      question: "What excites you?",
      options: [
        { text: "Innovation", category: "Technology" },
        { text: "Helping", category: "Healthcare" },
        { text: "Money", category: "Business" },
      ],
    },
  ],
};

  const questions = questionSet[level] || [];

  // 🔥 MCQ handler
  const handleAnswer = (opt) => {
    const updatedScores = { ...scores };
    updatedScores[opt.category] = (scores[opt.category] || 0) + 1;

    setScores(updatedScores);
    setReasons([...reasons, opt.text]);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const sorted = Object.entries(updatedScores).sort((a, b) => b[1] - a[1]);
      const topCareer = sorted[0][0];

      navigate("/result", {
        state: { career: topCareer, reasons },
      });
    }
  };

  // 🔥 Input handler
  const handleInput = (value) => {
    let category = "Business";

    if (value.toLowerCase().includes("tech") || value.toLowerCase().includes("engineering")) {
      category = "Technology";
    } else if (value.toLowerCase().includes("medical")) {
      category = "Healthcare";
    } else if (value.toLowerCase().includes("design") || value.toLowerCase().includes("arts")) {
      category = "Creative";
    }

    handleAnswer({ text: value, category });
  };

  if (!questions.length) {
    return <div className="p-10 text-center">Invalid Path</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-center">

        <p className="text-sm text-gray-500 mb-2">
          Step {step + 1} of {questions.length}
        </p>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          {questions[step].question}
        </h2>

        {/* 🔥 Input Field */}
        {questions[step].type === "input" ? (
          <input
            type="text"
            placeholder="Enter your degree and press Enter"
            className="w-full p-3 border rounded-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleInput(e.target.value);
              }
            }}
          />
        ) : (
          <div className="space-y-4">
            {questions[step].options.map((opt, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(opt)}
                className="w-full py-3 rounded-xl border border-gray-300 hover:bg-purple-100 transition"
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default CareerQuestions;