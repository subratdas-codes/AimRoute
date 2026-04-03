// frontend/src/pages/Services.jsx
// Replace your existing Services.jsx with this completely

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Services = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  // ── 6 core services with deep detail ─────────────────────
  const services = [
    {
      icon:"🤖", title:"AI Career Matching",
      tag:"Personalised to you",
      short:"Your answers shape your result — no two students get the same output.",
      detail:"Our AI evaluates your interests, decision-making style, and strengths across 4 categories — Technology, Business, Creative, and Healthcare. It then matches you to careers that genuinely fit your profile, not just your stream or subjects. Every student gets a different result because every student is different.",
      color:"from-purple-100 to-purple-200",
    },
    {
      icon:"📋", title:"Smart Quiz Assessment",
      tag:"Scenario-based questions",
      short:"Real-life scenarios — not textbook questions. No right or wrong answers.",
      detail:"Instead of asking 'what's your favourite subject?', we ask how you'd react in real situations. Each question maps to a career category. The more honestly you answer, the more accurate your result. The quiz takes under 3 minutes and adapts to your education level.",
      color:"from-blue-100 to-blue-200",
    },
    {
      icon:"🗺️", title:"Personalised Roadmap",
      tag:"Step by step",
      short:"A clear path from where you are today to your target career.",
      detail:"After your result, you get a step-by-step roadmap specific to your level and career match. It shows what exams to clear, what skills to build, what degree to pursue, and how long each stage takes. The roadmap updates based on your quiz answers — not a generic template.",
      color:"from-pink-100 to-pink-200",
    },
    {
      icon:"🏫", title:"College Suggestions",
      tag:"6,554 NIRF colleges",
      short:"Real colleges filtered by your career, state, and percentage.",
      detail:"We use real data from 6,554 NIRF-ranked institutions across India. Colleges are filtered by your career match, your state, and whether your percentage meets the cutoff. You can filter further by medium of instruction and campus type. No generic lists — only colleges that are realistic for you.",
      color:"from-green-100 to-green-200",
    },
    {
      icon:"🎓", title:"Exam Eligibility Checker",
      tag:"20+ competitive exams",
      short:"Know which entrance exams you qualify for — right now.",
      detail:"Based on your education level and percentage, we instantly show which competitive exams you're eligible for — JEE, NEET, CAT, CLAT, GATE, UPSC, NDA, IBPS, NIFT and more. Each exam card shows exam date, registration window, age limit, number of attempts, and what it leads to. No guesswork.",
      color:"from-amber-100 to-amber-200",
    },
    {
      icon:"💾", title:"Dashboard & History",
      tag:"Save and track",
      short:"Save your results, track attempts, and download your career report.",
      detail:"Create a free account to save your career results to your personal dashboard. See all past quiz attempts, compare results across different levels, download your career report as PDF or CSV, and view your strongest interest categories over time. Your career journey — all in one place.",
      color:"from-indigo-100 to-indigo-200",
    },
  ];

  // ── Feature comparison vs generic guidance ────────────────
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

  // ── Student testimonials (placeholder) ───────────────────
  const testimonials = [
    { name:"Priya S.", level:"12th · PCB stream", text:"I was confused between MBBS and Pharmacy. AimRoute showed me exactly which colleges I qualify for based on my NEET score. Saved so much time.", avatar:"P" },
    { name:"Rahul K.", level:"Graduation · BTech CSE", text:"After my BTech I didn't know whether to go for MBA or MCA. The roadmap it gave me was very specific — not generic advice like everyone else gives.", avatar:"R" },
    { name:"Anjali M.", level:"After 10th", text:"I had no idea what to do after 10th. My parents wanted PCM but after the quiz it showed Commerce + BBA path which I actually loved. Very helpful.", avatar:"A" },
  ];

  return (
    <div className="bg-white">

      {/* ── HERO ── */}
      <section className="relative py-28 text-center bg-pink-200 border-b border-gray-100 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5"
          style={{backgroundImage:"radial-gradient(circle,#7c3aed 1px,transparent 1px)",backgroundSize:"30px 30px"}}/>
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="inline-block bg-purple-100 text-purple-700 text-sm px-4 py-1 rounded-full mb-6 font-medium">
            AI-Powered Career Guidance Platform
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight text-gray-800">
            Everything You Need to <br />
            <span className="text-purple-600">Find Your Direction</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            AimRoute combines smart assessments, AI matching, and verified college data
            to give students clarity — not confusion.
          </p>
          <button
            onClick={() => navigate("/career-path")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            Start Free Assessment
          </button>
          <p className="text-gray-400 text-sm mt-3">No login required to explore</p>
        </div>
      </section>

      {/* ── HOW IT WORKS — 4 steps ── */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">The Process</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How AimRoute Works</h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto text-sm">
            From your first question to your personalised career result — here's exactly what happens.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step:"01", icon:"📝", title:"Take the quiz",         desc:"Answer scenario-based questions about your interests and strengths. No right or wrong answers — just honest ones." },
              { step:"02", icon:"⚡", title:"AI analyses your profile", desc:"Your answers map to 4 interest categories. Our AI weighs them against your education level and percentage." },
              { step:"03", icon:"🎯", title:"Get your career matches", desc:"Receive your top 5 career matches with fit labels, salary ranges, and why each one suits you." },
              { step:"04", icon:"🗺️", title:"Follow your roadmap",    desc:"See colleges, entrance exams, and a step-by-step path from where you are to where you want to be." },
            ].map((item,i) => (
              <div key={i} className="relative bg-white rounded-2xl p-6 shadow text-left">
                {i < 3 && <div className="hidden md:block absolute top-10 -right-3 w-6 h-0.5 bg-purple-300 z-10"/>}
                <div className="text-2xl font-bold text-purple-400 mb-3">{item.step}</div>
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 SERVICES GRID ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">What We Offer</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Six Features, One Platform</h2>
          <p className="text-gray-500 mb-14 max-w-xl mx-auto text-sm">
            Everything a student needs to make a confident career decision — click any card to learn more.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s,i) => (
              <div key={i} onClick={() => setSelected(s)}
                className="bg-white p-8 rounded-2xl shadow hover:shadow-xl hover:-translate-y-2 transition duration-300 cursor-pointer border border-gray-100 hover:border-purple-200 text-left">
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-2xl mb-5`}>
                  {s.icon}
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium mb-3 inline-block">{s.tag}</span>
                <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.short}</p>
                <div className="mt-4 text-purple-500 text-sm font-medium">Learn more →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 bg-purple-50 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">Why AimRoute</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How We're Different</h2>
          <p className="text-gray-500 mb-12 text-sm">
            Most career guidance is a Google search or a well-meaning uncle's advice. Here's what actually makes us different.
          </p>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="grid grid-cols-3 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <span className="text-left">Feature</span>
              <span className="text-center text-purple-700">AimRoute</span>
              <span className="text-center">Generic Guidance</span>
            </div>
            {comparison.map((row,i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-4 text-sm border-b border-gray-50 ${i%2===0?"bg-white":"bg-gray-50/50"}`}>
                <span className="text-gray-700 font-medium">{row.feature}</span>
                <span className="text-center">{row.aimroute ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-400">✗</span>}</span>
                <span className="text-center">{row.generic  ? <span className="text-green-600 font-bold">✓</span> : <span className="text-red-400">✗</span>}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-sm text-purple-600 font-medium mb-3">Student Stories</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Students Say</h2>
          <p className="text-gray-500 mb-14 text-sm">Real students, real decisions, real results.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t,i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-sm text-purple-600 font-medium mb-3">Common Questions</div>
            <h2 className="text-3xl font-bold text-gray-800">Frequently Asked</h2>
          </div>
          <div className="space-y-4">
            {[
              { q:"Is AimRoute free to use?",                            a:"Yes, completely free. You can take the quiz, see your result, and explore colleges without creating an account. Login is only needed to save your result to a dashboard." },
              { q:"Do I need to login to take the quiz?",               a:"No. Guests can take the full quiz and see the complete result. Login is only required if you want to save your result and access your dashboard." },
              { q:"How accurate are the career suggestions?",           a:"Our AI matches your quiz answers to career patterns across 4 interest categories. The more honestly you answer, the more accurate your result. It's a guide, not a guarantee — but it's personalised to you." },
              { q:"Can I take the quiz more than once?",                a:"Yes. You can take it as many times as you want, for different education levels. Each attempt is saved separately on your dashboard if you're logged in." },
              { q:"How is AimRoute different from other career tests?", a:"Most tests give you a generic personality type. AimRoute gives you specific career paths, real colleges that match your percentage and state, entrance exams you qualify for, and a step-by-step roadmap — all in one place." },
            ].map((faq,i) => (
              <FaqItem key={i} q={faq.q} a={faq.a}/>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center py-20 px-6 bg-gradient-to-br from-purple-600 to-indigo-700">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Direction?</h2>
        <p className="text-purple-200 mb-8 max-w-md mx-auto text-sm">
          Free · No login required · Results in 3 minutes
        </p>
        <button
          onClick={() => navigate("/career-path")}
          className="bg-white text-purple-700 px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
        >
          Start Free Assessment
        </button>
      </section>

      {/* ── SERVICE DETAIL MODAL ── */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
          style={{backgroundColor:"rgba(0,0,0,0.45)"}}
          onClick={() => setSelected(null)}>
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-left"
            onClick={e => e.stopPropagation()}>
            <div className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br ${selected.color} text-3xl mb-5`}>
              {selected.icon}
            </div>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium mb-3 inline-block">{selected.tag}</span>
            <h2 className="text-xl font-bold text-gray-800 mb-3">{selected.title}</h2>
            <p className="text-gray-500 leading-relaxed text-sm">{selected.detail}</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setSelected(null); navigate("/career-path"); }}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition">
                Try it now →
              </button>
              <button onClick={() => setSelected(null)}
                className="px-5 py-3 border border-gray-200 text-gray-500 rounded-xl text-sm hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

// ── Collapsible FAQ item ──────────────────────────────────────
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(o=>!o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-800 text-sm">{q}</span>
        <span className={`text-purple-500 text-xs transition-transform duration-200 ${open?"rotate-180":""}`}>▼</span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-500 text-sm leading-relaxed border-t border-gray-50">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

export default Services;