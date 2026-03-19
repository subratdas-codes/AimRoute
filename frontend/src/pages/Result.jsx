import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const career = location.state?.career;

  const details = {
    Technology: "You should explore Software, AI, Data Science 🚀",
    Healthcare: "You can become Doctor, Nurse, or Medical Expert 🏥",
    Business: "You are great for Entrepreneurship & Finance 💼",
    Creative: "You fit in Design, Media & Creative Fields 🎨",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">

        <h2 className="text-3xl font-bold mb-4">
          🎯 Your Career Path
        </h2>

        <p className="text-2xl text-purple-600 font-semibold">
          {career}
        </p>

        <p className="mt-4 text-gray-600">
          {details[career]}
        </p>

      </div>

    </div>
  );
}

export default Result;