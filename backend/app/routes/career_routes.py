from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.utils.career_pools import CAREER_POOLS, SALARY_RANGES, ROADMAP_STEPS

router = APIRouter(prefix="/careers", tags=["Careers"])

# ── Build flat career lookup from all levels/categories ───────
def build_career_index():
    index = {}
    for level, categories in CAREER_POOLS.items():
        for category, careers in categories.items():
            for c in careers:
                name = c["career"]
                if name not in index:
                    index[name] = {
                        "career":   name,
                        "desc":     c["desc"],
                        "category": category,
                        "levels":   [],
                        "salary":   SALARY_RANGES.get(name, None),
                        "roadmap":  ROADMAP_STEPS.get(level, []),
                    }
                if level not in index[name]["levels"]:
                    index[name]["levels"].append(level)
    return index

CAREER_INDEX = build_career_index()

# ── Extra metadata (duration, exam, growth, skills, job roles) ─
CAREER_META = {
    "B.Tech / B.E (JEE)":                       { "duration":"4 years",      "exam":"JEE Main / Advanced",       "growth":"High",     "job_roles":["Software Engineer","Systems Analyst","Project Manager"], "skills":["Programming","Mathematics","Problem Solving"] },
    "MCA — Master of Computer Applications":     { "duration":"2 years",      "exam":"NIMCET / State CET",        "growth":"High",     "job_roles":["Software Developer","System Admin","Data Analyst"],     "skills":["Programming","DBMS","Networking"] },
    "M.Tech / M.E (GATE)":                      { "duration":"2 years",      "exam":"GATE",                      "growth":"High",     "job_roles":["Research Engineer","PSU Engineer","Faculty"],           "skills":["Advanced Engineering","Research","Technical Writing"] },
    "Software Engineer (Campus/Off-campus)":     { "duration":"0 years",      "exam":"Campus Placement",          "growth":"High",     "job_roles":["Software Developer","SDE","Backend/Frontend Dev"],      "skills":["DSA","System Design","Coding"] },
    "AI / ML Engineer / Researcher":             { "duration":"1-2 years",    "exam":"GATE / Portfolio",          "growth":"Very High","job_roles":["ML Engineer","Data Scientist","AI Researcher"],        "skills":["Python","ML Frameworks","Statistics","Deep Learning"] },
    "Senior Software Engineer (Product Companies)":{"duration":"3-5 yrs exp","exam":"Experience Based",          "growth":"Very High","job_roles":["SDE-2/3","Tech Lead","Staff Engineer"],                 "skills":["System Design","Leadership","Architecture"] },
    "BCA — Bachelor of Computer Applications":   { "duration":"3 years",      "exam":"Merit / Entrance",          "growth":"Medium",   "job_roles":["Junior Developer","IT Support","Web Developer"],        "skills":["Programming","Web Dev","Database"] },
    "Data Science / AI PG Diploma":              { "duration":"1 year",       "exam":"Entrance / Merit",          "growth":"Very High","job_roles":["Data Analyst","ML Engineer","BI Analyst"],             "skills":["Python","Statistics","Machine Learning","SQL"] },
    "GATE Exam → PSU Jobs":                      { "duration":"2-3 yrs prep", "exam":"GATE",                      "growth":"Medium",   "job_roles":["Junior Engineer","Executive Engineer"],                  "skills":["Core Engineering","Aptitude","Technical Subject"] },
    "PhD in CS / AI (IIT / IISc / Abroad)":     { "duration":"4-6 years",    "exam":"GATE / GRE",                "growth":"High",     "job_roles":["Research Scientist","Professor","R&D Lead"],            "skills":["Research","Publications","Advanced AI/CS"] },
    "Scientist at ISRO / DRDO / CDAC":           { "duration":"0 years",      "exam":"GATE / DRDO CEPTAM",        "growth":"Medium",   "job_roles":["Scientist B","Technical Officer"],                       "skills":["Core Subject","Research Aptitude"] },
    "MBA (CAT — IIM)":                           { "duration":"2 years",      "exam":"CAT",                       "growth":"Very High","job_roles":["Manager","Consultant","Product Manager"],              "skills":["Leadership","Strategy","Communication","Analytics"] },
    "CA Foundation":                             { "duration":"3-4 years",    "exam":"CA Foundation/Inter/Final", "growth":"Very High","job_roles":["Chartered Accountant","Tax Consultant","CFO"],         "skills":["Accounting","Taxation","Audit","Finance Law"] },
    "BBA — Bachelor of Business Administration": { "duration":"3 years",      "exam":"Merit / BBA CET",           "growth":"Medium",   "job_roles":["Sales Executive","HR Executive","Marketing Associate"],  "skills":["Communication","Marketing","Management Basics"] },
    "UPSC Civil Services (IAS/IPS/IFS)":         { "duration":"2-3 yrs prep", "exam":"UPSC CSE",                  "growth":"High",     "job_roles":["IAS Officer","IPS Officer","IFS Diplomat"],             "skills":["Current Affairs","Essay Writing","Leadership","Ethics"] },
    "B.Com (Hons)":                              { "duration":"3 years",      "exam":"Merit",                     "growth":"Medium",   "job_roles":["Accountant","Finance Executive","Auditor"],             "skills":["Accounting","Economics","Business Law"] },
    "MBBS (NEET-UG)":                           { "duration":"5.5 years",    "exam":"NEET-UG",                   "growth":"High",     "job_roles":["General Physician","Hospital Doctor","Surgeon"],         "skills":["Biology","Clinical Skills","Patient Care","Anatomy"] },
    "MD / MS (NEET-PG)":                         { "duration":"3 years",      "exam":"NEET-PG",                   "growth":"Very High","job_roles":["Specialist Doctor","Surgeon","Researcher"],            "skills":["Medical Specialisation","Research","Surgery/Medicine"] },
    "B.Sc Nursing":                              { "duration":"4 years",      "exam":"Nursing Entrance",          "growth":"Medium",   "job_roles":["Staff Nurse","ICU Nurse","Nurse Manager"],              "skills":["Patient Care","Clinical Procedures","Empathy"] },
    "DM / MCh — Superspeciality Medical":        { "duration":"3 years",      "exam":"NEET-SS",                   "growth":"Very High","job_roles":["Cardiologist","Neurosurgeon","Oncologist"],            "skills":["Super Speciality","Surgery","Research"] },
    "B.Des — Bachelor of Design (NID/NIFT)":     { "duration":"4 years",      "exam":"NID DAT / NIFT Entrance",   "growth":"High",     "job_roles":["UX Designer","Product Designer","Fashion Designer"],    "skills":["Design Thinking","Sketching","Software Tools","Creativity"] },
    "BA English / Journalism & Mass Communication":{"duration":"3 years",     "exam":"Merit / Entrance",          "growth":"Medium",   "job_roles":["Journalist","Content Writer","PR Executive"],           "skills":["Writing","Communication","Research","Editing"] },
    "NDA — National Defence Academy":            { "duration":"3 years",      "exam":"NDA Written + SSB",         "growth":"High",     "job_roles":["Army Officer","Naval Officer","Air Force Officer"],      "skills":["Physical Fitness","Leadership","Discipline","Aptitude"] },
    "IAS / IPS / IFS (UPSC)":                   { "duration":"2-3 yrs prep", "exam":"UPSC CSE",                  "growth":"High",     "job_roles":["District Collector","SP","IFS Officer"],                "skills":["Current Affairs","Ethics","Leadership","Essay"] },
    "MS Abroad (GRE)":                           { "duration":"1.5-2 years",  "exam":"GRE + IELTS/TOEFL",        "growth":"Very High","job_roles":["Research Engineer","Data Scientist","Software Dev"],   "skills":["GRE Aptitude","English","Core Subject","Research"] },
}

DEFAULT_META = {
    "duration":  "Varies",
    "exam":      "Check official website",
    "growth":    "Medium",
    "job_roles": ["Relevant industry roles"],
    "skills":    ["Domain knowledge", "Communication", "Problem solving"],
}

GROWTH_SCORE = {"Very High": 4, "High": 3, "Medium": 2, "Low": 1}

def enrich(career_name: str) -> dict:
    base = CAREER_INDEX.get(career_name, {})
    meta = CAREER_META.get(career_name, DEFAULT_META)
    return {
        "career":    career_name,
        "desc":      base.get("desc", ""),
        "category":  base.get("category", "general"),
        "levels":    base.get("levels", []),
        "salary":    SALARY_RANGES.get(career_name, None),
        "roadmap":   base.get("roadmap", []),
        "duration":  meta.get("duration",  DEFAULT_META["duration"]),
        "exam":      meta.get("exam",      DEFAULT_META["exam"]),
        "growth":    meta.get("growth",    DEFAULT_META["growth"]),
        "job_roles": meta.get("job_roles", DEFAULT_META["job_roles"]),
        "skills":    meta.get("skills",    DEFAULT_META["skills"]),
    }


@router.get("/list")
def list_careers(
    level:    Optional[str] = None,
    category: Optional[str] = None,
):
    """Return all careers, optionally filtered by level or category."""
    results = []
    seen    = set()
    for lvl, categories in CAREER_POOLS.items():
        if level and lvl != level:
            continue
        for cat, careers in categories.items():
            if category and cat != category:
                continue
            for c in careers:
                if c["career"] not in seen:
                    seen.add(c["career"])
                    results.append({
                        "career":   c["career"],
                        "desc":     c["desc"],
                        "category": cat,
                        "level":    lvl,
                    })
    return {"total": len(results), "careers": results}


@router.get("/compare")
def compare_careers(
    career_a: str = Query(..., description="First career name"),
    career_b: str = Query(..., description="Second career name"),
):
    """Return enriched data for two careers plus per-dimension winner."""
    if career_a not in CAREER_INDEX:
        raise HTTPException(status_code=404, detail=f"Career '{career_a}' not found")
    if career_b not in CAREER_INDEX:
        raise HTTPException(status_code=404, detail=f"Career '{career_b}' not found")

    a = enrich(career_a)
    b = enrich(career_b)

    def salary_num(career: dict) -> float:
        s = career.get("salary")
        if not s: return 0
        raw = s.get("max", "₹0").replace("₹","").replace("L","").replace("+","").replace("Cr","00").strip()
        try: return float(raw)
        except: return 0

    def growth_num(career: dict) -> int:
        return GROWTH_SCORE.get(career.get("growth", "Medium"), 2)

    winners = {
        "salary":    "a" if salary_num(a) >= salary_num(b) else "b",
        "growth":    "a" if growth_num(a) >= growth_num(b) else "b",
        "skills":    "tie",
        "job_roles": "tie",
        "duration":  "tie",
    }

    return {
        "career_a": a,
        "career_b": b,
        "winners":  winners,
    }