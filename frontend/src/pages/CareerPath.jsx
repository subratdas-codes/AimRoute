import { useNavigate } from "react-router-dom";

function CareerPath() {
  const navigate = useNavigate();

  const levels = [
    {
      title: "After 10th",
      desc: "Choose the right stream for your future",
      icon: "🎓",
      value: "10th",
    },
    {
      title: "After 12th",
      desc: "Select the best degree and career path",
      icon: "📘",
      value: "12th",
    },
    {
      title: "Graduation",
      desc: "Find jobs or higher studies options",
      icon: "🎓",
      value: "grad",
    },
    {
      title: "Post Graduation",
      desc: "Advance your career and specialization",
      icon: "🎓",
      value: "pg",
    },
  ];

  const handleSelect = (level) => {
    console.log("Selected:", level);

    // 👉 next step (we’ll build later)
    navigate(`/career-path/${level}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 pt-28 px-6 text-center">

      {/* Heading */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Discover Your Career Path 🚀
      </h1>

      <p className="text-gray-500 mb-12">
        Select your current stage to get personalized guidance
      </p>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-10">

        {levels.map((item, index) => (
          <div
            key={index}
            onClick={() => handleSelect(item.value)}
            className="bg-white/60 backdrop-blur-lg p-8 w-72 rounded-3xl shadow-md 
                       cursor-pointer transition transform hover:-translate-y-3 hover:shadow-2xl border border-white/40"
          >
            <div className="text-5xl mb-4">{item.icon}</div>

            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {item.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {item.desc}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default CareerPath;