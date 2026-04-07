from app.database.connection import SessionLocal
from app.database.base import Base
from app.database.connection import engine
from app.models.question_model import Question, QuestionOption
from app.models import user_model, result_model, question_model

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed_questions():
    db.query(QuestionOption).delete()
    db.query(Question).delete()
    db.commit()

    questions_data = [

        # ════════════════════════════════════════
        # 10TH LEVEL
        # ════════════════════════════════════════

        # Phase 1 — Gate (always shown first)
        {
            "id": 1001, "level": "10th", "phase": "gate", "order_index": 1, "is_start": True,
            "question_text": "What percentage did you score in your Class 10 exams?",
            "options": [
                {"text": "Above 90% — I scored very well", "tag": "high_score",    "next_id": 1002},
                {"text": "75% to 90% — Good performance",  "tag": "mid_score",    "next_id": 1002},
                {"text": "55% to 75% — Average",           "tag": "avg_score",    "next_id": 1002},
                {"text": "Below 55% — Needs improvement",  "tag": "low_score",    "next_id": 1002},
            ]
        },
        {
            "id": 1002, "level": "10th", "phase": "gate", "order_index": 2, "is_start": False,
            "question_text": "You have a completely free Saturday. Which of these feels most exciting to you?",
            "options": [
                {"text": "🔬 Doing a science experiment or building something", "tag": "Technology", "next_id": 1010},
                {"text": "🎨 Drawing, designing, writing or creating art",       "tag": "Creative",   "next_id": 1020},
                {"text": "💼 Planning a small business or earning money",        "tag": "Business",   "next_id": 1030},
                {"text": "🤝 Helping someone, teaching or volunteering",         "tag": "Healthcare", "next_id": 1040},
            ]
        },

        # Phase 2 — TECHNOLOGY domain (4 deep questions)
        {
            "id": 1010, "level": "10th", "phase": "domain_tech", "order_index": 3, "is_start": False,
            "question_text": "When you think about technology and science, what excites you most?",
            "options": [
                {"text": "💻 Writing code and building software or apps",    "tag": "Technology", "next_id": 1011},
                {"text": "⚙️ Physics, machines, engines and how things work", "tag": "Technology", "next_id": 1011},
                {"text": "🧬 Biology, medicine and the human body",           "tag": "Healthcare", "next_id": 1011},
                {"text": "📐 Maths, numbers and solving logical problems",    "tag": "Technology", "next_id": 1011},
            ]
        },
        {
            "id": 1011, "level": "10th", "phase": "domain_tech", "order_index": 4, "is_start": False,
            "question_text": "Your school is hosting a Science Fair. What project would you most enjoy working on?",
            "options": [
                {"text": "A working app or website I coded myself",         "tag": "Technology", "next_id": 1012},
                {"text": "A physics experiment showing how machines work",  "tag": "Technology", "next_id": 1012},
                {"text": "A model showing how the human body functions",    "tag": "Healthcare", "next_id": 1012},
                {"text": "A mathematical model predicting something real",  "tag": "Technology", "next_id": 1012},
            ]
        },
        {
            "id": 1012, "level": "10th", "phase": "domain_tech", "order_index": 5, "is_start": False,
            "question_text": "After 12th Science, which path sounds most right for you?",
            "options": [
                {"text": "B.Tech CSE — become a software engineer",        "tag": "Technology", "next_id": 1050},
                {"text": "B.Tech other branch — engineering or physics",   "tag": "Technology", "next_id": 1050},
                {"text": "MBBS — become a doctor after NEET",              "tag": "Healthcare", "next_id": 1050},
                {"text": "B.Sc — pure science, research or teaching",      "tag": "Technology", "next_id": 1050},
            ]
        },

        # Phase 2 — CREATIVE domain (4 deep questions)
        {
            "id": 1020, "level": "10th", "phase": "domain_creative", "order_index": 3, "is_start": False,
            "question_text": "Which creative area do you enjoy most?",
            "options": [
                {"text": "🎨 Visual art, drawing, illustration, animation",   "tag": "Creative",   "next_id": 1021},
                {"text": "✍️ Writing, storytelling, journalism or content",   "tag": "Creative",   "next_id": 1021},
                {"text": "🎭 Acting, music, dance or performance",            "tag": "Creative",   "next_id": 1021},
                {"text": "👗 Fashion, interior design or product design",     "tag": "Creative",   "next_id": 1021},
            ]
        },
        {
            "id": 1021, "level": "10th", "phase": "domain_creative", "order_index": 4, "is_start": False,
            "question_text": "Imagine you are working on a big project. Which role would you choose?",
            "options": [
                {"text": "The designer — I create the visual identity",    "tag": "Creative",   "next_id": 1022},
                {"text": "The writer — I craft the story and content",     "tag": "Creative",   "next_id": 1022},
                {"text": "The performer — I bring it to life on stage",    "tag": "Creative",   "next_id": 1022},
                {"text": "The director — I have the overall creative vision", "tag": "Creative", "next_id": 1022},
            ]
        },
        {
            "id": 1022, "level": "10th", "phase": "domain_creative", "order_index": 5, "is_start": False,
            "question_text": "After 12th, which creative path interests you?",
            "options": [
                {"text": "B.Des or Fine Arts — design school like NID/NIFT", "tag": "Creative", "next_id": 1050},
                {"text": "BFA or performing arts — music, drama, dance",     "tag": "Creative", "next_id": 1050},
                {"text": "Journalism / Mass Comm — media and storytelling",   "tag": "Creative", "next_id": 1050},
                {"text": "Architecture — blend of design and engineering",    "tag": "Creative", "next_id": 1050},
            ]
        },

        # Phase 2 — BUSINESS domain (4 deep questions)
        {
            "id": 1030, "level": "10th", "phase": "domain_business", "order_index": 3, "is_start": False,
            "question_text": "Which part of running a business excites you most?",
            "options": [
                {"text": "💰 Finance, accounts and money management",         "tag": "Business", "next_id": 1031},
                {"text": "📢 Marketing, sales and convincing people",         "tag": "Business", "next_id": 1031},
                {"text": "👥 Managing a team and organising operations",      "tag": "Business", "next_id": 1031},
                {"text": "💡 Coming up with new business ideas (startup)",    "tag": "Business", "next_id": 1031},
            ]
        },
        {
            "id": 1031, "level": "10th", "phase": "domain_business", "order_index": 4, "is_start": False,
            "question_text": "Your school starts a student company. What role do you take?",
            "options": [
                {"text": "CFO — I manage the budget and accounts",           "tag": "Business", "next_id": 1032},
                {"text": "CMO — I handle marketing and promotions",          "tag": "Business", "next_id": 1032},
                {"text": "CEO — I lead the whole team and strategy",         "tag": "Business", "next_id": 1032},
                {"text": "COO — I handle day-to-day operations",             "tag": "Business", "next_id": 1032},
            ]
        },
        {
            "id": 1032, "level": "10th", "phase": "domain_business", "order_index": 5, "is_start": False,
            "question_text": "After 12th Commerce, what is your dream path?",
            "options": [
                {"text": "CA — Chartered Accountant, top finance career",    "tag": "Business", "next_id": 1050},
                {"text": "BBA then MBA — become a business manager",         "tag": "Business", "next_id": 1050},
                {"text": "Start my own business as an entrepreneur",         "tag": "Business", "next_id": 1050},
                {"text": "Banking and finance — IBPS, RBI grade B",          "tag": "Business", "next_id": 1050},
            ]
        },

        # Phase 2 — HEALTHCARE domain (4 deep questions)
        {
            "id": 1040, "level": "10th", "phase": "domain_health", "order_index": 3, "is_start": False,
            "question_text": "When you think about helping people, which area feels most meaningful?",
            "options": [
                {"text": "🏥 Treating sick people as a doctor or nurse",      "tag": "Healthcare", "next_id": 1041},
                {"text": "🧠 Understanding the mind — psychology and counselling", "tag": "Healthcare", "next_id": 1041},
                {"text": "📚 Teaching and guiding students as a teacher",     "tag": "Healthcare", "next_id": 1041},
                {"text": "🌍 Social work — helping communities and NGOs",     "tag": "Healthcare", "next_id": 1041},
            ]
        },
        {
            "id": 1041, "level": "10th", "phase": "domain_health", "order_index": 4, "is_start": False,
            "question_text": "A friend is going through a hard time. What do you naturally do?",
            "options": [
                {"text": "I listen patiently and comfort them emotionally",  "tag": "Healthcare", "next_id": 1042},
                {"text": "I analyse what went wrong and suggest solutions",  "tag": "Technology", "next_id": 1042},
                {"text": "I organise help from others around them",          "tag": "Business",   "next_id": 1042},
                {"text": "I research and share information to help them",    "tag": "Healthcare", "next_id": 1042},
            ]
        },
        {
            "id": 1042, "level": "10th", "phase": "domain_health", "order_index": 5, "is_start": False,
            "question_text": "After 12th, which helping-career path appeals to you most?",
            "options": [
                {"text": "MBBS or BDS — become a doctor or dentist",         "tag": "Healthcare", "next_id": 1050},
                {"text": "B.Sc Nursing or Physiotherapy",                   "tag": "Healthcare", "next_id": 1050},
                {"text": "B.Ed — become a teacher or school counsellor",    "tag": "Healthcare", "next_id": 1050},
                {"text": "Social Work or Psychology degree",                 "tag": "Healthcare", "next_id": 1050},
            ]
        },

        # Phase 3 — Personality (same for all, shown after domain)
        {
            "id": 1050, "level": "10th", "phase": "personality", "order_index": 6, "is_start": False,
            "question_text": "When you face a difficult problem, what is your first instinct?",
            "options": [
                {"text": "Break it down step by step using logic",          "tag": "Technology", "next_id": 1051},
                {"text": "Ask others, build a team and collaborate",        "tag": "Business",   "next_id": 1051},
                {"text": "Think creatively and try unusual approaches",     "tag": "Creative",   "next_id": 1051},
                {"text": "Help others affected by the problem first",       "tag": "Healthcare", "next_id": 1051},
            ]
        },
        {
            "id": 1051, "level": "10th", "phase": "personality", "order_index": 7, "is_start": False,
            "question_text": "What kind of work environment excites you the most?",
            "options": [
                {"text": "🖥️ Office or lab — focused, technical, deep work", "tag": "Technology", "next_id": 1052},
                {"text": "🏢 Corporate or startup — fast paced, meetings",  "tag": "Business",   "next_id": 1052},
                {"text": "🎭 Studio or field — expressive, flexible work",  "tag": "Creative",   "next_id": 1052},
                {"text": "🏥 Hospital, school or community — people focused","tag": "Healthcare", "next_id": 1052},
            ]
        },
        {
            "id": 1052, "level": "10th", "phase": "personality", "order_index": 8, "is_start": False,
            "question_text": "What motivates you to work hard every day?",
            "options": [
                {"text": "Building something new and solving hard problems", "tag": "Technology", "next_id": 1060},
                {"text": "Financial success, growth and leadership",         "tag": "Business",   "next_id": 1060},
                {"text": "Creative freedom and leaving a unique mark",       "tag": "Creative",   "next_id": 1060},
                {"text": "Making a real difference in people's lives",       "tag": "Healthcare", "next_id": 1060},
            ]
        },

        # Phase 4 — Confirmation (1 question, always last)
        {
            "id": 1060, "level": "10th", "phase": "confirmation", "order_index": 9, "is_start": False,
            "question_text": "10 years from now, which version of yourself feels most right?",
            "options": [
                {"text": "🚀 A tech professional building products people love",   "tag": "Technology", "next_id": None},
                {"text": "🎨 A creative professional known for my unique work",    "tag": "Creative",   "next_id": None},
                {"text": "💼 A business leader running a successful company",      "tag": "Business",   "next_id": None},
                {"text": "💚 A professional who improved many people's lives",     "tag": "Healthcare", "next_id": None},
            ]
        },

        # ════════════════════════════════════════
        # 12TH LEVEL
        # ════════════════════════════════════════

        {
            "id": 2001, "level": "12th", "phase": "gate", "order_index": 1, "is_start": True,
            "question_text": "What percentage did you score in Class 12?",
            "options": [
                {"text": "Above 90%",  "tag": "high_score", "next_id": 2002},
                {"text": "75% to 90%", "tag": "mid_score",  "next_id": 2002},
                {"text": "55% to 75%", "tag": "avg_score",  "next_id": 2002},
                {"text": "Below 55%",  "tag": "low_score",  "next_id": 2002},
            ]
        },
        {
            "id": 2002, "level": "12th", "phase": "gate", "order_index": 2, "is_start": False,
            "question_text": "Which stream did you study in 12th?",
            "options": [
                {"text": "Science — PCM (Physics, Chemistry, Maths)",    "tag": "Technology", "next_id": 2010},
                {"text": "Science — PCB (Physics, Chemistry, Biology)",  "tag": "Healthcare", "next_id": 2020},
                {"text": "Commerce",                                      "tag": "Business",   "next_id": 2030},
                {"text": "Arts / Humanities",                             "tag": "Creative",   "next_id": 2040},
            ]
        },

        # Domain — PCM Science
        {
            "id": 2010, "level": "12th", "phase": "domain_pcm", "order_index": 3, "is_start": False,
            "question_text": "As a PCM student, which subject did you enjoy the most?",
            "options": [
                {"text": "Maths — I love solving complex equations",        "tag": "Technology", "next_id": 2011},
                {"text": "Physics — I love understanding how things work",  "tag": "Technology", "next_id": 2011},
                {"text": "Chemistry — I enjoy reactions and experiments",   "tag": "Healthcare", "next_id": 2011},
                {"text": "All equally — I am a balanced science student",  "tag": "Technology", "next_id": 2011},
            ]
        },
        {
            "id": 2011, "level": "12th", "phase": "domain_pcm", "order_index": 4, "is_start": False,
            "question_text": "Are you preparing for or considering JEE?",
            "options": [
                {"text": "Yes — JEE is my primary goal",                   "tag": "Technology", "next_id": 2012},
                {"text": "I tried but will explore other options",         "tag": "Technology", "next_id": 2012},
                {"text": "No — I want a different tech path like BCA",     "tag": "Technology", "next_id": 2012},
                {"text": "No — I am exploring non-engineering options",    "tag": "Technology", "next_id": 2012},
            ]
        },
        {
            "id": 2012, "level": "12th", "phase": "domain_pcm", "order_index": 5, "is_start": False,
            "question_text": "Which B.Tech branch or tech path interests you most?",
            "options": [
                {"text": "CSE / IT — software, AI, data science",          "tag": "Technology", "next_id": 2050},
                {"text": "ECE / EEE — electronics, circuits, hardware",    "tag": "Technology", "next_id": 2050},
                {"text": "Mechanical / Civil — core engineering",          "tag": "Technology", "next_id": 2050},
                {"text": "BCA or B.Sc CS — computer science without JEE", "tag": "Technology", "next_id": 2050},
            ]
        },

        # Domain — PCB Science
        {
            "id": 2020, "level": "12th", "phase": "domain_pcb", "order_index": 3, "is_start": False,
            "question_text": "As a PCB student, which subject felt most natural to you?",
            "options": [
                {"text": "Biology — I love studying living organisms",     "tag": "Healthcare", "next_id": 2021},
                {"text": "Chemistry — reactions and molecules interest me","tag": "Healthcare", "next_id": 2021},
                {"text": "Physics — even in PCB I liked the Physics part", "tag": "Technology", "next_id": 2021},
                {"text": "All of them equally",                            "tag": "Healthcare", "next_id": 2021},
            ]
        },
        {
            "id": 2021, "level": "12th", "phase": "domain_pcb", "order_index": 4, "is_start": False,
            "question_text": "Are you targeting NEET for MBBS?",
            "options": [
                {"text": "Yes — MBBS is my dream",                         "tag": "Healthcare", "next_id": 2022},
                {"text": "I tried NEET but will explore other options",    "tag": "Healthcare", "next_id": 2022},
                {"text": "No — I want pharmacy or biotech instead",        "tag": "Healthcare", "next_id": 2022},
                {"text": "No — I prefer nursing, physiotherapy or B.Sc",  "tag": "Healthcare", "next_id": 2022},
            ]
        },
        {
            "id": 2022, "level": "12th", "phase": "domain_pcb", "order_index": 5, "is_start": False,
            "question_text": "Which healthcare career path appeals most to you?",
            "options": [
                {"text": "MBBS or BDS — clinical doctor or dentist",       "tag": "Healthcare", "next_id": 2050},
                {"text": "B.Pharm or M.Pharm — pharmaceutical career",    "tag": "Healthcare", "next_id": 2050},
                {"text": "B.Sc Nursing or Physiotherapy",                  "tag": "Healthcare", "next_id": 2050},
                {"text": "Biotech or Microbiology — research path",        "tag": "Healthcare", "next_id": 2050},
            ]
        },

        # Domain — Commerce
        {
            "id": 2030, "level": "12th", "phase": "domain_commerce", "order_index": 3, "is_start": False,
            "question_text": "In Commerce, which subject did you enjoy most?",
            "options": [
                {"text": "Accountancy — I enjoy numbers and precision",    "tag": "Business", "next_id": 2031},
                {"text": "Business Studies — strategy and management",     "tag": "Business", "next_id": 2031},
                {"text": "Economics — macro trends and policy",            "tag": "Business", "next_id": 2031},
                {"text": "Maths — I took Commerce with Maths",             "tag": "Business", "next_id": 2031},
            ]
        },
        {
            "id": 2031, "level": "12th", "phase": "domain_commerce", "order_index": 4, "is_start": False,
            "question_text": "What kind of business career feels most exciting?",
            "options": [
                {"text": "CA or CFA — become a top finance professional",  "tag": "Business", "next_id": 2032},
                {"text": "MBA — become a business leader or manager",      "tag": "Business", "next_id": 2032},
                {"text": "Entrepreneur — start my own company",            "tag": "Business", "next_id": 2032},
                {"text": "Banking — IBPS, RBI or private banking career",  "tag": "Business", "next_id": 2032},
            ]
        },
        {
            "id": 2032, "level": "12th", "phase": "domain_commerce", "order_index": 5, "is_start": False,
            "question_text": "Which degree would you prefer after 12th Commerce?",
            "options": [
                {"text": "BBA — Bachelor of Business Administration",      "tag": "Business", "next_id": 2050},
                {"text": "B.Com — Bachelor of Commerce",                   "tag": "Business", "next_id": 2050},
                {"text": "CA Foundation — direct CA path",                 "tag": "Business", "next_id": 2050},
                {"text": "Economics Honours — analytics and policy path",  "tag": "Business", "next_id": 2050},
            ]
        },

        # Domain — Arts
        {
            "id": 2040, "level": "12th", "phase": "domain_arts", "order_index": 3, "is_start": False,
            "question_text": "In Arts, which subject excited you the most?",
            "options": [
                {"text": "English Literature — writing and language",      "tag": "Creative",   "next_id": 2041},
                {"text": "History / Political Science — society and law",  "tag": "Business",   "next_id": 2041},
                {"text": "Psychology — understanding human behaviour",     "tag": "Healthcare", "next_id": 2041},
                {"text": "Fine Arts / Music — creative expression",        "tag": "Creative",   "next_id": 2041},
            ]
        },
        {
            "id": 2041, "level": "12th", "phase": "domain_arts", "order_index": 4, "is_start": False,
            "question_text": "Which career from Arts stream interests you most?",
            "options": [
                {"text": "Lawyer — BA LLB through CLAT",                   "tag": "Business",   "next_id": 2042},
                {"text": "Journalist or Media professional",               "tag": "Creative",   "next_id": 2042},
                {"text": "Psychologist or Counsellor",                    "tag": "Healthcare", "next_id": 2042},
                {"text": "Designer or Creative professional",              "tag": "Creative",   "next_id": 2042},
            ]
        },
        {
            "id": 2042, "level": "12th", "phase": "domain_arts", "order_index": 5, "is_start": False,
            "question_text": "Which degree path are you considering after 12th Arts?",
            "options": [
                {"text": "BA LLB — integrated law degree",                 "tag": "Business",   "next_id": 2050},
                {"text": "BA in Mass Comm / Journalism",                   "tag": "Creative",   "next_id": 2050},
                {"text": "BA Psychology or Social Work",                   "tag": "Healthcare", "next_id": 2050},
                {"text": "B.Des or BFA — design or fine arts",             "tag": "Creative",   "next_id": 2050},
            ]
        },

        # Phase 3 — Personality (same for all 12th students)
        {
            "id": 2050, "level": "12th", "phase": "personality", "order_index": 6, "is_start": False,
            "question_text": "In a group project, which role do you naturally take?",
            "options": [
                {"text": "The technical expert — I solve the hard problems", "tag": "Technology", "next_id": 2051},
                {"text": "The leader — I coordinate and manage the team",    "tag": "Business",   "next_id": 2051},
                {"text": "The creative — I bring the fresh ideas",           "tag": "Creative",   "next_id": 2051},
                {"text": "The support — I make sure everyone is okay",      "tag": "Healthcare", "next_id": 2051},
            ]
        },
        {
            "id": 2051, "level": "12th", "phase": "personality", "order_index": 7, "is_start": False,
            "question_text": "What does success look like to you at age 30?",
            "options": [
                {"text": "Working at a top tech company or running a startup","tag": "Technology", "next_id": 2052},
                {"text": "Running a successful business or leading a company","tag": "Business",   "next_id": 2052},
                {"text": "Being known for my creative work and expression",   "tag": "Creative",   "next_id": 2052},
                {"text": "Working in a meaningful role that helps society",   "tag": "Healthcare", "next_id": 2052},
            ]
        },
        {
            "id": 2052, "level": "12th", "phase": "personality", "order_index": 8, "is_start": False,
            "question_text": "Which of these challenges would you enjoy solving most?",
            "options": [
                {"text": "Building an AI system that predicts disease",      "tag": "Technology", "next_id": 2060},
                {"text": "Growing a startup from 0 to 1000 customers",      "tag": "Business",   "next_id": 2060},
                {"text": "Creating a campaign that changes public opinion",  "tag": "Creative",   "next_id": 2060},
                {"text": "Improving healthcare access for rural communities","tag": "Healthcare", "next_id": 2060},
            ]
        },

        # Phase 4 — Confirmation
        {
            "id": 2060, "level": "12th", "phase": "confirmation", "order_index": 9, "is_start": False,
            "question_text": "Which future feels most like YOU — be completely honest:",
            "options": [
                {"text": "A skilled engineer, developer or data scientist",  "tag": "Technology", "next_id": None},
                {"text": "A doctor, nurse or healthcare professional",       "tag": "Healthcare", "next_id": None},
                {"text": "A business owner, manager or finance expert",      "tag": "Business",   "next_id": None},
                {"text": "A designer, journalist, lawyer or creative pro",   "tag": "Creative",   "next_id": None},
            ]
        },

        # ════════════════════════════════════════
        # GRADUATION LEVEL
        # ════════════════════════════════════════

        {
            "id": 3001, "level": "grad", "phase": "gate", "order_index": 1, "is_start": True,
            "question_text": "What was your graduation percentage or CGPA?",
            "options": [
                {"text": "Above 8.5 CGPA / 85% — Excellent",              "tag": "high_score", "next_id": 3002},
                {"text": "7 to 8.5 CGPA / 70-85% — Good",                 "tag": "mid_score",  "next_id": 3002},
                {"text": "6 to 7 CGPA / 60-70% — Average",                "tag": "avg_score",  "next_id": 3002},
                {"text": "Below 6 CGPA / 60% — Below average",            "tag": "low_score",  "next_id": 3002},
            ]
        },
        {
            "id": 3002, "level": "grad", "phase": "gate", "order_index": 2, "is_start": False,
            "question_text": "What was your graduation degree?",
            "options": [
                {"text": "B.Tech / B.E — Engineering",                    "tag": "Technology", "next_id": 3010},
                {"text": "BCA / B.Sc Computer Science",                   "tag": "Technology", "next_id": 3010},
                {"text": "BBA / B.Com / Economics",                       "tag": "Business",   "next_id": 3020},
                {"text": "BA / B.Sc Science / Other",                     "tag": "Creative",   "next_id": 3030},
            ]
        },

        # Domain — Engineering/Tech grad
        {
            "id": 3010, "level": "grad", "phase": "domain_tech", "order_index": 3, "is_start": False,
            "question_text": "As a tech graduate, what are you most interested in doing next?",
            "options": [
                {"text": "Get a software engineering job at a good company", "tag": "Technology", "next_id": 3011},
                {"text": "Pursue M.Tech or MS for advanced specialisation",  "tag": "Technology", "next_id": 3011},
                {"text": "Switch to MBA for a management/product role",      "tag": "Business",   "next_id": 3011},
                {"text": "Start my own tech startup",                        "tag": "Business",   "next_id": 3011},
            ]
        },
        {
            "id": 3011, "level": "grad", "phase": "domain_tech", "order_index": 4, "is_start": False,
            "question_text": "Which tech specialisation excites you most right now?",
            "options": [
                {"text": "AI / Machine Learning / Data Science",             "tag": "Technology", "next_id": 3012},
                {"text": "Full Stack Web Development",                       "tag": "Technology", "next_id": 3012},
                {"text": "Cloud Computing / DevOps",                         "tag": "Technology", "next_id": 3012},
                {"text": "Cybersecurity / Networking",                       "tag": "Technology", "next_id": 3012},
            ]
        },
        {
            "id": 3012, "level": "grad", "phase": "domain_tech", "order_index": 5, "is_start": False,
            "question_text": "How do you prefer to work day to day?",
            "options": [
                {"text": "Deep individual focus — coding, research, analysis","tag": "Technology", "next_id": 3050},
                {"text": "Cross-functional teams — product, design, business","tag": "Business",   "next_id": 3050},
                {"text": "Client facing — consulting or sales engineering",  "tag": "Business",   "next_id": 3050},
                {"text": "Building my own product or company",               "tag": "Business",   "next_id": 3050},
            ]
        },

        # Domain — Business grad
        {
            "id": 3020, "level": "grad", "phase": "domain_biz", "order_index": 3, "is_start": False,
            "question_text": "As a business graduate, what is your primary goal?",
            "options": [
                {"text": "Top MBA from IIM or equivalent — CAT preparation", "tag": "Business", "next_id": 3021},
                {"text": "CA / CFA / CMA — professional finance certification","tag": "Business", "next_id": 3021},
                {"text": "Corporate job in finance, marketing or operations", "tag": "Business", "next_id": 3021},
                {"text": "Start my own business",                             "tag": "Business", "next_id": 3021},
            ]
        },
        {
            "id": 3021, "level": "grad", "phase": "domain_biz", "order_index": 4, "is_start": False,
            "question_text": "Which business domain do you want to specialise in?",
            "options": [
                {"text": "Finance and investment banking",                   "tag": "Business", "next_id": 3022},
                {"text": "Marketing, branding and digital media",           "tag": "Business", "next_id": 3022},
                {"text": "HR and organisational management",                "tag": "Business", "next_id": 3022},
                {"text": "Consulting and strategy",                         "tag": "Business", "next_id": 3022},
            ]
        },
        {
            "id": 3022, "level": "grad", "phase": "domain_biz", "order_index": 5, "is_start": False,
            "question_text": "Where do you see yourself working in 5 years?",
            "options": [
                {"text": "At a top MNC or consulting firm",                 "tag": "Business", "next_id": 3050},
                {"text": "Leading my own company or startup",               "tag": "Business", "next_id": 3050},
                {"text": "In a government or policy role",                  "tag": "Business", "next_id": 3050},
                {"text": "Abroad — international MBA or career",           "tag": "Business", "next_id": 3050},
            ]
        },

        # Domain — Other grad (BA/BSc)
        {
            "id": 3030, "level": "grad", "phase": "domain_other", "order_index": 3, "is_start": False,
            "question_text": "What is your main goal after graduation?",
            "options": [
                {"text": "Switch to tech — learn coding and get a tech job", "tag": "Technology", "next_id": 3031},
                {"text": "Government job — UPSC, SSC, state PCS",           "tag": "Business",   "next_id": 3031},
                {"text": "Higher education — M.Sc, MA or research",         "tag": "Healthcare", "next_id": 3031},
                {"text": "Creative career — media, design, content",        "tag": "Creative",   "next_id": 3031},
            ]
        },
        {
            "id": 3031, "level": "grad", "phase": "domain_other", "order_index": 4, "is_start": False,
            "question_text": "What kind of work impact matters most to you?",
            "options": [
                {"text": "Building technology that millions of people use",  "tag": "Technology", "next_id": 3032},
                {"text": "Shaping policy that changes society",              "tag": "Business",   "next_id": 3032},
                {"text": "Research that advances human knowledge",           "tag": "Healthcare", "next_id": 3032},
                {"text": "Creative work that inspires or entertains people", "tag": "Creative",   "next_id": 3032},
            ]
        },
        {
            "id": 3032, "level": "grad", "phase": "domain_other", "order_index": 5, "is_start": False,
            "question_text": "How do you feel about going back to studying or retraining?",
            "options": [
                {"text": "Very open — I will do whatever it takes",         "tag": "Technology", "next_id": 3050},
                {"text": "Somewhat open — if it leads to a clear outcome",  "tag": "Business",   "next_id": 3050},
                {"text": "Prefer not — I want to use my existing degree",   "tag": "Creative",   "next_id": 3050},
                {"text": "I am already studying — this is for direction",   "tag": "Healthcare", "next_id": 3050},
            ]
        },

        # Phase 3 — Personality
        {
            "id": 3050, "level": "grad", "phase": "personality", "order_index": 6, "is_start": False,
            "question_text": "What is your biggest professional strength right now?",
            "options": [
                {"text": "Technical skills — coding, analysis, engineering", "tag": "Technology", "next_id": 3051},
                {"text": "Communication and leadership",                     "tag": "Business",   "next_id": 3051},
                {"text": "Creativity and design thinking",                   "tag": "Creative",   "next_id": 3051},
                {"text": "Empathy and working with people",                  "tag": "Healthcare", "next_id": 3051},
            ]
        },
        {
            "id": 3051, "level": "grad", "phase": "personality", "order_index": 7, "is_start": False,
            "question_text": "How do you handle ambiguity and uncertainty at work?",
            "options": [
                {"text": "I enjoy it — I like figuring things out",         "tag": "Technology", "next_id": 3052},
                {"text": "I manage it by planning and organising",          "tag": "Business",   "next_id": 3052},
                {"text": "I channel it into creative exploration",          "tag": "Creative",   "next_id": 3052},
                {"text": "I focus on supporting the people around me",     "tag": "Healthcare", "next_id": 3052},
            ]
        },
        {
            "id": 3052, "level": "grad", "phase": "personality", "order_index": 8, "is_start": False,
            "question_text": "Which of these would make you feel most proud at work?",
            "options": [
                {"text": "Solving a complex technical problem no one could", "tag": "Technology", "next_id": 3060},
                {"text": "Leading a team to hit a big business target",     "tag": "Business",   "next_id": 3060},
                {"text": "Creating work that people genuinely admire",      "tag": "Creative",   "next_id": 3060},
                {"text": "Helping someone overcome a real life challenge",  "tag": "Healthcare", "next_id": 3060},
            ]
        },

        # Phase 4 — Confirmation
        {
            "id": 3060, "level": "grad", "phase": "confirmation", "order_index": 9, "is_start": False,
            "question_text": "If you could only choose ONE priority for your career — what would it be?",
            "options": [
                {"text": "🚀 Building cutting edge technology",              "tag": "Technology", "next_id": None},
                {"text": "💼 Leading organisations and driving growth",      "tag": "Business",   "next_id": None},
                {"text": "🎨 Creating work that expresses your identity",    "tag": "Creative",   "next_id": None},
                {"text": "💚 Making a meaningful difference to people",      "tag": "Healthcare", "next_id": None},
            ]
        },

        # ════════════════════════════════════════
        # POST GRADUATION LEVEL
        # ════════════════════════════════════════

        {
            "id": 4001, "level": "pg", "phase": "gate", "order_index": 1, "is_start": True,
            "question_text": "What is your post graduation specialisation?",
            "options": [
                {"text": "M.Tech / MCA / M.Sc Computer Science",           "tag": "Technology", "next_id": 4010},
                {"text": "MBA — Management specialisation",                 "tag": "Business",   "next_id": 4020},
                {"text": "M.Sc — Pure Science / Research",                 "tag": "Healthcare", "next_id": 4030},
                {"text": "MA / M.Com / LLM / Other",                       "tag": "Creative",   "next_id": 4040},
            ]
        },

        # Domain — Tech PG
        {
            "id": 4010, "level": "pg", "phase": "domain_tech", "order_index": 2, "is_start": False,
            "question_text": "As a tech post grad, what is your main career goal?",
            "options": [
                {"text": "Senior software engineer at a top product company","tag": "Technology", "next_id": 4011},
                {"text": "AI / ML researcher or industry scientist",        "tag": "Technology", "next_id": 4011},
                {"text": "PhD and academic career in computer science",     "tag": "Technology", "next_id": 4011},
                {"text": "Tech startup — founding or early team member",   "tag": "Business",   "next_id": 4011},
            ]
        },
        {
            "id": 4011, "level": "pg", "phase": "domain_tech", "order_index": 3, "is_start": False,
            "question_text": "Which technical area do you want to master in the next 2 years?",
            "options": [
                {"text": "Deep Learning, LLMs and Generative AI",           "tag": "Technology", "next_id": 4012},
                {"text": "Cloud architecture and distributed systems",      "tag": "Technology", "next_id": 4012},
                {"text": "Cybersecurity and ethical hacking",               "tag": "Technology", "next_id": 4012},
                {"text": "Product management and engineering leadership",   "tag": "Business",   "next_id": 4012},
            ]
        },
        {
            "id": 4012, "level": "pg", "phase": "domain_tech", "order_index": 4, "is_start": False,
            "question_text": "How important is research and publishing papers to you?",
            "options": [
                {"text": "Very important — I want an academic/research career","tag": "Technology", "next_id": 4050},
                {"text": "Somewhat — I want industry but enjoy research too","tag": "Technology", "next_id": 4050},
                {"text": "Not important — I want industry impact",          "tag": "Technology", "next_id": 4050},
                {"text": "I want to build products, not research",          "tag": "Business",   "next_id": 4050},
            ]
        },

        # Domain — MBA PG
        {
            "id": 4020, "level": "pg", "phase": "domain_mba", "order_index": 2, "is_start": False,
            "question_text": "What is your MBA specialisation?",
            "options": [
                {"text": "Finance — investment, banking, treasury",         "tag": "Business", "next_id": 4021},
                {"text": "Marketing — brand, digital, product marketing",   "tag": "Business", "next_id": 4021},
                {"text": "Operations / Supply Chain",                       "tag": "Business", "next_id": 4021},
                {"text": "HR / General Management",                        "tag": "Business", "next_id": 4021},
            ]
        },
        {
            "id": 4021, "level": "pg", "phase": "domain_mba", "order_index": 3, "is_start": False,
            "question_text": "Where do you see yourself 5 years after MBA?",
            "options": [
                {"text": "VP or Director at a large corporate",            "tag": "Business", "next_id": 4022},
                {"text": "Founder or co-founder of a startup",             "tag": "Business", "next_id": 4022},
                {"text": "Management consultant at a top firm",            "tag": "Business", "next_id": 4022},
                {"text": "Investment banker or portfolio manager",         "tag": "Business", "next_id": 4022},
            ]
        },
        {
            "id": 4022, "level": "pg", "phase": "domain_mba", "order_index": 4, "is_start": False,
            "question_text": "What is your biggest career differentiator?",
            "options": [
                {"text": "Analytical thinking and data driven decisions",  "tag": "Business", "next_id": 4050},
                {"text": "People skills and relationship building",        "tag": "Business", "next_id": 4050},
                {"text": "Strategic vision and big picture thinking",      "tag": "Business", "next_id": 4050},
                {"text": "Execution and getting things done",              "tag": "Business", "next_id": 4050},
            ]
        },

        # Domain — M.Sc Research
        {
            "id": 4030, "level": "pg", "phase": "domain_research", "order_index": 2, "is_start": False,
            "question_text": "What is your M.Sc specialisation?",
            "options": [
                {"text": "Physics / Chemistry / Mathematics",              "tag": "Technology", "next_id": 4031},
                {"text": "Biology / Biotechnology / Life Sciences",        "tag": "Healthcare", "next_id": 4031},
                {"text": "Data Science / Statistics",                      "tag": "Technology", "next_id": 4031},
                {"text": "Environmental Science / Geography",              "tag": "Healthcare", "next_id": 4031},
            ]
        },
        {
            "id": 4031, "level": "pg", "phase": "domain_research", "order_index": 3, "is_start": False,
            "question_text": "What is your preferred next step after M.Sc?",
            "options": [
                {"text": "PhD — full research and academic career",        "tag": "Healthcare", "next_id": 4032},
                {"text": "Industry job in pharma, biotech or tech company","tag": "Healthcare", "next_id": 4032},
                {"text": "Government research lab — ISRO, DRDO, CSIR",    "tag": "Technology", "next_id": 4032},
                {"text": "Teaching at college or university",              "tag": "Healthcare", "next_id": 4032},
            ]
        },
        {
            "id": 4032, "level": "pg", "phase": "domain_research", "order_index": 4, "is_start": False,
            "question_text": "What kind of problems do you most want to solve in your career?",
            "options": [
                {"text": "Disease, health and medicine challenges",        "tag": "Healthcare", "next_id": 4050},
                {"text": "Climate, environment and sustainability",        "tag": "Healthcare", "next_id": 4050},
                {"text": "Fundamental science — understanding the universe","tag": "Technology","next_id": 4050},
                {"text": "Technology and computing challenges",            "tag": "Technology", "next_id": 4050},
            ]
        },

        # Domain — Other PG
        {
            "id": 4040, "level": "pg", "phase": "domain_other", "order_index": 2, "is_start": False,
            "question_text": "What is your primary goal after completing your PG?",
            "options": [
                {"text": "Senior role in my specialisation field",         "tag": "Creative",   "next_id": 4041},
                {"text": "Academia — teaching and research",               "tag": "Healthcare", "next_id": 4041},
                {"text": "Government service or civil services",           "tag": "Business",   "next_id": 4041},
                {"text": "Switch to a different field entirely",           "tag": "Technology", "next_id": 4041},
            ]
        },
        {
            "id": 4041, "level": "pg", "phase": "domain_other", "order_index": 3, "is_start": False,
            "question_text": "How do you want to spend most of your working hours?",
            "options": [
                {"text": "Writing, researching and creating content",      "tag": "Creative",   "next_id": 4042},
                {"text": "Teaching, training and developing others",       "tag": "Healthcare", "next_id": 4042},
                {"text": "Policy, law and governance work",                "tag": "Business",   "next_id": 4042},
                {"text": "Building or managing projects and teams",        "tag": "Business",   "next_id": 4042},
            ]
        },
        {
            "id": 4042, "level": "pg", "phase": "domain_other", "order_index": 4, "is_start": False,
            "question_text": "What legacy do you want your career to leave?",
            "options": [
                {"text": "Work that inspired or moved people creatively",  "tag": "Creative",   "next_id": 4050},
                {"text": "Shaped the minds of the next generation",        "tag": "Healthcare", "next_id": 4050},
                {"text": "Changed laws or policy for the better",          "tag": "Business",   "next_id": 4050},
                {"text": "Built something lasting and impactful",          "tag": "Technology", "next_id": 4050},
            ]
        },

        # Phase 3 — Personality (same for all PG)
        {
            "id": 4050, "level": "pg", "phase": "personality", "order_index": 5, "is_start": False,
            "question_text": "At this stage of your career, what motivates you most?",
            "options": [
                {"text": "Mastering my craft and becoming the best",       "tag": "Technology", "next_id": 4051},
                {"text": "Building influence, income and leadership",      "tag": "Business",   "next_id": 4051},
                {"text": "Creating work that expresses my unique voice",   "tag": "Creative",   "next_id": 4051},
                {"text": "Contributing to something bigger than myself",   "tag": "Healthcare", "next_id": 4051},
            ]
        },
        {
            "id": 4051, "level": "pg", "phase": "personality", "order_index": 6, "is_start": False,
            "question_text": "How do you prefer to make important decisions?",
            "options": [
                {"text": "Data and analysis — I need evidence",            "tag": "Technology", "next_id": 4052},
                {"text": "Intuition and experience — I trust my gut",      "tag": "Business",   "next_id": 4052},
                {"text": "Gut feeling and creative instinct",              "tag": "Creative",   "next_id": 4052},
                {"text": "Impact on people — what feels right ethically",  "tag": "Healthcare", "next_id": 4052},
            ]
        },
        {
            "id": 4052, "level": "pg", "phase": "personality", "order_index": 7, "is_start": False,
            "question_text": "What does your ideal workday look like?",
            "options": [
                {"text": "Deep work — coding, researching or building",    "tag": "Technology", "next_id": 4060},
                {"text": "Meetings, strategy and leading a team",          "tag": "Business",   "next_id": 4060},
                {"text": "Creating, designing or producing content",       "tag": "Creative",   "next_id": 4060},
                {"text": "Working directly with people to solve problems", "tag": "Healthcare", "next_id": 4060},
            ]
        },

        # Phase 4 — Confirmation
        {
            "id": 4060, "level": "pg", "phase": "confirmation", "order_index": 8, "is_start": False,
            "question_text": "At the peak of your career, which title would make you proudest?",
            "options": [
                {"text": "Chief Technology Officer or Lead Researcher",    "tag": "Technology", "next_id": None},
                {"text": "CEO, Managing Director or Partner",              "tag": "Business",   "next_id": None},
                {"text": "Award-winning creative or cultural figure",      "tag": "Creative",   "next_id": None},
                {"text": "Doctor, Professor or Social Impact Leader",      "tag": "Healthcare", "next_id": None},
            ]
        },
    ]

    for q_data in questions_data:
        question = Question(
            id=q_data["id"],
            level=q_data["level"],
            question_text=q_data["question_text"],
            order_index=q_data["order_index"],
            is_start=q_data["is_start"]
        )
        db.add(question)
        db.flush()

        for opt in q_data["options"]:
            option = QuestionOption(
                question_id=q_data["id"],
                option_text=opt["text"],
                category_tag=opt["tag"],
                next_question_id=opt["next_id"]
            )
            db.add(option)

    db.commit()
    print(f"✅ Questions seeded — {len(questions_data)} questions across 4 levels")
    print("✅ Each student gets 9-10 questions personalised to their answers")

if __name__ == "__main__":
    print("🌱 Seeding questions...")
    seed_questions()
    db.close()
    print("🎉 Done!")