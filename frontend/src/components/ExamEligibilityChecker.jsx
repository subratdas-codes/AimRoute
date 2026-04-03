// frontend/src/components/ExamEligibilityChecker.jsx
// Drop this component anywhere inside Dashboard.jsx
// Usage: <ExamEligibilityChecker />

import { useState, useMemo } from "react";

// ── Static Exam Data ──────────────────────────────────────────
const EXAMS = [
  // Engineering
  {
    id: "jee-main",
    name: "JEE Main",
    full: "Joint Entrance Examination (Main)",
    category: "Engineering",
    icon: "⚙️",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCM)"],
      minPercentage: 75, // 75% in PCM (65% for reserved)
      ageMin: null,
      ageMax: null,
      note: "75% aggregate in 12th (PCM). 65% for SC/ST/PwD.",
    },
    dates: { registration: "Nov – Dec 2024", exam: "Jan & Apr 2025" },
    link: "https://jeemain.nta.ac.in",
    seats: "~11 lakh candidates",
    color: { bg: "bg-blue-50", text: "text-blue-800", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-500" },
  },
  {
    id: "jee-adv",
    name: "JEE Advanced",
    full: "Joint Entrance Examination (Advanced)",
    category: "Engineering",
    icon: "🏛️",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCM)"],
      minPercentage: 75,
      note: "Must qualify JEE Main. Top 2.5 lakh ranks eligible. 75% in 12th (PCM).",
    },
    dates: { registration: "Apr – May 2025", exam: "May 2025" },
    link: "https://jeeadv.ac.in",
    seats: "~17,000 IIT seats",
    color: { bg: "bg-indigo-50", text: "text-indigo-800", badge: "bg-indigo-100 text-indigo-700", bar: "bg-indigo-500" },
  },
  {
    id: "bitsat",
    name: "BITSAT",
    full: "BITS Admission Test",
    category: "Engineering",
    icon: "🔬",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCM)"],
      minPercentage: 75,
      note: "75% aggregate in PCB/PCM in 12th with min 60% in each subject.",
    },
    dates: { registration: "Jan – Mar 2025", exam: "May – Jun 2025" },
    link: "https://www.bitsadmission.com",
    seats: "~2,000 seats across BITS campuses",
    color: { bg: "bg-cyan-50", text: "text-cyan-800", badge: "bg-cyan-100 text-cyan-700", bar: "bg-cyan-500" },
  },
  // Medical
  {
    id: "neet-ug",
    name: "NEET UG",
    full: "National Eligibility cum Entrance Test (UG)",
    category: "Medical",
    icon: "🩺",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCB)"],
      minPercentage: 50,
      note: "50% in Physics, Chemistry, Biology in 12th. 40% for SC/ST/OBC/PwD.",
    },
    dates: { registration: "Feb – Mar 2025", exam: "May 2025" },
    link: "https://neet.nta.nic.in",
    seats: "~1 lakh MBBS/BDS seats",
    color: { bg: "bg-red-50", text: "text-red-800", badge: "bg-red-100 text-red-700", bar: "bg-red-400" },
  },
  {
    id: "neet-pg",
    name: "NEET PG",
    full: "National Eligibility cum Entrance Test (PG)",
    category: "Medical",
    icon: "🏥",
    eligibility: {
      levels: ["grad"],
      streams: ["All"],
      minPercentage: 55,
      note: "MBBS degree with completion of 1-year internship mandatory.",
    },
    dates: { registration: "Nov 2024", exam: "Mar 2025" },
    link: "https://natboard.edu.in",
    seats: "~50,000 PG medical seats",
    color: { bg: "bg-pink-50", text: "text-pink-800", badge: "bg-pink-100 text-pink-700", bar: "bg-pink-400" },
  },
  // Management
  {
    id: "cat",
    name: "CAT",
    full: "Common Admission Test",
    category: "Management",
    icon: "💼",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 50,
      note: "50% aggregate in graduation (45% for SC/ST/PwD). Final year students can also apply.",
    },
    dates: { registration: "Aug – Sep 2025", exam: "Nov 2025" },
    link: "https://iimcat.ac.in",
    seats: "~4,000 IIM seats",
    color: { bg: "bg-amber-50", text: "text-amber-800", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
  },
  {
    id: "mat",
    name: "MAT",
    full: "Management Aptitude Test",
    category: "Management",
    icon: "📈",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 50,
      note: "Graduation in any discipline with 50% aggregate. Conducted 4 times a year.",
    },
    dates: { registration: "Rolling / quarterly", exam: "Feb, May, Sep, Dec" },
    link: "https://mat.aima.in",
    seats: "Accepted by 600+ B-Schools",
    color: { bg: "bg-orange-50", text: "text-orange-800", badge: "bg-orange-100 text-orange-700", bar: "bg-orange-400" },
  },
  {
    id: "xat",
    name: "XAT",
    full: "Xavier Aptitude Test",
    category: "Management",
    icon: "🎓",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 45,
      note: "Recognized bachelor's degree with minimum 45% aggregate.",
    },
    dates: { registration: "Jul – Nov 2024", exam: "Jan 2025" },
    link: "https://xatonline.in",
    seats: "XLRI & 150+ institutes",
    color: { bg: "bg-yellow-50", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-500" },
  },
  {
    id: "gmat",
    name: "GMAT",
    full: "Graduate Management Admission Test",
    category: "Management",
    icon: "🌐",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 50,
      note: "Bachelor's degree required. No minimum percentage — competitive score needed.",
    },
    dates: { registration: "Year-round", exam: "Year-round (computer adaptive)" },
    link: "https://www.mba.com/exams/gmat",
    seats: "7,700+ programs worldwide",
    color: { bg: "bg-teal-50", text: "text-teal-800", badge: "bg-teal-100 text-teal-700", bar: "bg-teal-500" },
  },
  // Law
  {
    id: "clat",
    name: "CLAT",
    full: "Common Law Admission Test",
    category: "Law",
    icon: "⚖️",
    eligibility: {
      levels: ["12th", "grad"],
      streams: ["All"],
      minPercentage: 45,
      note: "45% in 12th for UG CLAT. 50% in graduation for PG CLAT.",
    },
    dates: { registration: "Jan – Mar 2025", exam: "May 2025" },
    link: "https://consortiumofnlus.ac.in",
    seats: "NLUs across India",
    color: { bg: "bg-slate-50", text: "text-slate-800", badge: "bg-slate-100 text-slate-700", bar: "bg-slate-500" },
  },
  {
    id: "ailet",
    name: "AILET",
    full: "All India Law Entrance Test",
    category: "Law",
    icon: "🏛️",
    eligibility: {
      levels: ["12th"],
      streams: ["All"],
      minPercentage: 50,
      note: "50% in 12th from a recognized board. For NLU Delhi only.",
    },
    dates: { registration: "Jan – Mar 2025", exam: "Apr 2025" },
    link: "https://nationallawuniversitydelhi.in",
    seats: "NLU Delhi — ~110 seats",
    color: { bg: "bg-stone-50", text: "text-stone-800", badge: "bg-stone-100 text-stone-700", bar: "bg-stone-400" },
  },
  {
    id: "lsat",
    name: "LSAT India",
    full: "Law School Admission Test (India)",
    category: "Law",
    icon: "📜",
    eligibility: {
      levels: ["12th", "grad"],
      streams: ["All"],
      minPercentage: 45,
      note: "45% in qualifying exam. Accepted by 85+ law schools across India.",
    },
    dates: { registration: "Dec 2024 – Mar 2025", exam: "Apr – May 2025" },
    link: "https://www.lsatindia.in",
    seats: "85+ law schools",
    color: { bg: "bg-zinc-50", text: "text-zinc-800", badge: "bg-zinc-100 text-zinc-700", bar: "bg-zinc-500" },
  },
  // Civil Services
  {
    id: "upsc",
    name: "UPSC CSE",
    full: "Union Public Service Commission (Civil Services)",
    category: "Civil Services",
    icon: "🏅",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 0,
      ageMin: 21,
      ageMax: 32,
      note: "Any bachelor's degree. Age: 21–32 (relaxation for reserved categories). No minimum %.",
    },
    dates: { registration: "Feb – Mar 2025", exam: "Prelims: Jun 2025, Mains: Sep 2025" },
    link: "https://upsc.gov.in",
    seats: "~1,000 posts (IAS/IPS/IFS etc.)",
    color: { bg: "bg-green-50", text: "text-green-800", badge: "bg-green-100 text-green-700", bar: "bg-green-500" },
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL",
    full: "Staff Selection Commission — Combined Graduate Level",
    category: "Civil Services",
    icon: "🗂️",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 0,
      ageMin: 18,
      ageMax: 32,
      note: "Any bachelor's degree. Age: 18–32 depending on post. No minimum %.",
    },
    dates: { registration: "Apr – May 2025", exam: "Tier I: Jul 2025" },
    link: "https://ssc.nic.in",
    seats: "Several thousand Group B/C posts",
    color: { bg: "bg-emerald-50", text: "text-emerald-800", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  },
  // Design
  {
    id: "nata",
    name: "NATA",
    full: "National Aptitude Test in Architecture",
    category: "Design",
    icon: "🏗️",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCM)", "Commerce", "Arts/Humanities"],
      minPercentage: 50,
      note: "50% in 12th with Mathematics as a subject. Mandatory for B.Arch admission.",
    },
    dates: { registration: "Jan – Feb 2025", exam: "Apr & Jun 2025" },
    link: "https://nata.in",
    seats: "All architecture colleges",
    color: { bg: "bg-violet-50", text: "text-violet-800", badge: "bg-violet-100 text-violet-700", bar: "bg-violet-500" },
  },
  {
    id: "nid",
    name: "NID DAT",
    full: "National Institute of Design — Design Aptitude Test",
    category: "Design",
    icon: "🎨",
    eligibility: {
      levels: ["12th", "grad"],
      streams: ["All"],
      minPercentage: 50,
      note: "10+2 or equivalent for B.Des. Graduation for M.Des. No specific stream required.",
    },
    dates: { registration: "Oct – Nov 2024", exam: "Jan 2025" },
    link: "https://admissions.nid.edu",
    seats: "NID campuses across India",
    color: { bg: "bg-fuchsia-50", text: "text-fuchsia-800", badge: "bg-fuchsia-100 text-fuchsia-700", bar: "bg-fuchsia-500" },
  },
  {
    id: "nift",
    name: "NIFT",
    full: "National Institute of Fashion Technology Entrance",
    category: "Design",
    icon: "👗",
    eligibility: {
      levels: ["12th", "grad"],
      streams: ["All"],
      minPercentage: 45,
      note: "12th pass for UG programs. Graduation for PG. Any stream accepted.",
    },
    dates: { registration: "Nov 2024 – Jan 2025", exam: "Feb 2025" },
    link: "https://nift.ac.in",
    seats: "NIFT campuses — 16 cities",
    color: { bg: "bg-rose-50", text: "text-rose-800", badge: "bg-rose-100 text-rose-700", bar: "bg-rose-400" },
  },
  // Banking
  {
    id: "ibps-po",
    name: "IBPS PO",
    full: "IBPS Probationary Officer",
    category: "Banking",
    icon: "🏦",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 0,
      ageMin: 20,
      ageMax: 30,
      note: "Any bachelor's degree. Age: 20–30 (relaxation for reserved). No minimum %.",
    },
    dates: { registration: "Jul – Aug 2025", exam: "Oct – Nov 2025" },
    link: "https://www.ibps.in",
    seats: "~3,000+ PO posts across PSU banks",
    color: { bg: "bg-sky-50", text: "text-sky-800", badge: "bg-sky-100 text-sky-700", bar: "bg-sky-500" },
  },
  {
    id: "sbi-po",
    name: "SBI PO",
    full: "State Bank of India Probationary Officer",
    category: "Banking",
    icon: "💰",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["All"],
      minPercentage: 0,
      ageMin: 21,
      ageMax: 30,
      note: "Any bachelor's degree. Age: 21–30. Final year students can apply provisionally.",
    },
    dates: { registration: "Nov 2024 – Dec 2024", exam: "Jan – Feb 2025" },
    link: "https://sbi.co.in/careers",
    seats: "~2,000 PO posts",
    color: { bg: "bg-blue-50", text: "text-blue-800", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-400" },
  },
  // Defence
  {
    id: "nda",
    name: "NDA",
    full: "National Defence Academy",
    category: "Defence",
    icon: "🪖",
    eligibility: {
      levels: ["12th"],
      streams: ["Science (PCM)", "All"],
      minPercentage: 0,
      ageMin: 16.5,
      ageMax: 19.5,
      note: "12th pass (PCM for Air Force/Navy). Age: 16.5–19.5 years. Only unmarried males.",
    },
    dates: { registration: "Dec 2024 & Jun 2025", exam: "Apr & Sep 2025" },
    link: "https://upsc.gov.in",
    seats: "~400 NDA seats",
    color: { bg: "bg-olive-50 bg-lime-50", text: "text-lime-800", badge: "bg-lime-100 text-lime-700", bar: "bg-lime-600" },
  },
  {
    id: "cds",
    name: "CDS",
    full: "Combined Defence Services",
    category: "Defence",
    icon: "🎖️",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["Science (PCM)", "All"],
      minPercentage: 0,
      ageMin: 19,
      ageMax: 25,
      note: "Graduation required. Age: 19–25 varies by academy. PCM for Air Force/Navy.",
    },
    dates: { registration: "Nov 2024 & May 2025", exam: "Feb & Sep 2025" },
    link: "https://upsc.gov.in",
    seats: "~450 seats across IMA/AFA/INA/OTA",
    color: { bg: "bg-green-50", text: "text-green-900", badge: "bg-green-200 text-green-800", bar: "bg-green-700" },
  },
  {
    id: "afcat",
    name: "AFCAT",
    full: "Air Force Common Admission Test",
    category: "Defence",
    icon: "✈️",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["Science (PCM)", "All"],
      minPercentage: 60,
      ageMin: 20,
      ageMax: 26,
      note: "Graduation with 60% aggregate. Age: 20–26. PCM/BE for flying branch.",
    },
    dates: { registration: "Dec 2024 & Jun 2025", exam: "Feb & Aug 2025" },
    link: "https://afcat.cdac.in",
    seats: "Various IAF branches",
    color: { bg: "bg-sky-50", text: "text-sky-900", badge: "bg-sky-200 text-sky-800", bar: "bg-sky-600" },
  },
  // GATE
  {
    id: "gate",
    name: "GATE",
    full: "Graduate Aptitude Test in Engineering",
    category: "Engineering",
    icon: "🔧",
    eligibility: {
      levels: ["grad", "pg"],
      streams: ["Science (PCM)", "All"],
      minPercentage: 0,
      note: "Bachelor's in Engineering/Technology/Architecture or Masters in Science. No minimum %.",
    },
    dates: { registration: "Aug – Oct 2025", exam: "Feb 2026" },
    link: "https://gate2025.iitr.ac.in",
    seats: "PSUs + M.Tech/MS admissions",
    color: { bg: "bg-purple-50", text: "text-purple-800", badge: "bg-purple-100 text-purple-700", bar: "bg-purple-500" },
  },
];

const CATEGORIES = ["All", "Engineering", "Medical", "Management", "Law", "Civil Services", "Design", "Banking", "Defence"];

const LEVEL_OPTIONS = [
  { value: "12th",  label: "12th Grade" },
  { value: "grad",  label: "Graduation" },
  { value: "pg",    label: "Post Graduation" },
];

const STREAM_OPTIONS = {
  "12th": ["Science (PCM)", "Science (PCB)", "Commerce", "Arts/Humanities"],
  "grad": ["All"],
  "pg":   ["All"],
};

const CAT_ICONS = {
  Engineering: "⚙️", Medical: "🩺", Management: "💼",
  Law: "⚖️", "Civil Services": "🏅", Design: "🎨",
  Banking: "🏦", Defence: "🪖",
};

function isEligible(exam, level, stream, pct) {
  const e = exam.eligibility;
  if (!e.levels.includes(level)) return false;
  if (e.streams[0] !== "All" && stream && !e.streams.includes(stream)) return false;
  if (pct !== "" && Number(pct) < e.minPercentage) return false;
  return true;
}

function EligibilityBadge({ eligible }) {
  return eligible ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd"/>
      </svg>
      Eligible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
      </svg>
      Not Eligible
    </span>
  );
}

function ExamCard({ exam, eligible }) {
  const [expanded, setExpanded] = useState(false);
  const c = exam.color;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${eligible ? "border-gray-100 shadow-sm" : "border-gray-100 opacity-60"}`}>
      <div
        className={`flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${expanded ? "bg-gray-50" : "bg-white"}`}
        onClick={() => setExpanded(o => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-lg w-8 h-8 flex items-center justify-center rounded-lg ${c.bg} flex-shrink-0`}>{exam.icon}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{exam.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.badge}`}>{exam.category}</span>
            </div>
            <div className="text-xs text-gray-400 truncate hidden sm:block">{exam.full}</div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <EligibilityBadge eligible={eligible} />
          <span className={`text-gray-400 text-xs transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}>›</span>
        </div>
      </div>

      {expanded && (
        <div className={`border-t border-gray-100 px-4 py-4 space-y-3 ${c.bg}`}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3.5 border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Eligibility Criteria</div>
              <p className="text-xs text-gray-600 leading-relaxed">{exam.eligibility.note}</p>
            </div>
            <div className="bg-white rounded-xl p-3.5 border border-gray-100">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Important Dates</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Registration</span>
                  <span className="font-medium text-gray-800">{exam.dates.registration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Exam Date</span>
                  <span className="font-medium text-gray-800">{exam.dates.exam}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Seats</span>
                  <span className="font-medium text-gray-800">{exam.seats}</span>
                </div>
              </div>
            </div>
          </div>
          <a
            href={exam.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${c.badge} hover:opacity-80 transition-opacity`}
          >
            Official Website ↗
          </a>
        </div>
      )}
    </div>
  );
}

export default function ExamEligibilityChecker() {
  const [level,    setLevel]    = useState("");
  const [stream,   setStream]   = useState("");
  const [pct,      setPct]      = useState("");
  const [activeTab, setTab]     = useState("All");
  const [showAll,  setShowAll]  = useState(false);

  const streams = level ? STREAM_OPTIONS[level] || [] : [];

  const { eligible, ineligible } = useMemo(() => {
    if (!level) return { eligible: [], ineligible: [] };
    const filtered = EXAMS.filter(e => activeTab === "All" || e.category === activeTab);
    const elig = [], inelig = [];
    filtered.forEach(e => {
      if (isEligible(e, level, stream, pct)) elig.push(e);
      else inelig.push(e);
    });
    return { eligible: elig, ineligible: inelig };
  }, [level, stream, pct, activeTab]);

  const displayed = showAll ? [...eligible, ...ineligible] : eligible;
  const hasResult = level !== "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xl">📋</span>
          <div>
            <div className="text-sm font-semibold text-gray-800">Exam Eligibility Checker</div>
            <div className="text-xs text-gray-400">Enter your details to see which exams you can apply for</div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="px-6 py-5">
        <div className="grid sm:grid-cols-3 gap-3">
          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Education Level *</label>
            <select
              value={level}
              onChange={e => { setLevel(e.target.value); setStream(""); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="">Select level</option>
              {LEVEL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Stream */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Stream / Branch</label>
            <select
              value={stream}
              onChange={e => setStream(e.target.value)}
              disabled={!level || streams[0] === "All"}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">{streams[0] === "All" ? "All streams" : "Select stream"}</option>
              {streams[0] !== "All" && streams.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Percentage / CGPA %</label>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 78"
              value={pct}
              onChange={e => setPct(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {hasResult && (
        <>
          {/* Summary bar */}
          <div className="mx-6 mb-4 bg-purple-50 rounded-xl px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold text-green-700">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                {eligible.length} eligible
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                {ineligible.length} not eligible
              </span>
            </div>
            {pct === "" && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                ⚠️ Enter % for precise results
              </span>
            )}
          </div>

          {/* Category tabs */}
          <div className="px-6 mb-4">
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setTab(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    activeTab === cat
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat !== "All" && <span className="mr-1">{CAT_ICONS[cat]}</span>}
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exam list */}
          <div className="px-6 pb-6 space-y-2">
            {displayed.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-sm font-semibold text-gray-600 mb-1">No exams found</p>
                <p className="text-xs text-gray-400">Try a different category or adjust your details</p>
              </div>
            ) : (
              <>
                {eligible.filter(e => activeTab === "All" || e.category === activeTab).map(e => (
                  <ExamCard key={e.id} exam={e} eligible={true} />
                ))}
                {showAll && ineligible.filter(e => activeTab === "All" || e.category === activeTab).map(e => (
                  <ExamCard key={e.id} exam={e} eligible={false} />
                ))}
              </>
            )}

            {ineligible.length > 0 && (
              <button
                onClick={() => setShowAll(o => !o)}
                className="w-full mt-1 text-xs text-gray-400 hover:text-gray-600 py-2 border border-dashed border-gray-200 rounded-xl transition-colors hover:border-gray-300"
              >
                {showAll ? "Hide ineligible exams ↑" : `Show ${ineligible.filter(e => activeTab === "All" || e.category === activeTab).length} ineligible exams ↓`}
              </button>
            )}
          </div>
        </>
      )}

      {/* Empty state */}
      {!hasResult && (
        <div className="px-6 pb-6">
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-3xl mb-3">🎓</p>
            <p className="text-sm font-semibold text-gray-600 mb-1">Select your education level to begin</p>
            <p className="text-xs text-gray-400">We'll show eligible exams from JEE, NEET, CAT, UPSC & more</p>
          </div>
        </div>
      )}
    </div>
  );
}