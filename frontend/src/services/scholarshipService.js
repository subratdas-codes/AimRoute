import SCHOLARSHIPS from "../../../mlmodel/scholarships.json";

// ── Constants ─────────────────────────────────────────────────

export const CATEGORY_OPTIONS = ["All", "General", "OBC", "SC", "ST", "EWS"];

export const LEVEL_OPTIONS = [
  { value: "12th", label: "12th grade" },
  { value: "grad", label: "Graduation" },
  { value: "pg",   label: "Post graduation" },
];

export const TYPE_LABELS = {
  government: "Government",
  state:      "State govt.",
  private:    "Private / NGO",
  psu:        "PSU / Corporate",
};

// Maps quiz dominant_category → scholarship careers array value
export const CAREER_TAG_MAP = {
  Technology: "Technology",
  Healthcare:  "Healthcare",
  Business:    "Business",
  Creative:    "Creative",
  Science:     "Science",
};

// Maps quiz level → scholarship level value
export const QUIZ_LEVEL_MAP = {
  "10th": "12th",   // 10th students are heading into 12th-level scholarships
  "12th": "12th",
  "grad": "grad",
  "pg":   "pg",
};



export function filterScholarships({ level, category, career, incomeLpa }) {
  if (!level) return [];

  const income = incomeLpa !== "" && !isNaN(Number(incomeLpa))
    ? Number(incomeLpa)
    : null;

  return SCHOLARSHIPS
    .filter(s => {
      // 1. Level filter
      if (!s.level.includes(level)) return false;

      // 2. Category filter (skip if user selected "All")
      if (category && category !== "All") {
        if (!s.category.includes("All") && !s.category.includes(category)) {
          return false;
        }
      }

      // 3. Career filter (skip if user selected "All" or scholarship is open to all)
      if (career && career !== "All") {
        if (!s.careers.includes("All") && !s.careers.includes(career)) {
          return false;
        }
      }

      // 4. Income filter — only apply if user entered a value
      //    income_limit_lpa: 999 means no income restriction
      if (income !== null && s.income_limit_lpa !== 999) {
        if (income > s.income_limit_lpa) return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort order: government → state → psu → private
      const typeOrder = { government: 0, state: 1, psu: 2, private: 3 };
      const tDiff = (typeOrder[a.type] ?? 4) - (typeOrder[b.type] ?? 4);
      if (tDiff !== 0) return tDiff;
      // Within same type: sort by income limit ascending (more accessible first)
      return a.income_limit_lpa - b.income_limit_lpa;
    });
}

// ── Pre-fill helper ────────────────────────────────────────────
// Reads career_result from localStorage and returns prefill values
// for the ScholarshipFinder form.

export function getPrefillFromResult() {
  try {
    const result = JSON.parse(localStorage.getItem("career_result") || "{}");
    return {
      level:    QUIZ_LEVEL_MAP[result.level]    || "",
      career:   CAREER_TAG_MAP[result.dominant_category] || "All",
      incomeLpa: "",   // user must always enter income themselves
    };
  } catch {
    return { level: "", career: "All", incomeLpa: "" };
  }
}

// ── Type badge color helper ────────────────────────────────────
export function typeBadgeColor(type) {
  return {
    government: { bg: "bg-green-100",  text: "text-green-700"  },
    state:      { bg: "bg-blue-100",   text: "text-blue-700"   },
    psu:        { bg: "bg-amber-100",  text: "text-amber-700"  },
    private:    { bg: "bg-purple-100", text: "text-purple-700" },
  }[type] || { bg: "bg-gray-100", text: "text-gray-600" };
}