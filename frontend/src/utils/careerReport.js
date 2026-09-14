// frontend/src/utils/careerReport.js
// Shared client-side PDF report generator for AimRoute results.

const LEVEL_LABEL = {
  "10th": "After 10th",
  "12th": "After 12th",
  grad: "After Graduation",
  pg: "After PG",
};

const ROADMAP = {
  "10th": ["10th Exam", "Choose Stream", "11th & 12th", "Degree / Diploma", "Career"],
  "12th": ["12th Exam", "Entrance Exam", "Degree (3-5 yrs)", "Job / PG", "Career"],
  grad: ["Graduation", "Entrance / Job", "PG / Certification", "Senior Role", "Career"],
  pg: ["PG Degree", "Specialisation", "Research / Industry", "Leadership", "Career"],
};

function formatDate(iso) {
  if (!iso) return new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function buildReportHTML(result) {
  const careers   = result.top_careers || result.all_careers || [];
  const level     = LEVEL_LABEL[result.level] || result.level || "Student";
  const date      = formatDate(result.created_at);
  const cat       = result.dominant_category || "General";
  const pct       = result.percentage || 0;
  const roadmap   = ROADMAP[result.level] || ROADMAP["grad"];
  const top       = result.top_career || careers[0]?.career || "—";
  const fit       = result.fit_label || careers[0]?.fit || "—";

  const r = 40, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const donutSVG = `<svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg">
    <circle cx="55" cy="55" r="${r}" fill="none" stroke="#ede9fe" stroke-width="13"/>
    <circle cx="55" cy="55" r="${r}" fill="none" stroke="#7c3aed" stroke-width="13"
      stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}" stroke-dashoffset="${(circ / 4).toFixed(1)}" stroke-linecap="round"/>
    <text x="55" y="51" text-anchor="middle" font-family="Arial" font-size="16" font-weight="800" fill="#1e1b4b">${pct}%</text>
    <text x="55" y="67" text-anchor="middle" font-family="Arial" font-size="9" fill="#9ca3af">Score</text>
  </svg>`;

  const chartColors = ["#7c3aed", "#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];
  const chartBars = careers.slice(0, 6).map((c, i) => {
    const barW = Math.max(12, 100 - i * 13);
    return `<div style="margin-bottom:11px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:180px;font-size:11px;color:#374151;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;">${i + 1}. ${c.career || ""}</div>
        <div style="flex:1;background:#f3f4f6;border-radius:99px;height:14px;overflow:hidden;max-width:220px;">
          <div style="width:${barW}%;background:${chartColors[i] || "#7c3aed"};height:100%;border-radius:99px;"></div>
        </div>
        <div style="width:32px;text-align:right;font-size:11px;font-weight:700;color:${chartColors[i] || "#7c3aed"};flex-shrink:0;">${barW}%</div>
      </div>
    </div>`;
  }).join("");

  const roadmapSteps = roadmap.map((s, i) => `
    <span style="background:${i === 0 ? "#7c3aed" : i === roadmap.length - 1 ? "#059669" : "#e5e7eb"};
      color:${i === 0 || i === roadmap.length - 1 ? "#fff" : "#374151"};
      padding:5px 13px;border-radius:99px;font-size:11px;font-weight:600;white-space:nowrap;display:inline-block;">${s}</span>
    ${i < roadmap.length - 1 ? `<span style="color:#d1d5db;font-size:16px;vertical-align:middle;"> › </span>` : ""}`
  ).join("");

  const careerRows = careers.map((c, i) => `
    <tr style="border-bottom:1px solid #f3f4f6;background:${i % 2 === 0 ? "#fafafa" : "#fff"};">
      <td style="padding:9px 8px;font-weight:600;color:#1e1b4b;">${i + 1}. ${c.career || ""}</td>
      <td style="padding:9px 8px;color:#6b7280;">${c.category || ""}</td>
      <td style="padding:9px 8px;">
        <span style="background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:99px;font-size:10px;">${c.fit || "—"}</span>
      </td>
      <td style="padding:9px 8px;color:#059669;font-weight:600;">${c.salary_min && c.salary_max ? `${c.salary_min} - ${c.salary_max}` : (c.salary_min || "—")}</td>
    </tr>`).join("");

  const reasonPills = (result.reasons || []).slice(0, 6).map(r =>
    `<span style="background:#ede9fe;color:#5b21b6;padding:4px 12px;border-radius:99px;font-size:11px;display:inline-block;margin:3px 3px 3px 0;">${r}</span>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>AimRoute Career Report</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,sans-serif;color:#1f2937;background:#fff;}
  .header{background:linear-gradient(135deg,#e91e8c 0%,#7c3aed 100%);padding:34px 44px;color:#fff;}
  .header h1{font-size:23px;font-weight:800;margin-bottom:4px;}
  .header p{font-size:12px;opacity:.85;}
  .badge{display:inline-block;background:rgba(255,255,255,.2);padding:3px 11px;border-radius:99px;font-size:11px;margin-top:8px;}
  .body{padding:28px 44px;}
  .section{margin-bottom:26px;}
  .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;
    color:#9ca3af;margin-bottom:12px;border-bottom:1px solid #f3f4f6;padding-bottom:6px;}
  .top-box{background:linear-gradient(135deg,#f5f3ff,#e0e7ff);border-radius:12px;
    padding:20px 24px;margin-bottom:22px;border-left:5px solid #7c3aed;}
  .top-box .lbl{font-size:10px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;}
  .top-box .nm{font-size:21px;font-weight:800;color:#1e1b4b;margin-bottom:4px;}
  .score-flex{display:flex;align-items:center;gap:22px;flex-wrap:wrap;}
  .meta-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:11px;}
  .meta-box{background:#f9fafb;border-radius:9px;padding:13px 15px;border:1px solid #f3f4f6;}
  .meta-box .lbl{font-size:10px;color:#9ca3af;margin-bottom:3px;}
  .meta-box .val{font-size:14px;font-weight:700;color:#1e1b4b;}
  .chart-box{background:#fafafa;border-radius:11px;padding:16px 18px;border:1px solid #f3f4f6;}
  table{width:100%;border-collapse:collapse;}
  th{text-align:left;padding:9px 8px;font-size:10px;color:#9ca3af;text-transform:uppercase;
    letter-spacing:.5px;border-bottom:2px solid #f3f4f6;background:#fafafa;}
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

  <div class="top-box">
    <div class="lbl">Your Best Career Match</div>
    <div class="nm">${top}</div>
    <div style="font-size:12px;color:#4c1d95;margin-top:4px;">Fit label: ${fit}</div>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <div class="score-flex">
      <div style="flex-shrink:0;">${donutSVG}</div>
      <div style="flex:1;min-width:260px;">
        <div class="meta-grid">
          <div class="meta-box"><div class="lbl">Education Level</div><div class="val">${level}</div></div>
          <div class="meta-box"><div class="lbl">Dominant Interest</div><div class="val">${cat}</div></div>
          <div class="meta-box"><div class="lbl">Fit Label</div><div class="val">${fit}</div></div>
        </div>
        ${careers[0]?.salary_min ? `
        <div style="margin-top:10px;background:#f0fdf4;border-radius:9px;padding:9px 13px;border:1px solid #bbf7d0;">
          <div style="font-size:10px;color:#6b7280;margin-bottom:2px;">Estimated Salary (Top Match)</div>
          <div style="font-size:15px;font-weight:800;color:#059669;">${careers[0].salary_min} - ${careers[0].salary_max} LPA</div>
        </div>` : ""}
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Career Match Strength</div>
    <div class="chart-box">${chartBars}</div>
  </div>

  <div class="section">
    <div class="section-title">All Career Suggestions</div>
    <table>
      <thead><tr><th>Rank</th><th>Career</th><th>Category</th><th>Fit</th><th>Salary (LPA)</th></tr></thead>
      <tbody>${careerRows}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Your Career Roadmap</div>
    <div style="background:#f9fafb;padding:14px 16px;border-radius:11px;border:1px solid #f3f4f6;line-height:2.4;">
      ${roadmapSteps}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Why This Fits You</div>
    <div style="line-height:2.2;">${reasonPills || "<span style=\"color:#9ca3af\">—</span>"}</div>
  </div>

  <div class="footer">
    AimRoute &middot; AI Career Guidance &middot; aimroute.noreply@gmail.com<br/>
    This report is auto-generated based on your quiz responses. Results are indicative and for guidance only.
  </div>

</div>
</body>
</html>`;
}

export function downloadCareerPDF(result) {
  const html  = buildReportHTML(result);
  const blob  = new Blob([html], { type: "text/html" });
  const url   = URL.createObjectURL(blob);
  const win   = window.open(url, "_blank");
  if (win) win.onload = () => { win.print(); URL.revokeObjectURL(url); };
}