import React, { useEffect, useState } from "react";
import API from "../services/api";

const INDIAN_STATES = [
  "All States", "Odisha", "Delhi", "Maharashtra", "West Bengal",
  "Tamil Nadu", "Karnataka", "Gujarat", "Rajasthan", "Uttar Pradesh",
  "Madhya Pradesh", "Bihar", "Andhra Pradesh", "Telangana", "Kerala",
  "Punjab", "Haryana", "Jharkhand", "Assam", "Uttarakhand"
];

const Result = () => {
  const [data, setData] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [selectedState, setSelectedState] = useState("All States");
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("career_result"));
    setData(stored);
    if (stored) {
      fetchColleges(stored.top_careers[0].career, "All States");
    }
  }, []);

  const fetchColleges = async (career, state) => {
    setLoadingColleges(true);
    try {
      const response = await API.get("/colleges/", {
        params: {
          career: career,
          state: state === "All States" ? null : state,
        },
      });
      setColleges(response.data);
    } catch (err) {
      console.error("Failed to fetch colleges", err);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    fetchColleges(data.top_careers[0].career, state);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.post("/results/save", {
        career: data.top_careers[0].career,
        confidence: data.top_careers[0].confidence,
        reasons: data.reasons,
        level: data.level,
        colleges: colleges.slice(0, 3).map(c => c.name),
      });
      setSaved(true);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Hero */}
      <h1 className="text-3xl font-bold text-center mb-2">
        ✨ You're Built for {data.top_careers[0].career}
      </h1>
      <p className="text-center text-gray-500 mb-6">
        Based on your choices and strengths
      </p>

      {/* Roadmap */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {["10th", "12th", "Degree", data.top_careers[0].career].map((step, i) => (
          <span key={i} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
            {step}
          </span>
        ))}
      </div>

      {/* Career Cards */}
      <h2 className="text-xl font-semibold mb-4">Top Career Matches</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {data.top_careers.map((c, i) => (
          <div key={i} className={`p-4 shadow rounded-xl border ${
            i === 0 ? "border-purple-400 bg-purple-50" : "border-gray-200"
          }`}>
            {i === 0 && (
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full mb-2 inline-block">
                Best Match
              </span>
            )}
            <h3 className="font-bold">{c.career}</h3>
            <p className="text-sm text-gray-500">{c.confidence}</p>
          </div>
        ))}
      </div>

      {/* Salary */}
      <h2 className="text-xl font-semibold mb-2">Salary Potential</h2>
      <div className="bg-gray-200 h-4 rounded-full mb-2">
        <div className="bg-green-500 h-4 rounded-full w-2/3"></div>
      </div>
      <p className="text-sm text-gray-600 mb-6">₹5L – ₹25L per year (approx)</p>

      {/* Why This Fits */}
      <h2 className="text-xl font-semibold mb-4">Why This Fits You</h2>
      <div className="flex flex-wrap gap-2 mb-8">
        {data.reasons.slice(0, 5).map((r, i) => (
          <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            {r}
          </span>
        ))}
      </div>

      {/* College Location Filter */}
      <h2 className="text-xl font-semibold mb-4">Suggested Colleges</h2>
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <label className="text-sm text-gray-600 mr-2">Filter by State:</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        {selectedState !== "All States" && (
          <span className="text-sm text-purple-600 font-medium">
            Showing colleges in {selectedState}
          </span>
        )}
      </div>

      {/* College List */}
      {loadingColleges ? (
        <p className="text-center text-gray-400 mb-8">Loading colleges...</p>
      ) : colleges.length === 0 ? (
        <p className="text-center text-gray-400 mb-8">
          No colleges found for this state. Try "All States".
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {colleges.map((col, i) => (
            <div key={i} className="p-4 border rounded-xl hover:shadow-md transition">
              <h3 className="font-bold text-gray-800">{col.name}</h3>
              <p className="text-sm text-gray-500">{col.city}, {col.state}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {col.college_type}
                </span>
                <span className="text-blue-600 font-semibold text-sm">
                  Cutoff: {col.cutoff_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      {saved ? (
        <div className="w-full py-3 bg-green-100 text-green-700 rounded-xl font-semibold text-center mb-4">
          Result saved to your dashboard!
        </div>
      ) : (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition mb-4"
        >
          {saving ? "Saving..." : "Save My Result to Dashboard"}
        </button>
      )}

      {/* Try Again */}
      <button
        onClick={() => {
          localStorage.removeItem("career_result");
          window.location.href = "/career-path";
        }}
        className="w-full py-3 border border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition"
      >
        Try Again
      </button>

    </div>
  );
};

export default Result;