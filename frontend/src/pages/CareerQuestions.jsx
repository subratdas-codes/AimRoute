// frontend/src/pages/CareerQuestions.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API from "../services/api";

const TYPING_PHRASES = [
  "Analysing your answers",
  "Matching your interests",
  "Finding best careers",
  "Building your roadmap",
];

function TypingText() {
  const [text, setText] = useState("");
  const [pIdx, setPIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const phrase = TYPING_PHRASES[pIdx];
    const delay = deleting ? 40 : 80;
    const timer = setTimeout(() => {
      if (!deleting) {
        if (cIdx < phrase.length) { setText(phrase.slice(0, cIdx + 1)); setCIdx(c => c + 1); }
        else setTimeout(() => setDeleting(true), 1200);
      } else {
        if (cIdx > 0) { setText(phrase.slice(0, cIdx - 1)); setCIdx(c => c - 1); }
        else { setDeleting(false); setPIdx(p => (p + 1) % TYPING_PHRASES.length); }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [cIdx, deleting, pIdx]);
  return (
    <span>
      {text}
      <span style={{ display: "inline-block", width: "2px", height: "18px", background: "#a855f7", marginLeft: "2px", verticalAlign: "middle", animation: "blink .8s ease-in-out infinite" }} />
    </span>
  );
}

const LEVEL_ALIAS = {
  "grad": "graduation", "graduation": "graduation",
  "post-grad": "pg", "postgrad": "pg", "pg": "pg",
  "10th": "10th", "12th": "12th",
};
const LEVEL_NAMES = {
  "10th": "10th Grade", "12th": "12th Grade",
  "graduation": "Graduation", "pg": "Post Graduation",
};
const LEVEL_ICONS = {
  "10th": "🎒", "12th": "📚", "graduation": "🎓", "pg": "🔬",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes bd { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes optIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }

  @keyframes floatA {
    0%   { transform: translateY(0px) translateX(0px) rotate(0deg); }
    25%  { transform: translateY(-22px) translateX(8px) rotate(5deg); }
    50%  { transform: translateY(-14px) translateX(-6px) rotate(-3deg); }
    75%  { transform: translateY(-28px) translateX(4px) rotate(7deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  }
  @keyframes floatB {
    0%   { transform: translateY(0px) translateX(0px) rotate(0deg); }
    30%  { transform: translateY(-18px) translateX(-10px) rotate(-6deg); }
    60%  { transform: translateY(-30px) translateX(5px) rotate(4deg); }
    100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  }
  @keyframes floatC {
    0%   { transform: translateY(0px) scale(1); }
    50%  { transform: translateY(-16px) scale(1.05); }
    100% { transform: translateY(0px) scale(1); }
  }
  @keyframes pathDraw {
    0%   { stroke-dashoffset: 800; opacity: 0; }
    10%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0.18; }
  }
  @keyframes orbitDot {
    0%   { transform: rotate(0deg) translateX(55px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(55px) rotate(-360deg); }
  }
  @keyframes orbitDot2 {
    0%   { transform: rotate(0deg) translateX(38px) rotate(0deg); }
    100% { transform: rotate(360deg) translateX(38px) rotate(-360deg); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.85); opacity: 0.5; }
    60%  { transform: scale(1.15); opacity: 0; }
    100% { transform: scale(0.85); opacity: 0; }
  }
  @keyframes shimmerBar {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes starPop {
    0%,100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
    50%      { transform: scale(1.2) rotate(20deg); opacity: 1; }
  }
  @keyframes trailMove {
    0%   { stroke-dashoffset: 300; }
    100% { stroke-dashoffset: -300; }
  }
  @keyframes bgPulse {
    0%,100% { transform: scale(1); opacity: 0.07; }
    50%      { transform: scale(1.08); opacity: 0.12; }
  }

  .opt { animation: optIn .3s ease forwards; opacity: 0; }
  .opt:nth-child(1){animation-delay:.05s}
  .opt:nth-child(2){animation-delay:.12s}
  .opt:nth-child(3){animation-delay:.19s}
  .opt:nth-child(4){animation-delay:.26s}
  .slide-up { animation: slideUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards; }
  .opt-btn { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
  .opt-btn:hover { transform: translateX(5px); }
  .brand-btn {
    background: linear-gradient(135deg, #e91e8c, #7c3aed);
    background-size: 200% 200%;
    animation: gradientShift 4s ease infinite;
    transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
  }
  .brand-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(233,30,140,0.35); }
  .brand-btn:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ─── Floating card data ─────────────────────────────────────── */
const CAREER_CARDS = [
  { label: "Software Engineer", sub: "₹12-25 LPA",  icon: "💻", top: "8%",  left: "2%",  anim: "floatA", delay: "0s",    dur: "6s",  rot: -8  },
  { label: "Data Scientist",    sub: "₹10-22 LPA",  icon: "📊", top: "15%", left: "80%", anim: "floatB", delay: "1.2s",  dur: "7s",  rot: 6   },
  { label: "Doctor (MBBS)",     sub: "₹8-20 LPA",   icon: "🩺", top: "52%", left: "85%", anim: "floatA", delay: "0.6s",  dur: "8s",  rot: -5  },
  { label: "UX Designer",       sub: "₹8-18 LPA",   icon: "🎨", top: "72%", left: "1%",  anim: "floatB", delay: "2s",    dur: "6.5s",rot: 7   },
  { label: "CA / Finance",      sub: "₹6-20 LPA",   icon: "💰", top: "38%", left: "88%", anim: "floatC", delay: "1.8s",  dur: "5.5s",rot: -4  },
  { label: "IAS Officer",       sub: "₹7-15 LPA",   icon: "🏛️", top: "85%", left: "60%", anim: "floatA", delay: "0.3s",  dur: "7.5s",rot: 5   },
];

/* ─── Animated stat bubbles ──────────────────────────────────── */
const STAT_BUBBLES = [
  { val: "6,554", label: "Colleges", top: "28%", left: "3%",  delay: "0.8s", dur: "floatC 6s ease-in-out infinite" },
  { val: "200+",  label: "Careers",  top: "62%", left: "82%", delay: "1.5s", dur: "floatC 7s ease-in-out infinite" },
];

/* ─── Orbiting dots around a center ─────────────────────────── */
function OrbitRing({ top, left, size, color, delay }) {
  return (
    <div style={{ position: "absolute", top, left, width: size, height: size, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px dashed ${color}`, opacity: 0.2, animation: `spin-slow ${18 + size / 10}s linear infinite` }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: -5, marginLeft: -5, width: 10, height: 10, borderRadius: "50%", background: color, opacity: 0.6, animation: `orbitDot ${4 + size / 30}s linear infinite`, animationDelay: delay }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: -4, marginLeft: -4, width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.4, animation: `orbitDot2 ${6 + size / 30}s linear infinite reverse`, animationDelay: delay }} />
    </div>
  );
}

/* ─── Star shape ─────────────────────────────────────────────── */
function StarDeco({ top, left, color, size, delay }) {
  return (
    <div style={{ position: "absolute", top, left, fontSize: size, lineHeight: 1, animation: `starPop ${3 + Math.random()}s ease-in-out infinite`, animationDelay: delay, color, opacity: 0.7, pointerEvents: "none" }}>
      ✦
    </div>
  );
}

/* ─── Animated connecting SVG lines ─────────────────────────── */
function ConnectLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {[
        "M 80 120 Q 320 300 720 450 Q 1100 600 1380 750",
        "M 1380 100 Q 900 250 720 450 Q 540 650 60 820",
        "M 400 50 Q 600 250 720 450 Q 840 650 1100 850",
      ].map((d, i) => (
        <path key={i} d={d} fill="none"
          stroke={i % 2 === 0 ? "#e91e8c" : "#7c3aed"}
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.12"
          style={{ animation: `trailMove ${8 + i * 2}s linear infinite`, animationDelay: `${i * 2}s` }}
        />
      ))}
      <path d="M 100 800 Q 400 500 720 450 Q 1040 400 1400 200" fill="none"
        stroke="url(#lgLine)" strokeWidth="1" strokeDasharray="800" strokeDashoffset="800"
        style={{ animation: "pathDraw 4s ease-out 0.5s forwards" }}
      />
      <defs>
        <linearGradient id="lgLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e91e8c" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BgScene() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none", background: "#fafafa" }}>

      {/* ── Large soft gradient blobs ── */}
      <div style={{ position: "absolute", width: 800, height: 800, top: "-300px", left: "-300px", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fce7f3 0%, #ede9fe 50%, transparent 75%)", opacity: 0.95 }} />
      <div style={{ position: "absolute", width: 700, height: 700, bottom: "-280px", right: "-280px", borderRadius: "50%", background: "radial-gradient(circle at 60% 60%, #ede9fe 0%, #fce7f3 50%, transparent 75%)", opacity: 0.9 }} />

      {/* ── Animated connection lines ── */}
      <ConnectLines />

      {/* ── Orbiting rings ── */}
      <OrbitRing top="5%"  left="70%" size={120} color="#e91e8c" delay="0s" />
      <OrbitRing top="55%" left="1%"  size={100} color="#7c3aed" delay="1s" />
      <OrbitRing top="75%" left="78%" size={90}  color="#e91e8c" delay="0.5s" />

      {/* ── Star decorations ── */}
      <StarDeco top="18%" left="22%" color="#e91e8c" size="18px" delay="0s" />
      <StarDeco top="42%" left="91%" color="#7c3aed" size="14px" delay="0.7s" />
      <StarDeco top="70%" left="18%" color="#a855f7" size="20px" delay="1.4s" />
      <StarDeco top="12%" left="48%" color="#7c3aed" size="12px" delay="2s" />
      <StarDeco top="82%" left="40%" color="#e91e8c" size="16px" delay="0.3s" />
      <StarDeco top="35%" left="6%"  color="#a855f7" size="13px" delay="1.8s" />

      {/* ── Dot grid ── */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.09) 1.5px, transparent 1.5px)", backgroundSize: "38px 38px" }} />

      {/* ── Floating career cards (left & right sides) ── */}
      {CAREER_CARDS.map((c, i) => (
        <div key={i} style={{
          position: "absolute", top: c.top, left: c.left,
          background: "white",
          border: "1.5px solid rgba(233,30,140,0.12)",
          borderRadius: 16,
          padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 8,
          boxShadow: "0 8px 28px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.05)",
          animation: `${c.anim} ${c.dur} ease-in-out infinite`,
          animationDelay: c.delay,
          transform: `rotate(${c.rot}deg)`,
          minWidth: 170,
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ fontSize: 22, lineHeight: 1 }}>{c.icon}</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, marginTop: 2 }}>{c.sub}</div>
          </div>
          {/* shimmer streak */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "35%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", animation: `shimmerBar ${2 + i * 0.4}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }} />
          </div>
        </div>
      ))}

      {/* ── Stat bubbles ── */}
      {STAT_BUBBLES.map((s, i) => (
        <div key={i} style={{
          position: "absolute", top: s.top, left: s.left,
          background: "white",
          border: "1.5px solid rgba(124,58,237,0.14)",
          borderRadius: 99,
          padding: "10px 20px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(124,58,237,0.1)",
          animation: s.dur,
          animationDelay: s.delay,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg,#e91e8c,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginTop: 1 }}>{s.label}</div>
        </div>
      ))}

      {/* ── Pulse rings at corners ── */}
      {[
        { top: "10%", left: "15%", color: "#e91e8c" },
        { top: "80%", left: "88%", color: "#7c3aed" },
      ].map((p, i) => (
        <div key={i} style={{ position: "absolute", top: p.top, left: p.left }}>
          {[0, 1, 2].map(j => (
            <div key={j} style={{ position: "absolute", width: 60 + j * 30, height: 60 + j * 30, borderRadius: "50%", border: `1.5px solid ${p.color}`, top: -(j * 15), left: -(j * 15), opacity: 0, animation: `pulseRing ${2.5}s ease-out infinite`, animationDelay: `${j * 0.7}s` }} />
          ))}
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: p.color, opacity: 0.7 }} />
        </div>
      ))}

      {/* ── Progress bar teaser at bottom ── */}
      <div style={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", width: 220, background: "white", borderRadius: 99, padding: "10px 18px", boxShadow: "0 4px 20px rgba(124,58,237,0.12)", border: "1.5px solid rgba(233,30,140,0.1)" }}>
        <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginBottom: 6, textAlign: "center" }}>YOUR CAREER MATCH SCORE</div>
        <div style={{ height: 6, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,#e91e8c,#7c3aed)", borderRadius: 99, animation: "shimmerBar 2.5s ease-in-out infinite" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 10, color: "#c4b5fd" }}>Take quiz to reveal</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#7c3aed" }}>72%</span>
        </div>
      </div>
    </div>
  );
}

export default function CareerQuestions() {
  const { level: rawLevel } = useParams();
  const navigate = useNavigate();
  const level = LEVEL_ALIAS[rawLevel] || rawLevel;

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [scores, setScores] = useState({});
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stepCount, setStepCount] = useState(0);
  const [percentage, setPercentage] = useState("");
  const [percentageConfirmed, setPercentageConfirmed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    API.get(`/quiz/?level=${level}`)
      .then(r => {
        const allQ = r.data.questions || r.data;
        setQuestions(allQ);
        setCurrentQuestion(allQ.find(q => q.is_start) || allQ[0]);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load questions."); setLoading(false); });
  }, [level]);

  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    el.style.opacity = "0"; el.style.transform = "translateY(20px)";
    el.style.transition = "opacity .35s ease, transform .35s ease";
    requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });
  }, [currentQuestion]);

  const submitToBackend = async (finalScores, finalReasons) => {
    setSubmitting(true);
    try {
      const res = await API.post("/ml/predict", { level, category_scores: finalScores, percentage: parseFloat(percentage) || 60 });
      const data = res.data;
      localStorage.setItem("career_result", JSON.stringify({
        top_careers: data.top_careers, top_career: data.top_career,
        fit_label: data.fit_label, dominant_category: data.dominant_category,
        reasons: finalReasons, level, percentage: parseFloat(percentage) || 60,
      }));
      navigate("/result");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleAnswer = (opt) => {
    setSelectedOption(opt.id || opt.option_text);
    setTimeout(() => {
      setSelectedOption(null);
      const updatedScores = { ...scores, [opt.category_tag]: (scores[opt.category_tag] || 0) + 1 };
      const updatedReasons = [...reasons, opt.option_text];
      setScores(updatedScores); setReasons(updatedReasons); setStepCount(s => s + 1);
      if (opt.next_question_id) {
        const nq = questions.find(q => q.id === opt.next_question_id);
        if (nq) { setCurrentQuestion(nq); return; }
      }
      const nbo = questions.filter(q => q.order_index > currentQuestion.order_index).sort((a, b) => a.order_index - b.order_index)[0];
      if (nbo) { setCurrentQuestion(nbo); return; }
      submitToBackend(updatedScores, updatedReasons);
    }, 300);
  };

  const pageWrap = { minHeight: "100vh", background: "#fafafa", position: "relative" };

  // ── PERCENTAGE GATE ──────────────────────────────────────────────────────
  if (!loading && !percentageConfirmed) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div className="slide-up" style={{ width: "100%", maxWidth: 460 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ background: "white", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "6px 20px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(124,58,237,0.1)" }}>
              <span style={{ fontSize: 16 }}>{LEVEL_ICONS[level] || "📊"}</span>
              <span style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600 }}>{LEVEL_NAMES[level] || level} Career Assessment</span>
            </div>
          </div>
          <div style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 28, padding: "48px 40px", textAlign: "center", boxShadow: "0 24px 80px rgba(124,58,237,0.13), 0 4px 16px rgba(0,0,0,0.05)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 34, boxShadow: "0 8px 28px rgba(233,30,140,0.3)" }}>
              {LEVEL_ICONS[level] || "📊"}
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, letterSpacing: "-0.5px" }}>Before we start</h2>
            <p style={{ color: "#7c3aed", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{LEVEL_NAMES[level] || level} Career Quiz</p>
            <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 32, lineHeight: 1.7 }}>
              What was your percentage in your last exam?<br />
              <span style={{ fontSize: 12, color: "#d1d5db" }}>(Helps us suggest colleges and realistic paths)</span>
            </p>
            <div style={{ position: "relative", marginBottom: 8 }}>
              <input type="number" min="0" max="100" placeholder="e.g. 78" value={percentage}
                onChange={e => setPercentage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && percentage >= 0 && percentage <= 100 && setPercentageConfirmed(true)}
                style={{ width: "100%", background: "#fafafa", border: "2px solid #e9d5ff", borderRadius: 16, padding: "18px 56px 18px 24px", textAlign: "center", fontSize: 36, fontWeight: 800, color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "'Sora',sans-serif", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "#a855f7"; e.target.style.boxShadow = "0 0 0 4px rgba(168,85,247,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "#e9d5ff"; e.target.style.boxShadow = "none"; }}
              />
              <span style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", color: "#d8b4fe", fontSize: 22, fontWeight: 700 }}>%</span>
            </div>
            <p style={{ color: "#d1d5db", fontSize: 12, marginBottom: 28 }}>Enter a number between 0 and 100</p>
            <button className="brand-btn" onClick={() => setPercentageConfirmed(true)}
              disabled={!percentage || percentage < 0 || percentage > 100}
              style={{ width: "100%", border: "none", borderRadius: 14, padding: "17px 24px", color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
              Start Quiz →
            </button>
            <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 32, paddingTop: 24, borderTop: "1.5px solid #f3f4f6" }}>
              {[{ v: "5 min", l: "Duration" }, { v: "AI", l: "Powered" }, { v: "Free", l: "Forever" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1, borderRight: i < 2 ? "1.5px solid #f3f4f6" : "none" }}>
                  <div style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 15 }}>{s.v}</div>
                  <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 3 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color: "#c4b5fd", fontSize: 12, textAlign: "center", marginTop: 16 }}>Press Enter to continue</p>
        </div>
      </div>
    </div>
  );

  // ── LOADING ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#e91e8c", animation: "spin-slow 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#9ca3af", fontWeight: 600 }}>Loading questions…</p>
        </div>
      </div>
    </div>
  );

  // ── ERROR ────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444", marginBottom: 16, fontWeight: 600 }}>{error}</p>
          <button className="brand-btn" onClick={() => window.location.reload()}
            style={{ padding: "12px 28px", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  // ── SUBMITTING ───────────────────────────────────────────────────────────
  if (submitting) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 28, padding: "52px 44px", textAlign: "center", maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(124,58,237,0.12)" }}>
          <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 28px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#e91e8c", animation: "spin-slow 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#7c3aed", animation: "spin-rev 0.7s linear infinite" }} />
            <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✨</div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}><TypingText /></h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            {[0, 150, 300].map(d => (
              <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)", animation: "bd .7s ease-in-out infinite", animationDelay: `${d}ms` }} />
            ))}
          </div>
          <p style={{ color: "#9ca3af", fontSize: 13 }}>Finding the best path for you</p>
        </div>
      </div>
    </div>
  );

  if (!currentQuestion) return (
    <div style={pageWrap}>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", zIndex: 1, position: "relative" }}>
        <p style={{ color: "#9ca3af" }}>No questions found.</p>
      </div>
    </div>
  );

  // ── QUIZ ─────────────────────────────────────────────────────────────────
  const progress = Math.min((stepCount / 9) * 100, 100);

  return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 580 }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "6px 14px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                <span style={{ fontSize: 14 }}>{LEVEL_ICONS[level] || "📊"}</span>
                <span style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>{LEVEL_NAMES[level] || level}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fce7f3,#ede9fe)", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "6px 16px", color: "#7c3aed", fontSize: 12, fontWeight: 700 }}>
                Q{stepCount + 1} · {Math.round(progress)}%
              </div>
            </div>
            <div style={{ height: 6, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#e91e8c,#7c3aed)", width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 12px rgba(233,30,140,0.4)" }} />
            </div>
          </div>

          <div ref={cardRef} style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 28, padding: "36px 32px", boxShadow: "0 24px 64px rgba(124,58,237,0.1), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#fce7f3,#ede9fe)", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "4px 14px", marginBottom: 16 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)" }} />
              <span style={{ color: "#7c3aed", fontSize: 11, fontWeight: 700, letterSpacing: "0.5px" }}>QUESTION {stepCount + 1}</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.5, marginBottom: 24 }}>
              {currentQuestion.question_text}
            </h2>
            <p style={{ color: "#d1d5db", fontSize: 12, marginBottom: 16, textAlign: "center" }}>
              Answer honestly — there are no right or wrong answers
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(currentQuestion.options || []).map((opt, i) => {
                const isSelected = selectedOption === (opt.id || opt.option_text);
                return (
                  <button key={i} className="opt opt-btn" onClick={() => handleAnswer(opt)}
                    style={{ width: "100%", textAlign: "left", background: isSelected ? "linear-gradient(135deg,#fce7f3,#ede9fe)" : "#fafafa", border: isSelected ? "1.5px solid #c084fc" : "1.5px solid #f3f4f6", borderRadius: 14, padding: "14px 18px", color: isSelected ? "#7c3aed" : "#4b5563", fontSize: 14, fontWeight: isSelected ? 600 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "#fdf4ff"; e.currentTarget.style.borderColor = "#e9d5ff"; e.currentTarget.style.color = "#1a1a2e"; } }}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.color = "#4b5563"; } }}
                  >
                    <span style={{ minWidth: 30, height: 30, borderRadius: 9, background: isSelected ? "linear-gradient(135deg,#e91e8c,#7c3aed)" : "white", border: isSelected ? "none" : "1.5px solid #e9d5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: isSelected ? "white" : "#a855f7", flexShrink: 0, boxShadow: isSelected ? "0 4px 12px rgba(233,30,140,0.25)" : "none", transition: "all 0.2s" }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.option_text}
                  </button>
                );
              })}
            </div>
          </div>
          <p style={{ color: "#d8b4fe", fontSize: 12, textAlign: "center", marginTop: 16 }}>Select an option to continue</p>
        </div>
      </div>
    </div>
  );
}