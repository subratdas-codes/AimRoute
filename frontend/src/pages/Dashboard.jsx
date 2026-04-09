import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import ScholarshipFinder from "../components/ScholarshipFinder";
import ExamEligibilityChecker from "../components/ExamEligibilityChecker";

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
  "12th":["12th Exam","Entrance Exam","Degree (3-5y)","Job / PG","Career"],
  "grad":["Graduation","Entrance/Job","PG / Cert.","Senior Role","Career"],
  "pg":  ["PG Degree","Specialisation","Research/Ind.","Leadership","Career"],
};
// Sample colleges & scholarships per category (replace with real API data if available)
const SAMPLE_COLLEGES = {
  Technology:["IIT Bombay","IIT Delhi","BITS Pilani","NIT Trichy","VIT Vellore"],
  Business:  ["IIM Ahmedabad","IIM Bangalore","XLRI Jamshedpur","SP Jain","MDI Gurgaon"],
  Creative:  ["NID Ahmedabad","Symbiosis Pune","MIT Institute of Design","Pearl Academy"],
  Healthcare:["AIIMS Delhi","CMC Vellore","JIPMER Puducherry","Manipal College of Medical Sciences"],
  general:   ["Delhi University","Jadavpur University","BHU Varanasi","Anna University"],
};
const SAMPLE_SCHOLARSHIPS = {
  Technology:["INSPIRE Scholarship (DST)","AICTE Pragati Scholarship","NSP ST/SC Merit Scholarship"],
  Business:  ["Aditya Birla Scholarship","HDFC Educational Crisis Scholarship","Rotary Foundation"],
  Creative:  ["Lalit Kala Akademi Grant","British Council Arts Scholarship","NID Scholarship"],
  Healthcare:["PM Scholarship for Central Armed Police","ICMR Junior Research Fellowship","Sitaram Jindal Scholarship"],
  general:   ["NSP (National Scholarship Portal)","PM Vidya Lakshmi","State Merit Scholarship"],
};

const HISTORY_PAGE_SIZE = 3;

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
}

// ── Rich PDF download ─────────────────────────────────────────
function downloadPDF(result) {
  const careers      = result.all_careers || [];
  const level        = LEVEL_LABEL[result.level] || result.level;
  const date         = formatDate(result.created_at);
  const cat          = result.dominant_category || "general";
  const colleges     = result.colleges     || SAMPLE_COLLEGES[cat]     || SAMPLE_COLLEGES.general;
  const scholarships = result.scholarships || SAMPLE_SCHOLARSHIPS[cat] || SAMPLE_SCHOLARSHIPS.general;
  const roadmap      = ROADMAP[result.level] || ROADMAP["grad"];
  const pct          = result.percentage || 0;

  // Donut SVG for exam score
  const r = 40, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const donutSVG = `<svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="55" r="${r}" fill="none" stroke="#ede9fe" stroke-width="13"/>
    <circle cx="55" cy="55" r="${r}" fill="none" stroke="#7c3aed" stroke-width="13"
      stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
      stroke-dashoffset="${(circ/4).toFixed(1)}" stroke-linecap="round"/>
    <text x="55" y="51" text-anchor="middle" font-family="Arial" font-size="16" font-weight="800" fill="#1e1b4b">${pct}%</text>
    <text x="55" y="67" text-anchor="middle" font-family="Arial" font-size="9" fill="#9ca3af">Score</text>
  </svg>`;

  // Bar chart for career match strengths
  const chartColors = ["#7c3aed","#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#ddd6fe"];
  const chartBars = careers.slice(0, 6).map((c, i) => {
    const barW = Math.max(12, 100 - i * 13);
    return `<div style="margin-bottom:11px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:180px;font-size:11px;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;">${i+1}. ${c.career||""}</div>
        <div style="flex:1;background:#f3f4f6;border-radius:99px;height:14px;overflow:hidden;">
          <div style="width:${barW}%;background:${chartColors[i]||"#7c3aed"};height:100%;border-radius:99px;"></div>
        </div>
        <div style="width:32px;text-align:right;font-size:11px;font-weight:700;color:${chartColors[i]||"#7c3aed"};flex-shrink:0;">${barW}%</div>
      </div>
    </div>`;
  }).join("");

  // Roadmap steps
  const roadmapSteps = roadmap.map((s, i) => `
    <span style="background:${i===0?"#7c3aed":i===roadmap.length-1?"#059669":"#e5e7eb"};
      color:${i===0||i===roadmap.length-1?"#fff":"#374151"};
      padding:5px 13px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;display:inline-block;">${s}</span>
    ${i<roadmap.length-1?`<span style="color:#d1d5db;font-size:16px;vertical-align:middle;"> › </span>`:""}`
  ).join("");

  // Career table rows
  const careerRows = careers.map((c, i) => `
    <tr style="border-bottom:1px solid #f3f4f6;background:${i%2===0?"#fafafa":"#fff"};">
      <td style="padding:9px 8px;font-weight:600;color:#1e1b4b;">${i+1}. ${c.career||""}</td>
      <td style="padding:9px 8px;color:#6b7280;">${c.category||""}</td>
      <td style="padding:9px 8px;">
        <span style="background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:99px;font-size:10px;">${c.fit||""}</span>
      </td>
      <td style="padding:9px 8px;color:#059669;font-weight:600;">${c.salary_min&&c.salary_max?`${c.salary_min} - ${c.salary_max}`:"-"}</td>
    </tr>`).join("");

  // College items
  const collegeItems = colleges.map((col, i) => `
    <div style="display:flex;align-items:center;gap:9px;padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <div style="width:22px;height:22px;background:#ede9fe;border-radius:50%;display:flex;align-items:center;
        justify-content:center;font-size:10px;font-weight:800;color:#7c3aed;flex-shrink:0;">${i+1}</div>
      <span style="font-size:12px;color:#1f2937;font-weight:500;">${col}</span>
    </div>`).join("");

  // Scholarship items
  const scholarshipItems = scholarships.map(s => `
    <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid #f3f4f6;">
      <span style="color:#059669;font-size:14px;line-height:1.4;flex-shrink:0;">&#10003;</span>
      <span style="font-size:12px;color:#1f2937;line-height:1.4;">${s}</span>
    </div>`).join("");

  // Reason pills
  const reasonPills = (result.reasons||[]).slice(0,6).map(r =>
    `<span style="background:#ede9fe;color:#5b21b6;padding:4px 12px;border-radius:99px;font-size:11px;display:inline-block;margin:3px 3px 3px 0;">${r}</span>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>AimRoute Career Report</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;color:#1f2937;background:#fff;}
  .header{background:linear-gradient(135deg,#7c3aed 0%,#6366f1 100%);padding:34px 44px;color:#fff;}
  .header h1{font-size:23px;font-weight:800;margin-bottom:4px;}
  .header p{font-size:12px;opacity:.8;}
  .badge{display:inline-block;background:rgba(255,255,255,.2);padding:3px 11px;border-radius:99px;font-size:11px;margin-top:8px;}
  .body{padding:28px 44px;}
  .section{margin-bottom:26px;}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;
    color:#9ca3af;margin-bottom:12px;border-bottom:1px solid #f3f4f6;padding-bottom:6px;}
  .top-box{background:linear-gradient(135deg,#f5f3ff,#e0e7ff);border-radius:12px;
    padding:20px 24px;margin-bottom:22px;border-left:5px solid #7c3aed;}
  .top-box .lbl{font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;}
  .top-box .nm{font-size:21px;font-weight:800;color:#1e1b4b;margin-bottom:4px;}
  .top-box .dc{font-size:12px;color:#4c1d95;line-height:1.5;}
  .meta-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;}
  .meta-box{background:#f9fafb;border-radius:9px;padding:13px 15px;border:1px solid #f3f4f6;}
  .meta-box .lbl{font-size:10px;color:#9ca3af;margin-bottom:3px;}
  .meta-box .val{font-size:14px;font-weight:700;color:#1e1b4b;}
  .score-flex{display:flex;align-items:center;gap:22px;}
  .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .chart-box{background:#fafafa;border-radius:11px;padding:16px 18px;border:1px solid #f3f4f6;}
  table{width:100%;border-collapse:collapse;}
  th{text-align:left;padding:9px 8px;font-size:10px;color:#9ca3af;text-transform:uppercase;
    letter-spacing:.5px;border-bottom:2px solid #f3f4f6;background:#fafafa;}
  .salary-box{margin-top:10px;background:#f0fdf4;border-radius:9px;padding:9px 13px;border:1px solid #bbf7d0;}
  .salary-box .lbl{font-size:10px;color:#6b7280;margin-bottom:2px;}
  .salary-box .val{font-size:15px;font-weight:800;color:#059669;}
  .footer{margin-top:34px;padding-top:14px;border-top:2px solid #f3f4f6;text-align:center;color:#9ca3af;font-size:10px;line-height:1.6;}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
</style>
</head>
<body>

<div class="header">
  <h1>&#127919; AimRoute Career Report</h1>
  <p>Generated on ${date}</p>
  <span class="badge">${level}</span>
</div>

<div class="body">

  <!-- TOP CAREER -->
  <div class="top-box">
    <div class="lbl">Your Best Career Match</div>
    <div class="nm">${result.top_career}</div>
    ${careers[0]?.desc ? `<div class="dc">${careers[0].desc}</div>` : ""}
  </div>

  <!-- SUMMARY + DONUT -->
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="score-flex">
      <div style="flex-shrink:0;">${donutSVG}</div>
      <div style="flex:1;">
        <div class="meta-grid">
          <div class="meta-box"><div class="lbl">Education Level</div><div class="val">${level}</div></div>
          <div class="meta-box"><div class="lbl">Dominant Interest</div><div class="val">${cat}</div></div>
          <div class="meta-box"><div class="lbl">Fit Label</div><div class="val">${result.fit_label||"-"}</div></div>
        </div>
        ${careers[0]?.salary_min ? `
        <div class="salary-box">
          <div class="lbl">Estimated Salary Range (Top Match)</div>
          <div class="val">${careers[0].salary_min} - ${careers[0].salary_max} / year</div>
        </div>` : ""}
      </div>
    </div>
  </div>

  <!-- BAR CHART -->
  <div class="section">
    <div class="section-title">Career Match Strength</div>
    <div class="chart-box">${chartBars}</div>
  </div>

  <!-- CAREER TABLE -->
  <div class="section">
    <div class="section-title">All Career Suggestions</div>
    <table>
      <thead><tr><th>Career</th><th>Category</th><th>Fit</th><th>Salary Range</th></tr></thead>
      <tbody>${careerRows}</tbody>
    </table>
  </div>

  <!-- COLLEGES + SCHOLARSHIPS -->
  <div class="section two-col">
    <div>
      <div class="section-title">Recommended Colleges</div>
      ${collegeItems}
    </div>
    <div>
      <div class="section-title">Scholarship Opportunities</div>
      ${scholarshipItems}
    </div>
  </div>

  <!-- ROADMAP -->
  <div class="section">
    <div class="section-title">Your Career Roadmap</div>
    <div style="background:#f9fafb;padding:14px 16px;border-radius:11px;border:1px solid #f3f4f6;line-height:2.4;">
      ${roadmapSteps}
    </div>
  </div>

  <!-- WHY THIS FITS -->
  <div class="section">
    <div class="section-title">Why This Fits You</div>
    <div style="line-height:2.2;">${reasonPills}</div>
  </div>

  <div class="footer">
    AimRoute &middot; AI Career Guidance &middot; aimroute.noreply@gmail.com<br/>
    This report is auto-generated based on your quiz responses. Results are indicative and for guidance only.
  </div>

</div>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url, "_blank");
  if (win) win.onload = () => { win.print(); URL.revokeObjectURL(url); };
}

// ── CSV download ──────────────────────────────────────────────
function downloadCSV(result) {
  const careers = result.all_careers || [];
  const headers = ["Rank","Career","Category","Fit","Salary Min","Salary Max","Description"];
  const rows = careers.map((c, i) => [
    i + 1,
    `"${c.career || ""}"`,
    c.category || "",
    `"${c.fit || ""}"`,
    c.salary_min || "",
    c.salary_max || "",
    `"${(c.desc || "").replace(/"/g, "'")}"`,
  ]);
  const meta = [
    ["Level", LEVEL_LABEL[result.level] || result.level],
    ["Top Career", `"${result.top_career}"`],
    ["Fit Label", `"${result.fit_label}"`],
    ["Dominant Interest", result.dominant_category],
    ["Exam Score", `${result.percentage}%`],
    ["Date", formatDate(result.created_at)],
    ["Reasons", `"${(result.reasons || []).join(", ")}"`],
    [],
    headers,
    ...rows,
  ];
  const csv  = meta.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `AimRoute_Result_${result.top_career.replace(/\s+/g,"_")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Download Menu ─────────────────────────────────────────────
function DownloadMenu({ result }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos]   = useState({ top: 0, right: 0 });
  const btnRef          = useRef(null);

  const handleOpen = (e) => {
    e.stopPropagation();
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 4, right: window.innerWidth - rect.right });
    }
    setOpen(o => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <>
      <button ref={btnRef} onClick={handleOpen} title="Download result"
        className="p-1.5 rounded-lg hover:bg-purple-100 text-gray-400 hover:text-purple-600 transition-colors flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
        </svg>
      </button>
      {open && (
        <div onClick={e => e.stopPropagation()}
          style={{ position:"fixed", top: pos.top - window.scrollY, right: pos.right, zIndex:9999 }}
          className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden w-36">
          <button onClick={() => { downloadPDF(result); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium">
            <span>📄</span> PDF
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { downloadCSV(result); setOpen(false); }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors font-medium">
            <span>📊</span> CSV
          </button>
        </div>
      )}
    </>
  );
}

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, barColor, barPct }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="text-xl mb-3">{icon}</div>
      <div className="text-2xl font-semibold text-gray-900 leading-tight truncate">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5 mb-3">{label}</div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`}
          style={{ width:`${barPct}%`, transitionProperty:"width", transitionDuration:"1000ms", transitionTimingFunction:"ease" }} />
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
            ${i===0?"bg-purple-600 text-white":i===steps.length-1?"bg-green-500 text-white":"bg-gray-100 text-gray-600"}`}>{s}</span>
          {i<steps.length-1 && <span className="text-gray-300 text-xs">›</span>}
        </div>
      ))}
    </div>
  );
}

// ── History Row ───────────────────────────────────────────────
function HistoryRow({ result, index, selectMode, selected, onToggleSelect, onDelete }) {
  const [open, setOpen] = useState(false);
  const cs = CAT_STYLE[result.dominant_category] || CAT_STYLE.general;

  return (
    <div className={`border rounded-xl transition-all duration-200
      ${selected ? "border-purple-400 bg-purple-50/40 shadow-sm" : "border-gray-100"}
      ${open ? "shadow-md" : ""}`}>

      <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50/80 transition-colors rounded-xl"
        onClick={() => setOpen(o => !o)}>

        {/* Checkbox — only shown in select mode */}
        {selectMode && (
          <div className="mr-3 shrink-0" onClick={e => { e.stopPropagation(); onToggleSelect(); }}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors
              ${selected ? "bg-purple-600 border-purple-600" : "border-gray-300 hover:border-purple-400"}`}>
              {selected && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {LEVEL_LABEL[result.level]||result.level}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${FIT_STYLE[result.fit_label]||"bg-gray-100 text-gray-600"}`}>
              {result.fit_label}
            </span>
            {index===0 && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-medium">Latest</span>}
          </div>
          <div className="font-semibold text-gray-900 text-sm truncate">{result.top_career}</div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
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
          <DownloadMenu result={result} />
          {/* Per-row delete — only in select mode */}
          {selectMode && (
            <button onClick={e => { e.stopPropagation(); onDelete([result.id]); }} title="Delete"
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <span className={`text-gray-400 text-xs transition-transform duration-200 ${open?"rotate-90":""}`}>›</span>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 space-y-5 rounded-b-xl">
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
                    {c.salary_min && <span className="text-xs text-green-700 font-medium">{c.salary_min} – {c.salary_max}/yr</span>}
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

// ── Confirm Modal ─────────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="text-2xl mb-3">🗑️</div>
        <div className="text-sm font-semibold text-gray-900 mb-2">{message}</div>
        <div className="text-xs text-gray-500 mb-5">This action cannot be undone.</div>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Spinner ───────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          style={{ animationName:"spin", animationDuration:"1s", animationTimingFunction:"linear", animationIterationCount:"infinite" }} />
        <p className="text-sm text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
export default function Dashboard() {
  const [data, setData]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showAll, setShowAll]         = useState(false);
  const [selectMode, setSelectMode]   = useState(false);
  const [selected, setSelected]       = useState(new Set());
  const [confirmModal, setConfirmModal] = useState(null);
  const navigate                      = useNavigate();

  useEffect(() => {
    API.get("/dashboard/")
      .then(r => { setData(r.data); setLoading(false); })
      .catch(e => {
        if (e.response?.status===401) navigate("/login");
        else { setError("Failed to load dashboard."); setLoading(false); }
      });
  }, [navigate]);

  const handleDelete = (ids) => {
    setConfirmModal({
      ids,
      message: ids.length === 1
        ? "Delete this quiz result?"
        : `Delete ${ids.length} selected quiz results?`,
    });
  };

  const confirmDelete = async () => {
    const { ids } = confirmModal;
    setConfirmModal(null);
    try { await Promise.all(ids.map(id => API.delete(`/results/${id}/`))); } catch (_) {}
    setData(prev => ({
      ...prev,
      history: prev.history.filter(r => !ids.includes(r.id)),
      total_attempts: Math.max(0, (prev.total_attempts || 0) - ids.length),
    }));
    setSelected(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (ids) => {
    const allSel = ids.every(id => selected.has(id));
    setSelected(allSel ? new Set() : new Set(ids));
  };

  const exitSelectMode = () => { setSelectMode(false); setSelected(new Set()); };

  if (loading) return <Spinner />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-sm">{error}</p>
    </div>
  );

  const dominant = data.category_totals
    ? Object.entries(data.category_totals).sort((a,b)=>b[1]-a[1])[0]?.[0] : null;
  const cs      = CAT_STYLE[dominant] || CAT_STYLE.general;
  const latest  = data.latest;
  const total   = data.total_attempts || 0;
  const history = data.history || [];
  const visibleHistory = showAll ? history : history.slice(0, HISTORY_PAGE_SIZE);
  const hasMore = history.length > HISTORY_PAGE_SIZE;
  const visibleIds = visibleHistory.map(r => r.id);
  const allVisibleSel = visibleIds.length > 0 && visibleIds.every(id => selected.has(id));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmDelete}
          onCancel={() => setConfirmModal(null)}
        />
      )}

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
                  {dominant && <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cs.bg} ${cs.text}`}>{CAT_ICON[dominant]} {dominant} interest</span>}
                  {total > 0 && <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">{total} quiz{total!==1?"zes":""} taken</span>}
                </div>
              </div>
            </div>
            <button onClick={() => navigate("/career-path")}
              className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
              Take new quiz →
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="🎯" label="Total attempts"      value={total}                                                      sub="career quizzes taken"          barColor="bg-purple-500" barPct={Math.min(total*20,100)} />
          <StatCard icon="🏆" label="Latest top match"    value={latest?.top_career?.split(" ").slice(0,2).join(" ")||"—"} sub={latest?.top_career||"Take a quiz first"} barColor="bg-green-500" barPct={latest?85:0} />
          <StatCard icon="📊" label="Last exam score"     value={latest?`${latest.percentage}%`:"—"}                        sub="your most recent %"             barColor="bg-amber-500"  barPct={latest?.percentage||0} />
          <StatCard icon={CAT_ICON[dominant]||"🎯"} label="Strongest interest" value={dominant||"—"}                        sub="across all attempts"            barColor={cs.bar}        barPct={dominant?90:0} />
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
                  {latest.all_careers?.[0]?.desc && <p className="text-xs text-purple-700 mb-3 leading-relaxed">{latest.all_careers[0].desc}</p>}
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

          {/* LEVEL BREAKDOWN */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-gray-800 mb-1">Attempts by level</div>
            <div className="text-xs text-gray-400 mb-5">Quiz distribution</div>
            <div className="space-y-4">
              {["10th","12th","grad","pg"].map(lvl => {
                const count = data.level_breakdown?.[lvl] || 0;
                const max   = Math.max(...Object.values(data.level_breakdown || { dummy: 1 }), 1);
                const pct   = Math.round((count / max) * 100);
                return (
                  <div key={lvl}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs text-gray-500">{LEVEL_LABEL[lvl]}</span>
                      <span className="text-xs font-semibold text-gray-800">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full"
                        style={{ width:`${pct}%`, transitionProperty:"width", transitionDuration:"700ms", transitionTimingFunction:"ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-800">Quiz history</div>
              <div className="text-xs text-gray-400 mt-0.5">
                {selectMode
                  ? `${selected.size} of ${visibleIds.length} selected`
                  : "Click any row to expand · ↓ to download"}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {!selectMode ? (
                /* ── Normal mode ── */
                <>
                  {history.length > 0 && (
                    <button onClick={() => setSelectMode(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Select
                    </button>
                  )}
                  {history.length > 0 && (
                    <button onClick={() => handleDelete(history.map(r => r.id))}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear all
                    </button>
                  )}
                </>
              ) : (
                /* ── Select mode toolbar ── */
                <>
                  <button onClick={() => toggleSelectAll(visibleIds)}
                    className="px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors">
                    {allVisibleSel ? "Deselect all" : "Select all"}
                  </button>
                  {selected.size > 0 && (
                    <button onClick={() => handleDelete([...selected])}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-lg text-xs font-semibold hover:bg-red-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete ({selected.size})
                    </button>
                  )}
                  <button onClick={exitSelectMode}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors">
                    Cancel
                  </button>
                </>
              )}
              <span className="text-xs text-gray-400">{total} attempt{total!==1?"s":""}</span>
            </div>
          </div>

          {history.length > 0 ? (
            <>
              <div className="space-y-3">
                {visibleHistory.map((r,i) => (
                  <HistoryRow
                    key={r.id}
                    result={r}
                    index={i}
                    selectMode={selectMode}
                    selected={selected.has(r.id)}
                    onToggleSelect={() => toggleSelect(r.id)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              {hasMore && (
                <button onClick={() => setShowAll(o => !o)}
                  className="mt-4 w-full py-2.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                  {showAll
                    ? <>Show less <span className="text-purple-400">↑</span></>
                    : <>Show {history.length - HISTORY_PAGE_SIZE} more result{history.length - HISTORY_PAGE_SIZE !== 1 ? "s" : ""} <span className="text-purple-400">↓</span></>}
                </button>
              )}
            </>
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

        {/* EXAM ELIGIBILITY CHECKER */}
        <ExamEligibilityChecker />

        {/* SCHOLARSHIP FINDER */}
        <ScholarshipFinder />

        {/* NEXT STEPS */}
        <div className="grid md:grid-cols-3 gap-4 pb-6">
          {[
            {icon:"📚",title:"Explore colleges",  desc:"Find colleges matching your career and score",action:"Browse colleges →",href:"/result",      bg:"bg-purple-50",text:"text-purple-900",sub:"text-purple-700"},
            {icon:"🗺️",title:"View roadmap",      desc:"Step-by-step path to your target career",      action:"See your path →", href:"/result",      bg:"bg-green-50", text:"text-green-900", sub:"text-green-700"},
            {icon:"🔁",title:"Try another level", desc:"Explore career paths for a different level",   action:"Start new quiz →",href:"/career-path", bg:"bg-amber-50", text:"text-amber-900", sub:"text-amber-700"},
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