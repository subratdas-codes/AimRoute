import { useNavigate } from "react-router-dom";

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/aimroute",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: "hover:text-blue-400",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/aimroute_official?igsh=cm00eG9jb2lqNXNm",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    color: "hover:text-pink-400",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61573481099139",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: "hover:text-blue-500",
  },
];

const NAV_LINKS = {
  "Explore": [
    { label: "Career Quiz",      path: "/career-path" },
    { label: "After 10th",       path: "/career-path/10th" },
    { label: "After 12th",       path: "/career-path/12th" },
    { label: "After Graduation", path: "/career-path/grad" },
    { label: "After PG",         path: "/career-path/pg" },
  ],
  "Features": [
    { label: "College Finder",       path: "/result" },
    { label: "Career Roadmap",       path: "/roadmap" },
    { label: "Exam Eligibility",     path: "/dashboard" },
    { label: "AI Career Chat",       path: "/career-path" },
    { label: "Services",             path: "/services" },
  ],
  "Account": [
    { label: "Login",       path: "/login" },
    { label: "Sign Up",     path: "/signup" },
    { label: "Dashboard",   path: "/dashboard" },
    { label: "Settings",    path: "/settings" },
  ],
};

export default function Footer() {
  const navigate = useNavigate();
  const year     = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">

      {/* ── Top CTA strip ── */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-extrabold text-white mb-1">
              Still figuring out your career?
            </h3>
            <p className="text-purple-200 text-sm">
              Free · No login needed · Results in 3 minutes
            </p>
          </div>
          <button
            onClick={() => navigate("/career-path")}
            className="bg-white text-purple-700 font-bold px-8 py-3 rounded-full hover:bg-purple-50 transition-colors shadow-lg whitespace-nowrap text-sm">
            Start Free Assessment →
          </button>
        </div>
      </div>

      {/* ── Main footer body ── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="col-span-2">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 mb-4 cursor-pointer group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
              <div>
                <span className="text-white font-extrabold text-lg tracking-tight">Aim</span>
                <span className="text-purple-400 font-extrabold text-lg tracking-tight">Route</span>
                <div className="text-xs text-gray-500 leading-none -mt-0.5 font-medium">AI Career Guidance</div>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              Helping Indian students from 10th to PG find their right career path using AI-powered assessments, real college data, and personalised roadmaps.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  title={s.name}
                  className={`w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 ${s.color} hover:bg-gray-700 transition-all duration-200 hover:scale-110`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-gray-500 hover:text-purple-400 text-sm transition-colors text-left hover:translate-x-1 inline-block transition-transform duration-200">
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-600 text-xs">
            © {year} AimRoute. All rights reserved. Made with ❤️ for Indian students.
          </p>

          <div className="flex items-center gap-6">
            {[
              { label: "Privacy Policy",    path: "/" },
              { label: "Terms of Service",  path: "/" },
              { label: "Contact Us",        path: "/" },
            ].map((item) => (
              <button key={item.label}
                onClick={() => navigate(item.path)}
                className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}