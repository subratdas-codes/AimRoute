import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const { career, reasons, level, scores } = location.state || {};

  if (!career) {
    return <div className="p-10 text-center">No Result Found</div>;
  }

  // 🔥 Career Data
  const careerData = {
    Technology: {
      title: "Technology Field 💻",
      description:
        "You are inclined towards logical thinking and problem-solving, making technology a great fit for you.",

      nextSteps: {
        "10th": "Choose Science stream (PCM) in +2.",
        "12th": "Pursue BTech, BCA or similar degree.",
        "grad": "Apply for tech jobs or go for MCA/MBA.",
        "pg": "Advance in specialized tech roles or leadership.",
      },

      roadmap: "10th → 12th Science → BTech → Software Engineer",

      skills: ["Programming", "Logical Thinking", "Problem Solving"],

      careers: [
        "Software Engineer",
        "Data Scientist",
        "AI Engineer",
        "Cyber Security Expert",
      ],

      salary: "₹5 LPA – ₹25 LPA",
    },

    Business: {
      title: "Business & Management 💼",
      description:
        "You have leadership qualities and interest in management and finance.",

      nextSteps: {
        "10th": "Choose Commerce stream in +2.",
        "12th": "Pursue BBA, BCom or related fields.",
        "grad": "Go for MBA or start business.",
        "pg": "Advance into leadership roles or entrepreneurship.",
      },

      roadmap: "10th → Commerce → BBA → MBA → Manager",

      skills: ["Communication", "Leadership", "Financial Knowledge"],

      careers: [
        "Entrepreneur",
        "Business Analyst",
        "Manager",
        "Financial Analyst",
      ],

      salary: "₹4 LPA – ₹20 LPA",
    },

    Healthcare: {
      title: "Healthcare Field 🏥",
      description:
        "You are empathetic and interested in helping people, making healthcare ideal for you.",

      nextSteps: {
        "10th": "Choose Science stream (PCB).",
        "12th": "Prepare for NEET and pursue MBBS.",
        "grad": "Specialize in medical field.",
        "pg": "Become expert doctor or researcher.",
      },

      roadmap: "10th → 12th PCB → MBBS → Doctor",

      skills: ["Empathy", "Biology Knowledge", "Patience"],

      careers: ["Doctor", "Nurse", "Physiotherapist"],

      salary: "₹6 LPA – ₹30 LPA",
    },

    Creative: {
      title: "Creative Field 🎨",
      description:
        "You have imagination and artistic thinking, perfect for creative careers.",

      nextSteps: {
        "10th": "Choose Arts or any flexible stream.",
        "12th": "Pursue Design / Media courses.",
        "grad": "Build portfolio and skills.",
        "pg": "Specialize in creative domain.",
      },

      roadmap: "10th → Arts → Design Course → Creative Career",

      skills: ["Creativity", "Design Thinking", "Communication"],

      careers: [
        "Graphic Designer",
        "Animator",
        "Content Creator",
      ],

      salary: "₹3 LPA – ₹15 LPA",
    },
  };

  const data = careerData[career];

  // 🔥 Graph Data
  const chartData = {
    labels: Object.keys(scores || {}),
    datasets: [
      {
        label: "Your Career Fit Score",
        data: Object.values(scores || {}),
        backgroundColor: "#7C3AED",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-6 py-20">

      <div className="bg-white p-10 rounded-3xl shadow-xl max-w-5xl w-full mx-auto">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">
          🎯 Your Career Direction
        </h2>

        <h3 className="text-2xl text-purple-600 font-semibold text-center mb-4">
          {data.title}
        </h3>

        <p className="text-center text-gray-600 mb-8">
          {data.description}
        </p>

        {/* 🔥 GRAPH */}
        <div className="mb-10">
          <h4 className="font-semibold mb-3 text-center">
            📊 Your Profile Analysis
          </h4>
          <Bar data={chartData} />
        </div>

        {/* Next Step */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">📍 What you should do next:</h4>
          <p className="text-gray-700">
            {data.nextSteps[level]}
          </p>
        </div>

        {/* Roadmap */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">🛤 Career Roadmap:</h4>
          <p className="text-gray-700">{data.roadmap}</p>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">🛠 Skills Required:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {data.skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* Careers */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">💼 Career Options:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {data.careers.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>

        {/* Salary */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">💰 Salary Range:</h4>
          <p className="text-gray-700">{data.salary}</p>
        </div>

        {/* Reasons */}
        <div>
          <h4 className="font-semibold mb-2">📊 Why this suits you:</h4>
          <ul className="list-disc list-inside text-gray-700">
            {reasons?.map((r, i) => (
              <li key={i}>✔ {r}</li>
            ))}
          </ul>
        </div>

        {/* 🔥 RETAKE BUTTON */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate("/career-path");
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-500 
                       text-white px-8 py-3 rounded-xl font-semibold 
                       shadow-lg hover:scale-105 transition duration-300"
          >
            🔄 Retake Assessment
          </button>
        </div>

      </div>
    </div>
  );
}

export default Result;