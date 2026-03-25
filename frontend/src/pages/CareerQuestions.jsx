import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

function CareerQuestions() {
  const { level } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const questionSet = {
  "10th": [
  {
    question: "If a fan or TV stops working at home, what will you do?",
    options: [
      { text: "🔧 Try to fix it myself", category: "Technology" },
      { text: "🌐 Search on the internet", category: "Technology" },
      { text: "📞 Call a technician", category: "Business" },
      { text: "😅 Ignore it", category: "Creative" },
    ],
  },
  {
    question: "What do you like to do in your free time?",
    options: [
      { text: "💻 Use computer/mobile to create things", category: "Technology" },
      { text: "🤝 Help people", category: "Healthcare" },
      { text: "💰 Think about money or business", category: "Business" },
      { text: "🎨 Draw or do creative work", category: "Creative" },
    ],
  },
  {
    question: "Which subject do you like the most in school?",
    options: [
      { text: "📊 Maths / Computer", category: "Technology" },
      { text: "🧬 Biology", category: "Healthcare" },
      { text: "📈 Business / Accounts", category: "Business" },
      { text: "📚 English / Art", category: "Creative" },
    ],
  },
  {
    question: "If you get a project, what will you choose?",
    options: [
      { text: "💻 Make an app or website", category: "Technology" },
      { text: "🩺 Study human body or health", category: "Healthcare" },
      { text: "💼 Create a business idea", category: "Business" },
      { text: "🎬 Design a poster or video", category: "Creative" },
    ],
  },
  {
    question: "What interests you the most?",
    options: [
      { text: "⚙️ Technology", category: "Technology" },
      { text: "❤️ Helping people", category: "Healthcare" },
      { text: "💸 Earning money / business", category: "Business" },
      { text: "🎨 Creative work", category: "Creative" },
    ],
  },
  {
    question: "When you face a problem, what do you do?",
    options: [
      { text: "🧠 Try to solve it myself", category: "Technology" },
      { text: "📱 Learn from internet", category: "Technology" },
      { text: "👥 Ask someone", category: "Business" },
      { text: "💡 Try a different idea", category: "Creative" },
    ],
  },
  {
    question: "What do you want to become in future?",
    options: [
      { text: "👨‍💻 Engineer / Developer", category: "Technology" },
      { text: "👩‍⚕️ Doctor / Nurse", category: "Healthcare" },
      { text: "📊 Businessman", category: "Business" },
      { text: "🎨 Designer / Artist", category: "Creative" },
    ],
  },
  {
    question: "Which type of work do you NOT like?",
    options: [
      { text: "📖 Reading theory", category: "Technology" },
      { text: "🩸 Medical things", category: "Healthcare" },
      { text: "➗ Maths calculations", category: "Creative" },
      { text: "🎨 Drawing", category: "Business" },
    ],
  },
  {
    question: "If you get ₹10,000, what will you do?",
    options: [
      { text: "🛒 Buy tech items", category: "Technology" },
      { text: "📚 Use for learning", category: "Healthcare" },
      { text: "📈 Start small business", category: "Business" },
      { text: "🎨 Spend on creative things", category: "Creative" },
    ],
  },
  {
    question: "How do you like to learn?",
    options: [
      { text: "🛠️ By practice", category: "Technology" },
      { text: "🎥 By watching videos", category: "Healthcare" },
      { text: "🗣️ By discussing", category: "Business" },
      { text: "🖌️ By visuals/drawing", category: "Creative" },
    ],
  },
  {
    question: "What type of work do you like?",
    options: [
      { text: "💻 Working on computer", category: "Technology" },
      { text: "👥 Working with people", category: "Healthcare" },
      { text: "💼 Managing money", category: "Business" },
      { text: "🎨 Creative work", category: "Creative" },
    ],
  },
  {
    question: "If you can become anything for a day, what will you choose?",
    options: [
      { text: "👨‍💻 Engineer", category: "Technology" },
      { text: "👩‍⚕️ Doctor", category: "Healthcare" },
      { text: "💼 Businessman", category: "Business" },
      { text: "🎨 Designer", category: "Creative" },
    ],
  },
  {
    question: "Your friend asks for help in studies. What will you do?",
    options: [
      { text: "📊 Explain step by step", category: "Technology" },
      { text: "🧠 Help understand concepts", category: "Healthcare" },
      { text: "💬 Motivate them", category: "Business" },
      { text: "🎨 Use creative methods", category: "Creative" },
    ],
  },
  {
    question: "You see a new idea online. What do you feel?",
    options: [
      { text: "🚀 I want to build something like this", category: "Technology" },
      { text: "🔍 I want to understand how it works", category: "Healthcare" },
      { text: "💰 I think how it can make money", category: "Business" },
      { text: "🎨 I want to make it more creative", category: "Creative" },
    ],
  },
  {
    question: "What kind of future life do you want?",
    options: [
      { text: "⚙️ Build things with technology", category: "Technology" },
      { text: "❤️ Help people and care for health", category: "Healthcare" },
      { text: "📈 Earn money and grow business", category: "Business" },
      { text: "🎨 Do creative and interesting work", category: "Creative" },
    ],
  }
] ,

    "12th": [
  {
    question: "What was your 12th percentage?",
    options: [
      { text: "🎯 Above 90%", category: "Technology" },
      { text: "📈 75% – 90%", category: "Technology" },
      { text: "📊 60% – 75%", category: "Business" },
      { text: "📉 Below 60%", category: "Creative" },
    ],
  },
  {
    question: "Which subject were you best at in 12th?",
    options: [
      { text: "📊 Maths / Physics", category: "Technology" },
      { text: "🧬 Biology", category: "Healthcare" },
      { text: "💰 Accounts / Economics", category: "Business" },
      { text: "🎨 Arts / Humanities", category: "Creative" },
    ],
  },
  {
    question: "What did you enjoy most while studying?",
    options: [
      { text: "🧠 Solving problems", category: "Technology" },
      { text: "📚 Understanding concepts", category: "Healthcare" },
      { text: "💼 Learning business ideas", category: "Business" },
      { text: "✍️ Creative writing/design", category: "Creative" },
    ],
  },
  {
    question: "When you visit a hospital, what interests you most?",
    options: [
      { text: "⚙️ Machines & equipment", category: "Technology" },
      { text: "👩‍⚕️ Doctors treating patients", category: "Healthcare" },
      { text: "🏢 Management system", category: "Business" },
      { text: "💭 Patient emotions", category: "Creative" },
    ],
  },
  {
    question: "If you get a project, what will you choose?",
    options: [
      { text: "💻 Build app/model", category: "Technology" },
      { text: "🧬 Study biology", category: "Healthcare" },
      { text: "📊 Business plan", category: "Business" },
      { text: "🎬 Creative content", category: "Creative" },
    ],
  },
  {
    question: "Which career do you like most?",
    options: [
      { text: "👨‍💻 Engineering / IT", category: "Technology" },
      { text: "👩‍⚕️ Medical", category: "Healthcare" },
      { text: "📈 Business", category: "Business" },
      { text: "🎨 Arts", category: "Creative" },
    ],
  },
  {
    question: "What type of problems do you like?",
    options: [
      { text: "⚙️ Technical problems", category: "Technology" },
      { text: "❤️ Health-related", category: "Healthcare" },
      { text: "💰 Business challenges", category: "Business" },
      { text: "🎨 Creative thinking", category: "Creative" },
    ],
  },
  {
    question: "How do you learn best?",
    options: [
      { text: "🛠️ Practice", category: "Technology" },
      { text: "📖 Understanding deeply", category: "Healthcare" },
      { text: "📊 Real-life examples", category: "Business" },
      { text: "🎨 Visual/creative methods", category: "Creative" },
    ],
  },
  {
    question: "What motivates you?",
    options: [
      { text: "🚀 Building things", category: "Technology" },
      { text: "❤️ Helping people", category: "Healthcare" },
      { text: "💸 Earning money", category: "Business" },
      { text: "🎨 Creativity", category: "Creative" },
    ],
  },
  {
    question: "What do you see yourself doing daily?",
    options: [
      { text: "💻 Coding", category: "Technology" },
      { text: "🩺 Treating people", category: "Healthcare" },
      { text: "📊 Managing money", category: "Business" },
      { text: "🎨 Designing", category: "Creative" },
    ],
  },
  {
    question: "If you get ₹50,000, what will you do?",
    options: [
      { text: "💻 Learn tech skills", category: "Technology" },
      { text: "📚 Learn medical topics", category: "Healthcare" },
      { text: "📈 Invest/start business", category: "Business" },
      { text: "🎨 Buy creative tools", category: "Creative" },
    ],
  },
  {
    question: "How do you handle pressure?",
    options: [
      { text: "🧠 Logical thinking", category: "Technology" },
      { text: "😌 Stay calm", category: "Healthcare" },
      { text: "📊 Practical approach", category: "Business" },
      { text: "🎨 Try creative solutions", category: "Creative" },
    ],
  },
  {
    question: "Which path sounds interesting to you?",
    options: [
      { text: "🎓 B.Tech", category: "Technology" },
      { text: "🩺 MBBS", category: "Healthcare" },
      { text: "💼 B.Com", category: "Business" },
      { text: "🎨 BA", category: "Creative" },
    ],
  },
  {
    question: "What do you prefer working with?",
    options: [
      { text: "⚙️ Machines", category: "Technology" },
      { text: "👥 People", category: "Healthcare" },
      { text: "💰 Money", category: "Business" },
      { text: "💡 Ideas", category: "Creative" },
    ],
  },
  {
    question: "What future do you want?",
    options: [
      { text: "🚀 Innovation", category: "Technology" },
      { text: "❤️ Helping people", category: "Healthcare" },
      { text: "📈 Financial success", category: "Business" },
      { text: "🎨 Creative success", category: "Creative" },
    ],
  },

  // 🔥 SCENARIO BASED (MOST IMPORTANT)
  {
    question: "Your laptop stops working before a deadline. What do you do?",
    options: [
      { text: "🔧 Try to fix it myself", category: "Technology" },
      { text: "🤝 Ask for help", category: "Healthcare" },
      { text: "📊 Find another solution", category: "Business" },
      { text: "😌 Stay calm and manage creatively", category: "Creative" },
    ],
  },
  {
    question: "Your friend is confused about career. What do you suggest?",
    options: [
      { text: "🧠 Follow skills", category: "Technology" },
      { text: "❤️ Help others", category: "Healthcare" },
      { text: "💰 Choose money field", category: "Business" },
      { text: "🎨 Follow passion", category: "Creative" },
    ],
  },
  {
    question: "You see a startup idea online. What do you think?",
    options: [
      { text: "⚙️ How it works", category: "Technology" },
      { text: "❤️ How it helps people", category: "Healthcare" },
      { text: "💰 How it earns money", category: "Business" },
      { text: "🎨 How to improve creatively", category: "Creative" },
    ],
  },
  {
    question: "In a group project, what role do you take?",
    options: [
      { text: "💻 Technical work", category: "Technology" },
      { text: "🤝 Support others", category: "Healthcare" },
      { text: "👑 Team leader", category: "Business" },
      { text: "🎨 Creative ideas", category: "Creative" },
    ],
  },
  {
    question: "You fail in an exam. What do you do?",
    options: [
      { text: "📊 Analyze mistakes", category: "Technology" },
      { text: "😌 Stay calm and retry", category: "Healthcare" },
      { text: "📈 Plan better strategy", category: "Business" },
      { text: "🎨 Try new method", category: "Creative" },
    ],
  }
] ,

    grad: [
  { 
    question: "What is your graduation degree?", 
    type: "input" 
  },

  {
    question: "What is your graduation percentage?",
    options: [
      { text: "🎯 Above 85%", category: "Technology" },
      { text: "📈 70% – 85%", category: "Technology" },
      { text: "📊 60% – 70%", category: "Business" },
      { text: "📉 Below 60%", category: "Creative" },
    ],
  },

  {
    question: "What was your 12th percentage?",
    options: [
      { text: "🎯 Above 90%", category: "Technology" },
      { text: "📈 75% – 90%", category: "Technology" },
      { text: "📊 60% – 75%", category: "Business" },
      { text: "📉 Below 60%", category: "Creative" },
    ],
  },

  {
    question: "What was your 10th percentage?",
    options: [
      { text: "🎯 Above 90%", category: "Technology" },
      { text: "📈 75% – 90%", category: "Technology" },
      { text: "📊 60% – 75%", category: "Business" },
      { text: "📉 Below 60%", category: "Creative" },
    ],
  },

  {
    question: "What type of work do you enjoy the most?",
    options: [
      { text: "💻 Coding / technical work", category: "Technology" },
      { text: "🔬 Research / analysis", category: "Healthcare" },
      { text: "👥 Managing people", category: "Business" },
      { text: "🎨 Creative work", category: "Creative" },
    ],
  },

  {
    question: "What was your role in college projects?",
    options: [
      { text: "💻 Developer", category: "Technology" },
      { text: "📊 Researcher", category: "Healthcare" },
      { text: "👑 Leader", category: "Business" },
      { text: "🎨 Designer", category: "Creative" },
    ],
  },

  {
    question: "What are your strongest skills?",
    options: [
      { text: "🧠 Programming / logic", category: "Technology" },
      { text: "📊 Analytical thinking", category: "Healthcare" },
      { text: "💬 Communication", category: "Business" },
      { text: "🎨 Creativity", category: "Creative" },
    ],
  },

  {
    question: "What type of career do you prefer?",
    options: [
      { text: "👨‍💻 IT / Engineering", category: "Technology" },
      { text: "🔬 Research / Science", category: "Healthcare" },
      { text: "📈 Business / Finance", category: "Business" },
      { text: "🎨 Creative / Media", category: "Creative" },
    ],
  },

  {
    question: "Do you want higher studies?",
    options: [
      { text: "🎓 M.Tech / MSc", category: "Technology" },
      { text: "🔬 PhD", category: "Healthcare" },
      { text: "💼 MBA", category: "Business" },
      { text: "🤔 Not sure", category: "Creative" },
    ],
  },

  // 🔥 SCENARIO BASED
  {
    question: "Your project deadline is tomorrow and work is incomplete. What do you do?",
    options: [
      { text: "⚙️ Fix it myself quickly", category: "Technology" },
      { text: "🔍 Analyze and improve", category: "Healthcare" },
      { text: "👥 Ask team for help", category: "Business" },
      { text: "🎨 Try a different approach", category: "Creative" },
    ],
  },

  {
    question: "You get a startup idea. What do you think first?",
    options: [
      { text: "⚙️ How to build it", category: "Technology" },
      { text: "🔬 Research deeply", category: "Healthcare" },
      { text: "💰 How to earn money", category: "Business" },
      { text: "🎨 Design creatively", category: "Creative" },
    ],
  }
],

    pg: [
  {
    question: "What is your specialization?",
    type: "input",
  },

  {
    question: "What is your highest qualification percentage?",
    options: [
      { text: "🎯 Above 85%", category: "Technology" },
      { text: "📈 70% – 85%", category: "Technology" },
      { text: "📊 60% – 70%", category: "Business" },
      { text: "📉 Below 60%", category: "Creative" },
    ],
  },

  {
    question: "What do you prefer now?",
    options: [
      { text: "💼 Job", category: "Technology" },
      { text: "🔬 Research", category: "Healthcare" },
      { text: "📈 Business", category: "Business" },
      { text: "🎓 Teaching", category: "Creative" },
    ],
  },

  {
    question: "What role suits you best?",
    options: [
      { text: "⚙️ Specialist / Expert", category: "Technology" },
      { text: "🔬 Researcher", category: "Healthcare" },
      { text: "👑 Manager / Leader", category: "Business" },
      { text: "🎨 Creator", category: "Creative" },
    ],
  },

  {
    question: "What type of work excites you?",
    options: [
      { text: "⚙️ Advanced technical problems", category: "Technology" },
      { text: "🔬 Research & discovery", category: "Healthcare" },
      { text: "📈 Business growth", category: "Business" },
      { text: "🎨 Creative innovation", category: "Creative" },
    ],
  },

  {
    question: "Do you want to pursue a PhD?",
    options: [
      { text: "🎓 Yes", category: "Healthcare" },
      { text: "🤔 Maybe", category: "Healthcare" },
      { text: "❌ No", category: "Technology" },
      { text: "😅 Not sure", category: "Creative" },
    ],
  },

  {
    question: "What type of job do you prefer?",
    options: [
      { text: "🏢 Corporate", category: "Technology" },
      { text: "🏫 Academic", category: "Healthcare" },
      { text: "📊 Business", category: "Business" },
      { text: "🎨 Creative field", category: "Creative" },
    ],
  },

  {
    question: "What is your strength now?",
    options: [
      { text: "🧠 Technical expertise", category: "Technology" },
      { text: "📚 Deep knowledge", category: "Healthcare" },
      { text: "👑 Leadership", category: "Business" },
      { text: "🎨 Creativity", category: "Creative" },
    ],
  },

  {
    question: "What motivates you?",
    options: [
      { text: "🚀 Innovation", category: "Technology" },
      { text: "🔬 Discovery", category: "Healthcare" },
      { text: "💰 Success / money", category: "Business" },
      { text: "🎨 Expression", category: "Creative" },
    ],
  },

  {
    question: "What kind of impact do you want to make?",
    options: [
      { text: "⚙️ Build products", category: "Technology" },
      { text: "🔬 Discover new things", category: "Healthcare" },
      { text: "📈 Create business", category: "Business" },
      { text: "🎨 Inspire people", category: "Creative" },
    ],
  },

  {
    question: "What is your career goal?",
    options: [
      { text: "👨‍💻 Senior Engineer / Expert", category: "Technology" },
      { text: "🔬 Scientist / Professor", category: "Healthcare" },
      { text: "👑 CEO / Manager", category: "Business" },
      { text: "🎨 Artist / Creator", category: "Creative" },
    ],
  },

  // 🔥 SCENARIO BASED (MOST IMPORTANT)
  {
    question: "You get a job offer and a PhD opportunity at the same time. What do you do?",
    options: [
      { text: "💼 Choose job", category: "Technology" },
      { text: "🔬 Choose research", category: "Healthcare" },
      { text: "📈 Think about business options", category: "Business" },
      { text: "🎨 Follow passion", category: "Creative" },
    ],
  },

  {
    question: "You have a strong idea. What will you do?",
    options: [
      { text: "⚙️ Build product", category: "Technology" },
      { text: "🔬 Research deeply", category: "Healthcare" },
      { text: "📈 Start business", category: "Business" },
      { text: "🎨 Create something unique", category: "Creative" },
    ],
  },

  {
    question: "You face failure in your career. What do you do?",
    options: [
      { text: "💻 Improve skills", category: "Technology" },
      { text: "📚 Study more deeply", category: "Healthcare" },
      { text: "📊 Change strategy", category: "Business" },
      { text: "🎨 Try a new path", category: "Creative" },
    ],
  }
],
  };

  const questions = questionSet[level] || [];

  // Convert category scores to skill scores for ML model
  const convertToSkillScores = (categoryScores) => {
    return {
      Python:       Math.min((categoryScores["Technology"] || 0), 3),
      SQL:          Math.min(Math.floor((categoryScores["Technology"] || 0) / 2), 2),
      HTML:         Math.min((categoryScores["Creative"] || 0), 2),
      CSS:          Math.min((categoryScores["Creative"] || 0), 2),
      Java:         Math.min((categoryScores["Technology"] || 0), 2),
      Communication:Math.min((categoryScores["Business"] || 0), 3),
      Logic:        Math.min((categoryScores["Technology"] || 0), 3),
      Math:         Math.min((categoryScores["Technology"] || 0), 3),
    }
  }

  // Called when last question is answered — submits to backend
  const submitToBackend = async (finalScores, finalReasons) => {
    setLoading(true)
    setError(null)

    try {
      const skillScores = convertToSkillScores(finalScores)

      // Call your ML predict endpoint
      const response = await API.post("/predict", skillScores)
      const topCareers = response.data.top_careers

      // Also save to quiz submit so it stores in database
      await API.post("/quiz/submit", {
        answers: finalReasons.reduce((acc, reason, i) => {
          acc[`q${i+1}`] = reason
          return acc
        }, {})
      })

      // Save full result to localStorage for result page
      localStorage.setItem("career_result", JSON.stringify({
        top_careers: topCareers,
        reasons: finalReasons,
        level: level,
        skill_scores: skillScores
      }))

      navigate("/result")

    } catch (err) {
      console.error("Submission failed", err)
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const handleAnswer = (opt) => {
    const updatedScores = { ...scores }
    updatedScores[opt.category] = (scores[opt.category] || 0) + 1

    const updatedReasons = [...reasons, opt.text]

    setScores(updatedScores)
    setReasons(updatedReasons)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // Last question — submit to backend
      submitToBackend(updatedScores, updatedReasons)
    }
  }

  const handleInput = (value) => {
    let category = "Business"
    const v = value.toLowerCase()
    if (v.includes("tech") || v.includes("engineering")) category = "Technology"
    else if (v.includes("medical")) category = "Healthcare"
    else if (v.includes("design") || v.includes("arts")) category = "Creative"
    handleAnswer({ text: value, category })
  }

  if (!questions.length) {
    return <div className="p-10 text-center">Invalid Path</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg text-center">

        {loading ? (
          <div>
            <div className="text-4xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-800">
              Analysing your answers...
            </h2>
            <p className="text-gray-500 mt-2">Our AI is finding the best career for you</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              Step {step + 1} of {questions.length}
            </p>

            <p className="text-sm text-gray-400 mb-2">
                Answer honestly — there are no right or wrong answers
            </p>

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {questions[step].question}
            </h2>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {questions[step].type === "input" ? (
              <input
                type="text"
                placeholder="Type your answer and press Enter"
                className="w-full p-3 border rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    handleInput(e.target.value.trim())
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
          </>
        )}

      </div>
    </div>
  )
}

export default CareerQuestions;