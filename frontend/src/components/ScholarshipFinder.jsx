// frontend/src/components/ScholarshipFinder.jsx
//
// Usage inside Dashboard.jsx — drop after the college suggestion section:
//   import ScholarshipFinder from "../components/ScholarshipFinder";
//   <ScholarshipFinder />

import { useState, useMemo, useEffect } from "react";
import {
  filterScholarships,
  getPrefillFromResult,
  typeBadgeColor,
  CATEGORY_OPTIONS,
  LEVEL_OPTIONS,
  TYPE_LABELS,
} from "../services/scholarshipService";

// ── ScholarshipCard ───────────────────────────────────────────

function ScholarshipCard({ scholarship: s }) {
  const [expanded, setExpanded] = useState(false);
  const badge = typeBadgeColor(s.type);
  const hasIncomeLimit = s.income_limit_lpa !== 999;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">

      {/* Card header — always visible */}
      <div
        className={`flex items-start justify-between px-4 py-3.5 cursor-pointer transition-colors hover:bg-gray-50 ${
          expanded ? "bg-gray-50" : "bg-white"
        }`}
        onClick={() => setExpanded(o => !o)}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Provider initial avatar */}
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-semibold text-xs flex-shrink-0 mt-0.5">
            {s.provider.charAt(0)}
          </div>

          <div className="min-w-0 flex-1">
            {/* Name + type badge */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-sm font-semibold text-gray-900 leading-snug">
                {s.name}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                {TYPE_LABELS[s.type]}
              </span>
            </div>

            {/* Provider + key facts row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="text-xs text-gray-400">{s.provider}</span>
              <span className="text-xs font-semibold text-green-700">{s.amount}</span>
              {hasIncomeLimit && (
                <span className="text-xs text-amber-600">
                  Income ≤ ₹{s.income_limit_lpa}L/yr
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chevron */}
        <span className={`text-gray-400 text-base ml-2 flex-shrink-0 transition-transform duration-200 mt-0.5 ${
          expanded ? "rotate-90" : ""
        }`}>›</span>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed">{s.description}</p>

          {/* Detail grid */}
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="bg-white rounded-xl border border-gray-100 px-3 py-2.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Amount
              </div>
              <div className="text-sm font-semibold text-green-700">{s.amount}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 px-3 py-2.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Deadline
              </div>
              <div className="text-sm font-medium text-gray-800">{s.deadline}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 px-3 py-2.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                Income limit
              </div>
              <div className="text-sm font-medium text-gray-800">
                {hasIncomeLimit
                  ? `≤ ₹${s.income_limit_lpa}L / year`
                  : "No limit"}
              </div>
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            {s.level.map(l => (
              <span key={l} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                {l === "12th" ? "12th grade" : l === "grad" ? "Graduation" : "PG"}
              </span>
            ))}
            {s.category.map(c => (
              <span key={c} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                {c}
              </span>
            ))}
            {s.states[0] !== "All" && s.states.map(st => (
              <span key={st} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                {st} only
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Last verified: {s.last_verified}
            </span>
            <a
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              Apply now ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ── ScholarshipFinder (main export) ──────────────────────────

export default function ScholarshipFinder() {
  const [level,     setLevel]     = useState("");
  const [category,  setCategory]  = useState("All");
  const [career,    setCareer]    = useState("All");
  const [incomeLpa, setIncomeLpa] = useState("");
  const [state,     setState]     = useState("All");
  const [showAll,   setShowAll]   = useState(false);

  // Pre-fill level + career from quiz result in localStorage
  useEffect(() => {
    const prefill = getPrefillFromResult();
    if (prefill.level)  setLevel(prefill.level);
    if (prefill.career) setCareer(prefill.career);
  }, []);

  // Filter scholarships — memoised on all 5 filter values
  const results = useMemo(
    () => filterScholarships({ level, category, career, incomeLpa, state }),
    [level, category, career, incomeLpa, state]
  );

  // Show first 5 by default, reveal rest on "Show more"
  const INITIAL_COUNT = 5;
  const displayed  = showAll ? results : results.slice(0, INITIAL_COUNT);
  const hiddenCount = results.length - INITIAL_COUNT;

  const hasFiltered = level !== "";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 20 }}>🎓</span>
          <div>
            <div className="text-sm font-semibold text-gray-800">Scholarship finder</div>
            <div className="text-xs text-gray-400">
              30+ scholarships — government, state, PSU & private foundations
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

          {/* Level */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Education level <span className="text-purple-500">*</span>
            </label>
            <select
              value={level}
              onChange={e => { setLevel(e.target.value); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="">Select level</option>
              {LEVEL_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={e => { setCategory(e.target.value); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              {CATEGORY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Career */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Career interest
            </label>
            <select
              value={career}
              onChange={e => { setCareer(e.target.value); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="All">All careers</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Business">Business</option>
              <option value="Creative">Creative / Design</option>
              <option value="Science">Science</option>
            </select>
          </div>

          {/* Annual income */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Annual family income (LPA)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              step={0.5}
              placeholder="e.g. 2.5"
              value={incomeLpa}
              onChange={e => { setIncomeLpa(e.target.value); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            />
          </div>

          {/* State */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              State (for state-specific scholarships)
            </label>
            <select
              value={state}
              onChange={e => { setState(e.target.value); setShowAll(false); }}
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
            >
              <option value="All">All India (+ state-specific)</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className="px-6 py-5">

        {!hasFiltered ? (
          /* Empty state — no level selected */
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-3xl mb-3">🏆</p>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Select your education level to find scholarships
            </p>
            <p className="text-xs text-gray-400">
              We'll match you with government, state & private scholarships
            </p>
          </div>
        ) : results.length === 0 ? (
          /* No matches */
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-2xl mb-3">🔍</p>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              No scholarships match your current filters
            </p>
            <p className="text-xs text-gray-400">
              Try broadening your category, career, or income limit
            </p>
          </div>
        ) : (
          <>
            {/* Result summary bar */}
            <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">
                  {results.length} scholarship{results.length !== 1 ? "s" : ""} found
                </span>
                {incomeLpa === "" && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full font-medium">
                    ⚠️ Enter income for precise results
                  </span>
                )}
              </div>
              {/* Type legend pills */}
              <div className="flex gap-1.5 flex-wrap">
                {["government","state","psu","private"].map(t => {
                  const b = typeBadgeColor(t);
                  const count = results.filter(s => s.type === t).length;
                  if (!count) return null;
                  return (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.bg} ${b.text}`}>
                      {TYPE_LABELS[t]} ({count})
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2">
              {displayed.map(s => (
                <ScholarshipCard key={s.id} scholarship={s} />
              ))}
            </div>

            {/* Show more / less */}
            {results.length > INITIAL_COUNT && (
              <button
                onClick={() => setShowAll(o => !o)}
                className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 py-2.5 border border-dashed border-gray-200 rounded-xl transition-colors hover:border-gray-300"
              >
                {showAll
                  ? "Show fewer ↑"
                  : `Show ${hiddenCount} more scholarship${hiddenCount !== 1 ? "s" : ""} ↓`}
              </button>
            )}
          </>
        )}

        {/* Disclaimer */}
        <p className="mt-4 text-xs text-gray-400 text-center">
          Scholarship details verified Jan 2025. Always check official websites for current deadlines.
        </p>
      </div>
    </div>
  );
}