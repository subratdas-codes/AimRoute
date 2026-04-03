// frontend/src/pages/CareerPath.jsx

import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const LEVELS = [
  {
    value:"10th", title:"After 10th", subtitle:"Stream Selection",
    desc:"Confused between Science, Commerce, Arts or Diploma? Find the stream that matches your interests.",
    icon:"📚", badge:"Streams", tags:["Science","Commerce","Arts","Diploma"],
    gradient:"from-pink-500 to-rose-500", light:"bg-pink-50", border:"border-pink-200",
    text:"text-pink-700", glow:"rgba(236,72,153,0.18)",
  },
  {
    value:"12th", title:"After 12th", subtitle:"Degree Selection",
    desc:"Choose the right degree and entrance exam — BTech, MBBS, BBA, Law, Design and more.",
    icon:"🎓", badge:"Degrees", tags:["BTech / JEE","MBBS / NEET","BBA","Law / CLAT"],
    gradient:"from-purple-500 to-indigo-500", light:"bg-purple-50", border:"border-purple-200",
    text:"text-purple-700", glow:"rgba(124,58,237,0.18)",
  },
  {
    value:"grad", title:"After Graduation", subtitle:"PG & Career",
    desc:"Deciding between MBA, MCA, MTech, government exams or a direct job? We'll guide you.",
    icon:"💼", badge:"PG / Jobs", tags:["MBA / CAT","MCA","UPSC / SSC","Job Placement"],
    gradient:"from-blue-500 to-cyan-500", light:"bg-blue-50", border:"border-blue-200",
    text:"text-blue-700", glow:"rgba(37,99,235,0.18)",
  },
  {
    value:"pg", title:"After PG", subtitle:"Specialisation",
    desc:"Explore research, PhD, senior industry roles, government services or specialisation paths.",
    icon:"🔬", badge:"Advanced", tags:["PhD / Research","ISRO / DRDO","Senior Roles","IAS / IPS"],
    gradient:"from-emerald-500 to-teal-500", light:"bg-emerald-50", border:"border-emerald-200",
    text:"text-emerald-700", glow:"rgba(5,150,105,0.18)",
  },
];

export default function CareerPath() {
  const navigate  = useNavigate();
  const cardsRef  = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      card.style.opacity   = "0";
      card.style.transform = "translateY(36px)";
      card.style.transition= `opacity .55s ease ${i*.15}s, transform .55s ease ${i*.15}s`;
      requestAnimationFrame(() => {
        card.style.opacity   = "1";
        card.style.transform = "translateY(0)";
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <style>{`
        @keyframes floatIcon{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
        .career-card{transition:transform .28s ease,box-shadow .28s ease}
        .career-card:hover{transform:translateY(-8px)!important}
        .career-card:hover .c-icon{animation:floatIcon 2s ease-in-out infinite}
        .career-card:hover .c-arrow{transform:translateX(4px)}
        .c-arrow{transition:transform .2s ease}
        .pdot{animation:pulseDot 1.6s ease-in-out infinite}
      `}</style>

      {/* HERO */}
      <div className="pt-20 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-purple-500 rounded-full pdot inline-block"/>
          AI Career Guidance
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Where Are You <span className="text-purple-600">Right Now?</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Pick your current education level and get a personalised career path built just for you.
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEVELS.map((level, i) => (
            <div key={i} ref={el => cardsRef.current[i] = el}
              onClick={() => navigate(`/career-path/${level.value}`)}
              className={`career-card group relative ${level.light} ${level.border} border-2 rounded-3xl p-6 cursor-pointer flex flex-col`}
              style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}
              onMouseEnter={e => e.currentTarget.style.boxShadow=`0 20px 40px ${level.glow}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.06)"}>

              <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${level.gradient}`}/>

              <div className="flex items-center justify-between mb-5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-white ${level.text} border ${level.border}`}>{level.badge}</span>
                <span className="c-icon text-3xl">{level.icon}</span>
              </div>

              <h3 className="text-xl font-extrabold text-gray-800 mb-0.5">{level.title}</h3>
              <p className={`text-xs font-semibold ${level.text} mb-3`}>{level.subtitle}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{level.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {level.tags.map((tag,j) => (
                  <span key={j} className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${level.text}`}>Start quiz</span>
                <div className={`c-arrow w-8 h-8 rounded-full bg-gradient-to-br ${level.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}>→</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-5">
            {[{icon:"⚡",text:"Results in 3 minutes"},{icon:"🔒",text:"No login needed"},{icon:"🎯",text:"Personalised to you"},{icon:"🆓",text:"Completely free"}].map((item,i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-500"><span>{item.icon}</span><span>{item.text}</span></div>
            ))}
          </div>
          <button onClick={() => navigate("/services")} className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors">How does it work? →</button>
        </div>
      </div>
    </div>
  );
}