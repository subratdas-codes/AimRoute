import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const services = [
    {
      icon: "🧠",
      title: "Smart Career Assessment",
      desc: "Scenario-based questions that understand how you think.",
      detail: "Our quiz analyses your decision-making style, interests, and strengths to build a real profile of you — not just what subject you like.",
      color: "from-blue-100 to-blue-200",
    },
    {
      icon: "🤖",
      title: "AI Career Matching",
      desc: "Get careers that truly match your profile.",
      detail: "Our ML model evaluates your responses and predicts the best-fit careers with confidence scores — so you know exactly how strong each match is.",
      color: "from-purple-100 to-purple-200",
    },
    {
      icon: "🗺️",
      title: "Personalised Roadmap",
      desc: "Step-by-step journey to your future career.",
      detail: "We generate a roadmap specific to your education level — whether you're in 10th, 12th, graduation or post graduation.",
      color: "from-pink-100 to-pink-200",
    },
    {
      icon: "🏫",
      title: "College Suggestions",
      desc: "Find colleges based on your career and location.",
      detail: "Get real college recommendations filtered by your state, career match, and cutoff percentage — so you only see colleges that are realistic for you.",
      color: "from-green-100 to-green-200",
    },
    {
      icon: "📊",
      title: "Skill Insights",
      desc: "Understand your strengths clearly.",
      detail: "We break down your profile into skill categories — technical, creative, analytical, and interpersonal — so you know exactly where you stand.",
      color: "from-orange-100 to-orange-200",
    },
    {
      icon: "💾",
      title: "Save & Track Results",
      desc: "Revisit your career plan anytime.",
      detail: "Save your assessment results to your dashboard. Track how your interests evolve over time and compare results across multiple attempts.",
      color: "from-yellow-100 to-yellow-200",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Students guided" },
    { number: "50+", label: "Career paths mapped" },
    { number: "500+", label: "Colleges listed" },
    { number: "3 mins", label: "Average assessment time" },
  ];

  const howAIWorks = [
    { step: "01", title: "You answer questions", desc: "Scenario-based, not subject-based. No right or wrong." },
    { step: "02", title: "We score your profile", desc: "Each answer maps to skill categories — logic, creativity, communication, technical." },
    { step: "03", title: "ML model predicts", desc: "Our trained Random Forest model compares your profile to career patterns." },
    { step: "04", title: "You get ranked results", desc: "Top 3 careers with confidence %, roadmap, and matching colleges." },
  ];

  return (
    <div className="bg-white">

     {/* HERO */}
<section className="relative py-28 text-center bg-pink-200 border-b border-gray-100 overflow-hidden">
  {/* Subtle background decoration */}
  <div className="absolute top-0 left-0 w-full h-full opacity-5"
    style={{ backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)", backgroundSize: "30px 30px" }}
  />
  <div className="relative z-10 max-w-3xl mx-auto px-6">
    <div className="inline-block bg-purple-100 text-purple-700 text-sm px-4 py-1 rounded-full mb-6 font-medium">
      AI-Powered Career Guidance Platform
    </div>
    <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
      Everything You Need to <br />
      <span className="text-purple-600">Find Your Direction</span>
    </h1>
    <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
      AimRoute combines smart assessments, real ML models, and verified
      college data to give students clarity — not confusion.
    </p>
    <button
      onClick={() => navigate("/career-path")}
      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
    >
      Start Free Assessment
    </button>
    <p className="text-gray-400 text-sm mt-3">No login required to explore</p>
  </div>
</section>

      {/* STATS */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-purple-600">{s.number}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION / ABOUT */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="text-sm text-purple-600 font-medium mb-3">Our Mission</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Built for confused students,<br /> by students who were confused.
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              After 10th, after 12th, after graduation — every student faces the
              same question: "What do I do next?" Most guidance is generic, outdated,
              or just a list of options. We built AimRoute to change that.
            </p>
            <p className="text-gray-500 leading-relaxed">
              AimRoute uses a real machine learning model trained on career patterns
              to give you a personalised result — not a one-size-fits-all answer.
              Every student gets a different result because every student is different.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            {[
              { icon: "🎯", label: "Personalised", desc: "Every result is unique to you" },
              { icon: "🔬", label: "ML Powered", desc: "Real model, not just rules" },
              { icon: "📍", label: "Location Aware", desc: "Colleges near you" },
              { icon: "🆓", label: "Free to Use", desc: "No payment needed" },
            ].map((item, i) => (
              <div key={i} className="bg-purple-50 rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold text-gray-800 text-sm">{item.label}</div>
                <div className="text-gray-500 text-xs mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW AI WORKS */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">Under the Hood</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How the AI Actually Works</h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto">
            Not magic — real machine learning. Here's exactly what happens when you take the assessment.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {howAIWorks.map((item, i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 shadow text-left">
                {i < howAIWorks.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 w-6 h-0.5 bg-purple-400 z-10" />
                )}
                <div className="text-2xl font-bold text-purple-300 mb-3">{item.step}</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">What We Offer</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Everything in One Place</h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto">
            Click any service to learn more about how it works.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                onClick={() => setSelected(service)}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 text-left"
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${service.color} text-2xl mb-5`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                <div className="mt-4 text-purple-500 text-sm font-medium">
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR WHICH STUDENTS */}
      <section className="py-20 bg-purple-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Who is AimRoute For?</h2>
          <p className="text-gray-500 mb-12">Every student at every stage of their education journey.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { level: "After 10th", icon: "📚", desc: "Confused between Science, Commerce, Arts or Diploma?", path: "/career-path/10th" },
              { level: "After 12th", icon: "🎓", desc: "Not sure which degree or entrance exam to target?", path: "/career-path/12th" },
              { level: "Graduation", icon: "💼", desc: "Deciding between job, MBA, M.Tech or government exams?", path: "/career-path/grad" },
              { level: "Post Graduation", icon: "🔬", desc: "Exploring research, PhD, senior roles or specialisation?", path: "/career-path/pg" },
            ].map((item, i) => (
              <div
                key={i}
                onClick={() => navigate(item.path)}
                className="bg-white rounded-2xl p-6 shadow hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer text-left"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.level}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
                <div className="mt-4 text-purple-500 text-sm font-medium">Start now →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to Find Your Direction?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Takes less than 3 minutes. No login required. Get your personalised career result instantly.
        </p>
        <button
          onClick={() => navigate("/career-path")}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-5 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-110 transition duration-300"
        >
          Start Free Assessment
        </button>
        <p className="text-gray-400 mt-3 text-sm">Free · No login required · Results in 3 minutes</p>
      </section>

      {/* MODAL */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white p-10 rounded-2xl shadow-2xl w-[420px] text-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-gradient-to-br ${selected.color} text-3xl mb-4`}>
              {selected.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{selected.title}</h2>
            <p className="text-gray-500 leading-relaxed">{selected.detail}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;