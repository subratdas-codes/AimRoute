# backend/seed.py
# Complete question tree with deep branching for all 4 levels
# Run: python seed.py

from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models.question_model import Question, QuestionOption
from app.models import user_model, result_model, question_model
from app.models.college_model import College

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ─────────────────────────────────────────────────────────────
# QUESTION TREE OVERVIEW
# ─────────────────────────────────────────────────────────────
#
# 10TH LEVEL (IDs 1–19)
#   Q1 (start) → branch by interest
#   → Technology  → Q2 → Q3 (coding) or Q4 (engineering)  → Q18 → Q19 → submit
#   → Healthcare  → Q5 → Q6 (medical) or Q7 (paramedical)  → Q18 → Q19 → submit
#   → Business    → Q8 → Q9 (finance) or Q10 (management) → Q18 → Q19 → submit
#   → Creative    → Q11 → Q12 (design) or Q13 (perform)   → Q18 → Q19 → submit
#
# 12TH LEVEL (IDs 20–44)
#   Q20 (start) → branch by stream
#   → Science PCM → Q21 → Q22 (JEE) or Q23 (B.Sc)        → Q43 → Q44 → submit
#   → Science PCB → Q24 → Q25 (NEET) or Q26 (allied)     → Q43 → Q44 → submit
#   → Commerce    → Q27 → Q28 (CA/CFA) or Q29 (BBA/BCom) → Q43 → Q44 → submit
#   → Arts        → Q30 → Q31 (law) or Q32 (media/design) → Q43 → Q44 → submit
#
# GRADUATION LEVEL (IDs 50–79)
#   Q50 (start) → branch by graduation degree
#   → Engineering → Q51 → Q52 (job) or Q53 (PG/research)  → Q78 → Q79 → submit
#   → BCA/B.Sc CS → Q54 → Q55 (job) or Q56 (MCA/M.Sc)    → Q78 → Q79 → submit
#   → BBA/BCom    → Q57 → Q58 (MBA) or Q59 (CA/corporate) → Q78 → Q79 → submit
#   → BA/B.Sc     → Q60 → Q61 (UPSC) or Q62 (teaching)   → Q78 → Q79 → submit
#   → LLB         → Q63 → Q64 (litigation) or Q65 (corp law) → Q78 → Q79 → submit
#   → MBBS/Medical→ Q66 → Q67 (PG NEET) or Q68 (research) → Q78 → Q79 → submit
#
# POST GRADUATION (IDs 80–99)
#   Q80 (start) → branch by PG specialisation
#   → M.Tech/MCA  → Q81 → Q82 (industry) or Q83 (PhD)    → Q98 → Q99 → submit
#   → MBA         → Q84 → Q85 (finance) or Q86 (marketing/HR) → Q98 → Q99 → submit
#   → M.Sc        → Q87 → Q88 (research) or Q89 (industry) → Q98 → Q99 → submit
#   → MA/LLM/other→ Q90 → Q91 (govt/UPSC) or Q92 (academic) → Q98 → Q99 → submit
#
# ─────────────────────────────────────────────────────────────

def seed_questions():
    db.query(QuestionOption).delete()
    db.query(Question).delete()
    db.commit()

    questions_data = [

        # ══════════════════════════════════════════════════════
        # 10TH LEVEL  (IDs 1–19)
        # ══════════════════════════════════════════════════════

        # Q1 — START — broad interest
        {
            "id": 1, "level": "10th", "order_index": 1, "is_start": True,
            "question_text": "Your school is hosting multiple clubs. Which ONE would you join?",
            "options": [
                {"text": "🧪 Science & Robotics club",   "tag": "Technology", "next_id": 2},
                {"text": "🩺 Health & Nature club",       "tag": "Healthcare", "next_id": 5},
                {"text": "💼 Business & Finance club",    "tag": "Business",   "next_id": 8},
                {"text": "🎨 Arts & Design club",         "tag": "Creative",   "next_id": 11},
            ]
        },

        # ── TECHNOLOGY BRANCH ──────────────────────────────────
        {
            "id": 2, "level": "10th", "order_index": 2, "is_start": False,
            "question_text": "In tech, what excites you more?",
            "options": [
                {"text": "Writing code and building apps",       "tag": "Technology", "next_id": 3},
                {"text": "Building machines and structures",     "tag": "Technology", "next_id": 4},
                {"text": "Understanding how computers work",     "tag": "Technology", "next_id": 3},
                {"text": "Physics, electricity and circuits",    "tag": "Technology", "next_id": 4},
            ]
        },
        {
            "id": 3, "level": "10th", "order_index": 3, "is_start": False,
            "question_text": "In computer science, what sounds most fun?",
            "options": [
                {"text": "Making websites and mobile apps",     "tag": "Technology", "next_id": 18},
                {"text": "Artificial intelligence and data",    "tag": "Technology", "next_id": 18},
                {"text": "Game development",                    "tag": "Technology", "next_id": 18},
                {"text": "Cybersecurity and ethical hacking",   "tag": "Technology", "next_id": 18},
            ]
        },
        {
            "id": 4, "level": "10th", "order_index": 4, "is_start": False,
            "question_text": "Which engineering field sounds most exciting to you?",
            "options": [
                {"text": "Civil — roads, bridges, buildings",   "tag": "Technology", "next_id": 18},
                {"text": "Mechanical — engines and machines",   "tag": "Technology", "next_id": 18},
                {"text": "Electrical — power and electronics",  "tag": "Technology", "next_id": 18},
                {"text": "Aerospace — aircraft and rockets",    "tag": "Technology", "next_id": 18},
            ]
        },

        # ── HEALTHCARE BRANCH ──────────────────────────────────
        {
            "id": 5, "level": "10th", "order_index": 5, "is_start": False,
            "question_text": "In healthcare, where do you see yourself?",
            "options": [
                {"text": "Treating patients as a doctor",        "tag": "Healthcare", "next_id": 6},
                {"text": "Supporting patients (nurse/therapist)","tag": "Healthcare", "next_id": 7},
                {"text": "Research and finding cures",           "tag": "Healthcare", "next_id": 6},
                {"text": "Mental health and counselling",        "tag": "Healthcare", "next_id": 7},
            ]
        },
        {
            "id": 6, "level": "10th", "order_index": 6, "is_start": False,
            "question_text": "Medical path — which area of medicine interests you?",
            "options": [
                {"text": "General medicine / surgery (MBBS)",    "tag": "Healthcare", "next_id": 18},
                {"text": "Dentistry (BDS)",                      "tag": "Healthcare", "next_id": 18},
                {"text": "Veterinary science",                   "tag": "Healthcare", "next_id": 18},
                {"text": "Biomedical research",                  "tag": "Healthcare", "next_id": 18},
            ]
        },
        {
            "id": 7, "level": "10th", "order_index": 7, "is_start": False,
            "question_text": "Allied health — which role suits you?",
            "options": [
                {"text": "Nursing or midwifery",                 "tag": "Healthcare", "next_id": 18},
                {"text": "Physiotherapy or occupational therapy","tag": "Healthcare", "next_id": 18},
                {"text": "Psychology and counselling",           "tag": "Healthcare", "next_id": 18},
                {"text": "Pharmacy",                             "tag": "Healthcare", "next_id": 18},
            ]
        },

        # ── BUSINESS BRANCH ────────────────────────────────────
        {
            "id": 8, "level": "10th", "order_index": 8, "is_start": False,
            "question_text": "In business, what draws you most?",
            "options": [
                {"text": "Numbers, finance and investments",     "tag": "Business", "next_id": 9},
                {"text": "Leading a team and making decisions",  "tag": "Business", "next_id": 10},
                {"text": "Selling, marketing and branding",      "tag": "Business", "next_id": 10},
                {"text": "Starting my own business",             "tag": "Business", "next_id": 9},
            ]
        },
        {
            "id": 9, "level": "10th", "order_index": 9, "is_start": False,
            "question_text": "Finance path — what sounds most interesting?",
            "options": [
                {"text": "Chartered Accountancy (CA)",           "tag": "Business", "next_id": 18},
                {"text": "Stock market and investments",         "tag": "Business", "next_id": 18},
                {"text": "Banking and financial services",       "tag": "Business", "next_id": 18},
                {"text": "Economics and policy",                 "tag": "Business", "next_id": 18},
            ]
        },
        {
            "id": 10, "level": "10th", "order_index": 10, "is_start": False,
            "question_text": "Management path — which area appeals to you?",
            "options": [
                {"text": "Marketing and advertising",            "tag": "Business", "next_id": 18},
                {"text": "Human resources and people management","tag": "Business", "next_id": 18},
                {"text": "Supply chain and operations",          "tag": "Business", "next_id": 18},
                {"text": "Entrepreneurship and startups",        "tag": "Business", "next_id": 18},
            ]
        },

        # ── CREATIVE BRANCH ────────────────────────────────────
        {
            "id": 11, "level": "10th", "order_index": 11, "is_start": False,
            "question_text": "In creative fields, what do you enjoy most?",
            "options": [
                {"text": "Drawing, designing and visual arts",   "tag": "Creative", "next_id": 12},
                {"text": "Acting, music or dance",               "tag": "Creative", "next_id": 13},
                {"text": "Writing stories, scripts or content",  "tag": "Creative", "next_id": 13},
                {"text": "Fashion, interiors or architecture",   "tag": "Creative", "next_id": 12},
            ]
        },
        {
            "id": 12, "level": "10th", "order_index": 12, "is_start": False,
            "question_text": "Visual/design path — what excites you?",
            "options": [
                {"text": "Graphic design and illustration",      "tag": "Creative", "next_id": 18},
                {"text": "Fashion design",                       "tag": "Creative", "next_id": 18},
                {"text": "Interior and space design",            "tag": "Creative", "next_id": 18},
                {"text": "Architecture (B.Arch)",                "tag": "Creative", "next_id": 18},
            ]
        },
        {
            "id": 13, "level": "10th", "order_index": 13, "is_start": False,
            "question_text": "Performance/writing path — which suits you?",
            "options": [
                {"text": "Journalism and content writing",       "tag": "Creative", "next_id": 18},
                {"text": "Film making and direction",            "tag": "Creative", "next_id": 18},
                {"text": "Music production and performance",     "tag": "Creative", "next_id": 18},
                {"text": "Theatre and acting",                   "tag": "Creative", "next_id": 18},
            ]
        },

        # ── SHARED CLOSING QUESTIONS (all 10th branches end here) ──
        {
            "id": 18, "level": "10th", "order_index": 18, "is_start": False,
            "question_text": "How do you prefer to work day-to-day?",
            "options": [
                {"text": "Independently — deep focused work",   "tag": "Technology", "next_id": 19},
                {"text": "With a team — collaboration",         "tag": "Business",   "next_id": 19},
                {"text": "With people — helping and guiding",   "tag": "Healthcare", "next_id": 19},
                {"text": "Freely — creative expression",        "tag": "Creative",   "next_id": 19},
            ]
        },
        {
            "id": 19, "level": "10th", "order_index": 19, "is_start": False,
            "question_text": "What kind of future excites you most?",
            "options": [
                {"text": "High-paying tech career",             "tag": "Technology", "next_id": None},
                {"text": "Making a social impact",              "tag": "Healthcare", "next_id": None},
                {"text": "Running my own business",             "tag": "Business",   "next_id": None},
                {"text": "Fame in a creative field",            "tag": "Creative",   "next_id": None},
            ]
        },


        # ══════════════════════════════════════════════════════
        # 12TH LEVEL  (IDs 20–44)
        # ══════════════════════════════════════════════════════

        # Q20 — START — stream selection
        {
            "id": 20, "level": "12th", "order_index": 1, "is_start": True,
            "question_text": "Which stream did you study in 12th grade?",
            "options": [
                {"text": "🔬 Science — PCM (Physics, Chemistry, Maths)", "tag": "Technology", "next_id": 21},
                {"text": "🧬 Science — PCB (Physics, Chemistry, Biology)","tag": "Healthcare", "next_id": 24},
                {"text": "📈 Commerce",                                   "tag": "Business",   "next_id": 27},
                {"text": "🎭 Arts / Humanities",                          "tag": "Creative",   "next_id": 30},
            ]
        },

        # ── PCM BRANCH ─────────────────────────────────────────
        {
            "id": 21, "level": "12th", "order_index": 2, "is_start": False,
            "question_text": "PCM student — what is your main goal after 12th?",
            "options": [
                {"text": "B.Tech through JEE (engineering colleges)",  "tag": "Technology", "next_id": 22},
                {"text": "B.Sc in Maths, Physics or Statistics",       "tag": "Technology", "next_id": 23},
                {"text": "BCA or B.Sc Computer Science",                "tag": "Technology", "next_id": 23},
                {"text": "Architecture — B.Arch (JEE/NATA)",           "tag": "Creative",   "next_id": 43},
            ]
        },
        {
            "id": 22, "level": "12th", "order_index": 3, "is_start": False,
            "question_text": "B.Tech — which branch interests you most?",
            "options": [
                {"text": "Computer Science / IT",                       "tag": "Technology", "next_id": 43},
                {"text": "Electronics & Communication (ECE)",           "tag": "Technology", "next_id": 43},
                {"text": "Mechanical Engineering",                      "tag": "Technology", "next_id": 43},
                {"text": "Civil / Electrical Engineering",              "tag": "Technology", "next_id": 43},
            ]
        },
        {
            "id": 23, "level": "12th", "order_index": 4, "is_start": False,
            "question_text": "B.Sc / BCA path — what do you want to do after graduation?",
            "options": [
                {"text": "Get a tech job directly",                     "tag": "Technology", "next_id": 43},
                {"text": "Do M.Sc or MCA for higher studies",           "tag": "Technology", "next_id": 43},
                {"text": "Research and academia",                       "tag": "Technology", "next_id": 43},
                {"text": "MBA after B.Sc",                              "tag": "Business",   "next_id": 43},
            ]
        },

        # ── PCB BRANCH ─────────────────────────────────────────
        {
            "id": 24, "level": "12th", "order_index": 5, "is_start": False,
            "question_text": "PCB student — what is your goal after 12th?",
            "options": [
                {"text": "MBBS through NEET (medical college)",         "tag": "Healthcare", "next_id": 25},
                {"text": "BDS — Dentistry",                             "tag": "Healthcare", "next_id": 26},
                {"text": "Pharmacy — B.Pharm",                         "tag": "Healthcare", "next_id": 26},
                {"text": "Nursing, Physiotherapy or Allied Health",     "tag": "Healthcare", "next_id": 26},
            ]
        },
        {
            "id": 25, "level": "12th", "order_index": 6, "is_start": False,
            "question_text": "MBBS path — what specialisation interests you long-term?",
            "options": [
                {"text": "Surgery or General Medicine",                 "tag": "Healthcare", "next_id": 43},
                {"text": "Paediatrics or Gynaecology",                  "tag": "Healthcare", "next_id": 43},
                {"text": "Radiology or Pathology",                      "tag": "Healthcare", "next_id": 43},
                {"text": "Psychiatry or Neurology",                     "tag": "Healthcare", "next_id": 43},
            ]
        },
        {
            "id": 26, "level": "12th", "order_index": 7, "is_start": False,
            "question_text": "Allied health path — what is your preferred role?",
            "options": [
                {"text": "Working directly with patients",              "tag": "Healthcare", "next_id": 43},
                {"text": "Lab and research work",                       "tag": "Healthcare", "next_id": 43},
                {"text": "Hospital administration and management",      "tag": "Business",   "next_id": 43},
                {"text": "Public health and community work",            "tag": "Healthcare", "next_id": 43},
            ]
        },

        # ── COMMERCE BRANCH ────────────────────────────────────
        {
            "id": 27, "level": "12th", "order_index": 8, "is_start": False,
            "question_text": "Commerce student — which path interests you?",
            "options": [
                {"text": "CA (Chartered Accountancy) — ICAI",          "tag": "Business", "next_id": 28},
                {"text": "BBA → MBA (management route)",                "tag": "Business", "next_id": 29},
                {"text": "B.Com → finance or banking career",           "tag": "Business", "next_id": 29},
                {"text": "Economics Honours → research/policy",         "tag": "Business", "next_id": 28},
            ]
        },
        {
            "id": 28, "level": "12th", "order_index": 9, "is_start": False,
            "question_text": "CA / Economics path — where do you see yourself?",
            "options": [
                {"text": "Big 4 accounting firm (Deloitte, PwC, EY, KPMG)", "tag": "Business", "next_id": 43},
                {"text": "Investment banking or stock market",              "tag": "Business", "next_id": 43},
                {"text": "Government or RBI / SEBI roles",                  "tag": "Business", "next_id": 43},
                {"text": "Own CA practice or consultancy",                  "tag": "Business", "next_id": 43},
            ]
        },
        {
            "id": 29, "level": "12th", "order_index": 10, "is_start": False,
            "question_text": "BBA / B.Com path — what area appeals most?",
            "options": [
                {"text": "Marketing and digital marketing",             "tag": "Business", "next_id": 43},
                {"text": "Human resources and organisational behaviour","tag": "Business", "next_id": 43},
                {"text": "Finance and banking",                         "tag": "Business", "next_id": 43},
                {"text": "Entrepreneurship and startup ecosystem",      "tag": "Business", "next_id": 43},
            ]
        },

        # ── ARTS BRANCH ────────────────────────────────────────
        {
            "id": 30, "level": "12th", "order_index": 11, "is_start": False,
            "question_text": "Arts / Humanities student — what path interests you?",
            "options": [
                {"text": "⚖️ Law — BA LLB (5 yr integrated)",          "tag": "Business",  "next_id": 31},
                {"text": "📰 Journalism, Media and Mass Communication", "tag": "Creative",  "next_id": 32},
                {"text": "🧠 Psychology, Sociology or Social Work",     "tag": "Healthcare","next_id": 32},
                {"text": "🎨 Fine Arts, Design or Architecture",        "tag": "Creative",  "next_id": 32},
            ]
        },
        {
            "id": 31, "level": "12th", "order_index": 12, "is_start": False,
            "question_text": "Law path — which area of law interests you?",
            "options": [
                {"text": "Criminal law and litigation",                 "tag": "Business", "next_id": 43},
                {"text": "Corporate law and contracts",                 "tag": "Business", "next_id": 43},
                {"text": "Constitutional law and public policy",        "tag": "Business", "next_id": 43},
                {"text": "Cyber law and intellectual property",         "tag": "Technology","next_id": 43},
            ]
        },
        {
            "id": 32, "level": "12th", "order_index": 13, "is_start": False,
            "question_text": "Media / Social Sciences path — which role suits you?",
            "options": [
                {"text": "TV, film or digital content creation",        "tag": "Creative",  "next_id": 43},
                {"text": "Print or investigative journalism",           "tag": "Creative",  "next_id": 43},
                {"text": "Counselling, social work or NGO work",        "tag": "Healthcare","next_id": 43},
                {"text": "Graphic design, UX or animation",             "tag": "Creative",  "next_id": 43},
            ]
        },

        # ── SHARED CLOSING — 12TH ──────────────────────────────
        {
            "id": 43, "level": "12th", "order_index": 43, "is_start": False,
            "question_text": "How important is a government / stable job to you?",
            "options": [
                {"text": "Very important — I want job security",        "tag": "Business",   "next_id": 44},
                {"text": "Somewhat — open to both govt and private",    "tag": "Technology", "next_id": 44},
                {"text": "Not important — private/startup is fine",     "tag": "Technology", "next_id": 44},
                {"text": "I want to run my own venture",                "tag": "Business",   "next_id": 44},
            ]
        },
        {
            "id": 44, "level": "12th", "order_index": 44, "is_start": False,
            "question_text": "What matters most to you in your career?",
            "options": [
                {"text": "High salary and financial growth",            "tag": "Business",   "next_id": None},
                {"text": "Social impact and helping others",            "tag": "Healthcare", "next_id": None},
                {"text": "Creative freedom and self-expression",        "tag": "Creative",   "next_id": None},
                {"text": "Innovation and solving hard problems",        "tag": "Technology", "next_id": None},
            ]
        },


        # ══════════════════════════════════════════════════════
        # GRADUATION LEVEL  (IDs 50–79)
        # ══════════════════════════════════════════════════════

        # Q50 — START — degree selection
        {
            "id": 50, "level": "grad", "order_index": 1, "is_start": True,
            "question_text": "What is your graduation degree?",
            "options": [
                {"text": "🔧 B.Tech / B.E (Engineering)",               "tag": "Technology", "next_id": 51},
                {"text": "💻 BCA / B.Sc Computer Science",              "tag": "Technology", "next_id": 54},
                {"text": "📊 BBA / B.Com / Economics",                  "tag": "Business",   "next_id": 57},
                {"text": "⚖️ LLB / BA LLB (Law)",                      "tag": "Business",   "next_id": 63},
                {"text": "🩺 MBBS / BDS / B.Pharm (Medical)",          "tag": "Healthcare", "next_id": 66},
                {"text": "📚 BA / B.Sc / Other",                        "tag": "general",    "next_id": 60},
            ]
        },

        # ── ENGINEERING BRANCH ─────────────────────────────────
        {
            "id": 51, "level": "grad", "order_index": 2, "is_start": False,
            "question_text": "Engineering graduate — what is your next goal?",
            "options": [
                {"text": "Software / tech job (placement)",             "tag": "Technology", "next_id": 52},
                {"text": "M.Tech / MS for deep technical expertise",    "tag": "Technology", "next_id": 53},
                {"text": "MBA for a management/product role",           "tag": "Business",   "next_id": 78},
                {"text": "UPSC / Government exam (IES, GATE PSU)",      "tag": "general",    "next_id": 78},
            ]
        },
        {
            "id": 52, "level": "grad", "order_index": 3, "is_start": False,
            "question_text": "Tech job — which role interests you?",
            "options": [
                {"text": "Software Development (SDE)",                  "tag": "Technology", "next_id": 78},
                {"text": "Data Science / ML / AI",                      "tag": "Technology", "next_id": 78},
                {"text": "DevOps / Cloud / Infrastructure",             "tag": "Technology", "next_id": 78},
                {"text": "Product Management",                          "tag": "Business",   "next_id": 78},
            ]
        },
        {
            "id": 53, "level": "grad", "order_index": 4, "is_start": False,
            "question_text": "Higher studies — which direction?",
            "options": [
                {"text": "M.Tech from IIT / NIT (GATE)",                "tag": "Technology", "next_id": 78},
                {"text": "MS Abroad (GRE — USA/Canada/Germany)",        "tag": "Technology", "next_id": 78},
                {"text": "PhD and academic research",                   "tag": "Technology", "next_id": 78},
                {"text": "M.Sc in Data Science / AI (specialised)",     "tag": "Technology", "next_id": 78},
            ]
        },

        # ── BCA / B.SC CS BRANCH ───────────────────────────────
        {
            "id": 54, "level": "grad", "order_index": 5, "is_start": False,
            "question_text": "BCA / B.Sc CS — what is your next step?",
            "options": [
                {"text": "Get a software job (fresher role)",           "tag": "Technology", "next_id": 55},
                {"text": "MCA or M.Sc CS for higher qualification",     "tag": "Technology", "next_id": 56},
                {"text": "MBA to move into management",                 "tag": "Business",   "next_id": 78},
                {"text": "Start freelancing or a tech startup",         "tag": "Business",   "next_id": 78},
            ]
        },
        {
            "id": 55, "level": "grad", "order_index": 6, "is_start": False,
            "question_text": "Which tech role are you targeting?",
            "options": [
                {"text": "Frontend / Backend / Full Stack Developer",   "tag": "Technology", "next_id": 78},
                {"text": "Data Analyst / Business Analyst",             "tag": "Business",   "next_id": 78},
                {"text": "QA / Testing Engineer",                       "tag": "Technology", "next_id": 78},
                {"text": "UI/UX Designer",                              "tag": "Creative",   "next_id": 78},
            ]
        },
        {
            "id": 56, "level": "grad", "order_index": 7, "is_start": False,
            "question_text": "MCA / M.Sc path — what after that?",
            "options": [
                {"text": "Senior developer or architect role",          "tag": "Technology", "next_id": 78},
                {"text": "AI / ML research or industry",                "tag": "Technology", "next_id": 78},
                {"text": "Government IT jobs (NIC, CDAC)",              "tag": "general",    "next_id": 78},
                {"text": "PhD in Computer Science",                     "tag": "Technology", "next_id": 78},
            ]
        },

        # ── BBA / BCOM BRANCH ──────────────────────────────────
        {
            "id": 57, "level": "grad", "order_index": 8, "is_start": False,
            "question_text": "BBA / B.Com / Economics graduate — what next?",
            "options": [
                {"text": "MBA from a top college (CAT/GMAT)",           "tag": "Business", "next_id": 58},
                {"text": "CA / CFA / CMA certification",                "tag": "Business", "next_id": 59},
                {"text": "Corporate job — finance, marketing, HR",      "tag": "Business", "next_id": 59},
                {"text": "Start my own business or join a startup",     "tag": "Business", "next_id": 58},
            ]
        },
        {
            "id": 58, "level": "grad", "order_index": 9, "is_start": False,
            "question_text": "MBA path — which specialisation?",
            "options": [
                {"text": "Finance and investment banking",              "tag": "Business", "next_id": 78},
                {"text": "Marketing and brand management",              "tag": "Business", "next_id": 78},
                {"text": "HR, operations or supply chain",              "tag": "Business", "next_id": 78},
                {"text": "Entrepreneurship and product management",     "tag": "Business", "next_id": 78},
            ]
        },
        {
            "id": 59, "level": "grad", "order_index": 10, "is_start": False,
            "question_text": "CA / Corporate path — where do you see yourself?",
            "options": [
                {"text": "Big 4 or audit/tax firm",                    "tag": "Business", "next_id": 78},
                {"text": "Investment banking / equity research",        "tag": "Business", "next_id": 78},
                {"text": "Corporate finance in an MNC",                 "tag": "Business", "next_id": 78},
                {"text": "Government finance (UPSC, RBI Grade B)",      "tag": "Business", "next_id": 78},
            ]
        },

        # ── BA / BSC / OTHERS BRANCH ───────────────────────────
        {
            "id": 60, "level": "grad", "order_index": 11, "is_start": False,
            "question_text": "BA / B.Sc graduate — what is your main interest now?",
            "options": [
                {"text": "UPSC Civil Services (IAS/IPS/IFS)",           "tag": "general",    "next_id": 61},
                {"text": "Teaching, research or academia",              "tag": "Healthcare", "next_id": 62},
                {"text": "Switch to tech (coding bootcamp / BCA)",      "tag": "Technology", "next_id": 78},
                {"text": "Creative field — media, writing, design",     "tag": "Creative",   "next_id": 62},
            ]
        },
        {
            "id": 61, "level": "grad", "order_index": 12, "is_start": False,
            "question_text": "UPSC path — which service interests you most?",
            "options": [
                {"text": "IAS — Indian Administrative Service",         "tag": "general", "next_id": 78},
                {"text": "IPS — Indian Police Service",                 "tag": "general", "next_id": 78},
                {"text": "IFS — Indian Foreign Service",                "tag": "general", "next_id": 78},
                {"text": "State PSC or other govt exams",               "tag": "general", "next_id": 78},
            ]
        },
        {
            "id": 62, "level": "grad", "order_index": 13, "is_start": False,
            "question_text": "Teaching / Creative path — which direction?",
            "options": [
                {"text": "NET / SET and become a professor",            "tag": "Healthcare", "next_id": 78},
                {"text": "M.A or M.Sc for specialisation",             "tag": "Healthcare", "next_id": 78},
                {"text": "Journalism, copywriting or content",          "tag": "Creative",   "next_id": 78},
                {"text": "NGO, social work or development sector",      "tag": "Healthcare", "next_id": 78},
            ]
        },

        # ── LLB BRANCH ─────────────────────────────────────────
        {
            "id": 63, "level": "grad", "order_index": 14, "is_start": False,
            "question_text": "Law graduate — which area of law are you focused on?",
            "options": [
                {"text": "Criminal litigation and court practice",      "tag": "Business", "next_id": 64},
                {"text": "Corporate law and mergers & acquisitions",    "tag": "Business", "next_id": 65},
                {"text": "Constitutional / public interest law",        "tag": "general",  "next_id": 64},
                {"text": "Cyber law or intellectual property",          "tag": "Technology","next_id": 65},
            ]
        },
        {
            "id": 64, "level": "grad", "order_index": 15, "is_start": False,
            "question_text": "Litigation path — what is your next step?",
            "options": [
                {"text": "Enrol in Bar Council and start practice",     "tag": "Business", "next_id": 78},
                {"text": "LLM for specialisation (India / abroad)",     "tag": "Business", "next_id": 78},
                {"text": "Judiciary exam (civil judge)",                "tag": "general",  "next_id": 78},
                {"text": "UPSC and legal services",                     "tag": "general",  "next_id": 78},
            ]
        },
        {
            "id": 65, "level": "grad", "order_index": 16, "is_start": False,
            "question_text": "Corporate law path — where do you want to work?",
            "options": [
                {"text": "Top-tier law firm (AZB, Cyril Amarchand)",   "tag": "Business", "next_id": 78},
                {"text": "In-house legal team of a company",            "tag": "Business", "next_id": 78},
                {"text": "LLM abroad (Harvard, Oxford, NUS)",           "tag": "Business", "next_id": 78},
                {"text": "Legal tech or legal consulting startup",      "tag": "Technology","next_id": 78},
            ]
        },

        # ── MEDICAL BRANCH ─────────────────────────────────────
        {
            "id": 66, "level": "grad", "order_index": 17, "is_start": False,
            "question_text": "Medical graduate — what is your primary goal?",
            "options": [
                {"text": "MD / MS through NEET-PG (specialisation)",   "tag": "Healthcare", "next_id": 67},
                {"text": "Research — ICMR, AIIMS, abroad",             "tag": "Healthcare", "next_id": 68},
                {"text": "Hospital practice / clinical work",           "tag": "Healthcare", "next_id": 78},
                {"text": "Healthcare management / administration (MHA)","tag": "Business",   "next_id": 78},
            ]
        },
        {
            "id": 67, "level": "grad", "order_index": 18, "is_start": False,
            "question_text": "MD / MS — which clinical specialisation?",
            "options": [
                {"text": "Surgery (General / Ortho / Neuro)",           "tag": "Healthcare", "next_id": 78},
                {"text": "Internal Medicine / Critical Care",           "tag": "Healthcare", "next_id": 78},
                {"text": "Radiology / Pathology / Anaesthesia",         "tag": "Healthcare", "next_id": 78},
                {"text": "Paediatrics / OBGyn / Psychiatry",            "tag": "Healthcare", "next_id": 78},
            ]
        },
        {
            "id": 68, "level": "grad", "order_index": 19, "is_start": False,
            "question_text": "Research path — what is your focus?",
            "options": [
                {"text": "Clinical trials and drug development",        "tag": "Healthcare", "next_id": 78},
                {"text": "Public health and epidemiology",              "tag": "Healthcare", "next_id": 78},
                {"text": "Biotech and genomics research",               "tag": "Healthcare", "next_id": 78},
                {"text": "Global health and WHO/UN programmes",         "tag": "Healthcare", "next_id": 78},
            ]
        },

        # ── SHARED CLOSING — GRADUATION ────────────────────────
        {
            "id": 78, "level": "grad", "order_index": 78, "is_start": False,
            "question_text": "How do you prefer to work?",
            "options": [
                {"text": "Remote / flexible work",                      "tag": "Technology", "next_id": 79},
                {"text": "Office with a structured team",               "tag": "Business",   "next_id": 79},
                {"text": "Field / hospital / on-ground work",           "tag": "Healthcare", "next_id": 79},
                {"text": "Independent / freelance",                     "tag": "Creative",   "next_id": 79},
            ]
        },
        {
            "id": 79, "level": "grad", "order_index": 79, "is_start": False,
            "question_text": "What is your single biggest career priority?",
            "options": [
                {"text": "Maximum salary / financial growth",           "tag": "Business",   "next_id": None},
                {"text": "Job security and work-life balance",          "tag": "general",    "next_id": None},
                {"text": "Impact — changing lives and society",         "tag": "Healthcare", "next_id": None},
                {"text": "Growth — learning and career progression",    "tag": "Technology", "next_id": None},
            ]
        },


        # ══════════════════════════════════════════════════════
        # POST GRADUATION LEVEL  (IDs 80–99)
        # ══════════════════════════════════════════════════════

        # Q80 — START — PG degree selection
        {
            "id": 80, "level": "pg", "order_index": 1, "is_start": True,
            "question_text": "What is your post graduation specialisation?",
            "options": [
                {"text": "💻 M.Tech / MCA / M.Sc CS (Tech)",           "tag": "Technology", "next_id": 81},
                {"text": "📊 MBA (Management)",                         "tag": "Business",   "next_id": 84},
                {"text": "🔬 M.Sc (Pure / Applied Science)",           "tag": "Healthcare", "next_id": 87},
                {"text": "⚖️ LLM (Law)",                               "tag": "Business",   "next_id": 90},
                {"text": "🎓 MA / M.Com / MSW / Other",                "tag": "general",    "next_id": 90},
            ]
        },

        # ── TECH PG BRANCH ─────────────────────────────────────
        {
            "id": 81, "level": "pg", "order_index": 2, "is_start": False,
            "question_text": "Tech PG — what is your primary career goal?",
            "options": [
                {"text": "Senior software engineer at FAANG / product co","tag": "Technology", "next_id": 82},
                {"text": "AI / ML researcher or data scientist",         "tag": "Technology", "next_id": 83},
                {"text": "PhD and academic career",                      "tag": "Technology", "next_id": 83},
                {"text": "Start a tech company or join an early startup", "tag": "Business",  "next_id": 98},
            ]
        },
        {
            "id": 82, "level": "pg", "order_index": 3, "is_start": False,
            "question_text": "Industry role — which domain interests you most?",
            "options": [
                {"text": "Cloud, DevOps and distributed systems",       "tag": "Technology", "next_id": 98},
                {"text": "Mobile / web product development",            "tag": "Technology", "next_id": 98},
                {"text": "Cybersecurity and ethical hacking",           "tag": "Technology", "next_id": 98},
                {"text": "Blockchain and Web3",                         "tag": "Technology", "next_id": 98},
            ]
        },
        {
            "id": 83, "level": "pg", "order_index": 4, "is_start": False,
            "question_text": "Research / PhD path — what is your focus area?",
            "options": [
                {"text": "Artificial Intelligence and deep learning",   "tag": "Technology", "next_id": 98},
                {"text": "Computer vision or NLP",                      "tag": "Technology", "next_id": 98},
                {"text": "Quantum computing or theoretical CS",         "tag": "Technology", "next_id": 98},
                {"text": "Human-computer interaction or AR/VR",         "tag": "Technology", "next_id": 98},
            ]
        },

        # ── MBA BRANCH ─────────────────────────────────────────
        {
            "id": 84, "level": "pg", "order_index": 5, "is_start": False,
            "question_text": "MBA — which specialisation did you / will you choose?",
            "options": [
                {"text": "Finance (investment banking, VC, PE)",        "tag": "Business", "next_id": 85},
                {"text": "Marketing and brand strategy",                "tag": "Business", "next_id": 86},
                {"text": "HR and organisational behaviour",             "tag": "Business", "next_id": 86},
                {"text": "Operations, supply chain or consulting",      "tag": "Business", "next_id": 85},
            ]
        },
        {
            "id": 85, "level": "pg", "order_index": 6, "is_start": False,
            "question_text": "Finance / Consulting MBA — where do you want to work?",
            "options": [
                {"text": "Investment bank or hedge fund",               "tag": "Business", "next_id": 98},
                {"text": "Big 3 consulting (McKinsey, BCG, Bain)",      "tag": "Business", "next_id": 98},
                {"text": "CFO track in a large corporation",            "tag": "Business", "next_id": 98},
                {"text": "Venture capital or PE fund",                  "tag": "Business", "next_id": 98},
            ]
        },
        {
            "id": 86, "level": "pg", "order_index": 7, "is_start": False,
            "question_text": "Marketing / HR MBA — what excites you most?",
            "options": [
                {"text": "Brand management in FMCG / consumer goods",  "tag": "Business", "next_id": 98},
                {"text": "Digital marketing and growth hacking",        "tag": "Business", "next_id": 98},
                {"text": "Talent acquisition and people analytics",     "tag": "Business", "next_id": 98},
                {"text": "Startup or product marketing",                "tag": "Business", "next_id": 98},
            ]
        },

        # ── M.SC BRANCH ────────────────────────────────────────
        {
            "id": 87, "level": "pg", "order_index": 8, "is_start": False,
            "question_text": "M.Sc — which subject?",
            "options": [
                {"text": "Physics / Chemistry / Mathematics",           "tag": "Technology", "next_id": 88},
                {"text": "Biotechnology / Biochemistry / Microbiology", "tag": "Healthcare", "next_id": 89},
                {"text": "Environmental Science / Geography",           "tag": "Healthcare", "next_id": 88},
                {"text": "Data Science / Statistics / AI",              "tag": "Technology", "next_id": 89},
            ]
        },
        {
            "id": 88, "level": "pg", "order_index": 9, "is_start": False,
            "question_text": "Pure science path — what is your goal?",
            "options": [
                {"text": "PhD from IIT / IISc / abroad",               "tag": "Technology", "next_id": 98},
                {"text": "ISRO / DRDO / BARC scientist",                "tag": "Technology", "next_id": 98},
                {"text": "Teaching — NET / SET and professorship",      "tag": "Healthcare", "next_id": 98},
                {"text": "Industry R&D role in a tech company",         "tag": "Technology", "next_id": 98},
            ]
        },
        {
            "id": 89, "level": "pg", "order_index": 10, "is_start": False,
            "question_text": "Life sciences / Data science — what is your goal?",
            "options": [
                {"text": "Pharma or biotech industry research",         "tag": "Healthcare", "next_id": 98},
                {"text": "Clinical research / drug trials",             "tag": "Healthcare", "next_id": 98},
                {"text": "Data scientist in tech or finance",           "tag": "Technology", "next_id": 98},
                {"text": "PhD in bioinformatics or computational bio",  "tag": "Healthcare", "next_id": 98},
            ]
        },

        # ── LLM / MA / OTHERS BRANCH ───────────────────────────
        {
            "id": 90, "level": "pg", "order_index": 11, "is_start": False,
            "question_text": "LLM / MA / Other PG — what is your main ambition?",
            "options": [
                {"text": "UPSC / IAS / State civil services",           "tag": "general",    "next_id": 91},
                {"text": "Teaching and research (NET / PhD)",           "tag": "Healthcare", "next_id": 92},
                {"text": "International law or diplomacy (LLM abroad)", "tag": "Business",   "next_id": 91},
                {"text": "Journalism, media or writing career",         "tag": "Creative",   "next_id": 92},
            ]
        },
        {
            "id": 91, "level": "pg", "order_index": 12, "is_start": False,
            "question_text": "Government / Policy path — which service?",
            "options": [
                {"text": "IAS / IPS / IFS (UPSC CSE)",                  "tag": "general", "next_id": 98},
                {"text": "Foreign affairs or UN/multilateral bodies",   "tag": "general", "next_id": 98},
                {"text": "Judiciary — LLM + judicial services exam",    "tag": "Business","next_id": 98},
                {"text": "Policy think tank or government advisory",    "tag": "general", "next_id": 98},
            ]
        },
        {
            "id": 92, "level": "pg", "order_index": 13, "is_start": False,
            "question_text": "Academia / Creative path — what is your focus?",
            "options": [
                {"text": "PhD and university professorship",            "tag": "Healthcare", "next_id": 98},
                {"text": "Content writing, publishing or media",        "tag": "Creative",   "next_id": 98},
                {"text": "Social work, NGO or development sector",      "tag": "Healthcare", "next_id": 98},
                {"text": "Independent research or consulting",          "tag": "general",    "next_id": 98},
            ]
        },

        # ── SHARED CLOSING — POST GRADUATION ───────────────────
        {
            "id": 98, "level": "pg", "order_index": 98, "is_start": False,
            "question_text": "At this stage, how do you prefer to work?",
            "options": [
                {"text": "Lead a team / take ownership of outcomes",    "tag": "Business",   "next_id": 99},
                {"text": "Deep individual contributor — expert role",   "tag": "Technology", "next_id": 99},
                {"text": "Research and publish — academic credibility", "tag": "Healthcare", "next_id": 99},
                {"text": "Build something of my own",                   "tag": "Business",   "next_id": 99},
            ]
        },
        {
            "id": 99, "level": "pg", "order_index": 99, "is_start": False,
            "question_text": "What is your 5-year career vision?",
            "options": [
                {"text": "Senior leadership — Director / VP / CXO",    "tag": "Business",   "next_id": None},
                {"text": "World-class expert in my technical domain",   "tag": "Technology", "next_id": None},
                {"text": "Published researcher / professor",            "tag": "Healthcare", "next_id": None},
                {"text": "Founder of my own company",                   "tag": "Business",   "next_id": None},
            ]
        },

    ]

    # ── Insert all questions and options ──────────────────────
    for q_data in questions_data:
        question = Question(
            id            = q_data["id"],
            level         = q_data["level"],
            question_text = q_data["question_text"],
            order_index   = q_data["order_index"],
            is_start      = q_data["is_start"],
        )
        db.add(question)
        db.flush()

        for opt in q_data["options"]:
            option = QuestionOption(
                question_id      = q_data["id"],
                option_text      = opt["text"],
                category_tag     = opt["tag"],
                next_question_id = opt["next_id"],
            )
            db.add(option)

    db.commit()
    print("✅ Questions seeded successfully")
    print(f"✅ Total questions: {len(questions_data)}")

    # Print summary
    levels = {}
    for q in questions_data:
        levels[q["level"]] = levels.get(q["level"], 0) + 1
    for lvl, count in levels.items():
        print(f"   {lvl}: {count} questions")


def seed_colleges():
    existing = db.query(College).count()
    if existing > 0:
        print(f"⚠️  Colleges already seeded ({existing} records) — skipping")
        return
    print("ℹ️  Add college data here when ready")


if __name__ == "__main__":
    print("🌱 Starting database seed...")
    seed_questions()
    seed_colleges()
    db.close()
    print("🎉 Seed complete!")