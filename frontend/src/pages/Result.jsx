import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import confetti from "canvas-confetti";
import Footer from "../components/Footer";

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
  "Excellent fit":                  { bg:"#f0fdf4", text:"#16a34a", border:"#86efac" },
  "Good fit":                       { bg:"#eff6ff", text:"#2563eb", border:"#93c5fd" },
  "Worth exploring":                { bg:"#fefce8", text:"#ca8a04", border:"#fde047" },
  "Aspirational needs strong prep": { bg:"#fff7ed", text:"#ea580c", border:"#fdba74" },
};
const CAT_ICON = { Technology:"💻", Business:"💼", Creative:"🎨", Healthcare:"🏥", general:"🎯" };

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
  * { font-family: 'Sora', sans-serif; box-sizing: border-box; }
  @keyframes modalIn { from{opacity:0;transform:scale(0.85) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes congratsIn { 0%{opacity:0;transform:scale(0.5) rotate(-10deg)} 60%{transform:scale(1.08) rotate(2deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes congratsOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(0.85) translateY(-20px)} }
  @keyframes emojiPop { 0%{transform:scale(0) rotate(-20deg)} 60%{transform:scale(1.3) rotate(5deg)} 100%{transform:scale(1) rotate(0deg)} }
  @keyframes shimmerText { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
  @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-18px) rotate(4deg)} }
  @keyframes floatB { 0%,100%{transform:translateY(0) rotate(3deg)} 50%{transform:translateY(-14px) rotate(-5deg)} }
  @keyframes floatC { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.05)} }
  @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spin-rev  { from{transform:rotate(360deg)} to{transform:rotate(0deg)} }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes shimmerBar { 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
  @keyframes starPop { 0%,100%{transform:scale(0.7) rotate(0deg);opacity:0.5} 50%{transform:scale(1.3) rotate(20deg);opacity:1} }
  @keyframes pulseRing { 0%{transform:scale(0.85);opacity:0.5} 60%{transform:scale(1.2);opacity:0} 100%{transform:scale(0.85);opacity:0} }
  @keyframes trailMove { 0%{stroke-dashoffset:300} 100%{stroke-dashoffset:-300} }
  @keyframes orbitDot { 0%{transform:rotate(0deg) translateX(50px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(50px) rotate(-360deg)} }
  .slide-up { animation: slideUp 0.5s cubic-bezier(0.4,0,0.2,1) forwards; }
  .brand-btn {
    background: linear-gradient(135deg,#e91e8c,#7c3aed);
    background-size: 200% 200%;
    animation: gradientShift 4s ease infinite;
    border: none; color: white; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .brand-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(233,30,140,0.3); }
  .brand-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(124,58,237,0.13); }
`;

const BG_FLOATS = [
  { emoji:"🎓", top:"6%",  left:"1%",  anim:"floatA", delay:"0s",   dur:"6s"   },
  { emoji:"🚀", top:"10%", left:"82%", anim:"floatB", delay:"1s",   dur:"7s"   },
  { emoji:"💡", top:"45%", left:"88%", anim:"floatC", delay:"0.5s", dur:"5.5s" },
  { emoji:"🏆", top:"70%", left:"1%",  anim:"floatA", delay:"1.5s", dur:"6.5s" },
  { emoji:"📊", top:"80%", left:"85%", anim:"floatB", delay:"2s",   dur:"7.5s" },
  { emoji:"💼", top:"30%", left:"92%", anim:"floatC", delay:"0.8s", dur:"5s"   },
];
const STARS = [
  {top:"22%",left:"12%",delay:"0s"},{top:"55%",left:"5%",delay:"1s"},
  {top:"15%",left:"60%",delay:"0.5s"},{top:"75%",left:"75%",delay:"1.5s"},
  {top:"40%",left:"95%",delay:"2s"},{top:"88%",left:"40%",delay:"0.3s"},
];

function BgScene() {
  return (
    <div style={{position:"fixed",inset:0,overflow:"hidden",zIndex:0,pointerEvents:"none",background:"#fafafa"}}>
      <div style={{position:"absolute",width:700,height:700,top:"-250px",left:"-250px",borderRadius:"50%",background:"radial-gradient(circle,#fce7f3,#ede9fe,transparent)",opacity:0.9}}/>
      <div style={{position:"absolute",width:600,height:600,bottom:"-220px",right:"-220px",borderRadius:"50%",background:"radial-gradient(circle,#ede9fe,#fce7f3,transparent)",opacity:0.85}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(124,58,237,0.09) 1.5px,transparent 1.5px)",backgroundSize:"38px 38px"}}/>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {["M 80 120 Q 400 350 720 450 Q 1040 550 1380 750","M 1380 80 Q 900 300 720 450 Q 540 600 60 820"].map((d,i)=>(
          <path key={i} d={d} fill="none" stroke={i%2===0?"#e91e8c":"#7c3aed"} strokeWidth="1.5" strokeDasharray="6 8" opacity="0.1"
            style={{animationName:"trailMove",animationDuration:`${8+i*2}s`,animationTimingFunction:"linear",animationIterationCount:"infinite",animationDelay:`${i*2}s`}}/>
        ))}
      </svg>
      <div style={{position:"absolute",top:"8%",right:"6%",width:110,height:110}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px dashed rgba(233,30,140,0.2)",animationName:"spin-slow",animationDuration:"20s",animationTimingFunction:"linear",animationIterationCount:"infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",marginTop:-5,marginLeft:-5,width:10,height:10,borderRadius:"50%",background:"#e91e8c",opacity:0.6,animationName:"orbitDot",animationDuration:"5s",animationTimingFunction:"linear",animationIterationCount:"infinite"}}/>
      </div>
      <div style={{position:"absolute",bottom:"10%",left:"4%",width:90,height:90}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"1.5px dashed rgba(124,58,237,0.2)",animationName:"spin-rev",animationDuration:"18s",animationTimingFunction:"linear",animationIterationCount:"infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",marginTop:-4,marginLeft:-4,width:8,height:8,borderRadius:"50%",background:"#7c3aed",opacity:0.6,animationName:"orbitDot",animationDuration:"4s",animationTimingFunction:"linear",animationIterationCount:"infinite",animationDirection:"reverse"}}/>
      </div>
      {STARS.map((s,i)=>(
        <div key={i} style={{position:"absolute",top:s.top,left:s.left,fontSize:i%2===0?"16px":"12px",color:i%2===0?"#e91e8c":"#7c3aed",opacity:0.7,animationName:"starPop",animationDuration:`${3+i*0.3}s`,animationTimingFunction:"ease-in-out",animationIterationCount:"infinite",animationDelay:s.delay}}>✦</div>
      ))}
      {BG_FLOATS.map((f,i)=>(
        <div key={i} style={{position:"absolute",top:f.top,left:f.left,width:60,height:60,borderRadius:"50%",background:"white",border:"1.5px solid rgba(233,30,140,0.1)",boxShadow:"0 8px 24px rgba(124,58,237,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,animationName:f.anim,animationDuration:f.dur,animationTimingFunction:"ease-in-out",animationIterationCount:"infinite",animationDelay:f.delay,overflow:"hidden"}}>
          {f.emoji}
          <div style={{position:"absolute",inset:0,borderRadius:"50%",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,width:"30%",height:"100%",background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)",animationName:"shimmerBar",animationDuration:`${2+i*0.5}s`,animationTimingFunction:"ease-in-out",animationIterationCount:"infinite",animationDelay:`${i*0.6}s`}}/>
          </div>
        </div>
      ))}
      {[{top:"20%",left:"8%",c:"#e91e8c"},{top:"72%",left:"88%",c:"#7c3aed"}].map((p,i)=>(
        <div key={i} style={{position:"absolute",top:p.top,left:p.left}}>
          {[0,1,2].map(j=>(
            <div key={j} style={{position:"absolute",width:50+j*25,height:50+j*25,borderRadius:"50%",border:`1.5px solid ${p.c}`,top:-(j*12),left:-(j*12),opacity:0,animationName:"pulseRing",animationDuration:"2.5s",animationTimingFunction:"ease-out",animationIterationCount:"infinite",animationDelay:`${j*0.7}s`}}/>
          ))}
          <div style={{width:12,height:12,borderRadius:"50%",background:p.c,opacity:0.7}}/>
        </div>
      ))}
    </div>
  );
}

const MODAL_STYLE = `@keyframes modalIn{from{opacity:0;transform:scale(0.85) translateY(30px)}to{opacity:1;transform:scale(1) translateY(0)}}`;

const GuestLoginModal = ({ onClose, onLogin, onSignup }) => (
  <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)"}} onClick={onClose}/>
    <div style={{position:"relative",background:"white",borderRadius:28,boxShadow:"0 32px 80px rgba(0,0,0,0.2)",padding:"40px 36px",maxWidth:420,width:"100%",textAlign:"center",animation:"modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <style>{MODAL_STYLE}</style>
      <div style={{width:76,height:76,borderRadius:"50%",background:"linear-gradient(135deg,#e91e8c,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,boxShadow:"0 8px 24px rgba(233,30,140,0.3)"}}>🔒</div>
      <h2 style={{fontSize:22,fontWeight:800,color:"#1a1a2e",marginBottom:8}}>Login to Save Your Result</h2>
      <p style={{color:"#9ca3af",fontSize:13,marginBottom:16}}>Create a free account or log in to unlock:</p>
      <div style={{background:"linear-gradient(135deg,#fce7f3,#ede9fe)",borderRadius:16,padding:"16px 20px",marginBottom:24,textAlign:"left",border:"1.5px solid #e9d5ff"}}>
        {["Save your result permanently","Access your personal Dashboard","Track all your quiz attempts","Get result summary on your email"].map((t,i)=>(
          <p key={i} style={{fontSize:13,color:"#7c3aed",margin:"4px 0",display:"flex",alignItems:"center",gap:8}}><span style={{color:"#e91e8c"}}>✓</span>{t}</p>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onLogin} className="brand-btn" style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700}}>Login to Save</button>
        <button onClick={onSignup} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:14,fontWeight:600,background:"white",border:"1.5px solid #c084fc",color:"#7c3aed",cursor:"pointer",transition:"background 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#fdf4ff"} onMouseLeave={e=>e.currentTarget.style.background="white"}>
          Create Free Account
        </button>
        <button onClick={onClose} style={{fontSize:13,color:"#9ca3af",background:"none",border:"none",cursor:"pointer",padding:"6px"}}>Maybe later</button>
      </div>
    </div>
  </div>
);

const SuccessModal = ({ onClose, onDashboard }) => (
  <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}}>
    <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)"}} onClick={onClose}/>
    <div style={{position:"relative",background:"white",borderRadius:28,boxShadow:"0 32px 80px rgba(0,0,0,0.2)",padding:"40px 36px",maxWidth:420,width:"100%",textAlign:"center",animation:"modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards"}}>
      <style>{MODAL_STYLE}</style>
      <div style={{width:76,height:76,borderRadius:"50%",background:"linear-gradient(135deg,#e91e8c,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:32,boxShadow:"0 8px 24px rgba(233,30,140,0.3)"}}>🎉</div>
      <h2 style={{fontSize:22,fontWeight:800,color:"#1a1a2e",marginBottom:8}}>Congratulations!</h2>
      <p style={{color:"#9ca3af",fontSize:13,marginBottom:4}}>Your career result has been saved successfully.</p>
      <p style={{color:"#9ca3af",fontSize:13,marginBottom:24}}>Check your inbox for the summary email!</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onDashboard} className="brand-btn" style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700}}>Go to Dashboard</button>
        <button onClick={onClose} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:13,fontWeight:600,background:"white",border:"1.5px solid #e5e7eb",color:"#6b7280",cursor:"pointer"}}>Stay on this page</button>
      </div>
    </div>
  </div>
);

const CongratsOverlay = ({ onClose, closing }) => (
  <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",animation:closing?"congratsOut 0.4s ease forwards":"none"}}>
    <div style={{background:"white",borderRadius:32,padding:"44px 40px",maxWidth:400,width:"90%",textAlign:"center",boxShadow:"0 40px 100px rgba(124,58,237,0.35)",animation:closing?"none":"congratsIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:5,background:"linear-gradient(90deg,#e91e8c,#7c3aed,#e91e8c)",backgroundSize:"200% 100%",animation:"shimmerText 2s linear infinite"}}/>
      <div style={{fontSize:72,marginBottom:12,display:"block",animation:"emojiPop 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",lineHeight:1}}>🎉</div>
      <h2 style={{fontSize:30,fontWeight:800,marginBottom:8,letterSpacing:"-0.5px",background:"linear-gradient(135deg,#e91e8c,#7c3aed)",backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"shimmerText 3s linear infinite"}}>Congratulations!</h2>
      <p style={{fontSize:15,color:"#6b7280",marginBottom:6,fontWeight:600}}>You've completed your Career Assessment 🚀</p>
      <p style={{fontSize:13,color:"#a855f7",fontWeight:600,marginBottom:28}}>Your personalised results are ready below ✨</p>
      <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:20,flexWrap:"wrap"}}>
        {["🏆 Best Match Found","📊 Colleges Listed","🗺️ Roadmap Ready"].map((t,i)=>(
          <span key={i} style={{fontSize:11,padding:"5px 12px",borderRadius:99,background:`linear-gradient(135deg,${i%2===0?"#fce7f3,#ede9fe":"#ede9fe,#fce7f3"})`,border:"1.5px solid #e9d5ff",color:"#7c3aed",fontWeight:700}}>{t}</span>
        ))}
      </div>
      <button onClick={onClose} style={{width:"100%",padding:"14px",borderRadius:14,fontSize:15,fontWeight:700,background:"linear-gradient(135deg,#e91e8c,#7c3aed)",backgroundSize:"200% 200%",animation:"shimmerText 4s ease infinite",border:"none",color:"white",cursor:"pointer",boxShadow:"0 8px 28px rgba(233,30,140,0.3)",transition:"transform 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
        View My Results →
      </button>
      <p style={{fontSize:11,color:"#d1d5db",marginTop:12}}>Auto-closing in a moment...</p>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#7c3aed,#e91e8c,#7c3aed)",backgroundSize:"200% 100%",animation:"shimmerText 2s linear infinite"}}/>
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
  const [showCongrats, setShowCongrats]       = useState(false);
  const [congratsOut, setCongratsOut]         = useState(false);
  const [filterState, setFilterState]         = useState("All States");
  const [filterLanguage, setFilterLanguage]   = useState("All Languages");
  const [filterGender, setFilterGender]       = useState("All Types");

  // ── College search state ──────────────────────────────────
  const [collegeSearch, setCollegeSearch]     = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("career_result");
    if (stored) {
      setData(JSON.parse(stored));
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const playNote = (freq, start, dur, vol = 0.3) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = "sine"; osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
          gain.gain.setValueAtTime(0, ctx.currentTime + start);
          gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
          osc.start(ctx.currentTime + start); osc.stop(ctx.currentTime + start + dur);
        };
        playNote(523,0.0,0.18); playNote(659,0.18,0.18); playNote(784,0.36,0.18);
        playNote(1047,0.54,0.35); playNote(880,0.72,0.18); playNote(1047,0.90,0.45);
      } catch(e) {}
      setShowCongrats(true);
      const dismissTimer = setTimeout(() => { setCongratsOut(true); setTimeout(() => setShowCongrats(false), 400); }, 3200);
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      const end = Date.now() + 2000;
      const interval = setInterval(() => {
        if (Date.now() > end) return clearInterval(interval);
        confetti({ particleCount: 20, spread: 60, origin: { y: Math.random() - 0.2 } });
      }, 250);
      return () => { clearInterval(interval); clearTimeout(dismissTimer); };
    }
  }, []);

  useEffect(() => {
    if (data) { setVisibleCount(6); setCollegeSearch(""); fetchColleges(); }
  }, [data, filterState, filterLanguage, filterGender]);

  const fetchColleges = async () => {
    setLoadingColleges(true);
    try {
      const stored = JSON.parse(localStorage.getItem("career_result") || "{}");
      const params = { state:filterState, percentage:stored.percentage||60, dominant_category:stored.dominant_category||"Technology", level:stored.level||"grad" };
      if (filterLanguage !== "All Languages") params.medium = filterLanguage;
      if (filterGender   !== "All Types")     params.gender = filterGender;
      const res = await API.get("/colleges/suggest", { params });
      setColleges(res.data.colleges || []);
      setTotalColleges(res.data.total || 0);
    } catch { setColleges([]); setTotalColleges(0); }
    finally { setLoadingColleges(false); }
  };

  // ── Client-side search filter applied on top of API results ──
  // Searches college name, city, and state — instant, no extra API call
  const filteredColleges = useMemo(() => {
    const q = collegeSearch.trim().toLowerCase();
    if (!q) return colleges;
    return colleges.filter(col =>
      col.college_name?.toLowerCase().includes(q) ||
      col.city?.toLowerCase().includes(q) ||
      col.state?.toLowerCase().includes(q) ||
      col.category?.toLowerCase().includes(q)
    );
  }, [colleges, collegeSearch]);

  const handleSave = () => { if (!user) { setShowGuestModal(true); return; } doSave(); };
  const doSave = async () => {
    setSaving(true);
    try {
      await API.post("/results/save", { level:data.level, top_career:data.top_careers[0].career, fit_label:data.top_careers[0].fit, dominant_category:data.dominant_category, percentage:data.percentage, reasons:data.reasons||[], all_careers:data.top_careers });
      setSaved(true); setShowSuccess(true);
    } catch(err){ console.error("Save failed",err); }
    finally { setSaving(false); }
  };

  if (!data) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>
      <p style={{color:"#9ca3af"}}>No result found. Please take the quiz first.</p>
    </div>
  );

  const label        = LEVEL_LABELS[data.level] || LEVEL_LABELS["grad"];
  const roadmap      = ROADMAP[data.level]       || ROADMAP["grad"];
  const activeCareer = data.top_careers[activeTab];
  const card = { background:"white", border:"1.5px solid #f3e8ff", borderRadius:24, padding:"32px 28px", boxShadow:"0 20px 60px rgba(124,58,237,0.08), 0 4px 16px rgba(0,0,0,0.04)" };

  return (
    <div style={{minHeight:"100vh",background:"#fafafa",position:"relative"}}>
      <style>{globalStyles}</style>
      <BgScene/>

      {showGuestModal && <GuestLoginModal onClose={()=>setShowGuestModal(false)} onLogin={()=>navigate("/login",{state:{returnTo:"/result"}})} onSignup={()=>navigate("/signup",{state:{returnTo:"/result"}})}/>}
      {showSuccess    && <SuccessModal onClose={()=>setShowSuccess(false)} onDashboard={()=>navigate("/dashboard")}/>}
      {showCongrats   && <CongratsOverlay closing={congratsOut} onClose={()=>{ setCongratsOut(true); setTimeout(()=>setShowCongrats(false),400); }}/>}

      <div style={{maxWidth:860,margin:"0 auto",padding:"40px 16px 60px",position:"relative",zIndex:1}}>

        {/* ── Guest banner ── */}
        {!user && (
          <div style={{background:"linear-gradient(135deg,#e91e8c,#7c3aed)",borderRadius:20,padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap",marginBottom:24,boxShadow:"0 8px 28px rgba(233,30,140,0.25)"}}>
            <div>
              <p style={{color:"white",fontWeight:700,fontSize:14,margin:0}}>You are viewing as a guest</p>
              <p style={{color:"rgba(255,255,255,0.7)",fontSize:12,margin:"3px 0 0"}}>Login to save this result and access your dashboard</p>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>navigate("/login",{state:{returnTo:"/result"}})} style={{padding:"8px 18px",background:"white",color:"#7c3aed",borderRadius:12,fontSize:13,fontWeight:700,border:"none",cursor:"pointer"}}>Login</button>
              <button onClick={()=>navigate("/signup",{state:{returnTo:"/result"}})} style={{padding:"8px 18px",background:"rgba(255,255,255,0.15)",color:"white",borderRadius:12,fontSize:13,fontWeight:600,border:"1.5px solid rgba(255,255,255,0.3)",cursor:"pointer"}}>Sign Up Free</button>
            </div>
          </div>
        )}

        {/* ── HERO ── */}
        <div className="slide-up" style={{...card,textAlign:"center",marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg,#e91e8c,#7c3aed)",backgroundSize:"200% 200%",animation:"gradientShift 4s ease infinite"}}/>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#fce7f3,#ede9fe)",border:"1.5px solid #e9d5ff",borderRadius:99,padding:"5px 16px",marginBottom:16}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"linear-gradient(135deg,#e91e8c,#7c3aed)"}}/>
            <span style={{color:"#7c3aed",fontSize:12,fontWeight:700}}>{label.badge}</span>
          </div>
          <h1 style={{fontSize:30,fontWeight:800,color:"#1a1a2e",marginBottom:8,letterSpacing:"-0.5px"}}>{label.title}</h1>
          <p style={{color:"#9ca3af",marginBottom:20,fontSize:14}}>{label.subtitle}</p>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:10}}>
            {[`${data.level?.toUpperCase()} Level`,`Score: ${data.percentage}%`,`${CAT_ICON[data.dominant_category]||"🎯"} ${data.dominant_category} interest`].map((t,i)=>(
              <span key={i} style={{background:i===1?"linear-gradient(135deg,#fce7f3,#ede9fe)":"#f9fafb",border:`1.5px solid ${i===1?"#e9d5ff":"#f3f4f6"}`,color:i===1?"#7c3aed":"#6b7280",padding:"6px 16px",borderRadius:99,fontSize:13,fontWeight:i===1?700:500}}>{t}</span>
            ))}
          </div>
          <div style={{margin:"24px auto 0",width:90,height:90,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <svg viewBox="0 0 90 90" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
              <circle cx="45" cy="45" r="38" fill="none" stroke="#f3e8ff" strokeWidth="7"/>
              <circle cx="45" cy="45" r="38" fill="none" stroke="url(#sg)" strokeWidth="7" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*38*Math.min(data.percentage,100)/100} ${2*Math.PI*38}`} transform="rotate(-90 45 45)"/>
              <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#e91e8c"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs>
            </svg>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,background:"linear-gradient(135deg,#e91e8c,#7c3aed)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{data.percentage}%</div>
              <div style={{fontSize:9,color:"#9ca3af",fontWeight:600}}>SCORE</div>
            </div>
          </div>
        </div>

        {/* ── ROADMAP ── */}
        <div style={{...card,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
            <div style={{width:4,height:20,borderRadius:99,background:"linear-gradient(135deg,#e91e8c,#7c3aed)"}}/>
            <h2 style={{fontSize:17,fontWeight:700,color:"#1a1a2e",margin:0}}>Your Path Forward</h2>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",overflowX:"auto",gap:8}}>
            {roadmap.map((step,i)=>(
              <React.Fragment key={i}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:80}}>
                  <div style={{width:44,height:44,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,
                    background:i===0?"linear-gradient(135deg,#e91e8c,#7c3aed)":i===roadmap.length-1?"linear-gradient(135deg,#10b981,#059669)":"linear-gradient(135deg,#fce7f3,#ede9fe)",
                    color:i===0||i===roadmap.length-1?"white":"#7c3aed",
                    boxShadow:i===0?"0 4px 16px rgba(233,30,140,0.3)":i===roadmap.length-1?"0 4px 16px rgba(16,185,129,0.3)":"none"}}>
                    {i+1}
                  </div>
                  <p style={{fontSize:11,textAlign:"center",color:"#6b7280",marginTop:8,lineHeight:1.3}}>{step}</p>
                </div>
                {i<roadmap.length-1 && <div style={{flex:1,height:3,borderRadius:99,background:"linear-gradient(90deg,#e9d5ff,#fce7f3)",minWidth:20}}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── CAREER CARDS ── */}
        <div style={{...card,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            <div style={{width:4,height:20,borderRadius:99,background:"linear-gradient(135deg,#e91e8c,#7c3aed)"}}/>
            <h2 style={{fontSize:17,fontWeight:700,color:"#1a1a2e",margin:0}}>Top Matches for You</h2>
          </div>
          <p style={{color:"#d1d5db",fontSize:12,marginBottom:20,marginLeft:12}}>Click a card to see salary details</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14}}>
            {data.top_careers.map((c,i)=>{
              const isActive = activeTab===i;
              return (
                <button key={i} onClick={()=>setActiveTab(i)} className="card-hover"
                  style={{padding:"18px 16px",borderRadius:18,border:isActive?"1.5px solid #c084fc":"1.5px solid #f3f4f6",textAlign:"left",cursor:"pointer",
                    background:isActive?"linear-gradient(135deg,#fce7f3,#ede9fe)":"#fafafa",transition:"all 0.2s",position:"relative",overflow:"hidden"}}>
                  {isActive && <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#e91e8c,#7c3aed)"}}/>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <span style={{fontSize:24}}>{CAT_ICON[c.category]||"🎯"}</span>
                    {i===0 && <span style={{fontSize:10,background:"linear-gradient(135deg,#e91e8c,#7c3aed)",color:"white",padding:"3px 10px",borderRadius:99,fontWeight:700}}>Best Match</span>}
                  </div>
                  <h3 style={{fontWeight:700,color:"#1a1a2e",marginBottom:6,fontSize:14}}>{c.career}</h3>
                  <p style={{fontSize:11,color:"#9ca3af",marginBottom:10,lineHeight:1.5}}>{c.desc||c.description}</p>
                  <span style={{fontSize:11,padding:"3px 10px",borderRadius:99,border:`1.5px solid ${(FIT_COLORS[c.fit]||{border:"#e5e7eb"}).border}`,background:(FIT_COLORS[c.fit]||{bg:"#f9fafb"}).bg,color:(FIT_COLORS[c.fit]||{text:"#6b7280"}).text,fontWeight:600}}>
                    {c.fit}
                  </span>
                  {c.salary_min && <p style={{fontSize:12,color:"#16a34a",fontWeight:700,marginTop:10}}>₹{c.salary_min} - {c.salary_max} LPA</p>}
                </button>
              );
            })}
          </div>
          {activeCareer?.salary_note && (
            <div style={{marginTop:16,padding:"14px 18px",background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #86efac",borderRadius:14}}>
              <p style={{fontSize:13,color:"#16a34a",margin:0}}><span style={{fontWeight:700}}>{activeCareer.career}:</span> {activeCareer.salary_note}</p>
            </div>
          )}
          <div style={{marginTop:20,paddingTop:20,borderTop:"1.5px solid #f3f4f6"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,background:"linear-gradient(135deg,#fce7f3,#ede9fe)",borderRadius:18,padding:"18px 20px",border:"1.5px solid #e9d5ff",flexWrap:"wrap"}}>
              <div>
                <p style={{fontWeight:700,color:"#1a1a2e",fontSize:14,margin:0}}>Want a step-by-step plan?</p>
                <p style={{fontSize:12,color:"#9ca3af",margin:"4px 0 0"}}>View the detailed roadmap for <span style={{color:"#7c3aed",fontWeight:700}}>{data.top_careers[0]?.career}</span></p>
              </div>
              <button onClick={()=>navigate("/roadmap")} className="brand-btn" style={{padding:"12px 24px",borderRadius:12,fontSize:14,fontWeight:700,flexShrink:0}}>
                View Full Roadmap →
              </button>
            </div>
          </div>
        </div>

        {/* ── WHY THIS FITS ── */}
        {data.reasons?.length > 0 && (
          <div style={{...card,marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <div style={{width:4,height:20,borderRadius:99,background:"linear-gradient(135deg,#e91e8c,#7c3aed)"}}/>
              <h2 style={{fontSize:17,fontWeight:700,color:"#1a1a2e",margin:0}}>Why this fits you</h2>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {data.reasons.slice(0,6).map((r,i)=>(
                <span key={i} style={{padding:"7px 16px",background:`linear-gradient(135deg,${i%2===0?"#fce7f3,#ede9fe":"#ede9fe,#fce7f3"})`,border:"1.5px solid #e9d5ff",borderRadius:99,fontSize:12,color:"#7c3aed",fontWeight:600}}>{r}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── COLLEGES ── */}
        <div style={{...card,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12,marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:4,height:20,borderRadius:99,background:"linear-gradient(135deg,#e91e8c,#7c3aed)"}}/>
              <div>
                <h2 style={{fontSize:17,fontWeight:700,color:"#1a1a2e",margin:0}}>Suggested Colleges</h2>
                <p style={{fontSize:12,color:"#9ca3af",margin:"2px 0 0"}}>
                  {collegeSearch
                    ? <>Showing <span style={{color:"#7c3aed",fontWeight:700}}>{Math.min(visibleCount, filteredColleges.length)}</span> of <span style={{color:"#7c3aed",fontWeight:700}}>{filteredColleges.length}</span> matching "<span style={{color:"#e91e8c",fontWeight:700}}>{collegeSearch}</span>"</>
                    : <>Showing <span style={{color:"#7c3aed",fontWeight:700}}>{Math.min(visibleCount,colleges.length)}</span> of <span style={{color:"#7c3aed",fontWeight:700}}>{totalColleges}</span> colleges</>
                  }
                </p>
              </div>
            </div>
          </div>

          {/* ── College search bar ── */}
          <div style={{position:"relative",marginBottom:16}}>
            {/* Search icon */}
            <svg style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",width:16,height:16,color:"#a855f7",pointerEvents:"none"}}
              fill="none" stroke="#a855f7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              value={collegeSearch}
              onChange={e => { setCollegeSearch(e.target.value); setVisibleCount(6); }}
              placeholder="Search by college name, city, or state..."
              style={{
                width:"100%", boxSizing:"border-box",
                padding:"11px 40px 11px 42px",
                border:"1.5px solid #e9d5ff", borderRadius:14,
                fontSize:13, color:"#1a1a2e", background:"#fdf4ff",
                outline:"none", fontFamily:"'Sora',sans-serif",
                transition:"border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={e=>{ e.target.style.borderColor="#a855f7"; e.target.style.boxShadow="0 0 0 3px rgba(168,85,247,0.12)"; }}
              onBlur={e=>{  e.target.style.borderColor="#e9d5ff"; e.target.style.boxShadow="none"; }}
            />
            {/* Clear button */}
            {collegeSearch && (
              <button
                onClick={() => { setCollegeSearch(""); setVisibleCount(6); }}
                style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"#e9d5ff",border:"none",borderRadius:"50%",width:20,height:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#7c3aed",fontWeight:700,padding:0}}
              >✕</button>
            )}
          </div>

          {/* Filters */}
          <div style={{background:"linear-gradient(135deg,#fce7f3,#ede9fe)",border:"1.5px solid #e9d5ff",borderRadius:18,padding:"16px 18px",marginBottom:20}}>
            <p style={{fontSize:11,color:"#a855f7",fontWeight:700,letterSpacing:"0.5px",marginBottom:12}}>FILTER COLLEGES</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
              {[
                {label:"State",val:filterState,set:setFilterState,opts:INDIAN_STATES},
                {label:"Language",val:filterLanguage,set:setFilterLanguage,opts:LANGUAGES},
                {label:"College Type",val:filterGender,set:setFilterGender,opts:GENDER_TYPES},
              ].map((f,i)=>(
                <div key={i}>
                  <label style={{fontSize:11,color:"#9ca3af",fontWeight:600,display:"block",marginBottom:5}}>{f.label}</label>
                  <select value={f.val} onChange={e=>{ f.set(e.target.value); setCollegeSearch(""); }}
                    style={{width:"100%",border:"1.5px solid #e9d5ff",borderRadius:10,padding:"8px 12px",fontSize:13,color:"#1a1a2e",background:"white",outline:"none",cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>
                    {f.opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {loadingColleges ? (
            <div style={{textAlign:"center",padding:"48px 0"}}>
              <div style={{width:40,height:40,borderRadius:"50%",border:"3px solid transparent",borderTopColor:"#e91e8c",animationName:"spin-slow",animationDuration:"1s",animationTimingFunction:"linear",animationIterationCount:"infinite",margin:"0 auto 12px"}}/>
              <p style={{color:"#9ca3af",fontSize:13}}>Finding best colleges for you...</p>
            </div>
          ) : filteredColleges.length === 0 ? (
            <div style={{textAlign:"center",padding:"32px 0"}}>
              {collegeSearch ? (
                <>
                  <p style={{fontSize:24,marginBottom:8}}>🔍</p>
                  <p style={{color:"#9ca3af",marginBottom:4}}>No colleges found for "<strong style={{color:"#7c3aed"}}>{collegeSearch}</strong>"</p>
                  <p style={{fontSize:13,color:"#d1d5db"}}>Try a different name, city, or state.</p>
                  <button onClick={()=>setCollegeSearch("")} style={{marginTop:12,padding:"8px 20px",background:"linear-gradient(135deg,#fce7f3,#ede9fe)",border:"1.5px solid #e9d5ff",borderRadius:10,color:"#7c3aed",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p style={{color:"#9ca3af",marginBottom:4}}>No colleges found for the selected filters.</p>
                  <p style={{fontSize:13,color:"#d1d5db"}}>Try selecting All States or changing the filters.</p>
                </>
              )}
            </div>
          ) : (
            <>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
                {filteredColleges.slice(0,visibleCount).map((col,i)=>(
                  <div key={i} className="card-hover" style={{padding:"16px",border:"1.5px solid #f3f4f6",borderRadius:16,background:"#fafafa",cursor:"default"}}>
                    <h3 style={{fontWeight:700,color:"#1a1a2e",marginBottom:4,fontSize:14}}>{col.college_name}</h3>
                    <p style={{fontSize:12,color:"#9ca3af",marginBottom:10}}>{col.city}, {col.state}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                      <span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"#eff6ff",color:"#2563eb",fontWeight:600}}>{col.category}</span>
                      {col.medium&&col.medium!=="English"&&<span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"#ede9fe",color:"#7c3aed",fontWeight:600}}>{col.medium}</span>}
                      {col.gender&&col.gender!=="Co-ed"&&<span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"#fce7f3",color:"#be185d",fontWeight:600}}>{col.gender}</span>}
                      {col.nirf_rank&&<span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"linear-gradient(135deg,#fce7f3,#ede9fe)",color:"#7c3aed",fontWeight:700,border:"1px solid #e9d5ff"}}>NIRF #{col.nirf_rank}</span>}
                      {col.eligibility==="aspirational"&&<span style={{fontSize:11,padding:"3px 10px",borderRadius:99,background:"#fff7ed",color:"#ea580c",fontWeight:600,border:"1px solid #fdba74"}}>Aspirational</span>}
                    </div>
                    {col.min_cutoff>(data.percentage||0)
                      ? <p style={{fontSize:11,color:"#ea580c",marginTop:4}}>Your score ({data.percentage}%) is below cutoff ({col.min_cutoff}%)</p>
                      : <p style={{fontSize:11,color:"#16a34a",fontWeight:600,marginTop:4}}>✓ Your score qualifies</p>}
                    {col.avg_package_lpa&&col.avg_package_lpa!==5&&(
                      <p style={{fontSize:11,color:"#16a34a",fontWeight:700,marginTop:4}}>Avg Package: {col.avg_package_lpa} LPA</p>
                    )}
                  </div>
                ))}
              </div>
              {visibleCount < filteredColleges.length && (
                <div style={{textAlign:"center",marginTop:20}}>
                  <button onClick={()=>setVisibleCount(v=>v+6)}
                    style={{padding:"12px 28px",background:"linear-gradient(135deg,#fce7f3,#ede9fe)",border:"1.5px solid #e9d5ff",borderRadius:14,color:"#7c3aed",fontSize:13,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,0.15)"}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                    Load More ({filteredColleges.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── SAVE + RETRY ── */}
        <div style={{display:"flex",flexDirection:"column",gap:12,paddingBottom:40}}>
          {saved ? (
            <div style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",border:"1.5px solid #86efac",borderRadius:16,fontWeight:700,color:"#16a34a",textAlign:"center",fontSize:15}}>
              ✓ Result saved to your dashboard!
            </div>
          ) : (
            <button onClick={handleSave} disabled={saving} className="brand-btn" style={{width:"100%",padding:"17px",borderRadius:16,fontSize:15,fontWeight:700}}>
              {saving?"Saving...":user?"Save My Result to Dashboard":"Login to Save Result"}
            </button>
          )}
          <button onClick={()=>{localStorage.removeItem("career_result");window.location.href="/career-path";}}
            style={{width:"100%",padding:"16px",background:"white",border:"1.5px solid #e9d5ff",borderRadius:16,color:"#7c3aed",fontSize:14,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="#fdf4ff";e.currentTarget.style.boxShadow="0 4px 16px rgba(124,58,237,0.1)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="white";e.currentTarget.style.boxShadow="none";}}>
            Try Again
          </button>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Result;