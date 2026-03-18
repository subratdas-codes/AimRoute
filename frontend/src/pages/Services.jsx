import React, { useState } from "react";

const Services = () => {
  const [selected, setSelected] = useState(null);

  const services = [
    {
      icon: "🧠",
      title: "Career Assessment",
      desc: "Take a short quiz to discover careers that match your interests.",
      detail:
        "Students take a structured quiz that evaluates interests, skills, and preferences to identify suitable career paths.",
    },
    {
      icon: "🤖",
      title: "Smart Recommendation",
      desc: "Our system analyzes answers and suggests suitable careers.",
      detail:
        "The system processes quiz responses and recommends the most relevant career paths using intelligent analysis.",
    },
    {
      icon: "🎯",
      title: "Career Guidance",
      desc: "Guidance to choose the right skills and career path.",
      detail:
        "Students receive guidance about skill development, learning paths, and career opportunities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-6 text-center">

      <h1 className="text-4xl font-bold mb-16 text-gray-800">
        Our Services
      </h1>

      <div className="flex flex-wrap justify-center gap-10">

        {services.map((service, index) => (
          <div
            key={index}
            onClick={() => setSelected(service)}
            className="bg-white p-8 w-72 rounded-2xl shadow-md cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-200"
          >
            <div className="text-4xl mb-4">{service.icon}</div>

            <h3 className="text-lg font-semibold mb-2">
              {service.title}
            </h3>

            <p className="text-gray-500 text-sm">
              {service.desc}
            </p>
          </div>
        ))}

      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">

          <div className="bg-white rounded-2xl p-10 w-[420px] text-center shadow-2xl border border-gray-100 animate-[pop_0.25s_ease]">

            <div className="text-5xl mb-4">
              {selected.icon}
            </div>

            <h2 className="text-2xl font-bold mb-3">
              {selected.title}
            </h2>

            <p className="text-gray-600">
              {selected.detail}
            </p>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default Services;