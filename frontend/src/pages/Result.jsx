

import React, { useEffect, useState } from "react";
import API from "../services/api";

// ── Indian states list ────────────────────────────────────────
const INDIAN_STATES = [
  "All States", "Andhra Pradesh", "Assam", "Bihar", "Delhi",
  "Gujarat", "Haryana", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

// ── Level labels ──────────────────────────────────────────────
const LEVEL_LABELS = {
  "10th": {
    title:    "Recommended streams after 10th",
    subtitle: "Choose the path that matches your interest",
    badge:    "Stream Options",
  },
  "12th": {
    title:    "Best degree options after 12th",
    subtitle: "Your interest points to these degrees and colleges",
    badge:    "Degree Paths",
  },
  "grad": {
    title:    "Your next best step after graduation",
    subtitle: "PG programs, job paths, and Govt exam options",
    badge:    "PG & Career",
  },
  "pg": {
    title:    "Career paths after post graduation",
    subtitle: "Specialisation, research, Govt, and industry roles",
    badge:    "Advanced Careers",
  },
};

// ── Roadmap steps per level ───────────────────────────────────
const ROADMAP = {
  "10th": ["10th Exam", "Choose Stream", "11th & 12th", "Degree / Diploma", "Career"],
  "12th": ["12th Exam", "Entrance Exam", "Degree (3–5 yrs)", "Job / PG", "Career"],
  "grad": ["Graduation", "Entrance / Job", "PG / Certification", "Senior Role", "Career"],
  "pg":   ["PG Degree", "Specialisation", "Research / Industry", "Leadership", "Career"],
};

// ── Fit badge colours ─────────────────────────────────────────
const FIT_COLORS = {
  "Excellent fit":               "bg-green-100 text-green-700 border-green-300",
  "Good fit":                    "bg-blue-100 text-blue-700 border-blue-300",
  "Worth exploring":             "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Aspirational — needs strong prep": "bg-orange-100 text-orange-700 border-orange-300",
};

// ── Category icons ────────────────────────────────────────────
const CAT_ICON = {
  Technology: "💻",
  Business:   "💼",
  Creative:   "🎨",
  Healthcare: "🏥",
  general:    "🎯",
};

const Result = () => {
  const [data, setData]                   = useState(null);
  const [colleges, setColleges]           = useState([]);
  const [selectedState, setSelectedState] = useState("All States");
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [saving, setSaving]               = useState(false);
  const [activeTab, setActiveTab]         = useState(0); // which career card is expanded

  // ── Load result from localStorage ────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("career_result");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData(parsed);
      if (parsed.top_careers && parsed.top_careers.length > 0) {
        fetchColleges(parsed.top_careers[0].career, "All States");
      }
    }
  }, []);

  // ── Fetch colleges ────────────────────────────────────────
  const fetchColleges = async (career, state) => {
    setLoadingColleges(true);
    try {
      const response = await API.get("/colleges/", {
        params: {
          career: career,
          state:  state === "All States" ? null : state,
        },
      });
      setColleges(response.data);
    } catch (err) {
      console.error("Failed to fetch colleges", err);
      setColleges([]);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    fetchColleges(data.top_careers[activeTab].career, state);
  };

  const handleCareerTabClick = (index) => {
    setActiveTab(index);
    fetchColleges(data.top_careers[index].career, selectedState);
  };

  // ── Save result ───────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await API.post("/results/save", {
        level:             data.level,
        top_career:        data.top_careers[0].career,
        fit_label:         data.top_careers[0].fit,
        dominant_category: data.dominant_category,
        percentage:        data.percentage,
        reasons:           data.reasons || [],
        all_careers:       data.top_careers,
      });
      setSaved(true);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No result found. Please take the quiz first.</p>
      </div>
    );
  }

  const label      = LEVEL_LABELS[data.level] || LEVEL_LABELS["grad"];
  const roadmap    = ROADMAP[data.level]       || ROADMAP["grad"];
  const topCareer  = data.top_careers[0];
  const activeCareer = data.top_careers[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* ── HERO ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
            {label.badge}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {label.title}
          </h1>
          <p className="text-gray-500 mb-4">{label.subtitle}</p>
          <div className="flex justify-center flex-wrap gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {data.level?.toUpperCase()} Level
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Last Score: {data.percentage}%
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {CAT_ICON[data.dominant_category]} {data.dominant_category} interest
            </span>
          </div>
        </div>

        {/* ── ROADMAP ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Your Path Forward</h2>
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {roadmap.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${i === 0 ? "bg-purple-600 text-white" :
                      i === roadmap.length - 1 ? "bg-green-500 text-white" :
                      "bg-purple-100 text-purple-700"}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2 leading-tight">{step}</p>
                </div>
                {i < roadmap.length - 1 && (
                  <div className="flex-1 h-0.5 bg-purple-200 min-w-[20px]" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── CAREER CARDS ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Top Matches for You
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Click a card to see colleges and salary for that option
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {data.top_careers.map((c, i) => (
              <button
                key={i}
                onClick={() => handleCareerTabClick(i)}
                className={`p-5 rounded-2xl border-2 text-left transition-all
                  ${activeTab === i
                    ? "border-purple-500 bg-purple-50 shadow-md"
                    : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
              >
                {/* Top row */}
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">{CAT_ICON[c.category] || "🎯"}</span>
                  {i === 0 && (
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                      Best Match
                    </span>
                  )}
                </div>

                {/* Career name */}
                <h3 className="font-bold text-gray-800 mb-1">{c.career}</h3>
                <p className="text-xs text-gray-500 mb-3">{c.desc}</p>

                {/* Fit badge */}
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${FIT_COLORS[c.fit] || "bg-gray-100 text-gray-600"}`}>
                  {c.fit}
                </span>

                {/* Salary */}
                {c.salary_min && (
                  <p className="text-xs text-green-600 font-semibold mt-3">
                    💰 {c.salary_min} – {c.salary_max}
                    <span className="text-gray-400 font-normal ml-1">/ year</span>
                  </p>
                )}
              </button>
            ))}
          </div>

          {/* Active career salary detail */}
          {activeCareer?.salary_note && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700">
                <span className="font-semibold">💡 Salary note for {activeCareer.career}:</span>{" "}
                {activeCareer.salary_note}
              </p>
            </div>
          )}
        </div>

        {/* ── WHY THIS FITS ── */}
        {data.reasons && data.reasons.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Why this fits you
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Based on the answers you gave in the quiz:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.reasons.slice(0, 6).map((r, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── COLLEGES ── */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Suggested Colleges</h2>
              <p className="text-sm text-gray-400">
                For: <span className="text-purple-600 font-medium">{activeCareer?.career}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-500">State:</label>
              <select
                value={selectedState}
                onChange={handleStateChange}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingColleges ? (
            <p className="text-center text-gray-400 py-8">Loading colleges...</p>
          ) : colleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">No colleges found for this filter.</p>
              <p className="text-sm text-gray-400">Try selecting "All States".</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {colleges.map((col, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  <h3 className="font-bold text-gray-800 mb-1">{col.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {col.city}, {col.state}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium
                      ${col.college_type === "Government"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"}`}>
                      {col.college_type}
                    </span>
                    <span className="text-blue-600 font-semibold text-sm">
                      Cutoff: {col.cutoff_percentage}%
                    </span>
                  </div>
                  {col.cutoff_percentage > (data.percentage || 0) && (
                    <p className="text-xs text-orange-500 mt-2">
                      ⚠️ Your score ({data.percentage}%) is below cutoff — needs improvement
                    </p>
                  )}
                  {col.cutoff_percentage <= (data.percentage || 0) && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ Your score qualifies for this college
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── SAVE + RETRY ── */}
        <div className="space-y-3 pb-8">
          {saved ? (
            <div className="w-full py-4 bg-green-100 text-green-700 rounded-2xl font-semibold text-center">
              ✅ Result saved to your dashboard!
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "💾 Save My Result to Dashboard"}
            </button>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("career_result");
              window.location.href = "/career-path";
            }}
            className="w-full py-4 border-2 border-purple-400 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition"
          >
            🔄 Try Again
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;
