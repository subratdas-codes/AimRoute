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
  const [text,      setText]      = useState("");
  const [pIdx,      setPIdx]      = useState(0);
  const [cIdx,      setCIdx]      = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const phrase = TYPING_PHRASES[pIdx];
    const delay  = deleting ? 40 : 80;
    const timer  = setTimeout(() => {
      if (!deleting) {
        if (cIdx < phrase.length) { setText(phrase.slice(0, cIdx+1)); setCIdx(c=>c+1); }
        else setTimeout(()=>setDeleting(true), 1200);
      } else {
        if (cIdx > 0) { setText(phrase.slice(0, cIdx-1)); setCIdx(c=>c-1); }
        else { setDeleting(false); setPIdx(p=>(p+1)%TYPING_PHRASES.length); }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [cIdx, deleting, pIdx]);

  return (
    <span>
      {text}
      <span style={{display:"inline-block",width:"2px",height:"18px",background:"#7c3aed",marginLeft:"2px",verticalAlign:"middle",animation:"blink .8s ease-in-out infinite"}}/>
    </span>
  );
}

const LEVEL_NAMES = {"10th":"10th Grade","12th":"12th Grade","grad":"Graduation","pg":"Post Graduation"};

export default function CareerQuestions() {
  const { level } = useParams();
  const navigate  = useNavigate();

  const [questions,           setQuestions]           = useState([]);
  const [currentQuestion,     setCurrentQuestion]     = useState(null);
  const [scores,              setScores]              = useState({});
  const [reasons,             setReasons]             = useState([]);
  const [loading,             setLoading]             = useState(true);
  const [submitting,          setSubmitting]          = useState(false);
  const [error,               setError]               = useState(null);
  const [stepCount,           setStepCount]           = useState(0);
  const [percentage,          setPercentage]          = useState("");
  const [percentageConfirmed, setPercentageConfirmed] = useState(false);
  const [selectedOption,      setSelectedOption]      = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    API.get(`/quiz/?level=${level}`)
      .then(r => {
        const allQ = r.data;
        setQuestions(allQ);
        setCurrentQuestion(allQ.find(q=>q.is_start)||allQ[0]);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load questions."); setLoading(false); });
  }, [level]);

  // Card slide-in on question change
  useEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    el.style.opacity   = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition= "opacity .35s ease, transform .35s ease";
    requestAnimationFrame(() => {
      el.style.opacity   = "1";
      el.style.transform = "translateY(0)";
    });
  }, [currentQuestion]);

  const submitToBackend = async (finalScores, finalReasons) => {
    setSubmitting(true);
    try {
      const res = await API.post("/ml/predict", {
        level, category_scores: finalScores, percentage: parseFloat(percentage)||60,
      });
      const { top_careers, dominant_category } = res.data;
      localStorage.setItem("career_result", JSON.stringify({
        top_careers, dominant_category, reasons: finalReasons,
        level, percentage: parseFloat(percentage)||60,
      }));
      navigate("/result");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  const handleAnswer = (opt) => {
    setSelectedOption(opt.id||opt.option_text);
    setTimeout(() => {
      setSelectedOption(null);
      const updatedScores  = {...scores, [opt.category_tag]:(scores[opt.category_tag]||0)+1};
      const updatedReasons = [...reasons, opt.option_text];
      setScores(updatedScores);
      setReasons(updatedReasons);
      setStepCount(s=>s+1);
      if (opt.next_question_id) {
        const nq = questions.find(q=>q.id===opt.next_question_id);
        if (nq) { setCurrentQuestion(nq); return; }
      }
      const nbo = questions.filter(q=>q.order_index>currentQuestion.order_index).sort((a,b)=>a.order_index-b.order_index)[0];
      if (nbo) { setCurrentQuestion(nbo); return; }
      submitToBackend(updatedScores, updatedReasons);
    }, 280);
  };

  // ── SCREENS ──────────────────────────────────────────────

  if (!loading && !percentageConfirmed) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}.gate{animation:slideUp .5s ease forwards}`}</style>
      <div className="gate bg-white p-10 rounded-3xl shadow-xl w-full max-w-md text-center">
        <div className="text-5xl mb-4" style={{animation:"slideUp .4s ease .1s both"}}>📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Before we start</h2>
        <p className="text-gray-500 mb-1">{LEVEL_NAMES[level]} Career Quiz</p>
        <p className="text-gray-500 mb-8 text-sm">What was your percentage in your last exam?<br/><span className="text-xs text-gray-400">(Helps us suggest colleges and realistic paths)</span></p>
        <input type="number" min="0" max="100" placeholder="e.g. 78"
          value={percentage} onChange={e=>setPercentage(e.target.value)}
          className="w-full border-2 border-gray-200 focus:border-purple-400 outline-none rounded-xl px-4 py-3 text-center text-2xl font-bold mb-2 transition"/>
        <p className="text-xs text-gray-400 mb-6">Enter a number between 0 and 100</p>
        <button onClick={()=>setPercentageConfirmed(true)}
          disabled={!percentage||percentage<0||percentage>100}
          className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-40 transition active:scale-95">
          Start Quiz →
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-500 font-medium">Loading questions...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="text-center"><p className="text-red-500 mb-4">{error}</p>
        <button onClick={()=>window.location.reload()} className="px-6 py-2 bg-purple-600 text-white rounded-lg">Try Again</button>
      </div>
    </div>
  );

  if (submitting) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes bd{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">🤖</div>
        <h2 className="text-xl font-bold text-gray-800 mb-4"><TypingText/></h2>
        <div className="flex justify-center gap-2">
          {[0,150,300].map(d=>(
            <div key={d} style={{width:"10px",height:"10px",borderRadius:"50%",background:"#7c3aed",animation:"bd .7s ease-in-out infinite",animationDelay:`${d}ms`}}/>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-4">Finding the best path for you</p>
      </div>
    </div>
  );

  if (!currentQuestion) return <div className="p-10 text-center text-gray-500">No questions found.</div>;

  const progress = Math.min((stepCount/9)*100, 100);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-6">
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes optIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        .opt{animation:optIn .3s ease forwards;opacity:0}
        .opt:nth-child(1){animation-delay:.05s}.opt:nth-child(2){animation-delay:.12s}
        .opt:nth-child(3){animation-delay:.19s}.opt:nth-child(4){animation-delay:.26s}
      `}</style>

      <div ref={cardRef} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-lg">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">{LEVEL_NAMES[level]} · Question {stepCount+1}</span>
            <span className="text-xs text-purple-600 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}}/>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-6 text-center">Answer honestly — there are no right or wrong answers</p>
        <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{currentQuestion.question_text}</h2>

        <div className="space-y-3">
          {currentQuestion.options.map((opt, i) => (
            <button key={i} onClick={()=>handleAnswer(opt)}
              className={`opt w-full py-3 px-5 rounded-xl border-2 text-left font-medium transition-all duration-200
                ${selectedOption===(opt.id||opt.option_text)
                  ? "border-purple-500 bg-purple-50 scale-[.98]"
                  : "border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-700"
                }`}>
              <span className="text-purple-400 font-bold mr-3 text-sm">{String.fromCharCode(65+i)}.</span>
              {opt.option_text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}