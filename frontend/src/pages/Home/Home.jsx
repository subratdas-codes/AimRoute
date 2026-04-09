import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import hero  from "../../assets/hero.svg";
import icon1 from "../../assets/icon1.svg";
import icon2 from "../../assets/icon2.svg";
import icon3 from "../../assets/icon3.svg";
import icon4 from "../../assets/icon4.svg";
import icon5 from "../../assets/icon5.svg";
import icon6 from "../../assets/icon6.svg";
import CareerSection from "../../components/CareerSection";
import Footer        from "../../components/Footer";
import HowItWorks    from "../../components/HowItWorks";

// ── Animated counter hook ─────────────────────────────────
function useCountUp(target, duration = 1800, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start    = 0;
    const step   = target / (duration / 16);
    const timer  = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

function StatCard({ num, label, suffix = "", started }) {
  const val = useCountUp(num, 1600, started);
  return (
    <div className="reveal text-center">
      <div className="text-3xl font-bold text-white">
        {val.toLocaleString()}{suffix}
      </div>
      <div className="text-purple-200 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const navigate   = useNavigate();
  const statsRef   = useRef(null);
  const [statsStarted, setStatsStarted] = useState(false);

  useEffect(() => {
    // Reveal on scroll
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // Stats counter trigger
    const statsObs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) { setStatsStarted(true); statsObs.disconnect(); } },
      { threshold: 0.3 }
    );
    if (statsRef.current) statsObs.observe(statsRef.current);

    return () => { observer.disconnect(); statsObs.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen bg-white -mt-24">
      <style>{`
        .reveal{opacity:0;transform:translateY(28px);transition:opacity .65s ease,transform .65s ease}
        .reveal.visible{opacity:1;transform:translateY(0)}
        .reveal:nth-child(2){transition-delay:.1s}.reveal:nth-child(3){transition-delay:.2s}
        .reveal:nth-child(4){transition-delay:.3s}.reveal:nth-child(5){transition-delay:.4s}
        .reveal:nth-child(6){transition-delay:.5s}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.75)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
        .float{animation:float 4s ease-in-out infinite}
        .float2{animation:float 5s ease-in-out infinite .7s}
        .float3{animation:float 6s ease-in-out infinite 1.2s}
        .pdot{animation:pulseDot 1.6s ease-in-out infinite}
        .animated-bg{background:linear-gradient(270deg,#7c3aed,#ec4899,#6366f1,#8b5cf6);background-size:300% 300%;animation:gradientShift 6s ease infinite}
        .card-lift{transition:transform .3s ease,box-shadow .3s ease}
        .card-lift:hover{transform:translateY(-6px);box-shadow:0 16px 36px rgba(124,58,237,.13)}
        .level-card{transition:transform .28s ease,box-shadow .28s ease,border-color .28s ease}
        .level-card:hover{transform:translateY(-5px);box-shadow:0 14px 30px rgba(124,58,237,.12)}
        .city-pill{transition:background .2s,color .2s,transform .2s}
        .city-pill:hover{background:#ede9fe;color:#5b21b6;transform:scale(1.05)}
      `}</style>

      {/* ── HERO ── */}
      <div className="container mx-auto px-8 py-20 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-purple-500 rounded-full pdot inline-block"/>
            AI-Powered Career Guidance
          </div>
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Discover Careers That <br/>
            <span className="text-purple-600">Match Who You Are.</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-lg">
            Take a structured assessment and explore career paths tailored to your interests, strengths, and goals.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={()=>navigate("/career-path")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 font-semibold">
              Start Career Assessment
            </button>
            <button onClick={()=>navigate("/services")}
              className="bg-white text-purple-700 border-2 border-purple-200 px-6 py-3 rounded-full hover:border-purple-400 transition font-semibold">
              How it works →
            </button>
          </div>
        </div>
        <div className="relative md:w-1/2 flex justify-center mt-12 md:mt-0">
          <div className="absolute w-[450px] h-[450px] bg-amber-200 rounded-full blur-3xl opacity-40"/>
          <img src={hero}  alt="hero"  className="relative z-10 w-[400px] h-[520px] object-contain drop-shadow-2xl"/>
          <img src={icon1} alt="" className="absolute top-5 left-10     w-20 bg-gray-200 rounded-full shadow-xl float"/>
          <img src={icon5} alt="" className="absolute bottom-35 left-10  w-20 bg-gray-200 rounded-full shadow-xl float2"/>
          <img src={icon6} alt="" className="absolute bottom-2 left-8    w-20 bg-gray-200 rounded-full shadow-xl float3"/>
          <img src={icon2} alt="" className="absolute top-10 right-5     w-20 bg-gray-200 rounded-full shadow-xl float"/>
          <img src={icon3} alt="" className="absolute bottom-35 right-6   w-20 bg-gray-200 rounded-full shadow-xl float2"/>
          <img src={icon4} alt="" className="absolute bottom-5 right-6    w-20 bg-gray-200 rounded-full shadow-xl float3"/>
        </div>
      </div>

      {/* ── AI BANNER ── */}
      <div className="animated-bg py-3 px-6 flex items-center justify-center gap-3 flex-wrap">
        <span className="pdot w-2 h-2 bg-white rounded-full inline-block"/>
        <span className="text-white text-sm font-medium">AI-powered career guidance · 6,554 NIRF colleges · Personalised for every student</span>
        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Free to use</span>
      </div>

      {/* ── WHY AIMROUTE ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="reveal text-4xl font-bold mb-4">Why Choose <span className="text-purple-600">AimRoute?</span></h2>
          <p className="reveal text-gray-500 mb-16 max-w-xl mx-auto">Most career guidance gives you a list. We give you a direction — personalised to you.</p>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {icon:"🤖",title:"AI Career Matching",   tag:"Smart & Personalised", desc:"Our AI analyses your answers and matches you to careers that genuinely fit your strengths — not just your subjects."},
              {icon:"🏫",title:"College Suggestions",  tag:"6,554 NIRF Colleges",  desc:"Discover top colleges filtered by your career match, state, and percentage. Real data, real options."},
              {icon:"🗺️",title:"Your Career Roadmap", tag:"Step by Step",          desc:"Get a clear step-by-step path from where you are today to where you want to be — specific to your level."},
            ].map((f,i)=>(
              <div key={i} className="reveal card-lift p-8 rounded-2xl shadow-lg border border-gray-100 text-left">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.desc}</p>
                <span className="inline-block bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS ── */}
      <section ref={statsRef} className="py-16 bg-gradient-to-r from-purple-600 to-pink-500">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard num={10000} suffix="+" label="Students Guided"  started={statsStarted}/>
            <StatCard num={6554}  suffix=""  label="Colleges Listed"  started={statsStarted}/>
            <StatCard num={50}    suffix="+" label="Career Paths"     started={statsStarted}/>
            <StatCard num={3}     suffix=" min" label="Average Time"  started={statsStarted}/>
          </div>
        </div>
      </section>

      {/* ── LEVEL CARDS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="reveal text-4xl font-bold text-gray-800 mb-4">Where Are You <span className="text-purple-600">Right Now?</span></h2>
          <p className="reveal text-gray-500 mb-14 max-w-xl mx-auto">Pick your level and get a career path built specifically for you.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {level:"After 10th",       icon:"📚",desc:"Choose between Science, Commerce, Arts or Diploma",       path:"/career-path/10th",color:"bg-pink-50 border-pink-200",text:"text-pink-700"},
              {level:"After 12th",       icon:"🎓",desc:"Find the right degree and entrance exam for your future", path:"/career-path/12th",color:"bg-purple-50 border-purple-200",text:"text-purple-700"},
              {level:"After Graduation", icon:"💼",desc:"Decide between job, MBA, M.Tech or government services",  path:"/career-path/grad",color:"bg-blue-50 border-blue-200",text:"text-blue-700"},
              {level:"After PG",         icon:"🔬",desc:"Explore research, PhD, senior roles or specialisation",   path:"/career-path/pg",  color:"bg-emerald-50 border-emerald-200",text:"text-emerald-700"},
            ].map((item,i)=>(
              <div key={i} onClick={()=>navigate(item.path)}
                className={`reveal level-card ${item.color} border-2 rounded-2xl p-6 cursor-pointer text-left`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.level}</h3>
                <p className="text-gray-500 text-sm mb-4">{item.desc}</p>
                <span className={`text-sm font-semibold ${item.text}`}>Start now →</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITY TRUST STRIP ── */}
      <section className="py-14 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-xs uppercase tracking-widest font-medium mb-6">Trusted by students from</p>
          <div className="flex flex-wrap justify-center gap-3">
            {["Delhi","Mumbai","Bangalore","Kolkata","Hyderabad","Chennai","Pune","Bhubaneswar","Jaipur","Ahmedabad"].map(city=>(
              <span key={city} className="city-pill bg-gray-50 px-4 py-2 rounded-full border border-gray-100 text-sm text-gray-500 cursor-default">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 text-center px-6 bg-gradient-to-br from-purple-50 to-pink-50">
        <h2 className="reveal text-4xl font-bold text-gray-800 mb-4">Your Career Starts with <span className="text-purple-600">One Click</span></h2>
        <p className="reveal text-gray-500 mb-8 max-w-md mx-auto">Free · No login needed · Results in 3 minutes</p>
        <button onClick={()=>navigate("/career-path")}
          className="reveal bg-gradient-to-r from-pink-500 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300">
          Start Free Assessment
        </button>
      </section>

      <CareerSection/>
      <HowItWorks/>
      <Footer/>
    </div>
  );
}