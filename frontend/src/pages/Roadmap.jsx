import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Full career roadmap database ──────────────────────────────
const ROADMAP_DB = {
  // ── TECHNOLOGY ───────────────────────────────────────────────
  "Software Engineer": [
    { phase: "Foundation", duration: "0–6 months", title: "Learn Programming Basics", desc: "Master Python or JavaScript fundamentals, data structures, and algorithms. Pick one language and go deep.", resources: ["CS50 by Harvard (free)", "freeCodeCamp", "Python.org Docs", "LeetCode Easy"], icon: "💻" },
    { phase: "Core Skills", duration: "6–12 months", title: "DSA + First Projects", desc: "Solve 100+ DSA problems. Build 2–3 full-stack projects and push them to GitHub.", resources: ["The Odin Project", "NeetCode 150", "GitHub", "MDN Web Docs"], icon: "🧱" },
    { phase: "Specialise", duration: "1–2 years", title: "Pick Your Domain", desc: "Choose frontend (React), backend (Node/FastAPI), DevOps, or ML. Get an internship.", resources: ["Roadmap.sh", "System Design Primer", "Internshala", "LinkedIn"], icon: "🎯" },
    { phase: "Career", duration: "2+ years", title: "Land Your Role", desc: "Apply to product startups, service companies, and eventually FAANG-tier firms. Keep building in public.", resources: ["Naukri", "AngelList", "Glassdoor", "Blind"], icon: "🚀" },
  ],
  "B.Tech / B.E (JEE)": [
    { phase: "Entrance Prep", duration: "Class 11–12", title: "Crack JEE Main / Advanced", desc: "Focus on Physics, Chemistry, Maths. Target JEE Main 95+ percentile and JEE Advanced for IITs.", resources: ["Allen Kota", "Aakash", "PW (Physics Wallah)", "NCERT + HC Verma"], icon: "📚" },
    { phase: "B.Tech", duration: "4 years", title: "Engineering Degree", desc: "Study your chosen branch deeply. Do internships from 2nd year. Contribute to open source and hackathons.", resources: ["NPTEL", "MIT OpenCourseWare", "Internshala", "GitHub"], icon: "🎓" },
    { phase: "Specialise", duration: "Year 3–4", title: "Domain + Placements", desc: "Pick a specialisation (AI/ML, Web, VLSI, etc). Build projects. Prepare for campus placements or GATE.", resources: ["LeetCode", "GeeksforGeeks", "Codeforces", "GATE PYQs"], icon: "🧠" },
    { phase: "Career", duration: "After graduation", title: "Job or Higher Studies", desc: "Join a tech company via campus or off-campus. Or pursue M.Tech (GATE) / MS abroad / MBA.", resources: ["LinkedIn", "GRE Prep", "GATE", "Naukri"], icon: "🚀" },
  ],
  "Data Scientist": [
    { phase: "Foundation", duration: "0–6 months", title: "Math & Python", desc: "Learn statistics, probability, linear algebra, and Python with pandas/numpy. Build strong fundamentals.", resources: ["Khan Academy", "StatQuest (YouTube)", "Kaggle Learn", "3Blue1Brown"], icon: "📐" },
    { phase: "Core Skills", duration: "6–12 months", title: "ML Algorithms", desc: "Study supervised and unsupervised learning. Build end-to-end ML pipelines and enter Kaggle competitions.", resources: ["fast.ai", "Scikit-learn Docs", "Kaggle Competitions", "Andrew Ng ML Course"], icon: "🤖" },
    { phase: "Specialise", duration: "1–2 years", title: "Deep Learning & NLP", desc: "Learn PyTorch or TensorFlow. Explore NLP, computer vision, or time-series based on your interest.", resources: ["Deep Learning Book (Goodfellow)", "Hugging Face", "Papers With Code", "Arxiv"], icon: "🧠" },
    { phase: "Career", duration: "2+ years", title: "Industry Entry", desc: "Start as Data Analyst or ML Engineer. Grow to Data Scientist → Senior DS → ML Lead.", resources: ["LinkedIn", "Analytics Vidhya", "AnalyticsIndiaMag", "Glassdoor"], icon: "📈" },
  ],
  "BCA / MCA": [
    { phase: "Foundation", duration: "Year 1", title: "CS Fundamentals", desc: "Learn C, Java, DBMS, OS, and networking. Build strong programming fundamentals.", resources: ["NPTEL", "W3Schools", "GeeksforGeeks", "TutorialsPoint"], icon: "💻" },
    { phase: "Core Skills", duration: "Year 2–3", title: "Web & App Dev", desc: "Learn full-stack web development or Android/iOS. Build projects and host them online.", resources: ["The Odin Project", "freeCodeCamp", "Flutter Docs", "Firebase"], icon: "🧱" },
    { phase: "Specialise", duration: "MCA or PG cert", title: "MCA or Certification", desc: "Pursue MCA for deeper CS knowledge, or do industry certifications in Cloud, AI, or Cybersecurity.", resources: ["AWS Certifications", "Google Cloud", "Coursera", "NPTEL MCA"], icon: "🎯" },
    { phase: "Career", duration: "After degree", title: "Tech Roles", desc: "Apply for Software Developer, System Analyst, or IT Consultant roles. Upskill continuously.", resources: ["Naukri", "Internshala", "LinkedIn", "HackerRank"], icon: "🚀" },
  ],
  "Cybersecurity Analyst": [
    { phase: "Foundation", duration: "0–6 months", title: "Networking & OS Basics", desc: "Learn TCP/IP, Linux, and Windows administration. Understand how the internet works at a protocol level.", resources: ["CompTIA Network+ material", "TryHackMe (free tier)", "Linux Journey", "Professor Messer"], icon: "🔐" },
    { phase: "Core Skills", duration: "6–18 months", title: "Security Fundamentals", desc: "Study ethical hacking, vulnerability assessment, SIEM, and incident response. Get CEH or CompTIA Security+.", resources: ["TryHackMe", "Hack The Box", "CompTIA Security+", "OWASP Top 10"], icon: "🛡️" },
    { phase: "Specialise", duration: "1–2 years", title: "Pick a Track", desc: "Choose Penetration Testing, SOC Analyst, Cloud Security, or Forensics. Get specialised certifications.", resources: ["OSCP (OffSec)", "CEH", "AWS Security Specialty", "SANS GIAC"], icon: "🎯" },
    { phase: "Career", duration: "2+ years", title: "Industry Roles", desc: "Join as SOC Analyst, Pen Tester, or Security Engineer. Bug bounty programs help build credibility.", resources: ["HackerOne", "Bugcrowd", "LinkedIn", "Naukri"], icon: "🚀" },
  ],
  // ── BUSINESS ──────────────────────────────────────────────────
  "Chartered Accountant": [
    { phase: "Foundation", duration: "After 12th", title: "Clear CA Foundation", desc: "Register with ICAI. Study Accounts, Maths, Economics and Business Law. Target 50%+ in each paper.", resources: ["ICAI Study Material", "ICAI Portal (icai.org)", "CA Foundation Books"], icon: "📖" },
    { phase: "Intermediate", duration: "1–2 years", title: "CA Intermediate + Articleship", desc: "Clear both groups of CA Inter. Begin your 3-year articleship simultaneously under a practicing CA.", resources: ["ICAI ICITSS Training", "ICAI Mock Tests", "CA Intermediate Notes"], icon: "📊" },
    { phase: "Articleship", duration: "3 years", title: "Practical Training", desc: "Work under a CA firm. Gain hands-on audit, taxation, and accounts experience. Build your professional network.", resources: ["ICAI Articleship Portal", "Tally ERP / SAP", "Tax Audit Manuals"], icon: "🏢" },
    { phase: "Final", duration: "6–12 months", title: "CA Final & Beyond", desc: "Clear CA Finals. Join Big 4, industry finance teams, or start your own practice.", resources: ["ICAI Final Material", "Big 4 Firms (EY, KPMG, PwC, Deloitte)", "DISA/CISA Certs"], icon: "🏆" },
  ],
  "MBA": [
    { phase: "Foundation", duration: "Graduation years", title: "Build Work Experience", desc: "Complete your graduation. Get 2+ years of work experience — most top B-schools prefer it.", resources: ["LinkedIn", "Internshala", "Entry-level jobs"], icon: "💼" },
    { phase: "Entrance Prep", duration: "6–12 months", title: "Crack CAT / GMAT / XAT", desc: "Target CAT 95+ percentile for IIMs. Prepare Quant, VARC, and DILR rigorously.", resources: ["TIME Institute", "IMS India", "Career Launcher", "MBA CrackJam"], icon: "📝" },
    { phase: "MBA", duration: "2 years", title: "B-School", desc: "Study finance, marketing, strategy, or operations. Do internships and build a strong alumni network.", resources: ["IIM Case Studies", "Harvard Business Review", "LinkedIn Learning"], icon: "🎓" },
    { phase: "Career", duration: "After MBA", title: "Management Roles", desc: "Enter consulting, investment banking, product management, or marketing. Aim for leadership roles in 5–7 years.", resources: ["BCG", "McKinsey", "Bain", "Consulting India"], icon: "📈" },
  ],
  "BBA": [
    { phase: "Foundation", duration: "After 12th", title: "BBA Admission", desc: "Clear DU JAT, IPMAT, SET, or college-specific exams. Get into a good BBA program.", resources: ["DU JAT Prep", "IPMAT Material", "Career Launcher", "TIME Institute"], icon: "📖" },
    { phase: "Core", duration: "3 years", title: "BBA Degree", desc: "Study management, marketing, finance, and HR. Do internships every summer and join business clubs.", resources: ["Harvard Business Review", "Coursera Business Courses", "Internshala"], icon: "🎓" },
    { phase: "Specialise", duration: "Year 3", title: "Choose Your Domain", desc: "Focus on Finance, Marketing, HR, or Entrepreneurship. Build case study experience.", resources: ["CFA Level 1 (for Finance)", "Google Digital Marketing", "Toastmasters"], icon: "🎯" },
    { phase: "Career", duration: "After BBA", title: "Entry-Level Management", desc: "Join as Management Trainee, Sales Executive, or HR Associate. Or pursue MBA for faster growth.", resources: ["Naukri", "LinkedIn", "CAT/GMAT Prep"], icon: "🚀" },
  ],
  "Product Manager": [
    { phase: "Foundation", duration: "0–6 months", title: "PM Fundamentals", desc: "Learn product thinking, user research, roadmapping, PRDs, and agile/scrum methodologies.", resources: ["Lenny's Newsletter", "Reforge", "Shreyas Doshi (Twitter/X)", "Product School"], icon: "🗺️" },
    { phase: "Core Skills", duration: "6–12 months", title: "Build & Ship Products", desc: "Work on side projects, contribute to open source, or take up freelance PM work. Build a portfolio.", resources: ["ProductHunt", "Figma", "Notion", "JIRA / Linear"], icon: "🛠️" },
    { phase: "Break In", duration: "1–2 years", title: "APM or Lateral Move", desc: "Apply to Associate PM programs (Google, Microsoft, Flipkart, Swiggy). Or transition from engineering/design.", resources: ["APM List", "LinkedIn", "Exponent PM", "PM Exercises"], icon: "🎯" },
    { phase: "Career", duration: "2+ years", title: "Scale as PM", desc: "Lead product squads, own OKRs and KPIs. Progress from APM → PM → Senior PM → Group PM → CPO.", resources: ["Intercom Blog", "Gibson Biddle", "Amplitude Academy"], icon: "📊" },
  ],
  // ── HEALTHCARE ────────────────────────────────────────────────
  "Doctor (MBBS)": [
    { phase: "Entrance Prep", duration: "Class 11–12", title: "Crack NEET UG", desc: "Study PCB rigorously. Target 600+ in NEET UG to get into a government medical college.", resources: ["Allen Kota", "Aakash Institute", "NCERT Biology", "PW (Physics Wallah)"], icon: "📚" },
    { phase: "MBBS", duration: "5.5 years", title: "MBBS Degree", desc: "Study all medical disciplines. Complete rotations in Medicine, Surgery, Paediatrics, OBG, and Psychiatry.", resources: ["Harrison's Principles of Internal Medicine", "Robbins Pathology", "Medscape"], icon: "🏥" },
    { phase: "PG Prep", duration: "1 year", title: "Crack NEET PG", desc: "Prepare for NEET PG to pursue MD/MS in your chosen specialty.", resources: ["PrepLadder", "Marrow", "DAMS", "NEET PG PYQs"], icon: "🩺" },
    { phase: "Career", duration: "3+ years", title: "Residency & Practice", desc: "Complete MD/MS residency. Join a hospital, start a clinic, or pursue super-speciality (DM/MCh).", resources: ["NMC Guidelines", "AIIMS Fellowship Programs", "Private Practice Setup"], icon: "⚕️" },
  ],
  "Pharmacist": [
    { phase: "Foundation", duration: "After 12th PCB", title: "D.Pharm / B.Pharm Admission", desc: "Clear GPAT entrance or college-level tests. Enroll in a PCI-approved pharmacy college.", resources: ["GPAT Prep Material", "PCI Website (pci.nic.in)", "D.Pharm Books"], icon: "💊" },
    { phase: "Degree", duration: "2–4 years", title: "Pharmacy Degree", desc: "Study pharmacology, pharmaceutical chemistry, and drug formulation. Do hospital or industry internships.", resources: ["NPTEL Pharmacy", "Pharmacy Books by AK Gupta", "Hospital Internship"], icon: "🎓" },
    { phase: "Specialise", duration: "M.Pharm or MBA", title: "Higher Studies", desc: "Pursue M.Pharm for research/academia, or MBA (Pharma) for industry management roles.", resources: ["GPAT for M.Pharm", "NIPER Entrance", "Pharma MBA Colleges"], icon: "🔬" },
    { phase: "Career", duration: "After degree", title: "Pharma Industry / Clinical", desc: "Join pharma companies (Sun Pharma, Cipla, Dr. Reddy's), hospitals, or open a medical store.", resources: ["Naukri Pharma Jobs", "LinkedIn", "Pharma Industry Forums"], icon: "🚀" },
  ],
  "Nurse / Allied Health": [
    { phase: "Foundation", duration: "After 12th PCB", title: "BSc Nursing / GNM Admission", desc: "Clear nursing entrance exams. Join a 4-year BSc Nursing or 3-year GNM program at an INC-approved college.", resources: ["INC Website", "AIIMS Nursing Entrance", "State Nursing Entrance Exams"], icon: "🏥" },
    { phase: "Degree", duration: "3–4 years", title: "Nursing Degree", desc: "Study anatomy, physiology, medical-surgical nursing, and community health. Complete clinical hours.", resources: ["Textbook of Medical Surgical Nursing", "Potter & Perry Fundamentals", "Clinical Rotations"], icon: "🩺" },
    { phase: "Specialise", duration: "1–2 years", title: "PG Nursing or Specialisation", desc: "Pursue MSc Nursing or PG diploma in ICU, OT, or oncology nursing for better pay and roles.", resources: ["MSc Nursing Entrance", "AIIMS PG Nursing", "Specialisation Courses"], icon: "🎯" },
    { phase: "Career", duration: "After degree", title: "Clinical or Abroad", desc: "Work in hospitals, join government health services, or pursue NCLEX for nursing jobs in the USA/UK.", resources: ["NCLEX Prep", "NMC UK Registration", "AIIMS / PGIMER Jobs"], icon: "🌍" },
  ],
  // ── CREATIVE ──────────────────────────────────────────────────
  "Graphic Designer / UI Designer": [
    { phase: "Foundation", duration: "0–6 months", title: "Design Fundamentals", desc: "Learn colour theory, typography, layout, and visual hierarchy. Master Figma and Adobe tools.", resources: ["Canva Design School", "Google UX Design Certificate", "Figma Academy", "Adobe Learn"], icon: "🎨" },
    { phase: "Core Skills", duration: "6–12 months", title: "Build Portfolio", desc: "Design 10+ projects — logos, mobile apps, web pages, posters. Publish on Behance and Dribbble.", resources: ["Behance", "Dribbble", "UI8 (inspiration)", "Awwwards"], icon: "🖌️" },
    { phase: "Specialise", duration: "1–2 years", title: "UI/UX or Brand Design", desc: "Pick UI/UX (user research, wireframing, prototyping) or Brand Design (identity systems, packaging).", resources: ["Nielsen Norman UX Cert", "Interaction Design Foundation", "Coursera UX"], icon: "🎯" },
    { phase: "Career", duration: "2+ years", title: "Agency or In-House", desc: "Join a design agency, product company, or freelance. Build a strong personal brand online.", resources: ["LinkedIn", "Toptal", "Upwork", "99designs"], icon: "🚀" },
  ],
  "Film / Media / Journalism": [
    { phase: "Foundation", duration: "After 12th", title: "Mass Comm / Film Admission", desc: "Appear for FTII, Symbiosis Mass Comm, Xavier's, or IPU CET. Choose journalism, filmmaking, or PR.", resources: ["FTII Entrance", "Symbiosis SET", "Xavier's Mumbai Entrance", "IPU CET"], icon: "🎬" },
    { phase: "Degree", duration: "3–4 years", title: "Mass Communication Degree", desc: "Learn reporting, editing, video production, radio, digital media, and public relations.", resources: ["Reuters Journalism Training", "MOOC Journalism Courses", "BBC Academy"], icon: "📰" },
    { phase: "Internship", duration: "During degree", title: "Newsroom / Studio Experience", desc: "Intern at newspapers, TV channels, digital media houses, or film production companies.", resources: ["The Hindu Internship", "NDTV", "Scroll.in", "Bollywood Production Houses"], icon: "🎙️" },
    { phase: "Career", duration: "After degree", title: "Media Roles", desc: "Work as journalist, video editor, content creator, PR executive, or documentary filmmaker.", resources: ["LinkedIn Media Jobs", "Naukri", "Journalism Job Boards"], icon: "📡" },
  ],
  "Architect": [
    { phase: "Foundation", duration: "After 12th PCM", title: "Crack NATA / JEE Paper 2", desc: "Prepare drawing, aesthetics, and aptitude sections for NATA. Get into a COA-approved B.Arch college.", resources: ["NATA Preparation Books", "COA Website", "Architecture Aptitude Practice"], icon: "📐" },
    { phase: "B.Arch", duration: "5 years", title: "Architecture Degree", desc: "Study design studios, structures, history of architecture, and environmental science. Build a design portfolio.", resources: ["AutoCAD", "Revit", "SketchUp", "Architecture Books by Ching"], icon: "🏛️" },
    { phase: "Specialise", duration: "Year 4–5", title: "Pick Your Focus", desc: "Choose interior design, urban planning, sustainable architecture, or structural design.", resources: ["M.Arch Programs", "GRIHA Green Building", "Urban Design Courses"], icon: "🎯" },
    { phase: "Career", duration: "After degree", title: "Register & Practice", desc: "Register with COA. Join a firm, work on government projects, or start an independent practice.", resources: ["COA Registration", "Architecture Firms India", "IIA Membership"], icon: "🏗️" },
  ],
  // ── LAW ───────────────────────────────────────────────────────
  "Lawyer": [
    { phase: "Foundation", duration: "After 12th", title: "Clear CLAT / AILET / LSAT", desc: "Prepare English, GK, Legal Reasoning, and Logical Reasoning. Target NLUs for top placement.", resources: ["CLAT Possible", "Legal Edge", "CLAT PYQ Papers", "Career Launcher Law"], icon: "⚖️" },
    { phase: "Law Degree", duration: "5 years (BA LLB) or 3 years (LLB)", title: "Law Degree", desc: "Study constitutional, criminal, civil, corporate, and family law. Join moot courts and model UNs.", resources: ["Bare Acts (India Code)", "SCC Online", "Manupatra", "Moot Court Society"], icon: "📜" },
    { phase: "Enrolment", duration: "After degree", title: "Bar Council Enrolment", desc: "Enroll with the State Bar Council. Intern under senior advocates or join a law firm as junior associate.", resources: ["Bar Council of India", "Law Firm Internships", "NALSA"], icon: "🏛️" },
    { phase: "Career", duration: "3+ years", title: "Specialise & Grow", desc: "Choose corporate law (M&A, IPR), litigation (criminal/civil), or legal advisory. Build your practice.", resources: ["AZB Partners", "Khaitan & Co", "S&R Associates", "High Court Practice"], icon: "👨‍⚖️" },
  ],
  // ── SCIENCE / RESEARCH ────────────────────────────────────────
  "Research Scientist": [
    { phase: "Foundation", duration: "BSc / B.Tech", title: "Strong Academic Base", desc: "Score 75%+ in your graduation. Publish or assist in at least one research project. Build lab skills.", resources: ["NPTEL Research Courses", "ResearchGate", "Google Scholar", "NCERT Advanced"], icon: "🔬" },
    { phase: "PG", duration: "2 years", title: "MSc or M.Tech", desc: "Join a top university (IITs, IISc, JNU, HCU). Focus on thesis work. Clear GATE / JAM / JEST.", resources: ["GATE Prep", "IIT JAM", "IISc Admissions", "CSIR NET Prep"], icon: "🎓" },
    { phase: "PhD", duration: "3–5 years", title: "Doctoral Research", desc: "Enroll in PhD at IITs, IISc, TIFR, or abroad. Publish in peer-reviewed journals. Attend conferences.", resources: ["IISc", "TIFR", "arXiv", "IEEE / Elsevier Journals"], icon: "🧪" },
    { phase: "Career", duration: "After PhD", title: "Postdoc or Industry R&D", desc: "Join DRDO, ISRO, BARC, national labs, or pursue postdoc abroad. Or join industry R&D teams.", resources: ["DRDO Recruitment", "ISRO Scientist Exam", "DST Fellowships", "Nature Jobs"], icon: "🚀" },
  ],
  "Civil Services (IAS/IPS)": [
    { phase: "Foundation", duration: "Graduation years", title: "NCERT & Academic Base", desc: "Read all NCERT books (6th–12th) thoroughly. Study history, polity, geography, economics, and science.", resources: ["NCERT Books", "Vision IAS", "Drishti IAS", "InsightsIAS"], icon: "📚" },
    { phase: "Prelims Prep", duration: "1–2 years", title: "UPSC Prelims", desc: "Cover GS Paper 1 (History, Polity, Geography, Economy, Science) and CSAT (Paper 2) rigorously.", resources: ["Laxmikanth Polity", "GC Leong Geography", "Economic Survey", "PIB"], icon: "📝" },
    { phase: "Mains + Interview", duration: "6–12 months", title: "Mains & Personality Test", desc: "Write high-quality essay and GS answers. Prepare optional subject deeply. Mock interview prep.", resources: ["Vision IAS Mains Test Series", "Vajiram & Ravi", "ForumIAS", "Unacademy UPSC"], icon: "🏛️" },
    { phase: "Career", duration: "After selection", title: "IAS / IPS / IFS Service", desc: "Complete LBSNAA training (IAS) or respective academy. Posted as SDM, DM, and then Secretary-level roles.", resources: ["LBSNAA Mussoorie", "State Cadre Allotment", "IAS Associations"], icon: "🇮🇳" },
  ],
};

// ── Fuzzy match: find best roadmap for any career string ──────
const findRoadmap = (career) => {
  if (!career) return null;
  if (ROADMAP_DB[career]) return { key: career, steps: ROADMAP_DB[career] };
  const exactCI = Object.keys(ROADMAP_DB).find(k => k.toLowerCase() === career.toLowerCase());
  if (exactCI) return { key: exactCI, steps: ROADMAP_DB[exactCI] };
  const partial = Object.keys(ROADMAP_DB).find(k => {
    const kLow = k.toLowerCase();
    const cLow = career.toLowerCase();
    return cLow.includes(kLow.split(" ")[0].toLowerCase()) ||
           kLow.includes(cLow.split(" ")[0].toLowerCase()) ||
           kLow.split("/").some(part => cLow.includes(part.trim().toLowerCase()));
  });
  if (partial) return { key: partial, steps: ROADMAP_DB[partial] };
  return null;
};

const generateGenericRoadmap = (career) => [
  { phase: "Foundation", duration: "0–6 months", title: "Research & Explore", desc: `Deep-dive into the ${career} field. Identify required qualifications, key skills, and entrance exams.`, resources: ["YouTube", "Google Scholar", "LinkedIn professionals", "Reddit r/careerguidance"], icon: "🔍" },
  { phase: "Skill Building", duration: "6–18 months", title: "Acquire Core Skills", desc: `Enroll in a relevant degree or certification program. Build projects or case studies to demonstrate your ${career} skills.`, resources: ["Coursera", "NPTEL", "Udemy", "edX"], icon: "📚" },
  { phase: "Experience", duration: "1–2 years", title: "Get Real-World Exposure", desc: "Intern, freelance, or volunteer in your target domain. Build a portfolio and network with professionals.", resources: ["LinkedIn", "Internshala", "Indeed", "Naukri"], icon: "💼" },
  { phase: "Career Launch", duration: "2+ years", title: "Enter the Industry", desc: `Apply for entry-level ${career} roles. Continuously upskill and target senior roles systematically.`, resources: ["Naukri", "LinkedIn Jobs", "Company Career Portals", "Placement Cells"], icon: "🚀" },
];

const LEVEL_LABEL = { "10th": "Class 10", "12th": "Class 12", grad: "Graduation", pg: "Post Graduation" };
const PHASE_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700", border: "border-violet-300", dot: "bg-violet-500" },
  { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-300", dot: "bg-indigo-500" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300", dot: "bg-purple-500" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-700", border: "border-fuchsia-300", dot: "bg-fuchsia-500" },
];

export default function Roadmap() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const [animatedSteps, setAnimatedSteps] = useState([]);

  // ── Read localStorage — handles both data shapes ──────────────
  useEffect(() => {
    const stored = localStorage.getItem("career_result");
    if (!stored) { navigate("/career-path"); return; }
    const parsed = JSON.parse(stored);
    setResult(parsed);
    // Support both: top_career (string) OR top_careers[0].career OR all_careers[0].career
    const top =
      (typeof parsed.top_career === "string" ? parsed.top_career : null) ||
      parsed.top_careers?.[0]?.career ||
      parsed.all_careers?.[0]?.career ||
      null;
    setSelectedCareer(top);
  }, [navigate]);

  // ── Animate steps on career change ───────────────────────────
  useEffect(() => {
    if (!selectedCareer) return;
    setAnimatedSteps([]);
    setActiveStep(null);
    const matched = findRoadmap(selectedCareer);
    const steps = matched ? matched.steps : generateGenericRoadmap(selectedCareer);
    steps.forEach((_, i) => {
      setTimeout(() => setAnimatedSteps(prev => [...prev, i]), i * 150);
    });
  }, [selectedCareer]);

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Loading your roadmap…</p>
      </div>
    </div>
  );

  const matched    = selectedCareer ? findRoadmap(selectedCareer) : null;
  const steps      = matched ? matched.steps : (selectedCareer ? generateGenericRoadmap(selectedCareer) : []);
  const allCareers = result.top_careers || result.all_careers || [];
  const fitLabel   = result.fit_label || result.top_careers?.[0]?.fit || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-400 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <button onClick={() => navigate("/result")}
            className="flex items-center gap-2 text-purple-300 hover:text-white text-sm mb-6 transition-colors">
            ← Back to Results
          </button>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-sm">
                {LEVEL_LABEL[result.level] || result.level}{fitLabel ? ` · ${fitLabel}` : ""}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Your Career<br /><span className="text-yellow-300">Roadmap</span>
              </h1>
              <p className="mt-3 text-purple-200 text-lg max-w-xl">
                A step-by-step path tailored to your quiz results and academic background.
              </p>
            </div>
            {selectedCareer && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 min-w-[220px]">
                <p className="text-purple-300 text-xs font-medium uppercase tracking-wider mb-1">Viewing roadmap for</p>
                <p className="text-white font-bold text-xl leading-tight">{selectedCareer}</p>
                <p className="text-purple-300 text-sm mt-1">{steps.length} phases · {result.dominant_category || "General"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── Career Switcher ───────────────────────────────── */}
        {allCareers.length > 1 && (
          <div className="mb-10">
            <p className="text-sm text-gray-500 font-medium mb-3">🔀 Switch career to explore its roadmap:</p>
            <div className="flex flex-wrap gap-3">
              {allCareers.map((c, i) => {
                const career = typeof c === "string" ? c : (c.career || "");
                const isSelected = career === selectedCareer;
                const hasDetailed = !!findRoadmap(career);
                return (
                  <button key={i} onClick={() => setSelectedCareer(career)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200"
                        : "bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600"
                    }`}>
                    {career}
                    {!hasDetailed && <span className="ml-1 text-xs opacity-50">(general)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {!selectedCareer ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No career data found. Please take the quiz first.</p>
            <button onClick={() => navigate("/career-path")}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">
              Take the Quiz
            </button>
          </div>
        ) : (
          <>
            {/* ── Phase overview bar ────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">Roadmap Overview — {selectedCareer}</p>
                <p className="text-xs text-gray-400">{steps.length} phases</p>
              </div>
              <div className="flex gap-2">
                {steps.map((s, i) => (
                  <div key={i} className="flex-1">
                    <div className={`h-2 rounded-full transition-all duration-500 ${PHASE_COLORS[i % 4].dot}`}
                      style={{ opacity: animatedSteps.includes(i) ? 1 : 0.15 }} />
                    <p className="text-xs text-gray-400 mt-1 truncate">{s.phase}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Timeline ──────────────────────────────────── */}
            <div className="relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-200 via-indigo-200 to-fuchsia-200 hidden md:block" />
              <div className="space-y-6">
                {steps.map((step, i) => {
                  const color    = PHASE_COLORS[i % 4];
                  const isVisible = animatedSteps.includes(i);
                  const isActive  = activeStep === i;
                  return (
                    <div key={i}
                      className={`relative transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                      style={{ transitionDelay: `${i * 60}ms` }}>
                      <div className="md:pl-16">
                        <div className={`absolute left-3.5 top-7 w-5 h-5 rounded-full border-4 border-white ${color.dot} shadow-md hidden md:block z-10`} />
                        <div onClick={() => setActiveStep(isActive ? null : i)}
                          className={`bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                            isActive ? `${color.border} shadow-lg` : "border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md"
                          }`}>
                          <div className="p-5 flex items-start gap-4">
                            <div className={`text-3xl w-14 h-14 flex items-center justify-center rounded-xl ${color.bg} flex-shrink-0`}>
                              {step.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                                  Phase {i + 1} · {step.phase}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">⏱ {step.duration}</span>
                              </div>
                              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                              <p className="text-gray-500 text-sm mt-1 leading-relaxed">{step.desc}</p>
                            </div>
                            <span className={`text-gray-400 text-xs transition-transform duration-200 flex-shrink-0 mt-1 ${isActive ? "rotate-180" : ""}`}>▼</span>
                          </div>
                          {isActive && (
                            <div className={`border-t ${color.border} px-5 py-4`}>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">📌 Recommended Resources</p>
                              <div className="flex flex-wrap gap-2">
                                {step.resources.map((r, j) => (
                                  <span key={j} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${color.bg} ${color.text} border ${color.border}`}>
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Stats strip ───────────────────────────────── */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Phases",    value: steps.length,                                    icon: "🗺️" },
                { label: "Est. Completion", value: steps[steps.length - 1]?.duration || "2+ yrs",  icon: "⏳" },
                { label: "Your Score",      value: `${result.percentage}%`,                         icon: "📊" },
                { label: "Fit Label",       value: fitLabel || "—",                                 icon: "⭐" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-lg font-extrabold text-gray-900 leading-tight">{stat.value}</div>
                  <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* ── CTA ───────────────────────────────────────── */}
            <div className="mt-10 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-400 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl font-extrabold mb-2">Ready to Begin?</h2>
              <p className="text-purple-200 mb-6 max-w-md mx-auto text-sm">
                Bookmark this roadmap, explore colleges that match your profile, and take the first step today.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button onClick={() => navigate("/result")}
                  className="bg-white text-purple-700 font-bold px-6 py-2.5 rounded-xl hover:bg-purple-50 transition-colors text-sm">
                  ← Back to Results
                </button>
                <button onClick={() => { localStorage.removeItem("career_result"); navigate("/career-path"); }}
                  className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/30 transition-colors border border-white/30 text-sm">
                  🔄 Retake Quiz
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}