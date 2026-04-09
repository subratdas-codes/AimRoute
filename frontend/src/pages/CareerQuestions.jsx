import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import API from "../services/api";

// ── Motivational messages ─────────────────────────────────────
const GENERIC_MESSAGES = [
  "You're doing great! 🌟",
  "Keep going, you've got this! 💪",
  "Love your honesty! ✨",
  "One step closer to your path! 🚀",
  "That's a thoughtful choice! 🧠",
  "You're figuring it out! 🎯",
  "Great instinct! 🔥",
  "Stay true to yourself! 💫",
  "Every answer brings clarity! 🌈",
  "You're on the right track! ⭐",
];

const CATEGORY_MESSAGES = {
  Technology: [
    "A tech mind at work! 💻",
    "Future developer detected! 🚀",
    "Engineering vibes! ⚙️",
    "You think like a builder! 🔧",
    "The digital world needs you! 🌐",
  ],
  Healthcare: [
    "A caring soul! 🩺",
    "Future healer in the making! 💊",
    "People are lucky to have you! 🏥",
    "Empathy is your superpower! 💚",
    "You were made to help! 🌿",
  ],
  Business: [
    "Entrepreneur energy! 💼",
    "Future leader spotted! 📈",
    "You think big! 🏆",
    "Business instincts on point! 💰",
    "CEO mindset loading... 🎯",
  ],
  Creative: [
    "Such a creative soul! 🎨",
    "Art + heart = you! ✨",
    "The world needs your vision! 🖌️",
    "Design thinking activated! 🎭",
    "Your creativity is a gift! 🌸",
  ],
  Science: [
    "Scientific mind alert! 🔬",
    "Future researcher vibes! 🧪",
    "Curiosity is your strength! 🌌",
    "You ask the right questions! 🔭",
    "Science needs minds like yours! ⚗️",
  ],
  general: [
    "Balanced and thoughtful! 🌟",
    "A true all-rounder! 🎯",
    "Smart and strategic! 🏅",
    "Your path is unique! 🗺️",
    "You see the big picture! 🌍",
  ],
};

function pickMessage(dominantCategory, stepCount) {
  const useCategoryMsg =
    dominantCategory &&
    CATEGORY_MESSAGES[dominantCategory] &&
    Math.random() < 0.6;
  const pool = useCategoryMsg
    ? CATEGORY_MESSAGES[dominantCategory]
    : GENERIC_MESSAGES;
  const idx = (stepCount * 7 + Math.floor(Math.random() * pool.length)) % pool.length;
  return pool[idx];
}

// ── Floating bubble ───────────────────────────────────────────
function MotivationBubble({ message, targetRect, containerRect, visible }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!targetRect || !containerRect || !visible) return;
    const relativeTop  = targetRect.top  - containerRect.top  + targetRect.height / 2;
    const relativeLeft = targetRect.right - containerRect.left + 12;
    const bubbleWidth  = 200;
    const fitsRight    = relativeLeft + bubbleWidth < containerRect.width;
    setPos({
      top:  relativeTop,
      left: fitsRight
        ? relativeLeft
        : targetRect.left - containerRect.left - bubbleWidth - 12,
    });
  }, [targetRect, containerRect, visible]);

  if (!visible || !message) return null;

  return (
    <div style={{
      position:  "absolute",
      top:       pos.top,
      left:      pos.left,
      transform: "translateY(-50%)",
      zIndex:    50,
      pointerEvents: "none",
      animationName:           "bubblePop",
      animationDuration:       "0.35s",
      animationTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
      animationFillMode:       "forwards",
    }}>
      <div style={{
        background:   "linear-gradient(135deg, #7c3aed, #ec4899)",
        color:        "white",
        borderRadius: 99,
        padding:      "7px 14px",
        fontSize:     13,
        fontWeight:   600,
        whiteSpace:   "nowrap",
        boxShadow:    "0 4px 20px rgba(124,58,237,0.35)",
        fontFamily:   "'Sora', sans-serif",
        position:     "relative",
      }}>
        {message}
        {/* Tail pointing left toward the option */}
        <span style={{
          position:    "absolute",
          left:        -7,
          top:         "50%",
          transform:   "translateY(-50%)",
          width:       0,
          height:      0,
          borderTop:   "7px solid transparent",
          borderBottom:"7px solid transparent",
          borderRight: "8px solid #7c3aed",
        }}/>
      </div>
    </div>
  );
}

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
      <span style={{
        display: "inline-block", width: "2px", height: "18px",
        background: "#a855f7", marginLeft: "2px", verticalAlign: "middle",
        animationName:           "blink",
        animationDuration:       ".8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }} />
    </span>
  );
}

// Maps any URL variant → the exact level string stored in the DB
const LEVEL_ALIAS = {
  "graduation": "grad", "graduate": "grad", "grad": "grad",
  "post-grad": "pg", "postgrad": "pg", "pg": "pg",
  "10th": "10th", "12th": "12th",
};
const LEVEL_NAMES = {
  "10th": "10th Grade", "12th": "12th Grade",
  "grad": "Graduation", "pg": "Post Graduation",
};
const LEVEL_ICONS = {
  "10th": "🎒", "12th": "📚", "grad": "🎓", "pg": "🔬",
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
  @keyframes bubblePop { from{opacity:0;transform:translateY(-50%) scale(0.6)} to{opacity:1;transform:translateY(-50%) scale(1)} }
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
  @keyframes starPop {
    0%,100% { transform: scale(0.7) rotate(0deg); opacity: 0.5; }
    50%      { transform: scale(1.2) rotate(20deg); opacity: 1; }
  }
  @keyframes trailMove {
    0%   { stroke-dashoffset: 300; }
    100% { stroke-dashoffset: -300; }
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

const CAREER_CARDS = [
  { label: "Software Engineer", sub: "₹12-25 LPA", icon: "💻", top: "8%",  left: "2%",  anim: "floatA", delay: "0s",   dur: "6s",   rot: -8 },
  { label: "Data Scientist",    sub: "₹10-22 LPA", icon: "📊", top: "15%", left: "80%", anim: "floatB", delay: "1.2s", dur: "7s",   rot: 6  },
  { label: "Doctor (MBBS)",     sub: "₹8-20 LPA",  icon: "🩺", top: "52%", left: "85%", anim: "floatA", delay: "0.6s", dur: "8s",   rot: -5 },
  { label: "UX Designer",       sub: "₹8-18 LPA",  icon: "🎨", top: "72%", left: "1%",  anim: "floatB", delay: "2s",   dur: "6.5s", rot: 7  },
  { label: "CA / Finance",      sub: "₹6-20 LPA",  icon: "💰", top: "38%", left: "88%", anim: "floatC", delay: "1.8s", dur: "5.5s", rot: -4 },
  { label: "IAS Officer",       sub: "₹7-15 LPA",  icon: "🏛️", top: "85%", left: "60%", anim: "floatA", delay: "0.3s", dur: "7.5s", rot: 5  },
];

const STAT_BUBBLES = [
  { val: "6,554", label: "Colleges", top: "28%", left: "3%",  delay: "0.8s", dur: "6s" },
  { val: "200+",  label: "Careers",  top: "62%", left: "82%", delay: "1.5s", dur: "7s" },
];

function OrbitRing({ top, left, size, color, delay }) {
  return (
    <div style={{ position: "absolute", top, left, width: size, height: size, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1.5px dashed ${color}`, opacity: 0.2, animationName: "spin-slow", animationDuration: `${18 + size / 10}s`, animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: -5, marginLeft: -5, width: 10, height: 10, borderRadius: "50%", background: color, opacity: 0.6, animationName: "orbitDot", animationDuration: `${4 + size / 30}s`, animationTimingFunction: "linear", animationIterationCount: "infinite", animationDelay: delay }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", marginTop: -4, marginLeft: -4, width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.4, animationName: "orbitDot2", animationDuration: `${6 + size / 30}s`, animationTimingFunction: "linear", animationIterationCount: "infinite", animationDirection: "reverse", animationDelay: delay }} />
    </div>
  );
}

function StarDeco({ top, left, color, size, delay }) {
  return (
    <div style={{ position: "absolute", top, left, fontSize: size, lineHeight: 1, animationName: "starPop", animationDuration: `${3 + Math.random()}s`, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: delay, color, opacity: 0.7, pointerEvents: "none" }}>✦</div>
  );
}

function ConnectLines() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
      {[
        "M 80 120 Q 320 300 720 450 Q 1100 600 1380 750",
        "M 1380 100 Q 900 250 720 450 Q 540 650 60 820",
        "M 400 50 Q 600 250 720 450 Q 840 650 1100 850",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={i % 2 === 0 ? "#e91e8c" : "#7c3aed"} strokeWidth="1.5" strokeDasharray="6 8" opacity="0.12"
          style={{ animationName: "trailMove", animationDuration: `${8 + i * 2}s`, animationTimingFunction: "linear", animationIterationCount: "infinite", animationDelay: `${i * 2}s` }} />
      ))}
      <path d="M 100 800 Q 400 500 720 450 Q 1040 400 1400 200" fill="none" stroke="url(#lgLine)" strokeWidth="1" strokeDasharray="800" strokeDashoffset="800"
        style={{ animationName: "pathDraw", animationDuration: "4s", animationTimingFunction: "ease-out", animationDelay: "0.5s", animationFillMode: "forwards" }} />
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
      <div style={{ position: "absolute", width: 800, height: 800, top: "-300px", left: "-300px", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #fce7f3 0%, #ede9fe 50%, transparent 75%)", opacity: 0.95 }} />
      <div style={{ position: "absolute", width: 700, height: 700, bottom: "-280px", right: "-280px", borderRadius: "50%", background: "radial-gradient(circle at 60% 60%, #ede9fe 0%, #fce7f3 50%, transparent 75%)", opacity: 0.9 }} />
      <ConnectLines />
      <OrbitRing top="5%"  left="70%" size={120} color="#e91e8c" delay="0s" />
      <OrbitRing top="55%" left="1%"  size={100} color="#7c3aed" delay="1s" />
      <OrbitRing top="75%" left="78%" size={90}  color="#e91e8c" delay="0.5s" />
      <StarDeco top="18%" left="22%" color="#e91e8c" size="18px" delay="0s" />
      <StarDeco top="42%" left="91%" color="#7c3aed" size="14px" delay="0.7s" />
      <StarDeco top="70%" left="18%" color="#a855f7" size="20px" delay="1.4s" />
      <StarDeco top="12%" left="48%" color="#7c3aed" size="12px" delay="2s" />
      <StarDeco top="82%" left="40%" color="#e91e8c" size="16px" delay="0.3s" />
      <StarDeco top="35%" left="6%"  color="#a855f7" size="13px" delay="1.8s" />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(124,58,237,0.09) 1.5px, transparent 1.5px)", backgroundSize: "38px 38px" }} />
      {CAREER_CARDS.map((c, i) => (
        <div key={i} style={{ position: "absolute", top: c.top, left: c.left, background: "white", border: "1.5px solid rgba(233,30,140,0.12)", borderRadius: 16, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.05)", animationName: c.anim, animationDuration: c.dur, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: c.delay, transform: `rotate(${c.rot}deg)`, minWidth: 155, backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 20, lineHeight: 1 }}>{c.icon}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.2 }}>{c.label}</div>
            <div style={{ fontSize: 10, color: "#7c3aed", fontWeight: 600, marginTop: 2 }}>{c.sub}</div>
          </div>
          <div style={{ position: "absolute", inset: 0, borderRadius: 16, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "35%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)", animationName: "shimmerBar", animationDuration: `${2 + i * 0.4}s`, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: `${i * 0.7}s` }} />
          </div>
        </div>
      ))}
      {STAT_BUBBLES.map((s, i) => (
        <div key={i} style={{ position: "absolute", top: s.top, left: s.left, background: "white", border: "1.5px solid rgba(124,58,237,0.14)", borderRadius: 99, padding: "8px 16px", textAlign: "center", boxShadow: "0 8px 24px rgba(124,58,237,0.1)", animationName: "floatC", animationDuration: s.dur, animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: s.delay }}>
          <div style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#e91e8c,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
          <div style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, marginTop: 1 }}>{s.label}</div>
        </div>
      ))}
      {[{ top: "10%", left: "15%", color: "#e91e8c" }, { top: "80%", left: "88%", color: "#7c3aed" }].map((p, i) => (
        <div key={i} style={{ position: "absolute", top: p.top, left: p.left }}>
          {[0, 1, 2].map(j => (
            <div key={j} style={{ position: "absolute", width: 60 + j * 30, height: 60 + j * 30, borderRadius: "50%", border: `1.5px solid ${p.color}`, top: -(j * 15), left: -(j * 15), opacity: 0, animationName: "pulseRing", animationDuration: "2.5s", animationTimingFunction: "ease-out", animationIterationCount: "infinite", animationDelay: `${j * 0.7}s` }} />
          ))}
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: p.color, opacity: 0.7 }} />
        </div>
      ))}
    </div>
  );
}

export default function CareerQuestions() {
  const { level: rawLevel } = useParams();
  const navigate = useNavigate();
  const level = LEVEL_ALIAS[rawLevel] || rawLevel;

  const [questions, setQuestions]                     = useState([]);
  const [currentQuestion, setCurrentQuestion]         = useState(null);
  const [scores, setScores]                           = useState({});
  const [reasons, setReasons]                         = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [submitting, setSubmitting]                   = useState(false);
  const [error, setError]                             = useState(null);
  const [stepCount, setStepCount]                     = useState(0);
  const [percentage, setPercentage]                   = useState("");
  const [percentageConfirmed, setPercentageConfirmed] = useState(false);
  const [selectedOption, setSelectedOption]           = useState(null);

  // ── Bubble state ──────────────────────────────────────────────
  const [bubble, setBubble]   = useState({ visible: false, message: "", targetRect: null, containerRect: null });
  const cardRef               = useRef(null);
  const bubbleTimer           = useRef(null);

  // Derive dominant category live from scores
  const dominantCategory = Object.keys(scores).length > 0
    ? Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    : null;

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

  // Clean up bubble timer on unmount
  useEffect(() => () => clearTimeout(bubbleTimer.current), []);

  const showBubble = useCallback((optionEl, category) => {
    if (!cardRef.current || !optionEl) return;
    const targetRect    = optionEl.getBoundingClientRect();
    const containerRect = cardRef.current.getBoundingClientRect();
    const message       = pickMessage(category || dominantCategory, stepCount);
    clearTimeout(bubbleTimer.current);
    setBubble({ visible: true, message, targetRect, containerRect });
    bubbleTimer.current = setTimeout(() => {
      setBubble(prev => ({ ...prev, visible: false }));
    }, 1400);
  }, [dominantCategory, stepCount]);

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

  const handleAnswer = (opt, optionEl) => {
    setSelectedOption(opt.id || opt.option_text);

    // Show bubble immediately on click
    showBubble(optionEl, opt.category_tag);

    setTimeout(() => {
      setSelectedOption(null);
      setBubble(prev => ({ ...prev, visible: false }));

      const updatedScores = { ...scores };
      const gateCategories = ["high_score", "mid_score", "avg_score", "low_score", "direct", "general"];
      if (!gateCategories.includes(opt.category_tag)) {
        updatedScores[opt.category_tag] = (scores[opt.category_tag] || 0) + 1;
      }

      const updatedReasons = [...reasons, opt.option_text];
      setScores(updatedScores);
      setReasons(updatedReasons);
      setStepCount(s => s + 1);

      if (opt.next_question_id) {
        const nq = questions.find(q => q.id === opt.next_question_id);
        if (nq) { setCurrentQuestion(nq); return; }
      }

      const nbo = questions
        .filter(q => q.order_index > currentQuestion.order_index)
        .sort((a, b) => a.order_index - b.order_index)[0];
      if (nbo) { setCurrentQuestion(nbo); return; }

      submitToBackend(updatedScores, updatedReasons);
    }, 300);
  };

  const pageWrap = { minHeight: "100vh", background: "#fafafa", position: "relative" };

  // ── PERCENTAGE GATE ───────────────────────────────────────────
  if (!loading && !percentageConfirmed) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", minHeight: "calc(100vh - 70px)", position: "relative", zIndex: 1 }}>
        <div className="slide-up" style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{ background: "white", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "5px 16px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 16px rgba(124,58,237,0.1)" }}>
              <span style={{ fontSize: 14 }}>{LEVEL_ICONS[level] || "📊"}</span>
              <span style={{ color: "#7c3aed", fontSize: 12, fontWeight: 600 }}>{LEVEL_NAMES[level] || level} Career Assessment</span>
            </div>
          </div>
          <div style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 24, padding: "32px 32px 28px", textAlign: "center", boxShadow: "0 20px 60px rgba(124,58,237,0.12), 0 4px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #e91e8c, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26, boxShadow: "0 6px 20px rgba(233,30,140,0.28)" }}>
              {LEVEL_ICONS[level] || "📊"}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 4, letterSpacing: "-0.5px" }}>Before we start</h2>
            <p style={{ color: "#7c3aed", fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{LEVEL_NAMES[level] || level} Career Quiz</p>
            <p style={{ color: "#9ca3af", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
              What was your percentage in your last exam?<br />
              <span style={{ fontSize: 11, color: "#d1d5db" }}>(Helps us suggest colleges and realistic paths)</span>
            </p>
            <div style={{ position: "relative", marginBottom: 6 }}>
              <input
                type="number" min="0" max="100" placeholder="e.g. 78"
                value={percentage}
                onChange={e => setPercentage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && percentage >= 0 && percentage <= 100 && setPercentageConfirmed(true)}
                style={{ width: "100%", background: "#fafafa", border: "2px solid #e9d5ff", borderRadius: 14, padding: "14px 48px 14px 20px", textAlign: "center", fontSize: 30, fontWeight: 800, color: "#1a1a2e", outline: "none", boxSizing: "border-box", fontFamily: "'Sora',sans-serif", transition: "border-color 0.2s, box-shadow 0.2s" }}
                onFocus={e => { e.target.style.borderColor = "#a855f7"; e.target.style.boxShadow = "0 0 0 4px rgba(168,85,247,0.12)"; }}
                onBlur={e => { e.target.style.borderColor = "#e9d5ff"; e.target.style.boxShadow = "none"; }}
              />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#d8b4fe", fontSize: 18, fontWeight: 700 }}>%</span>
            </div>
            <p style={{ color: "#d1d5db", fontSize: 11, marginBottom: 20 }}>Enter a number between 0 and 100</p>
            <button className="brand-btn" onClick={() => setPercentageConfirmed(true)}
              disabled={!percentage || percentage < 0 || percentage > 100}
              style={{ width: "100%", border: "none", borderRadius: 12, padding: "14px 24px", color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Start Quiz →
            </button>
            <div style={{ display: "flex", justifyContent: "center", gap: 0, marginTop: 20, paddingTop: 16, borderTop: "1.5px solid #f3f4f6" }}>
              {[{ v: "5 min", l: "Duration" }, { v: "AI", l: "Powered" }, { v: "Free", l: "Forever" }].map((s, i) => (
                <div key={i} style={{ textAlign: "center", flex: 1, borderRight: i < 2 ? "1.5px solid #f3f4f6" : "none" }}>
                  <div style={{ color: "#1a1a2e", fontWeight: 800, fontSize: 13 }}>{s.v}</div>
                  <div style={{ color: "#9ca3af", fontSize: 10, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <p style={{ color: "#c4b5fd", fontSize: 11, textAlign: "center", marginTop: 12 }}>Press Enter to continue</p>
        </div>
      </div>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────
  if (loading) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#e91e8c", margin: "0 auto 16px", animationName: "spin-slow", animationDuration: "1s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
          <p style={{ color: "#9ca3af", fontWeight: 600 }}>Loading questions…</p>
        </div>
      </div>
    </div>
  );

  // ── ERROR ─────────────────────────────────────────────────────
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

  // ── SUBMITTING ────────────────────────────────────────────────
  if (submitting) return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", position: "relative", zIndex: 1 }}>
        <div style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 28, padding: "44px 40px", textAlign: "center", maxWidth: 340, width: "100%", boxShadow: "0 20px 60px rgba(124,58,237,0.12)" }}>
          <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 24px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#e91e8c", animationName: "spin-slow", animationDuration: "1s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#7c3aed", animationName: "spin-rev", animationDuration: "0.7s", animationTimingFunction: "linear", animationIterationCount: "infinite" }} />
            <div style={{ position: "absolute", inset: 18, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✨</div>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 14 }}><TypingText /></h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
            {[0, 150, 300].map(d => (
              <div key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)", animationName: "bd", animationDuration: ".7s", animationTimingFunction: "ease-in-out", animationIterationCount: "infinite", animationDelay: `${d}ms` }} />
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

  // ── QUIZ ──────────────────────────────────────────────────────
  const progress = Math.min((stepCount / 9) * 100, 100);

  return (
    <div style={pageWrap}>
      <style>{globalStyles}</style>
      <BgScene />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", minHeight: "calc(100vh - 70px)", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 560 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "5px 12px", boxShadow: "0 2px 8px rgba(124,58,237,0.06)" }}>
                <span style={{ fontSize: 13 }}>{LEVEL_ICONS[level] || "📊"}</span>
                <span style={{ color: "#7c3aed", fontSize: 11, fontWeight: 600 }}>{LEVEL_NAMES[level] || level}</span>
              </div>
              <div style={{ background: "linear-gradient(135deg,#fce7f3,#ede9fe)", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "5px 14px", color: "#7c3aed", fontSize: 11, fontWeight: 700 }}>
                Q{stepCount + 1} · {Math.round(progress)}%
              </div>
            </div>
            <div style={{ height: 5, background: "#f3e8ff", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg,#e91e8c,#7c3aed)", width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 0 10px rgba(233,30,140,0.4)" }} />
            </div>
          </div>

          {/* Question card — position:relative so bubble positions correctly inside */}
          <div ref={cardRef} style={{ background: "white", border: "1.5px solid #f3e8ff", borderRadius: 24, padding: "28px 28px", boxShadow: "0 20px 56px rgba(124,58,237,0.09), 0 4px 16px rgba(0,0,0,0.04)", position: "relative" }}>

            {/* Motivation bubble rendered inside card */}
            <MotivationBubble
              message={bubble.message}
              targetRect={bubble.targetRect}
              containerRect={bubble.containerRect}
              visible={bubble.visible}
            />

            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg,#fce7f3,#ede9fe)", border: "1.5px solid #e9d5ff", borderRadius: 99, padding: "3px 12px", marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "linear-gradient(135deg,#e91e8c,#7c3aed)" }} />
              <span style={{ color: "#7c3aed", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>QUESTION {stepCount + 1}</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", lineHeight: 1.5, marginBottom: 18 }}>
              {currentQuestion.question_text}
            </h2>
            <p style={{ color: "#d1d5db", fontSize: 11, marginBottom: 14, textAlign: "center" }}>
              Answer honestly — there are no right or wrong answers
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(currentQuestion.options || []).map((opt, i) => {
                const isSelected = selectedOption === (opt.id || opt.option_text);
                return (
                  <button key={i} className="opt opt-btn"
                    onClick={e => handleAnswer(opt, e.currentTarget)}
                    style={{ width: "100%", textAlign: "left", background: isSelected ? "linear-gradient(135deg,#fce7f3,#ede9fe)" : "#fafafa", border: isSelected ? "1.5px solid #c084fc" : "1.5px solid #f3f4f6", borderRadius: 12, padding: "12px 16px", color: isSelected ? "#7c3aed" : "#4b5563", fontSize: 13, fontWeight: isSelected ? 600 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
                    onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = "#fdf4ff"; e.currentTarget.style.borderColor = "#e9d5ff"; e.currentTarget.style.color = "#1a1a2e"; } }}
                    onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f3f4f6"; e.currentTarget.style.color = "#4b5563"; } }}
                  >
                    <span style={{ minWidth: 26, height: 26, borderRadius: 8, background: isSelected ? "linear-gradient(135deg,#e91e8c,#7c3aed)" : "white", border: isSelected ? "none" : "1.5px solid #e9d5ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: isSelected ? "white" : "#a855f7", flexShrink: 0, boxShadow: isSelected ? "0 4px 12px rgba(233,30,140,0.25)" : "none", transition: "all 0.2s" }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt.option_text}
                  </button>
                );
              })}
            </div>
          </div>
          <p style={{ color: "#d8b4fe", fontSize: 11, textAlign: "center", marginTop: 12 }}>Select an option to continue</p>
        </div>
      </div>
    </div>
  );
}