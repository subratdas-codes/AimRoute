// frontend/src/pages/Terms.jsx
import Footer from "../components/Footer";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using AimRoute (the "Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use the Service.`,
  },
  {
    title: "2. Description of the Service",
    body: `AimRoute provides AI-assisted career guidance for Indian students, including a self-assessment quiz, career matching, college and exam suggestions, and career roadmaps. The Service is provided for informational and educational purposes only.`,
  },
  {
    title: "3. Accounts",
    body: `Creating an account is optional and only required to save quiz results and access your dashboard. You are responsible for keeping your login credentials confidential and for all activity under your account. You must provide accurate information and must not create an account using someone else's identity.`,
  },
  {
    title: "4. Acceptable Use",
    body: `You agree not to misuse the Service, attempt to gain unauthorised access, interfere with its operation, scrape data at unreasonable volume, or use it for any unlawful purpose. We reserve the right to suspend or permanently remove accounts that violate these terms or disrupt other users.`,
  },
  {
    title: "5. Not Professional Advice",
    body: `Career suggestions, salary ranges, college cutoffs, and roadmaps shown by AimRoute are data-driven estimates intended to help you explore options. They are not a substitute for advice from career counsellors, academic institutions, or recruitment professionals. You make all final decisions at your own discretion.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content, designs, logos, question banks, and software on AimRoute are the property of AimRoute or its licensors and are protected by applicable law. You may use the Service for personal, non-commercial purposes only.`,
  },
  {
    title: "7. Disclaimer of Warranties",
    body: `The Service is provided "as is" and "as available" without warranties of any kind, whether express or implied, including fitness for a particular purpose. While we work hard to keep college and exam data accurate, we do not guarantee that it is complete, current, or error-free.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `To the maximum extent permitted by law, AimRoute and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including career or academic decisions made based on our suggestions.`,
  },
  {
    title: "9. Termination",
    body: `You may stop using the Service at any time. We may suspend or terminate access to your account if you violate these Terms. You may request account deletion by contacting us at aimroute.noreply@gmail.com.`,
  },
  {
    title: "10. Changes to These Terms",
    body: `We may revise these Terms from time to time. Continued use of the Service after changes take effect means you accept the updated Terms. The latest version will always be available on this page.`,
  },
  {
    title: "11. Contact",
    body: `For any questions about these Terms, contact us at aimroute.noreply@gmail.com.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <section className="bg-gradient-to-br from-[#4c1d95] via-purple-700 to-[#1e1b4b] text-white">
        <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs uppercase tracking-widest text-purple-200 mb-6">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            The rules and guidelines that govern your use of AimRoute.
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
          <h3 className="text-xl font-bold mb-2">Have a question about these terms?</h3>
          <p className="text-purple-100 text-sm mb-4">
            We're happy to clarify anything.
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