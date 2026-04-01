import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "What skills should I build for my career?",
  "Which exams should I prepare for?",
  "How is the salary growth in my field?",
  "Compare my top 2 career options",
  "What colleges are best for me?",
  "How to bridge my skill gap?",
];

const ChatBot = () => {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [context, setContext]   = useState(null);
  const bottomRef               = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("career_result");
    if (stored) setContext(JSON.parse(stored));
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Send message to BACKEND (not Anthropic directly) ──
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: context || {},
        }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply || "Sorry, I could not process that.",
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Could not connect to backend. Make sure backend is running on port 8000.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKey  = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      {/* ── FLOATING BUBBLE ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-purple-600 text-white rounded-full shadow-2xl
                   flex items-center justify-center text-2xl hover:bg-purple-700 transition-all
                   hover:scale-110 active:scale-95"
        title="Ask AimRoute AI"
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* ── CHAT WINDOW ── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-3xl
                        shadow-2xl border border-purple-100 flex flex-col overflow-hidden"
          style={{ height: "520px" }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-bold text-sm">AimRoute AI</p>
              <p className="text-purple-200 text-xs">
                {context
                  ? `Personalised for ${context.dominant_category} • ${context.level?.toUpperCase()}`
                  : "Career Guidance Assistant"}
              </p>
            </div>
            <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">

            {/* Welcome message */}
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm max-w-[85%]">
                    <p className="text-sm text-gray-700">
                      {context
                        ? `Hi! I'm your AimRoute AI counsellor 👋\n\nI can see you're a ${context.level?.toUpperCase()} student with ${context.percentage}% score interested in ${context.dominant_category}.\n\nAsk me anything about your career path!`
                        : "Hi! I'm AimRoute AI 👋\n\nTake the career quiz first for personalised advice, or ask me any career question!"}
                    </p>
                  </div>
                </div>

                {/* Suggested questions */}
                <div className="space-y-2 pl-9">
                  <p className="text-xs text-gray-400 font-medium">Quick questions:</p>
                  {SUGGESTED_QUESTIONS.slice(0, 4).map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="block w-full text-left text-xs px-3 py-2 bg-purple-50 text-purple-700
                                 border border-purple-200 rounded-xl hover:bg-purple-100 transition">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0
                  ${msg.role === "user" ? "bg-purple-600 text-white" : "bg-purple-100"}`}>
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-white text-gray-700 rounded-tl-none"}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about your career path..."
                rows={1}
                className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-purple-400 max-h-24"
                style={{ minHeight: "42px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-purple-600 text-white rounded-2xl flex items-center justify-center
                           hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                ➤
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">Powered by AimRoute AI</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;