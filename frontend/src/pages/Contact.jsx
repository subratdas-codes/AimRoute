// frontend/src/pages/Contact.jsx
import Footer from "../components/Footer";

const METHODS = [
  {
    icon: "📧",
    label: "Email us",
    value: "aimroute.noreply@gmail.com",
    href: "mailto:aimroute.noreply@gmail.com",
    note: "For help, feedback, or any question about your account or data.",
  },
  {
    icon: "🕐",
    label: "Response time",
    value: "Within 7 business days",
    note: "We aim to reply well before then — usually within 24–48 hours on weekdays.",
  },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/aimroute",
    icon: "💼",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/aimroute_official?igsh=cm00eG9jb2lqNXNm",
    icon: "📸",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61573481099139",
    icon: "👍",
  },
];

const FAQS = [
  { q: "I can't log in to my account.", a: "Use the 'Forgot password' link on the login page to reset your password. If the problem persists, email us with your registered email address." },
  { q: "I think my account was banned by mistake.", a: "Email us from the registered email address and we will review your account status and restore access if appropriate." },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <section className="bg-gradient-to-br from-[#4c1d95] via-purple-700 to-[#1e1b4b] text-white">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest text-purple-200 mb-6">
            We'd love to hear from you
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Us</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Have a question, a bug to report, or feedback on your experience? Get in touch.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-2 gap-6">
          {METHODS.map((m) => (
            <div key={m.label} className="bg-white rounded-3xl border border-purple-100 shadow-lg shadow-purple-100/40 p-7">
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="font-bold text-gray-900">{m.label}</h3>
              {m.href ? (
                <a href={m.href} className="text-purple-600 font-semibold text-sm hover:underline">
                  {m.value}
                </a>
              ) : (
                <p className="text-purple-600 font-semibold text-sm">{m.value}</p>
              )}
              <p className="text-gray-500 text-xs mt-2 leading-relaxed">{m.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-3xl border border-purple-100 shadow-lg shadow-purple-100/40 p-7">
          <h3 className="font-bold text-gray-900 mb-4">Follow AimRoute</h3>
          <div className="flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-colors">
                <span>{s.icon}</span> {s.name}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Frequently asked</h3>
          {FAQS.map((f) => (
            <details key={f.q} className="bg-white rounded-3xl border border-purple-100 shadow-md shadow-purple-100/40 p-6 group">
              <summary className="cursor-pointer font-semibold text-gray-900 text-sm list-none flex items-center justify-between">
                {f.q}
                <span className="text-purple-500 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
              </summary>
              <p className="text-gray-600 text-sm mt-3 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}