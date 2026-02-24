import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// 🔥 Career Mapping Logic
const careerDetails = {
  Technology: {
    stream: "Science (PCM)",
    careers: ["Software Engineer", "Data Scientist", "AI Engineer", "Cyber Security Expert"],
    exams: ["JEE", "BITSAT", "VITEEE"],
    reason: "You show strong analytical and logical thinking skills."
  },
  Healthcare: {
    stream: "Science (PCB)",
    careers: ["Doctor", "Nurse", "Physiotherapist", "Pharmacist"],
    exams: ["NEET"],
    reason: "You have empathy and enjoy helping others."
  },
  Business: {
    stream: "Commerce",
    careers: ["CA", "MBA", "Entrepreneur", "Financial Analyst"],
    exams: ["CUET", "CAT", "CA Foundation"],
    reason: "You have leadership qualities and financial interest."
  },
  Creative: {
    stream: "Arts / Any Stream",
    careers: ["Graphic Designer", "Animator", "Content Creator", "Fashion Designer"],
    exams: ["NID", "NIFT"],
    reason: "You are imaginative and enjoy creative expression."
  }
};

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const scores = location.state?.scores || {};
  const educationLevel = scores.educationLevel;

  // 🔥 Remove educationLevel from scoring
  const filteredScores = Object.fromEntries(
    Object.entries(scores).filter(([key]) => key !== "educationLevel")
  );

  const sorted = Object.entries(filteredScores).sort((a, b) => b[1] - a[1]);
  const topCareer = sorted.length > 0 ? sorted[0][0] : null;

  const details = careerDetails[topCareer];

  const data = {
    labels: Object.keys(filteredScores),
    datasets: [
      {
        label: "Your Score",
        data: Object.values(filteredScores),
        backgroundColor: "#7C3AED"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center px-6 py-20">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-4xl">

        <h2 className="text-3xl font-bold text-center mb-8">
          Your Career Recommendation
        </h2>

        {topCareer ? (
          <>
            <div className="text-center mb-6">
              {educationLevel === "After10th" && (
                <p className="text-lg">
                  Since you completed 10th, we recommend choosing this stream:
                </p>
              )}

              {educationLevel && educationLevel !== "After10th" && (
                <p className="text-lg">
                  Based on your 12th background, here is a suitable career path:
                </p>
              )}

              <p className="text-2xl font-bold text-purple-600 mt-3">
                {topCareer}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">

              <div>
                <h3 className="font-semibold mb-2">
                  {educationLevel === "After10th"
                    ? "Recommended Stream:"
                    : "Suggested Degree / Field:"}
                </h3>
                <p className="text-gray-700">{details?.stream}</p>

                <h3 className="font-semibold mt-4 mb-2">Top Career Options:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {details?.careers.map((career, i) => (
                    <li key={i}>{career}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mt-4 mb-2">Entrance Exams:</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {details?.exams.map((exam, i) => (
                    <li key={i}>{exam}</li>
                  ))}
                </ul>

                <h3 className="font-semibold mt-4 mb-2">Why This Suits You:</h3>
                <p className="text-gray-700">{details?.reason}</p>
              </div>

              <div>
                <Bar data={data} />
              </div>

            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            Please complete the quiz first.
          </p>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate("/quiz")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Retake Quiz
          </button>
        </div>

      </div>
    </div>
  );
}

export default Result;