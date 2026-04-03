import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const INDIAN_STATES = [
  "All States","Andhra Pradesh","Assam","Bihar","Delhi","Gujarat","Haryana",
  "Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal",
];

const LANGUAGES = [
  "All Languages","English","Hindi","Tamil","Telugu","Kannada",
  "Malayalam","Marathi","Bengali","Gujarati","Bilingual",
];

const GENDER_TYPES = ["All Types", "Co-ed", "Women", "Men"];

const LEVEL_LABELS = {
  "10th":{ title:"Recommended streams after 10th",      subtitle:"Choose the path that matches your interest",        badge:"Stream Options"   },
  "12th":{ title:"Best degree options after 12th",      subtitle:"Your interest points to these degrees and colleges", badge:"Degree Paths"     },
  "grad":{ title:"Your next best step after graduation",subtitle:"PG programs, job paths, and Govt exam options",      badge:"PG & Career"      },
  "pg":  { title:"Career paths after post graduation",  subtitle:"Specialisation, research, Govt, and industry roles", badge:"Advanced Careers" },
};

const ROADMAP = {
  "10th":["10th Exam","Choose Stream","11th & 12th","Degree / Diploma","Career"],
  "12th":["12th Exam","Entrance Exam","Degree (3-5 yrs)","Job / PG","Career"],
  "grad":["Graduation","Entrance / Job","PG / Certification","Senior Role","Career"],
  "pg":  ["PG Degree","Specialisation","Research / Industry","Leadership","Career"],
};

const FIT_COLORS = {
  "Excellent fit":                  "bg-green-100 text-green-700 border-green-300",
  "Good fit":                       "bg-blue-100 text-blue-700 border-blue-300",
  "Worth exploring":                "bg-yellow-100 text-yellow-700 border-yellow-300",
  "Aspirational needs strong prep": "bg-orange-100 text-orange-700 border-orange-300",
};

const CAT_ICON = { Technology:"💻", Business:"💼", Creative:"🎨", Healthcare:"🏥", general:"🎯" };

const MODAL_STYLE = `
  @keyframes modalIn {
    from { opacity:0; transform:scale(0.85) translateY(30px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }
`;

const GuestLoginModal = ({ onClose, onLogin, onSignup }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      style={{animation:"modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <style>{MODAL_STYLE}</style>
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg text-4xl">🔒</div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Login to Save Your Result</h2>
      <p className="text-gray-500 text-sm mb-4">Create a free account or log in to unlock:</p>
      <div className="bg-purple-50 rounded-2xl p-4 mb-6 text-left space-y-2">
        <p className="text-sm text-purple-800">Save your result permanently</p>
        <p className="text-sm text-purple-800">Access your personal Dashboard</p>
        <p className="text-sm text-purple-800">Track all your quiz attempts</p>
        <p className="text-sm text-purple-800">Get result summary on your email</p>
      </div>
      <div className="flex flex-col gap-3">
        <button onClick={onLogin} className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition shadow-md">
          Login to Save
        </button>
        <button onClick={onSignup} className="w-full py-3 border-2 border-purple-400 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition">
          Create Free Account
        </button>
        <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 transition py-1">
          Maybe later
        </button>
      </div>
    </div>
  </div>
);

const SuccessModal = ({ onClose, onDashboard }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
      style={{animation:"modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <style>{MODAL_STYLE}</style>
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg text-4xl">🎉</div>
      <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Congratulations!</h2>
      <p className="text-gray-500 mb-1 text-sm">Your career result has been saved successfully.</p>
      <p className="text-gray-500 mb-6 text-sm">Check your inbox for the summary email!</p>
      <div className="border-t border-gray-100 my-5" />
      <div className="flex flex-col gap-3">
        <button onClick={onDashboard} className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold hover:bg-purple-700 transition shadow-md">
          Go to Dashboard
        </button>
        <button onClick={onClose} className="w-full py-3 border-2 border-gray-200 text-gray-500 rounded-2xl font-semibold hover:bg-gray-50 transition text-sm">
          Stay on this page
        </button>
      </div>
    </div>
  </div>
);

const Result = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData]                       = useState(null);
  const [colleges, setColleges]               = useState([]);
  const [visibleCount, setVisibleCount]       = useState(6);
  const [totalColleges, setTotalColleges]     = useState(0);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [saved, setSaved]                     = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [activeTab, setActiveTab]             = useState(0);
  const [showSuccess, setShowSuccess]         = useState(false);
  const [showGuestModal, setShowGuestModal]   = useState(false);

  // ── College filters ──────────────────────────────────────────
  const [filterState,    setFilterState]    = useState("All States");
  const [filterLanguage, setFilterLanguage] = useState("All Languages");
  const [filterGender,   setFilterGender]   = useState("All Types");

  useEffect(() => {
    const stored = localStorage.getItem("career_result");
    if (stored) setData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (data) {
      setVisibleCount(6);
      fetchColleges();
    }
  }, [data, filterState, filterLanguage, filterGender]);

  const fetchColleges = async () => {
    setLoadingColleges(true);
    try {
      const stored = JSON.parse(localStorage.getItem("career_result") || "{}");
      const params = {
        state:             filterState,
        percentage:        stored.percentage || 60,
        dominant_category: stored.dominant_category || "Technology",
        level:             stored.level || "grad",
      };
      if (filterLanguage !== "All Languages") params.medium = filterLanguage;
      if (filterGender   !== "All Types")     params.gender = filterGender;

      const res = await API.get("/colleges/suggest", { params });
      setColleges(res.data.colleges || []);
      setTotalColleges(res.data.total || 0);
    } catch {
      setColleges([]);
      setTotalColleges(0);
    } finally {
      setLoadingColleges(false);
    }
  };

  const handleSave = () => {
    if (!user) { setShowGuestModal(true); return; }
    doSave();
  };

  const doSave = async () => {
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
      setShowSuccess(true);
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">No result found. Please take the quiz first.</p>
    </div>
  );

  const label        = LEVEL_LABELS[data.level] || LEVEL_LABELS["grad"];
  const roadmap      = ROADMAP[data.level]       || ROADMAP["grad"];
  const activeCareer = data.top_careers[activeTab];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-10 px-4">

      {showGuestModal && (
        <GuestLoginModal
          onClose={()  => setShowGuestModal(false)}
          onLogin={()  => navigate("/login",  { state:{ returnTo:"/result" } })}
          onSignup={()  => navigate("/signup", { state:{ returnTo:"/result" } })}
        />
      )}
      {showSuccess && (
        <SuccessModal onClose={() => setShowSuccess(false)} onDashboard={() => navigate("/dashboard")} />
      )}

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Guest banner */}
        {!user && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-md">
            <div>
              <p className="text-white font-semibold text-sm">You are viewing as a guest</p>
              <p className="text-purple-200 text-xs mt-0.5">Login to save this result and access your dashboard</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => navigate("/login", { state:{ returnTo:"/result" } })}
                className="px-4 py-2 bg-white text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-50 transition">
                Login
              </button>
              <button onClick={() => navigate("/signup", { state:{ returnTo:"/result" } })}
                className="px-4 py-2 bg-purple-500 border border-purple-400 text-white rounded-xl text-sm font-semibold hover:bg-purple-400 transition">
                Sign Up Free
              </button>
            </div>
          </div>
        )}

        {/* HERO */}
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-4">
            {label.badge}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{label.title}</h1>
          <p className="text-gray-500 mb-4">{label.subtitle}</p>
          <div className="flex justify-center flex-wrap gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">{data.level?.toUpperCase()} Level</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Score: {data.percentage}%</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">{CAT_ICON[data.dominant_category]} {data.dominant_category} interest</span>
          </div>
        </div>

        {/* ROADMAP */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Your Path Forward</h2>
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {roadmap.map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center min-w-[80px]">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    i===0 ? "bg-purple-600 text-white" : i===roadmap.length-1 ? "bg-green-500 text-white" : "bg-purple-100 text-purple-700"
                  }`}>
                    {i+1}
                  </div>
                  <p className="text-xs text-center text-gray-600 mt-2 leading-tight">{step}</p>
                </div>
                {i < roadmap.length-1 && <div className="flex-1 h-0.5 bg-purple-200 min-w-[20px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CAREER CARDS */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Top Matches for You</h2>
          <p className="text-sm text-gray-400 mb-6">Click a card to see salary details</p>
          <div className="grid md:grid-cols-2 gap-4">
            {data.top_careers.map((c, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  activeTab===i ? "border-purple-500 bg-purple-50 shadow-md" : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                }`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl">{CAT_ICON[c.category] || "🎯"}</span>
                  {i===0 && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Best Match</span>}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{c.career}</h3>
                <p className="text-xs text-gray-500 mb-3">{c.desc || c.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${FIT_COLORS[c.fit] || "bg-gray-100 text-gray-600"}`}>
                  {c.fit}
                </span>
                {c.salary_min && (
                  <p className="text-xs text-green-600 font-semibold mt-3">
                    {c.salary_min} - {c.salary_max} LPA
                  </p>
                )}
              </button>
            ))}
          </div>

          {activeCareer?.salary_note && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700">
                <span className="font-semibold">{activeCareer.career}:</span> {activeCareer.salary_note}
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
              <div>
                <p className="font-bold text-gray-800 text-sm">Want a step-by-step plan?</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  View the detailed roadmap for <span className="text-purple-600 font-semibold">{data.top_careers[0]?.career}</span>
                </p>
              </div>
              <button onClick={() => navigate("/roadmap")}
                className="flex-shrink-0 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition shadow-md">
                View Full Roadmap
              </button>
            </div>
          </div>
        </div>

        {/* WHY THIS FITS */}
        {data.reasons?.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Why this fits you</h2>
            <div className="flex flex-wrap gap-2">
              {data.reasons.slice(0,6).map((r,i) => (
                <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{r}</span>
              ))}
            </div>
          </div>
        )}

        {/* COLLEGES */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Suggested Colleges</h2>
              <p className="text-sm text-gray-400">
                Showing <span className="text-purple-600 font-medium">{Math.min(visibleCount, colleges.length)}</span> of{" "}
                <span className="text-purple-600 font-medium">{totalColleges}</span> colleges
              </p>
            </div>
          </div>

          {/* ── 3 Filters: State | Language | Gender ── */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Filter Colleges</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>
                <label className="block text-xs text-gray-500 mb-1">State</label>
                <select
                  value={filterState}
                  onChange={e => setFilterState(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                >
                  {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Language of Instruction</label>
                <select
                  value={filterLanguage}
                  onChange={e => setFilterLanguage(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                >
                  {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">College Type</label>
                <select
                  value={filterGender}
                  onChange={e => setFilterGender(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                >
                  {GENDER_TYPES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

            </div>
          </div>

          {/* College Cards */}
          {loadingColleges ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Finding best colleges for you...</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-2">No colleges found for the selected filters.</p>
              <p className="text-sm text-gray-400">Try selecting All States or changing the filters.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                {colleges.slice(0, visibleCount).map((col, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                    <h3 className="font-bold text-gray-800 mb-1">{col.college_name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{col.city}, {col.state}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                        {col.category}
                      </span>
                      {col.medium && col.medium !== "English" && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-indigo-100 text-indigo-700">
                          {col.medium}
                        </span>
                      )}
                      {col.gender && col.gender !== "Co-ed" && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-pink-100 text-pink-700">
                          {col.gender}
                        </span>
                      )}
                      {col.nirf_rank && (
                        <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-700">
                          NIRF #{col.nirf_rank}
                        </span>
                      )}
                    </div>
                    {col.min_cutoff > (data.percentage || 0) ? (
                      <p className="text-xs text-orange-500 mt-2">
                        Your score ({data.percentage}%) is below cutoff ({col.min_cutoff}%)
                      </p>
                    ) : (
                      <p className="text-xs text-green-600 mt-2">Your score qualifies for this college</p>
                    )}
                    {col.avg_package_lpa && col.avg_package_lpa !== 5 && (
                      <p className="text-xs text-green-700 font-semibold mt-1">
                        Avg Package: {col.avg_package_lpa} LPA
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {visibleCount < colleges.length && (
                <div className="text-center mt-6">
                  <button onClick={() => setVisibleCount(v => v + 6)}
                    className="px-6 py-3 bg-purple-100 text-purple-700 rounded-2xl font-semibold hover:bg-purple-200 transition text-sm">
                    Load More ({colleges.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* SAVE + RETRY */}
        <div className="space-y-3 pb-8">
          {saved ? (
            <div className="w-full py-4 bg-green-100 text-green-700 rounded-2xl font-semibold text-center">
              Result saved to your dashboard!
            </div>
          ) : (
            <button onClick={handleSave} disabled={saving}
              className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
              {saving ? "Saving..." : user ? "Save My Result to Dashboard" : "Login to Save Result"}
            </button>
          )}
          <button
            onClick={() => { localStorage.removeItem("career_result"); window.location.href="/career-path"; }}
            className="w-full py-4 border-2 border-purple-400 text-purple-600 rounded-2xl font-semibold hover:bg-purple-50 transition">
            Try Again
          </button>
        </div>

      </div>
    </div>
  );
};

export default Result;