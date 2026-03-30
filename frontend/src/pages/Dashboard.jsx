// frontend/src/pages/Dashboard.jsx
// Professional redesign — replace your existing Dashboard.jsx completely

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const LEVEL_LABEL = {
  "10th":"10th Grade","12th":"12th Grade","grad":"Graduation","pg":"Post Graduation",
};
const CAT_ICON = {
  Technology:"💻",Business:"💼",Creative:"🎨",Healthcare:"🏥",general:"🎯",
};
const CAT_STYLE = {
  Technology:{bg:"bg-purple-50",text:"text-purple-800",bar:"bg-purple-500"},
  Business:  {bg:"bg-amber-50", text:"text-amber-800", bar:"bg-amber-500"},
  Creative:  {bg:"bg-pink-50",  text:"text-pink-800",  bar:"bg-pink-500"},
  Healthcare:{bg:"bg-green-50", text:"text-green-800", bar:"bg-green-500"},
  general:   {bg:"bg-gray-100", text:"text-gray-700",  bar:"bg-gray-400"},
};
const FIT_STYLE = {
  "Excellent fit":                    "bg-green-100 text-green-800",
  "Good fit":                         "bg-blue-100 text-blue-800",
  "Worth exploring":                  "bg-yellow-100 text-yellow-800",
  "Aspirational — needs strong prep": "bg-orange-100 text-orange-800",
};
const ROADMAP = {
  "10th":["10th Exam","Stream Choice","11th & 12th","Degree","Career"],
  "12th":["12th Exam","Entrance Exam","Degree (3–5y)","Job / PG","Career"],
  "grad":["Graduation","Entrance/Job","PG / Cert.","Senior Role","Career"],
  "pg":  ["PG Degree","Specialisation","Research/Ind.","Leadership","Career"],
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
}

function StatCard({ icon, label, value, sub, barColor, barPct }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="text-xl mb-3">{icon}</div>
      <div className="text-2xl font-semibold text-gray-900 leading-tight truncate">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5 mb-3">{label}</div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor} transition-all duration-1000`}
          style={{width:`${barPct}%`}} />
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1.5 truncate">{sub}</div>}
    </div>
  );
}

function RoadmapPills({ level }) {
  const steps = ROADMAP[level] || ROADMAP["grad"];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {steps.map((s,i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium
            ${i===0?"bg-purple-600 text-white":
              i===steps.length-1?"bg-green-500 text-white":
              "bg-gray-100 text-gray-600"}`}>
            {s}
          </span>
          {i<steps.length-1 && <span className="text-gray-300 text-xs">›</span>}
        </div>
      ))}
    </div>
  );
}

function HistoryRow({ result, index }) {
  const [open, setOpen] = useState(false);
  const cs = CAT_STYLE[result.dominant_category] || CAT_STYLE.general;
  return (
    <div className={`border border-gray-100 rounded-xl overflow-hidden ${open?"shadow-md":""}`}>
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(o=>!o)}
      >
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {LEVEL_LABEL[result.level]||result.level}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FIT_STYLE[result.fit_label]||"bg-gray-100 text-gray-600"}`}>
              {result.fit_label}
            </span>
            {index===0 && (
              <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">Latest</span>
            )}
          </div>
          <div className="font-semibold text-gray-900 text-sm truncate">{result.top_career}</div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${cs.bg} ${cs.text}`}>
              {CAT_ICON[result.dominant_category]} {result.dominant_category}
            </div>
            <div className="text-xs text-gray-400 mt-1">{formatDate(result.created_at)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-800">{result.percentage}%</div>
            <div className="text-xs text-gray-400">score</div>
          </div>
          <span className={`text-gray-400 text-xs transition-transform duration-200 ${open?"rotate-90":""}`}>›</span>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-5">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Your path</div>
            <RoadmapPills level={result.level} />
          </div>
          {result.all_careers?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">All suggestions</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {result.all_careers.map((c,i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-xl p-3.5">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800 leading-tight">{c.career}</span>
                      {i===0 && <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded-full shrink-0">#1</span>}
                    </div>
                    {c.desc && <p className="text-xs text-gray-500 mb-1.5 leading-relaxed">{c.desc}</p>}
                    {c.salary_min && (
                      <span className="text-xs text-green-700 font-medium">{c.salary_min} – {c.salary_max}/yr</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.reasons?.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Why this fits</div>
              <div className="flex flex-wrap gap-2">
                {result.reasons.slice(0,5).map((r,i) => (
                  <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full">{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate              = useNavigate();

  useEffect(() => {
    API.get("/dashboard/")
      .then(r => { setData(r.data); setLoading(false); })
      .catch(e => {
        if (e.response?.status===401) navigate("/login");
        else { setError("Failed to load dashboard."); setLoading(false); }
      });
  }, [navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  const dominant   = data.category_totals
    ? Object.entries(data.category_totals).sort((a,b)=>b[1]-a[1])[0]?.[0]
    : null;
  const cs         = CAT_STYLE[dominant] || CAT_STYLE.general;
  const latest     = data.latest;
  const total      = data.total_attempts || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* PROFILE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-semibold shrink-0">
                {data.name?.[0]?.toUpperCase()||"U"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg font-semibold text-gray-900">{data.name}</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-medium">Active</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">{data.email}</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">User #{data.user_id}</span>
                  {dominant && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cs.bg} ${cs.text}`}>
                      {CAT_ICON[dominant]} {dominant} interest
                    </span>
                  )}
                  {total > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
                      {total} quiz{total!==1?"zes":""} taken
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/career-path")}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
            >
              Take new quiz →
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="🎯" label="Total attempts" value={total}
            sub="career quizzes taken" barColor="bg-purple-500" barPct={Math.min(total*20,100)} />
          <StatCard icon="🏆" label="Latest top match"
            value={latest?.top_career?.split(" ").slice(0,2).join(" ")||"—"}
            sub={latest?.top_career||"Take a quiz first"} barColor="bg-green-500" barPct={latest?85:0} />
          <StatCard icon="📊" label="Last exam score"
            value={latest?`${latest.percentage}%`:"—"}
            sub="your most recent %" barColor="bg-amber-500" barPct={latest?.percentage||0} />
          <StatCard icon={CAT_ICON[dominant]||"🎯"} label="Strongest interest"
            value={dominant||"—"} sub="across all attempts" barColor={cs.bar} barPct={dominant?90:0} />
        </div>

        {/* LATEST + BREAKDOWN */}
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-1">Latest AI suggestion</div>
            <div className="text-xs text-gray-400 mb-5">Your most recent career match</div>
            {latest ? (
              <>
                <div className="bg-purple-50 rounded-xl p-5 mb-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-purple-900 text-base leading-tight">{latest.top_career}</h3>
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full shrink-0 font-medium">Best match</span>
                  </div>
                  {latest.all_careers?.[0]?.desc && (
                    <p className="text-xs text-purple-700 mb-3 leading-relaxed">{latest.all_careers[0].desc}</p>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-white text-purple-700 px-2 py-0.5 rounded-full font-medium">{LEVEL_LABEL[latest.level]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-white ${FIT_STYLE[latest.fit_label]||"text-gray-600"}`}>{latest.fit_label}</span>
                    {latest.all_careers?.[0]?.salary_min && (
                      <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {latest.all_careers[0].salary_min} – {latest.all_careers[0].salary_max}/yr
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your path forward</div>
                <RoadmapPills level={latest.level} />
              </>
            ) : (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                <p className="text-3xl mb-3">🎯</p>
                <p className="text-sm font-semibold text-gray-700 mb-1">No results yet</p>
                <p className="text-xs text-gray-400 mb-4">Take your first quiz to see AI suggestions here</p>
                <button onClick={() => navigate("/career-path")}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors">
                  Start quiz →
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-1">Attempts by level</div>
            <div className="text-xs text-gray-400 mb-5">Quiz distribution</div>
            <div className="space-y-4">
              {["10th","12th","grad","pg"].map(lvl => {
                const count = data.level_breakdown?.[lvl]||0;
                const max   = Math.max(...Object.values(data.level_breakdown||{dummy:1}),1);
                return (
                  <div key={lvl}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-500">{LEVEL_LABEL[lvl]}</span>
                      <span className="text-xs font-semibold text-gray-800">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-700"
                        style={{width:`${Math.round((count/max)*100)}%`}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-semibold text-gray-800">Quiz history</div>
            <span className="text-xs text-gray-400">{total} attempt{total!==1?"s":""}</span>
          </div>
          <div className="text-xs text-gray-400 mb-5">Click any row to expand full details</div>
          {data.history?.length > 0 ? (
            <div className="space-y-3">
              {data.history.map((r,i) => <HistoryRow key={r.id} result={r} index={i} />)}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm text-gray-600 font-semibold mb-1">No quiz history yet</p>
              <p className="text-xs text-gray-400 mb-4">Complete a quiz and save your result to see it here</p>
              <button onClick={() => navigate("/career-path")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-semibold hover:bg-purple-700 transition-colors">
                Take your first quiz →
              </button>
            </div>
          )}
        </div>

        {/* NEXT STEPS */}
        <div className="grid md:grid-cols-3 gap-4 pb-6">
          {[
            {icon:"📚",title:"Explore colleges",  desc:"Find colleges matching your career and score",  action:"Browse colleges →",href:"/result",      bg:"bg-purple-50",text:"text-purple-900",sub:"text-purple-700"},
            {icon:"🗺️",title:"View roadmap",      desc:"Step-by-step path to your target career",       action:"See your path →",  href:"/result",      bg:"bg-green-50", text:"text-green-900", sub:"text-green-700"},
            {icon:"🔁",title:"Try another level", desc:"Explore career paths for a different level",    action:"Start new quiz →", href:"/career-path", bg:"bg-amber-50", text:"text-amber-900", sub:"text-amber-700"},
          ].map((item,i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-5 cursor-pointer hover:shadow-sm transition-shadow`}
              onClick={() => navigate(item.href)}>
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className={`text-sm font-semibold ${item.text} mb-1`}>{item.title}</div>
              <div className={`text-xs ${item.sub} mb-4 leading-relaxed`}>{item.desc}</div>
              <div className={`text-xs font-semibold ${item.text}`}>{item.action}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
