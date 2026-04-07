// frontend/src/components/HowItWorks.jsx

import { useEffect, useRef } from "react";

const STEPS = [
  {
    number: "01",
    icon:   "🎯",
    title:  "Pick Your Stage",
    desc:   "Tell us where you are right now — After 10th, 12th, Graduation, or PG. No signup needed.",
    color:  "bg-purple-50 text-purple-700 border-purple-200",
    dot:    "bg-purple-500",
    glow:   "rgba(124,58,237,0.12)",
  },
  {
    number: "02",
    icon:   "💬",
    title:  "Answer a Few Questions",
    desc:   "Real-life scenarios — not subject questions. We learn how you think, not what you studied.",
    color:  "bg-blue-50 text-blue-700 border-blue-200",
    dot:    "bg-blue-500",
    glow:   "rgba(37,99,235,0.12)",
  },
  {
    number: "03",
    icon:   "🤖",
    title:  "AI Finds Your Best Fit",
    desc:   "Our AI reads your answers and shows your top career matches with salary ranges and fit scores.",
    color:  "bg-pink-50 text-pink-700 border-pink-200",
    dot:    "bg-pink-500",
    glow:   "rgba(236,72,153,0.12)",
  },
  {
    number: "04",
    icon:   "🗺️",
    title:  "See Your Full Path",
    desc:   "Get a step-by-step roadmap, matching colleges filtered by your state, and exam eligibility — all in one place.",
    color:  "bg-green-50 text-green-700 border-green-200",
    dot:    "bg-green-500",
    glow:   "rgba(5,150,105,0.12)",
  },
];

export default function HowItWorks() {
  const stepsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("hiw-visible");
      }),
      { threshold: 0.15 }
    );
    stepsRef.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-white">
      <style>{`
        @keyframes pulseDot {
          0%,100%{ opacity:1; transform:scale(1); }
          50%{ opacity:.4; transform:scale(.7); }
        }
        .pdot { animation: pulseDot 1.6s ease-in-out infinite; }
        .hiw-outer {
          opacity: 0;
          transition: opacity .6s ease;
        }
        .hiw-outer.hiw-visible {
          opacity: 1;
        }
        .hiw-outer:nth-child(1){ transition-delay: .05s }
        .hiw-outer:nth-child(2){ transition-delay: .15s }
        .hiw-outer:nth-child(3){ transition-delay: .25s }
        .hiw-outer:nth-child(4){ transition-delay: .35s }
        .hiw-card {
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .hiw-card:hover {
          transform: translateY(-6px);
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-200 border border-purple-200 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-5">
            <span className="w-2 h-2 rounded-full bg-purple-500 pdot inline-block"/>
            Simple 4-step process
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How <span className="text-purple-600">AimRoute</span> Works
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            From confusion to clarity in under 3 minutes.
            No login required — just answer a few questions and get your result.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {STEPS.map((step, i) => (
            <div key={i} className="relative hiw-outer"
              ref={el => stepsRef.current[i] = el}>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%-8px)] w-4 h-0.5 bg-gray-100 z-10"/>
              )}
              <div
                className="hiw-card bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left h-full cursor-default"
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 36px ${step.glow}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ""}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-4xl font-extrabold text-gray-100 leading-none">{step.number}</span>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl border-2 ${step.color}`}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 text-base">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                <div className="mt-5 flex items-center gap-1">
                  {STEPS.map((s, j) => (
                    <div key={j} className={`h-1.5 rounded-full transition-all duration-300 ${
                      j === i ? `w-5 ${step.dot}` :
                      j < i   ? `w-2 ${s.dot} opacity-40` :
                                "w-2 bg-gray-200"
                    }`}/>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon:"⚡", text:"Under 3 minutes"   },
            { icon:"🔒", text:"No signup needed"   },
            { icon:"🎯", text:"Personalised result" },
            { icon:"🆓", text:"100% free"           },
            { icon:"🏫", text:"6,554 real colleges" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
