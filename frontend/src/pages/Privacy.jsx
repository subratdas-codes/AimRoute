// frontend/src/pages/Privacy.jsx
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `We collect the information you provide when you create an account — your name and email address — along with your quiz answers, education level, percentage, and career assessment results. We also store a secure, hashed version of your password (never your plain-text password).`,
  },
  {
    title: "2. How We Use Your Information",
    body: `Your data powers the core AimRoute experience: generating your personalised career matches, recommending colleges and exams, saving your results to your dashboard, and sending you your career report by email. We use your information only to improve and operate the service, and we never sell or rent your personal data to third parties.`,
  },
  {
    title: "3. Data Stored Locally",
    body: `To keep you signed in and to save your progress, we use browser storage (localStorage) for your session token. This token is stored on your device and is deleted when you log out.`,
  },
  {
    title: "4. Email Communication",
    body: `When you register an account, save a result, or request a password reset, we send transactional emails to the address you provided. You will not receive marketing emails unless you explicitly opt in.`,
  },
  {
    title: "5. Third-Party Services",
    body: `We use cloud hosting and database providers (such as Render and a managed MySQL database) to run the service. These providers process your data only as necessary to keep AimRoute running and are bound by their own security standards.`,
  },
  {
    title: "6. Data Security",
    body: `Passwords are stored as cryptographic hashes, and API access uses signed tokens. While we take reasonable technical and organisational measures to protect your information, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "7. Your Rights",
    body: `You may access, update, or delete your account at any time via your account settings. To request deletion of your data or ask any privacy question, contact us at aimroute.noreply@gmail.com and we will respond within 7 business days.`,
  },
  {
    title: "8. Children's Privacy",
    body: `AimRoute is designed for students aged 13 and above. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us with personal data, please contact us and we will delete it.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be reflected on this page with an updated effective date, and where appropriate we will notify you by email.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <section className="bg-gradient-to-br from-[#4c1d95] via-purple-700 to-[#1e1b4b] text-white">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest text-purple-200 mb-6">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            How AimRoute collects, uses, and protects your personal information.
          </p>
          <p className="text-xs text-purple-300 mt-6">Last updated: September 2026</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="bg-white rounded-3xl border border-purple-100 shadow-lg shadow-purple-100/40 p-7">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Questions about your data?</h3>
          <p className="text-purple-100 text-sm mb-4">
            Reach us at any time and we'll be happy to help.
          </p>
          <a href="mailto:aimroute.noreply@gmail.com"
             className="inline-block px-6 py-3 rounded-2xl bg-white text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-colors">
            aimroute.noreply@gmail.com
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}