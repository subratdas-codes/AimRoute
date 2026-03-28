from app.database.connection import SessionLocal
from app.database.base import Base
from app.database.connection import engine
from app.models.question_model import Question, QuestionOption
from app.models import user_model, result_model, question_model
from app.models.college_model import College

# Create all tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed_questions():
    # Clear existing questions first
    db.query(QuestionOption).delete()
    db.query(Question).delete()
    db.commit()

    questions_data = [

        # ── 10TH LEVEL ──────────────────────────────
        {
            "id": 1, "level": "10th",
            "question_text": "Your school is hosting multiple events. You can only join ONE. What do you choose?",
            "order_index": 1, "is_start": True,
            "options": [
                {"text": "🧪 Build a science project", "tag": "Technology", "next_id": 2},
                {"text": "🎨 Create artwork for an exhibition", "tag": "Creative", "next_id": 5},
                {"text": "💼 Manage and organise the event", "tag": "Business", "next_id": 6},
                {"text": "🤝 Volunteer to help participants", "tag": "Healthcare", "next_id": 7},
            ]
        },
        {
            "id": 2, "level": "10th",
            "question_text": "You love tech and science — what excites you more?",
            "order_index": 2, "is_start": False,
            "options": [
                {"text": "Writing code and building apps", "tag": "Technology", "next_id": 3},
                {"text": "Understanding how the body works", "tag": "Healthcare", "next_id": 7},
                {"text": "Physics and engineering problems", "tag": "Technology", "next_id": 4},
                {"text": "Maths and data patterns", "tag": "Technology", "next_id": 3},
            ]
        },
        {
            "id": 3, "level": "10th",
            "question_text": "In tech, what would you enjoy most?",
            "order_index": 3, "is_start": False,
            "options": [
                {"text": "Building websites and apps", "tag": "Technology", "next_id": 8},
                {"text": "Working with AI and data", "tag": "Technology", "next_id": 8},
                {"text": "Cybersecurity and networks", "tag": "Technology", "next_id": 8},
                {"text": "Game development", "tag": "Technology", "next_id": 8},
            ]
        },
        {
            "id": 4, "level": "10th",
            "question_text": "Which engineering field sounds most exciting?",
            "order_index": 4, "is_start": False,
            "options": [
                {"text": "Civil — building roads and bridges", "tag": "Technology", "next_id": 8},
                {"text": "Mechanical — engines and machines", "tag": "Technology", "next_id": 8},
                {"text": "Electrical — power and circuits", "tag": "Technology", "next_id": 8},
                {"text": "Computer Science — software", "tag": "Technology", "next_id": 8},
            ]
        },
        {
            "id": 5, "level": "10th",
            "question_text": "You are creative — what type of creative work?",
            "order_index": 5, "is_start": False,
            "options": [
                {"text": "Visual design and illustration", "tag": "Creative", "next_id": 8},
                {"text": "Acting, music or performance", "tag": "Creative", "next_id": 8},
                {"text": "Writing stories or content", "tag": "Creative", "next_id": 8},
                {"text": "Fashion or interior design", "tag": "Creative", "next_id": 8},
            ]
        },
        {
            "id": 6, "level": "10th",
            "question_text": "You are business-minded — what area interests you?",
            "order_index": 6, "is_start": False,
            "options": [
                {"text": "Starting my own business", "tag": "Business", "next_id": 8},
                {"text": "Finance and banking", "tag": "Business", "next_id": 8},
                {"text": "Marketing and sales", "tag": "Business", "next_id": 8},
                {"text": "Management and leadership", "tag": "Business", "next_id": 8},
            ]
        },
        {
            "id": 7, "level": "10th",
            "question_text": "You want to help people — how?",
            "order_index": 7, "is_start": False,
            "options": [
                {"text": "As a doctor or nurse", "tag": "Healthcare", "next_id": 8},
                {"text": "As a teacher or counsellor", "tag": "Healthcare", "next_id": 8},
                {"text": "Through social work or NGO", "tag": "Healthcare", "next_id": 8},
                {"text": "As a psychologist", "tag": "Healthcare", "next_id": 8},
            ]
        },
        {
            "id": 8, "level": "10th",
            "question_text": "What kind of future excites you the most?",
            "order_index": 8, "is_start": False,
            "options": [
                {"text": "A high paying tech career", "tag": "Technology", "next_id": 9},
                {"text": "A career that helps society", "tag": "Healthcare", "next_id": 9},
                {"text": "Running my own business", "tag": "Business", "next_id": 9},
                {"text": "A creative and expressive life", "tag": "Creative", "next_id": 9},
            ]
        },
        {
            "id": 9, "level": "10th",
            "question_text": "How do you like to work?",
            "order_index": 9, "is_start": False,
            "options": [
                {"text": "Independently with focus", "tag": "Technology", "next_id": None},
                {"text": "With a team of people", "tag": "Business", "next_id": None},
                {"text": "Helping others directly", "tag": "Healthcare", "next_id": None},
                {"text": "Freely and creatively", "tag": "Creative", "next_id": None},
            ]
        },

        # ── 12TH LEVEL ──────────────────────────────
        {
            "id": 10, "level": "12th",
            "question_text": "Did you take a gap year after 12th?",
            "order_index": 1, "is_start": True,
            "options": [
                {"text": "No, going directly for admission", "tag": "direct", "next_id": 11},
                {"text": "Yes, I prepared for entrance exams", "tag": "Technology", "next_id": 11},
                {"text": "Yes, I learned a skill or did a course", "tag": "Technology", "next_id": 11},
                {"text": "Yes, personal or family reasons", "tag": "general", "next_id": 11},
            ]
        },
        {
            "id": 11, "level": "12th",
            "question_text": "Which stream did you study in 12th?",
            "order_index": 2, "is_start": False,
            "options": [
                {"text": "Science — PCM (Physics, Chemistry, Maths)", "tag": "Technology", "next_id": 12},
                {"text": "Science — PCB (Physics, Chemistry, Biology)", "tag": "Healthcare", "next_id": 14},
                {"text": "Commerce", "tag": "Business", "next_id": 15},
                {"text": "Arts / Humanities", "tag": "Creative", "next_id": 16},
            ]
        },
        {
            "id": 12, "level": "12th",
            "question_text": "PCM student — what is your main goal?",
            "order_index": 3, "is_start": False,
            "options": [
                {"text": "B.Tech through JEE", "tag": "Technology", "next_id": 13},
                {"text": "B.Sc in Maths or Physics", "tag": "Technology", "next_id": None},
                {"text": "BCA or B.Sc Computer Science", "tag": "Technology", "next_id": None},
                {"text": "Architecture (B.Arch)", "tag": "Creative", "next_id": None},
            ]
        },
        {
            "id": 13, "level": "12th",
            "question_text": "B.Tech — which branch interests you most?",
            "order_index": 4, "is_start": False,
            "options": [
                {"text": "Computer Science / IT", "tag": "Technology", "next_id": None},
                {"text": "Electronics and Communication", "tag": "Technology", "next_id": None},
                {"text": "Mechanical Engineering", "tag": "Technology", "next_id": None},
                {"text": "Civil Engineering", "tag": "Technology", "next_id": None},
            ]
        },
        {
            "id": 14, "level": "12th",
            "question_text": "PCB student — what is your goal?",
            "order_index": 5, "is_start": False,
            "options": [
                {"text": "MBBS through NEET", "tag": "Healthcare", "next_id": None},
                {"text": "B.Pharm or Pharmacy", "tag": "Healthcare", "next_id": None},
                {"text": "Nursing or Physiotherapy", "tag": "Healthcare", "next_id": None},
                {"text": "Biotechnology or Research", "tag": "Healthcare", "next_id": None},
            ]
        },
        {
            "id": 15, "level": "12th",
            "question_text": "Commerce student — what path interests you?",
            "order_index": 6, "is_start": False,
            "options": [
                {"text": "CA (Chartered Accountant)", "tag": "Business", "next_id": None},
                {"text": "BBA then MBA", "tag": "Business", "next_id": None},
                {"text": "B.Com and finance career", "tag": "Business", "next_id": None},
                {"text": "Economics and banking", "tag": "Business", "next_id": None},
            ]
        },
        {
            "id": 16, "level": "12th",
            "question_text": "Arts student — what excites you?",
            "order_index": 7, "is_start": False,
            "options": [
                {"text": "Law (BA LLB)", "tag": "Business", "next_id": None},
                {"text": "Journalism and Media", "tag": "Creative", "next_id": None},
                {"text": "Psychology or Social Work", "tag": "Healthcare", "next_id": None},
                {"text": "Design or Fine Arts", "tag": "Creative", "next_id": None},
            ]
        },

        # ── GRADUATION LEVEL ────────────────────────
        {
            "id": 20, "level": "grad",
            "question_text": "Did you take a gap year after graduation?",
            "order_index": 1, "is_start": True,
            "options": [
                {"text": "No gap year", "tag": "direct", "next_id": 21},
                {"text": "Yes, prepared for competitive exams", "tag": "Technology", "next_id": 21},
                {"text": "Yes, worked or freelanced", "tag": "Business", "next_id": 21},
                {"text": "Yes, personal reasons", "tag": "general", "next_id": 21},
            ]
        },
        {
            "id": 21, "level": "grad",
            "question_text": "What is your graduation degree?",
            "order_index": 2, "is_start": False,
            "options": [
                {"text": "B.Tech / B.E (Engineering)", "tag": "Technology", "next_id": 22},
                {"text": "BCA / B.Sc Computer Science", "tag": "Technology", "next_id": 22},
                {"text": "BBA / B.Com / Economics", "tag": "Business", "next_id": 24},
                {"text": "B.Sc / BA / Other", "tag": "general", "next_id": 25},
            ]
        },
        {
            "id": 22, "level": "grad",
            "question_text": "Engineering/Tech graduate — what is your next goal?",
            "order_index": 3, "is_start": False,
            "options": [
                {"text": "Get a software job (placement)", "tag": "Technology", "next_id": 23},
                {"text": "M.Tech / MS (higher studies)", "tag": "Technology", "next_id": None},
                {"text": "MBA for management role", "tag": "Business", "next_id": None},
                {"text": "UPSC / Government exams", "tag": "general", "next_id": None},
            ]
        },
        {
            "id": 23, "level": "grad",
            "question_text": "What kind of tech role interests you?",
            "order_index": 4, "is_start": False,
            "options": [
                {"text": "Software Development", "tag": "Technology", "next_id": None},
                {"text": "Data Science / AI / ML", "tag": "Technology", "next_id": None},
                {"text": "DevOps / Cloud", "tag": "Technology", "next_id": None},
                {"text": "Product Management", "tag": "Business", "next_id": None},
            ]
        },
        {
            "id": 24, "level": "grad",
            "question_text": "Business graduate — what next?",
            "order_index": 5, "is_start": False,
            "options": [
                {"text": "MBA from top college", "tag": "Business", "next_id": None},
                {"text": "CA / CFA certification", "tag": "Business", "next_id": None},
                {"text": "Start own business", "tag": "Business", "next_id": None},
                {"text": "Corporate job in finance/marketing", "tag": "Business", "next_id": None},
            ]
        },
        {
            "id": 25, "level": "grad",
            "question_text": "What is your main interest now?",
            "order_index": 6, "is_start": False,
            "options": [
                {"text": "Switch to tech field", "tag": "Technology", "next_id": None},
                {"text": "Research and academics", "tag": "Healthcare", "next_id": None},
                {"text": "Government or civil services", "tag": "general", "next_id": None},
                {"text": "Creative field or media", "tag": "Creative", "next_id": None},
            ]
        },

        # ── POST GRADUATION ─────────────────────────
        {
            "id": 30, "level": "pg",
            "question_text": "What is your post graduation specialisation?",
            "order_index": 1, "is_start": True,
            "options": [
                {"text": "MCA / M.Tech / M.Sc CS", "tag": "Technology", "next_id": 31},
                {"text": "MBA (Management)", "tag": "Business", "next_id": 32},
                {"text": "M.Sc (Science / Research)", "tag": "Healthcare", "next_id": 33},
                {"text": "MA / M.Com / Other", "tag": "general", "next_id": 34},
            ]
        },
        {
            "id": 31, "level": "pg",
            "question_text": "Tech PG — what is your goal?",
            "order_index": 2, "is_start": False,
            "options": [
                {"text": "Senior software engineer role", "tag": "Technology", "next_id": None},
                {"text": "AI / ML research or industry", "tag": "Technology", "next_id": None},
                {"text": "PhD and academia", "tag": "Technology", "next_id": None},
                {"text": "Startup or product company", "tag": "Business", "next_id": None},
            ]
        },
        {
            "id": 32, "level": "pg",
            "question_text": "MBA — which specialisation?",
            "order_index": 3, "is_start": False,
            "options": [
                {"text": "Finance and investment", "tag": "Business", "next_id": None},
                {"text": "Marketing and brand management", "tag": "Business", "next_id": None},
                {"text": "HR and operations", "tag": "Business", "next_id": None},
                {"text": "Entrepreneurship", "tag": "Business", "next_id": None},
            ]
        },
        {
            "id": 33, "level": "pg",
            "question_text": "Science PG — what is your goal?",
            "order_index": 4, "is_start": False,
            "options": [
                {"text": "Research and publications", "tag": "Healthcare", "next_id": None},
                {"text": "PhD programme", "tag": "Healthcare", "next_id": None},
                {"text": "Industry job in biotech / pharma", "tag": "Healthcare", "next_id": None},
                {"text": "Teaching and academics", "tag": "Healthcare", "next_id": None},
            ]
        },
        {
            "id": 34, "level": "pg",
            "question_text": "What matters most to you now?",
            "order_index": 5, "is_start": False,
            "options": [
                {"text": "Stable government job", "tag": "general", "next_id": None},
                {"text": "High paying private job", "tag": "Business", "next_id": None},
                {"text": "Creative or media career", "tag": "Creative", "next_id": None},
                {"text": "Social impact work", "tag": "Healthcare", "next_id": None},
            ]
        },
    ]

    # Insert all questions and options
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
    print("✅ Questions seeded successfully")
    print(f"✅ Total questions: {len(questions_data)}")

def seed_colleges():
    from app.models.college_model import College
    # Only seed if empty
    existing = db.query(College).count()
    if existing > 0:
        print(f"⚠️  Colleges already seeded ({existing} records) — skipping")
        return
    print("✅ Add college seeding here if needed")

if __name__ == "__main__":
    print("🌱 Starting database seed...")
    seed_questions()
    seed_colleges()
    db.close()
    print("🎉 Seed complete!")