// frontend/src/pages/Compare.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Footer from "../components/Footer";

const CATEGORY_COLORS = {
  Technology: { bg: "bg-blue-100",   text: "text-blue-700",   dot: "bg-blue-500"   },
  Business:   { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  Healthcare: { bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500"  },
  Creative:   { bg: "bg-pink-100",   text: "text-pink-700",   dot: "bg-pink-500"   },
  general:    { bg: "bg-gray-100",   text: "text-gray-700",   dot: "bg-gray-500"   },
};

const GROWTH_BAR = { "Very High": 100, "High": 75, "Medium": 50, "Low": 25 };
const GROWTH_COLOR = {
  "Very High": "from-emerald-400 to-teal-500",
  "High":      "from-blue-400 to-indigo-500",
  "Medium":    "from-amber-400 to-orange-400",
  "Low":       "from-gray-300 to-gray-400",
};

// ── Searchable dropdown ───────────────────────────────────────
function CareerDropdown({ label, value, onChange, careers, placeholder, side }) {
  const [open,  setOpen]  = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = careers
    .filter(c =>
      c.career.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 30);

  const selected = careers.find(c => c.career === value);

  // FIX: explicit classes instead of dynamic `border-${color}-300`
  const selectedBorder = side === "A"
    ? "border-purple-300 bg-purple-50"
    : "border-indigo-300 bg-indigo-50";

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
        {label}
      </label>
      <button
        onClick={() => { setOpen(o => !o); setQuery(""); }}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 ${
          value ? selectedBorder : "border-gray-200 bg-white hover:border-purple-300"
        }`}
      >
        <div className="flex-1 min-w-0">
          {selected ? (
            <div>
              <p className="font-bold text-gray-800 text-sm truncate">{selected.career}</p>
              <p className="text-xs text-gray-400 truncate">{selected.category} · {selected.level}</p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">{placeholder}</p>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
          style={{ maxHeight: 320 }}
        >
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search careers..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 240 }}>
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">No careers found</p>
            ) : (
              filtered.map((c, i) => {
                const cat = CATEGORY_COLORS[c.category] || CATEGORY_COLORS.general;
                return (
                  <button
                    key={i}
                    onClick={() => { onChange(c.career); setOpen(false); setQuery(""); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0
                      ${value === c.career ? "bg-purple-50" : ""}`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${cat.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{c.career}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium ${cat.text}`}>{c.category}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400 capitalize">{c.level}</span>
                      </div>
                    </div>
                    {value === c.career && (
                      <svg className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Comparison row ────────────────────────────────────────────
function CompareRow({ label, icon, valueA, valueB, winner, type = "text" }) {
  const winA = winner === "a";
  const winB = winner === "b";
  const tie  = winner === "tie";

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-5 border-b border-gray-50 last:border-0">

      {/* Value A */}
      <div className={`rounded-2xl p-4 transition-all duration-300 ${
        winA ? "bg-purple-50 border-2 border-purple-200" : "bg-gray-50 border-2 border-transparent"
      }`}>
        {type === "salary" && valueA ? (
          <div>
            <p className={`font-black text-lg ${winA ? "text-purple-700" : "text-gray-700"}`}>
              {valueA.min} – {valueA.max}
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{valueA.note}</p>
          </div>
        ) : type === "growth" ? (
          <div>
            <p className={`font-bold text-sm mb-2 ${winA ? "text-purple-700" : "text-gray-700"}`}>{valueA}</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${GROWTH_COLOR[valueA] || GROWTH_COLOR.Medium} transition-all duration-700`}
                style={{ width: `${GROWTH_BAR[valueA] || 50}%` }}
              />
            </div>
          </div>
        ) : type === "list" ? (
          <div className="flex flex-wrap gap-1.5">
            {(valueA || []).map((v, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-lg font-medium ${
                winA ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
              }`}>{v}</span>
            ))}
          </div>
        ) : (
          <p className={`font-semibold text-sm ${winA ? "text-purple-700" : "text-gray-700"}`}>
            {valueA || "—"}
          </p>
        )}
        {winA && <p className="text-xs font-bold text-purple-600 mt-2">✓ Better</p>}
      </div>

      {/* Center label */}
      <div className="flex flex-col items-center gap-1 min-w-[80px]">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-gray-400 text-center leading-tight">{label}</span>
        {tie && <span className="text-xs text-gray-300 font-medium">Tie</span>}
      </div>

      {/* Value B */}
      <div className={`rounded-2xl p-4 transition-all duration-300 ${
        winB ? "bg-indigo-50 border-2 border-indigo-200" : "bg-gray-50 border-2 border-transparent"
      }`}>
        {type === "salary" && valueB ? (
          <div>
            <p className={`font-black text-lg ${winB ? "text-indigo-700" : "text-gray-700"}`}>
              {valueB.min} – {valueB.max}
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{valueB.note}</p>
          </div>
        ) : type === "growth" ? (
          <div>
            <p className={`font-bold text-sm mb-2 ${winB ? "text-indigo-700" : "text-gray-700"}`}>{valueB}</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${GROWTH_COLOR[valueB] || GROWTH_COLOR.Medium} transition-all duration-700`}
                style={{ width: `${GROWTH_BAR[valueB] || 50}%` }}
              />
            </div>
          </div>
        ) : type === "list" ? (
          <div className="flex flex-wrap gap-1.5">
            {(valueB || []).map((v, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-lg font-medium ${
                winB ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"
              }`}>{v}</span>
            ))}
          </div>
        ) : (
          <p className={`font-semibold text-sm ${winB ? "text-indigo-700" : "text-gray-700"}`}>
            {valueB || "—"}
          </p>
        )}
        {winB && <p className="text-xs font-bold text-indigo-600 mt-2">✓ Better</p>}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function Compare() {
  const navigate                      = useNavigate();
  const [careers, setCareers]         = useState([]);
  const [careerA, setCareerA]         = useState("");
  const [careerB, setCareerB]         = useState("");
  const [result,  setResult]          = useState(null);
  const [loading, setLoading]         = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error,   setError]           = useState("");

  // Pre-fill from quiz result if available
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("career_result") || "{}");
      if (stored.top_careers?.length >= 1) setCareerA(stored.top_careers[0].career);
      if (stored.top_careers?.length >= 2) setCareerB(stored.top_careers[1].career);
    } catch { /* no result stored, start empty */ }
  }, []);

  // Load all careers
  useEffect(() => {
    api.get("/careers/list")
      .then(r => setCareers(r.data.careers))
      .catch(() => setError("Failed to load careers. Make sure the backend is running."))
      .finally(() => setLoadingList(false));
  }, []);

  // Auto-compare when both selected
  useEffect(() => {
    if (!careerA || !careerB || careerA === careerB) { setResult(null); return; }
    setLoading(true);
    setError("");
    api.get("/careers/compare", { params: { career_a: careerA, career_b: careerB } })
      .then(r => setResult(r.data))
      .catch(() => setError("Failed to compare careers."))
      .finally(() => setLoading(false));
  }, [careerA, careerB]);

  const swapCareers = () => { setCareerA(careerB); setCareerB(careerA); };

  const overallWinner = () => {
    if (!result) return null;
    const score = { a: 0, b: 0 };
    Object.values(result.winners).forEach(w => {
      if (w === "a") score.a++;
      else if (w === "b") score.b++;
    });
    if (score.a > score.b) return { winner:"a", name:careerA, score:score.a, total:score.a+score.b };
    if (score.b > score.a) return { winner:"b", name:careerB, score:score.b, total:score.a+score.b };
    return { winner:"tie" };
  };

  const verdict = overallWinner();

  // FIX: explicit category color classes — no dynamic interpolation
  const catA = result ? (CATEGORY_COLORS[result.career_a?.category] || CATEGORY_COLORS.general) : null;
  const catB = result ? (CATEGORY_COLORS[result.career_b?.category] || CATEGORY_COLORS.general) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradX  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        .fade-up  { animation: fadeUp 0.5s ease forwards; }
        .grad-anim{ background-size:300% 300%; animation:gradX 5s ease infinite; }
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
              Career Tool
            </span>
            <button
              onClick={() => navigate(-1)}
              className="ml-auto text-sm text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3">Career Comparison</h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Pick two careers and get a side-by-side breakdown of salary,
            growth, required skills, and job roles — all from real data.
          </p>
          {/* Pre-fill hint */}
          {careerA && (
            <div className="mt-4 inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-2 rounded-full text-sm text-purple-700 font-medium">
              <span>✨</span> Pre-filled from your quiz result — change anytime
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Selector card ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-8 mb-8"
          style={{ boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>

          {loadingList ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Loading careers...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-end">
              <CareerDropdown
                label="Career A"
                side="A"
                value={careerA}
                onChange={setCareerA}
                careers={careers.filter(c => c.career !== careerB)}
                placeholder="Search and select first career..."
              />

              {/* Swap button */}
              <div className="flex justify-center pb-1">
                <button
                  onClick={swapCareers}
                  disabled={!careerA && !careerB}
                  className="w-12 h-12 rounded-2xl bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-all duration-200 disabled:opacity-40 group"
                  title="Swap careers"
                >
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </button>
              </div>

              <CareerDropdown
                label="Career B"
                side="B"
                value={careerB}
                onChange={setCareerB}
                careers={careers.filter(c => c.career !== careerA)}
                placeholder="Search and select second career..."
              />
            </div>
          )}

          {careerA && careerB && careerA === careerB && (
            <p className="text-amber-600 text-sm text-center mt-4 bg-amber-50 py-2 rounded-xl">
              Please select two different careers to compare.
            </p>
          )}

          {(!careerA || !careerB) && (
            <div className="mt-6 flex items-center gap-3 bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4">
              <span className="text-2xl">👆</span>
              <p className="text-purple-700 text-sm font-medium">
                Select two careers above — comparison appears automatically.
              </p>
            </div>
          )}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center"
            style={{ boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
            <div className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
              style={{ border: "3px solid #e9d5ff", borderTopColor: "#7c3aed" }} />
            <p className="text-gray-500 font-medium">Comparing careers...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-600 text-sm text-center mb-6">
            {error}
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <div className="fade-up space-y-6">

            {/* Overall winner banner */}
            {verdict?.winner !== "tie" ? (
              <div className="rounded-3xl p-6 text-center grad-anim text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1,#ec4899)" }}>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">
                  Overall Winner
                </p>
                <h2 className="text-2xl font-black mb-1">{verdict?.name}</h2>
                <p className="text-white/70 text-sm">
                  Wins {verdict?.score} out of {verdict?.total} categories
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 text-center">
                <p className="text-amber-700 font-black text-xl mb-1">🤝 It's a Tie!</p>
                <p className="text-amber-600 text-sm">
                  Both careers are equally strong — your personal interest should decide.
                </p>
              </div>
            )}

            {/* Career headers
                FIX: explicit border classes — no dynamic `border-${color}-200` */}
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
              <div className="bg-white rounded-3xl p-5 border-2 border-purple-200"
                style={{ boxShadow: "0 8px 24px rgba(124,58,237,0.1)" }}>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${catA?.bg} ${catA?.text}`}>
                  {result.career_a.category}
                </span>
                <h3 className="font-black text-gray-800 text-base leading-tight mb-2">
                  {result.career_a.career}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{result.career_a.desc}</p>
                {result.career_a.levels?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {result.career_a.levels.map((l, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize">{l}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                <span className="text-gray-300 font-black text-xl">VS</span>
              </div>

              <div className="bg-white rounded-3xl p-5 border-2 border-indigo-200"
                style={{ boxShadow: "0 8px 24px rgba(99,102,241,0.1)" }}>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full mb-3 inline-block ${catB?.bg} ${catB?.text}`}>
                  {result.career_b.category}
                </span>
                <h3 className="font-black text-gray-800 text-base leading-tight mb-2">
                  {result.career_b.career}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">{result.career_b.desc}</p>
                {result.career_b.levels?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {result.career_b.levels.map((l, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium capitalize">{l}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Comparison rows */}
            <div className="bg-white rounded-3xl border border-gray-100 px-6 py-2"
              style={{ boxShadow: "0 8px 40px rgba(124,58,237,0.08)" }}>
              <CompareRow label="Salary Range"    icon="💰" type="salary" valueA={result.career_a.salary}    valueB={result.career_b.salary}    winner={result.winners.salary}    />
              <CompareRow label="Growth Outlook"  icon="📈" type="growth" valueA={result.career_a.growth}    valueB={result.career_b.growth}    winner={result.winners.growth}    />
              <CompareRow label="Duration / Entry"icon="⏱️" type="text"   valueA={result.career_a.duration}  valueB={result.career_b.duration}  winner="tie"                       />
              <CompareRow label="Entrance Exam"   icon="📝" type="text"   valueA={result.career_a.exam}      valueB={result.career_b.exam}      winner="tie"                       />
              <CompareRow label="Key Skills"      icon="🧠" type="list"   valueA={result.career_a.skills}    valueB={result.career_b.skills}    winner="tie"                       />
              <CompareRow label="Job Roles"       icon="💼" type="list"   valueA={result.career_a.job_roles} valueB={result.career_b.job_roles} winner="tie"                       />
            </div>

            {/* CTA buttons
                FIX: explicit border classes — no dynamic `border-${color}-100` */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border-2 border-purple-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Interested in</p>
                <p className="font-black text-gray-800 text-sm mb-4 leading-tight">{result.career_a.career}</p>
                <button
                  onClick={() => navigate("/career-path")}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                >
                  Take Quiz for this Path →
                </button>
              </div>
              <div className="bg-white rounded-2xl border-2 border-indigo-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Interested in</p>
                <p className="font-black text-gray-800 text-sm mb-4 leading-tight">{result.career_b.career}</p>
                <button
                  onClick={() => navigate("/career-path")}
                  className="w-full py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 hover:scale-[1.02] transition-all duration-200"
                >
                  Take Quiz for this Path →
                </button>
              </div>
            </div>

            {/* Reset */}
            <div className="text-center pb-4">
              <button
                onClick={() => { setCareerA(""); setCareerB(""); setResult(null); }}
                className="text-gray-400 hover:text-purple-600 text-sm font-medium transition-colors"
              >
                ← Compare different careers
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}