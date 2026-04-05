import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import lipsaPhoto   from "../assets/team/lipsa.jpeg";
import kamleshPhoto from "../assets/team/kamlesh.jpeg";
import subratPhoto  from "../assets/team/subrat.jpeg";
import jyotiPhoto   from "../assets/team/jyoti.jpeg";

const Services = () => {
  const [selected, setSelected]     = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [activePersona, setActivePersona] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActiveStep(s => (s + 1) % 4), 2800);
    return () => clearInterval(t);
  }, []);

  const personas = [
    {
      emoji: "🎒",
      level: "After 10th",
      title: "Confused about which stream to pick?",
      pain: "Science, Commerce, or Arts — everyone has an opinion but nobody knows what's right for you.",
      solution: "AimRoute's quiz identifies your actual strengths and tells you which stream leads to careers that match your personality — not your neighbour's expectations.",
      tags: ["Stream guidance", "Career preview", "College options"],
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
      tag_color: "bg-blue-100 text-blue-700",
    },
    {
      emoji: "📚",
      level: "After 12th",
      title: "JEE, NEET, or something else entirely?",
      pain: "You've finished 12th but the number of entrance exams and college choices is overwhelming.",
      solution: "We show exactly which exams you're eligible for based on your stream and percentage, and filter 6,554 colleges to only the ones realistic for your profile.",
      tags: ["Exam eligibility", "College filter", "Cutoff match"],
      color: "from-purple-500 to-violet-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
      tag_color: "bg-purple-100 text-purple-700",
    },
    {
      emoji: "🎓",
      level: "After Graduation",
      title: "Job, higher studies, or competitive exams?",
      pain: "BTech done. Now what? GATE, MBA, placement, or startup? Too many directions with no clear answer.",
      solution: "AimRoute maps your graduation background to real career outcomes, shows postgrad options with salary ranges, and builds a roadmap from where you are today.",
      tags: ["Post-grad paths", "GATE/CAT/UPSC", "Salary insights"],
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      tag_color: "bg-emerald-100 text-emerald-700",
    },
    {
      emoji: "🔬",
      level: "Post Graduation",
      title: "Research, industry, or something new?",
      pain: "You have a master's degree but aren't sure whether to go deeper into research or pivot to industry.",
      solution: "We assess your specialisation and interests to match you with senior career paths, research opportunities, and the exact exams or credentials that open those doors.",
      tags: ["Research paths", "Industry pivot", "Senior roles"],
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      tag_color: "bg-amber-100 text-amber-700",
    },
  ];

  const services = [
    { icon:"🤖", title:"AI Career Matching",      tag:"Personalised to you",    short:"Your answers shape your result — no two students get the same output.",               detail:"Our AI evaluates your interests and strengths across 4 categories — Technology, Business, Creative, and Healthcare. It matches you to careers that genuinely fit your profile, not just your stream.",      grad:"from-purple-500 to-violet-600", bg:"hover:bg-purple-50",  border:"hover:border-purple-200" },
    { icon:"📋", title:"Smart Quiz Assessment",    tag:"Scenario-based",         short:"Real-life scenarios — not textbook questions. No right or wrong answers.",            detail:"Instead of asking 'what's your favourite subject?', we ask how you'd react in real situations. Each question maps to a career category. The quiz takes under 3 minutes.",                                   grad:"from-blue-500 to-cyan-500",     bg:"hover:bg-blue-50",    border:"hover:border-blue-200"   },
    { icon:"🗺️", title:"Personalised Roadmap",     tag:"Step by step",           short:"A clear path from where you are today to your target career.",                       detail:"After your result, you get a step-by-step roadmap specific to your level and career match. It shows what exams to clear, what skills to build, and how long each stage takes.",                              grad:"from-pink-500 to-rose-500",     bg:"hover:bg-pink-50",    border:"hover:border-pink-200"   },
    { icon:"🏫", title:"College Suggestions",      tag:"6,554 NIRF colleges",    short:"Real colleges filtered by your career, state, and percentage.",                      detail:"We use real data from 6,554 NIRF-ranked institutions across India. Colleges are filtered by your career match, your state, and whether your percentage meets the cutoff.",                                   grad:"from-emerald-500 to-teal-500", bg:"hover:bg-emerald-50", border:"hover:border-emerald-200"},
    { icon:"🎓", title:"Exam Eligibility Checker", tag:"20+ competitive exams",  short:"Know which entrance exams you qualify for — right now.",                             detail:"Based on your level and percentage, we instantly show which exams you're eligible for — JEE, NEET, CAT, CLAT, GATE, UPSC, NDA, IBPS, NIFT and more.",                                                      grad:"from-amber-500 to-orange-500", bg:"hover:bg-amber-50",   border:"hover:border-amber-200"  },
    { icon:"💾", title:"Dashboard & History",      tag:"Save and track",         short:"Save your results, track attempts, and download your career report.",                detail:"Create a free account to save results to your dashboard. See all past attempts, compare across levels, and download your career report as PDF or CSV.",                                                      grad:"from-indigo-500 to-purple-600",bg:"hover:bg-indigo-50",  border:"hover:border-indigo-200" },
  ];

  const steps = [
    { icon:"📝", title:"Take the quiz",           desc:"Answer scenario-based questions about your interests. Honest answers give the most accurate result.", color:"from-purple-500 to-violet-600" },
    { icon:"⚡", title:"AI analyses your profile", desc:"Your answers map to 4 interest categories. The AI weighs them with your education level and percentage.", color:"from-blue-500 to-cyan-500" },
    { icon:"🎯", title:"Get your career matches",  desc:"Receive top career matches with fit labels, salary ranges, and personalised reasoning for each one.", color:"from-pink-500 to-rose-500" },
    { icon:"🗺️", title:"Follow your roadmap",      desc:"See matched colleges, eligible exams, and a step-by-step path from where you are to where you want to be.", color:"from-emerald-500 to-teal-500" },
  ];

  const comparison = [
    { feature:"Personalised result",      aimroute:true,  generic:false },
    { feature:"Level-specific paths",     aimroute:true,  generic:false },
    { feature:"Real college data (NIRF)", aimroute:true,  generic:false },
    { feature:"Exam eligibility checker", aimroute:true,  generic:false },
    { feature:"Step-by-step roadmap",     aimroute:true,  generic:false },
    { feature:"Free to use",              aimroute:true,  generic:true  },
    { feature:"No login to explore",      aimroute:true,  generic:true  },
    { feature:"AI-powered matching",      aimroute:true,  generic:false },
  ];

  const testimonials = [
    { name:"Lipsa Kiran Sahoo",  level:"12th Grade · PCB Stream",     text:"I was stuck between MBBS and Allied Health Sciences. AimRoute showed me exactly which colleges matched my percentage. The whole decision felt less overwhelming.",          photo:lipsaPhoto,   color:"from-purple-500 to-pink-500"   },
    { name:"Kamlesh Nayak",      level:"Graduation · BTech CSE",       text:"After BTech I didn't know whether to go for GATE, MBA, or a job. The roadmap AimRoute gave was specific to my profile — not the same generic advice you get everywhere.", photo:kamleshPhoto, color:"from-blue-500 to-cyan-500"     },
    { name:"Subrat Das",         level:"After 10th · Commerce Stream", text:"Everyone said take Science, but AimRoute showed Commerce with CA was a much better fit. The college suggestions for Odisha were really accurate too.",                      photo:subratPhoto,  color:"from-emerald-500 to-teal-500"  },
    { name:"Jyoti Ranjan Panda", level:"Post Graduation · MBA",        text:"The exam eligibility checker instantly told me which management entrance exams I qualify for. Saved me hours of research across different websites.",                        photo:jyotiPhoto,   color:"from-amber-500 to-orange-500"  },
  ];

  const faqs = [
    { q:"Is AimRoute free to use?",                            a:"Yes, completely free. You can take the quiz, see your result, and explore colleges without creating an account. Login is only needed to save your result." },
    { q:"Do I need to login to take the quiz?",               a:"No. Guests can take the full quiz and see the complete result. Login is only required if you want to save your result and access your dashboard." },
    { q:"How accurate are the career suggestions?",           a:"Our AI matches your answers to career patterns across 4 interest categories. The more honestly you answer, the more accurate your result." },
    { q:"Can I take the quiz more than once?",                a:"Yes. You can take it as many times as you want for different education levels. Each attempt is saved separately on your dashboard if you're logged in." },
    { q:"How is AimRoute different from other career tests?", a:"Most tests give a generic personality type. AimRoute gives specific career paths, real colleges matching your percentage and state, eligible exams, and a step-by-step roadmap — all in one place." },
  ];

  const p = personas[activePersona];

  return (
    <div className="bg-white overflow-x-hidden">
      <style>{`
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)}  }
        @keyframes gradX  { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes shimmer{ 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
        @keyframes pdot   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }

        .float  { animation: float  5s ease-in-out infinite; }
        .floatB { animation: floatB 7s ease-in-out infinite 1s; }
        .grad-anim { background-size:300% 300%; animation: gradX 6s ease infinite; }
        .pdot { width:8px;height:8px;border-radius:50%;display:inline-block;animation:pdot 1.5s ease-in-out infinite; }
        .shimmer-bar { position:relative;overflow:hidden; }
        .shimmer-bar::after { content:'';position:absolute;top:0;left:0;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent);animation:shimmer 2s ease-in-out infinite; }
        .card-lift { transition:transform 0.28s ease,box-shadow 0.28s ease,border-color 0.28s ease,background 0.28s ease; }
        .card-lift:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(124,58,237,0.12); }
        .step-card { transition:all 0.35s cubic-bezier(0.4,0,0.2,1); }
        .step-active { transform:translateY(-4px); box-shadow:0 20px 48px rgba(124,58,237,0.18); border-color:#c4b5fd !important; }
        .persona-slide { animation: slideIn 0.4s ease forwards; }
      `}</style>

      {/* ════════════════════════════════════════
          1. HERO — clean, light, no overlap with Home
      ════════════════════════════════════════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"radial-gradient(ellipse at 70% 40%, rgba(139,92,246,0.07) 0%, transparent 65%), radial-gradient(ellipse at 20% 80%, rgba(236,72,153,0.05) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle,#7c3aed 1px,transparent 1px)", backgroundSize:"32px 32px" }} />

        <div className="relative max-w-7xl mx-auto px-8 pt-20 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-7">
              <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-full">
                <span className="pdot" style={{ background:"#7c3aed" }} />
                <span className="text-purple-700 text-sm font-semibold">AI-Powered Career Guidance Platform</span>
              </div>

              <div>
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-5">
                  Everything You Need<br />to{" "}
                  <span style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    Find Your Direction
                  </span>
                </h1>
                <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                  One platform that covers every student — from 10th grade confusion
                  to post-graduation pivots. AI-powered, data-backed, completely free.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["🤖 AI Matching","🏫 6K+ Colleges","🗺️ Roadmap","🎓 Exam Checker","💾 Dashboard"].map((f,i) => (
                  <span key={i} className="text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-full font-semibold shadow-sm">
                    {f}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap items-center">
                <button onClick={() => navigate("/career-path")}
                  className="grad-anim text-white px-8 py-4 rounded-full font-bold text-base shadow-lg hover:scale-105 transition-transform duration-300 border-0"
                  style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899,#6366f1)" }}>
                  Start Free Assessment →
                </button>
                <button onClick={() => navigate("/login")}
                  className="border-2 border-purple-200 text-purple-700 px-8 py-4 rounded-full font-bold text-base hover:bg-purple-50 transition duration-300">
                  Sign In
                </button>
              </div>
              <p className="text-gray-400 text-sm">✓ No login required &nbsp;·&nbsp; ✓ Takes 3 minutes &nbsp;·&nbsp; ✓ 100% free</p>
            </div>

            {/* RIGHT — quiz mockup */}
            <div className="relative flex justify-center lg:justify-end pb-0">
              <div className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)", top:"10%", left:"10%" }} />

              <div className="relative bg-white border border-purple-100 rounded-3xl p-6 w-full max-w-sm shadow-2xl float"
                style={{ boxShadow:"0 32px 80px rgba(124,58,237,0.15)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)" }}>🎯</div>
                  <div>
                    <p className="text-gray-800 font-bold text-sm">Career Assessment</p>
                    <p className="text-gray-400 text-xs">10th Grade · Question 3 of 9</p>
                  </div>
                  <span className="ml-auto text-xs text-purple-600 bg-purple-50 border border-purple-100 px-2 py-1 rounded-full font-bold">33%</span>
                </div>
                <div className="h-2 bg-purple-50 rounded-full mb-5 overflow-hidden">
                  <div className="h-full rounded-full shimmer-bar"
                    style={{ width:"33%", background:"linear-gradient(90deg,#7c3aed,#ec4899)" }} />
                </div>
                <p className="text-gray-800 text-sm font-semibold mb-4 leading-relaxed">
                  You have a school project. What's your first move?
                </p>
                {[
                  { text:"Research and plan everything first", active:true  },
                  { text:"Jump in and figure it out as I go", active:false },
                  { text:"Organise the team and delegate",    active:false },
                  { text:"Focus on how it helps others",      active:false },
                ].map((opt, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl mb-2 border text-xs font-medium transition-all cursor-pointer
                    ${opt.active ? "border-purple-300 bg-purple-50 text-purple-700" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-purple-200"}`}>
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${opt.active ? "text-white" : "bg-white border border-gray-200 text-gray-400"}`}
                      style={opt.active ? { background:"linear-gradient(135deg,#7c3aed,#ec4899)" } : {}}>
                      {String.fromCharCode(65+i)}
                    </div>
                    {opt.text}
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i < 2 ? "bg-purple-500" : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <button className="text-xs text-white font-bold px-4 py-1.5 rounded-full"
                    style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)" }}>
                    Next →
                  </button>
                </div>
              </div>

              <div className="absolute -left-4 top-12 bg-white border border-green-100 rounded-2xl shadow-xl p-3 floatB" style={{ minWidth:148 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="pdot" style={{ background:"#10b981" }} />
                  <span className="text-xs font-bold text-gray-700">Top Match</span>
                </div>
                <p className="text-sm font-black text-emerald-600">Software Engineer</p>
                <p className="text-xs text-gray-400">Excellent fit · 94%</p>
              </div>

              <div className="absolute -right-2 bottom-20 bg-white border border-purple-100 rounded-2xl shadow-xl p-3 float"
                style={{ minWidth:140, animationDelay:"1.5s" }}>
                <p className="text-xs text-gray-500 mb-1">🏫 Colleges matched</p>
                <p className="text-2xl font-black text-purple-600">847</p>
                <p className="text-xs text-gray-400">in your state</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full overflow-hidden mt-16">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none"
            style={{ display:"block", width:"100%", height:60 }}>
            <path d="M0,0 C480,60 960,60 1440,0 L1440,60 L0,60 Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. WHO IS IT FOR — unique to Services
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Who Is It For
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Built for Every Stage</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Whether you just finished 10th or completed your master's —
              AimRoute has a specific path designed for exactly where you are.
            </p>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center gap-3 flex-wrap mb-10">
            {personas.map((persona, i) => (
              <button key={i} onClick={() => setActivePersona(i)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm border-2 transition-all duration-300
                  ${activePersona === i
                    ? `bg-gradient-to-r ${persona.color} text-white border-transparent shadow-lg scale-105`
                    : "bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700"}`}>
                <span>{persona.emoji}</span>
                {persona.level}
              </button>
            ))}
          </div>

          {/* Active persona card */}
          <div key={activePersona} className="persona-slide max-w-4xl mx-auto">
            <div className={`bg-white rounded-3xl border-2 ${p.border} overflow-hidden shadow-xl`}>
              <div className={`bg-gradient-to-r ${p.color} px-8 py-6`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                    {p.emoji}
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-semibold uppercase tracking-widest">{p.level}</p>
                    <h3 className="text-2xl font-black text-white leading-tight">{p.title}</h3>
                  </div>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                {/* Pain */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center text-sm">😤</div>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">The Problem</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{p.pain}</p>
                </div>

                {/* Solution */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center text-sm">✅</div>
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">How AimRoute Helps</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{p.solution}</p>
                </div>
              </div>

              {/* Tags + CTA */}
              <div className={`px-8 py-5 ${p.bg} border-t-2 ${p.border} flex flex-wrap items-center justify-between gap-4`}>
                <div className="flex gap-2 flex-wrap">
                  {p.tags.map((tag, i) => (
                    <span key={i} className={`text-xs font-bold px-3 py-1.5 rounded-full ${p.tag_color}`}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button onClick={() => navigate("/career-path")}
                  className={`bg-gradient-to-r ${p.color} text-white text-sm font-bold px-6 py-2.5 rounded-full hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-md`}>
                  Try it for {p.level} →
                </button>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {personas.map((_, i) => (
              <button key={i} onClick={() => setActivePersona(i)}
                className={`transition-all duration-300 rounded-full ${activePersona === i ? "w-8 h-2.5 bg-purple-600" : "w-2.5 h-2.5 bg-gray-300 hover:bg-purple-300"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              The Process
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">How AimRoute Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From your first question to a personalised career result — in under 3 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={i}
                className={`step-card relative bg-white rounded-3xl p-7 border-2 cursor-pointer
                  ${activeStep === i ? "step-active" : "border-gray-100 hover:border-purple-200"}`}
                onClick={() => setActiveStep(i)}>
                {i < 3 && (
                  <div className="hidden md:block absolute top-11 -right-3 w-6 h-0.5 z-10 transition-all duration-500"
                    style={{ background: activeStep > i ? "linear-gradient(90deg,#7c3aed,#a855f7)" : "#e5e7eb" }} />
                )}
                <div className="text-xs font-black text-gray-300 mb-4 tracking-widest">
                  STEP {String(i+1).padStart(2,"0")}
                </div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4 bg-gradient-to-br ${s.color} shadow-md`}>
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-base">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                {activeStep === i && (
                  <div className="absolute bottom-5 right-5">
                    <span className="pdot" style={{ background:"#7c3aed" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. SERVICES GRID
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              What We Offer
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Six Features, One Platform</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Everything a student needs to make a confident career decision. Click any card to learn more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} onClick={() => setSelected(s)}
                className={`card-lift group relative bg-white rounded-3xl p-7 cursor-pointer border border-gray-100 overflow-hidden ${s.bg} ${s.border}`}>
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${s.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 bg-gradient-to-br ${s.grad} shadow-md`}>
                  {s.icon}
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full mb-3 inline-block">
                  {s.tag}
                </span>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.short}</p>
                <div className="flex items-center gap-1 text-sm font-semibold text-purple-600 group-hover:gap-2 transition-all duration-200">
                  Learn more <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. COMPARISON
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Why AimRoute
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">How We're Different</h2>
            <p className="text-gray-500">
              Most career guidance is a Google search or a well-meaning uncle's advice.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-gray-100"
            style={{ boxShadow:"0 8px 40px rgba(124,58,237,0.1)" }}>
            <div className="grid grid-cols-3 px-8 py-5"
              style={{ background:"linear-gradient(135deg,#7c3aed,#6366f1)" }}>
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Feature</span>
              <span className="text-white text-xs font-bold uppercase tracking-widest text-center">AimRoute ✦</span>
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest text-center">Others</span>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-8 py-4 border-b border-gray-50 ${i%2===0 ? "bg-white" : "bg-gray-50/60"}`}>
                <span className="text-gray-700 text-sm font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-300 flex-shrink-0" />
                  {row.feature}
                </span>
                <span className="text-center">
                  {row.aimroute
                    ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-black text-sm">✓</span>
                    : <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-400">✗</span>}
                </span>
                <span className="text-center">
                  {row.generic
                    ? <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100 text-green-600 font-black text-sm">✓</span>
                    : <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-50 text-red-400">✗</span>}
                </span>
              </div>
            ))}
            <div className="px-8 py-5 bg-purple-50 text-center border-t border-purple-100">
              <button onClick={() => navigate("/career-path")}
                className="text-purple-700 font-bold text-sm hover:text-purple-900 transition-colors">
                Try AimRoute free — no login needed →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. TESTIMONIALS — dark
      ════════════════════════════════════════ */}
      <section className="py-24 px-6"
        style={{ background:"linear-gradient(135deg,#0f0a1e 0%,#1a0533 60%,#0d1b3e 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-white/10 border border-white/20 text-purple-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Student Stories
            </span>
            <h2 className="text-4xl font-black text-white mb-4">What Students Say</h2>
            <p className="text-gray-400">Real students, real decisions, real results.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-lift relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.color}`} />
                <div className="text-7xl font-black leading-none mb-1 select-none"
                  style={{ fontFamily:"Georgia,serif", color:"rgba(255,255,255,0.06)", lineHeight:0.8 }}>
                  "
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length:5 }).map((_,j) => (
                    <span key={j} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="border-t border-white/10 pt-4 flex items-center gap-3">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name}
                      className="w-11 h-11 rounded-full object-cover flex-shrink-0 ring-2 ring-white/20"
                      onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                    />
                  ) : null}
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    style={{ display: t.photo ? "none" : "flex" }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{t.name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{t.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. FAQ
      ════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              FAQ
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Frequently Asked</h2>
            <p className="text-gray-500">Everything you need to know before you start.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. CTA
      ════════════════════════════════════════ */}
      <section className="relative py-24 px-6 overflow-hidden"
        style={{ background:"linear-gradient(135deg,#7c3aed 0%,#6366f1 50%,#ec4899 100%)" }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />

        <div className="absolute top-8 left-8 bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-4 float hidden lg:block">
          <p className="text-white text-xs font-bold mb-1">🎯 Career Match</p>
          <p className="text-white text-base font-black">Software Engineer</p>
          <p className="text-white/60 text-xs">Excellent fit · 94%</p>
        </div>
        <div className="absolute bottom-8 right-8 bg-white/15 backdrop-blur border border-white/20 rounded-2xl p-4 floatB hidden lg:block">
          <p className="text-white text-xs font-bold mb-1">🏫 Colleges Found</p>
          <p className="text-white text-base font-black">847 matches</p>
          <p className="text-white/60 text-xs">in your state</p>
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 px-4 py-2 rounded-full mb-8">
            <span className="pdot" style={{ background:"white" }} />
            <span className="text-white text-sm font-medium">Join 10,000+ students already on track</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-5 leading-tight">
            Ready to Find Your<br />Direction?
          </h2>
          <p className="text-white/70 text-lg mb-10">Free · No login required · Results in 3 minutes</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate("/career-path")}
              className="bg-white text-purple-700 px-10 py-4 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-transform duration-300">
              Start Free Assessment →
            </button>
            <button onClick={() => navigate("/login")}
              className="bg-white/15 border-2 border-white/40 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/25 transition-all duration-300">
              Sign In
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10">
            {["✓ 100% Free","✓ No Spam","✓ Instant Results"].map((t,i) => (
              <span key={i} className="text-white/50 text-sm">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SERVICE DETAIL MODAL
      ════════════════════════════════════════ */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{ backgroundColor:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${selected.grad} p-8`}>
              <div className="w-14 h-14 bg-white/25 rounded-2xl flex items-center justify-center text-3xl mb-4">
                {selected.icon}
              </div>
              <span className="text-white/70 text-xs font-bold uppercase tracking-widest">{selected.tag}</span>
              <h2 className="text-2xl font-black text-white mt-1">{selected.title}</h2>
            </div>
            <div className="p-8">
              <p className="text-gray-600 leading-relaxed text-sm mb-6">{selected.detail}</p>
              <div className="flex gap-3">
                <button onClick={() => { setSelected(null); navigate("/career-path"); }}
                  className={`flex-1 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${selected.grad} hover:opacity-90 transition`}>
                  Try it now →
                </button>
                <button onClick={() => setSelected(null)}
                  className="px-5 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${open ? "border-purple-200 shadow-md" : "border-gray-100 shadow-sm bg-white"}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-bold text-gray-800 text-sm pr-4">{q}</span>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all duration-200
          ${open ? "bg-purple-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
          ▼
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 bg-gray-50/50">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default Services;