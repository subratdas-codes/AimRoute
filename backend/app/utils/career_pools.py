# career_pools.py
# Place this file at: backend/app/utils/career_pools.py

CAREER_POOLS = {
    "10th": {
        "Technology": [
            {"career": "Science with PCM", "desc": "Physics, Chemistry, Maths — gateway to Engineering & Tech"},
            {"career": "Science with PCB", "desc": "Physics, Chemistry, Biology — gateway to Medical & Life Sciences"},
            {"career": "Diploma in Computer Science", "desc": "3-year polytechnic diploma, quick entry into IT jobs"},
            {"career": "Diploma in Electronics & Communication", "desc": "Hardware, circuits, embedded systems"},
            {"career": "ITI in Electrician / Fitter", "desc": "Govt-recognised trade certificate, job-ready in 1-2 years"},
        ],
        "Business": [
            {"career": "Commerce with Maths", "desc": "Accounts, Business Studies, Economics — CA / BBA path"},
            {"career": "Commerce without Maths", "desc": "Business Studies, Economics — BBA / retail management path"},
            {"career": "Diploma in Business Management", "desc": "Short-term diploma for early entry into business roles"},
        ],
        "Creative": [
            {"career": "Arts / Humanities", "desc": "History, Geography, Pol Science — Law / Journalism / UPSC path"},
            {"career": "Diploma in Fine Arts & Design", "desc": "Drawing, graphics, animation — creative career foundation"},
            {"career": "Diploma in Fashion Design", "desc": "Textile, clothing design — fashion industry entry"},
        ],
        "Healthcare": [
            {"career": "Science with PCB", "desc": "Biology stream — MBBS, BAMS, Nursing path"},
            {"career": "Diploma in Nursing (ANM/GNM)", "desc": "2-3 year nursing diploma — Govt hospital jobs"},
            {"career": "Diploma in Paramedical Sciences", "desc": "Lab technician, radiographer — allied health careers"},
        ],
        "general": [
            {"career": "Arts / Humanities", "desc": "Flexible stream — UPSC, Teaching, Social Work"},
            {"career": "Commerce", "desc": "Business, Finance — BBA, B.Com path"},
            {"career": "Vocational Courses (Class 11-12)", "desc": "Skill-based CBSE vocational stream"},
        ],
    },

    "12th": {
        "Technology": [
            {"career": "B.Tech / B.E (JEE)", "desc": "4-year engineering — CSE, ECE, Mechanical, Civil via JEE Main/Advanced"},
            {"career": "BCA — Bachelor of Computer Applications", "desc": "3-year CS degree — software development focus"},
            {"career": "B.Sc Computer Science / IT", "desc": "3-year science degree — programming, data, networking"},
            {"career": "B.Sc Physics / Mathematics", "desc": "Pure science — research, GATE, teaching path"},
            {"career": "B.Arch (Architecture)", "desc": "5-year architecture degree via NATA exam"},
            {"career": "Diploma to B.Tech (Lateral Entry)", "desc": "If you did polytechnic — join B.Tech in 2nd year"},
        ],
        "Business": [
            {"career": "BBA — Bachelor of Business Administration", "desc": "3-year management degree — MBA springboard"},
            {"career": "B.Com (Hons)", "desc": "Commerce degree — CA, finance, banking careers"},
            {"career": "CA Foundation", "desc": "Chartered Accountancy — India's top finance qualification"},
            {"career": "BMS — Bachelor of Management Studies", "desc": "Mumbai University's flagship management degree"},
            {"career": "Economics (Hons) — Delhi University", "desc": "Strong base for banking exams, civil services, research"},
            {"career": "Hotel Management (NCHMCT JEE)", "desc": "Hospitality, tourism, event management"},
        ],
        "Creative": [
            {"career": "BA English / Journalism & Mass Communication", "desc": "Media, writing, PR, content careers"},
            {"career": "BFA — Bachelor of Fine Arts", "desc": "Painting, sculpture, visual arts"},
            {"career": "B.Des — Bachelor of Design (NID/NIFT)", "desc": "Product, graphic, fashion, UX design via entrance exam"},
            {"career": "BA Psychology", "desc": "Mental health, counselling, HR, research path"},
            {"career": "BA LLB (Integrated Law)", "desc": "5-year law degree — legal profession, civil services"},
        ],
        "Healthcare": [
            {"career": "MBBS (NEET-UG)", "desc": "5.5-year medical degree — doctor via NEET exam"},
            {"career": "B.Pharm — Bachelor of Pharmacy", "desc": "4-year degree — drug industry, clinical research"},
            {"career": "B.Sc Nursing", "desc": "4-year nursing degree — Govt hospital jobs available"},
            {"career": "BPT — Physiotherapy", "desc": "4.5-year degree — rehabilitation, sports medicine"},
            {"career": "B.Sc Biotechnology", "desc": "Research, pharma, biotech industry"},
            {"career": "BAMS / BHMS (Ayurveda / Homeopathy)", "desc": "Alternative medicine — Govt recognised degrees"},
        ],
        "general": [
            {"career": "BA General", "desc": "Arts degree — flexible for teaching, civil services"},
            {"career": "NDA — National Defence Academy", "desc": "Join Indian Army / Navy / Air Force after 12th"},
            {"career": "Polytechnic / Lateral Entry Diploma", "desc": "Technical diploma after PCM for engineering entry"},
            {"career": "B.Ed after Graduation", "desc": "Teaching career path — plan for degree first"},
        ],
    },

    "grad": {
        "Technology": [
            {"career": "MCA — Master of Computer Applications", "desc": "2-year PG in CS — software industry standard"},
            {"career": "M.Tech / M.E (GATE)", "desc": "2-year tech PG — PSU jobs, research, academia via GATE"},
            {"career": "MS Abroad (GRE)", "desc": "Masters in USA/Canada/Germany — research or industry"},
            {"career": "Data Science / AI PG Diploma", "desc": "IIT / IISc / Coursera PG programs in Data Science, ML"},
            {"career": "Software Engineer (Campus/Off-campus)", "desc": "Direct placement in IT companies — TCS, Infosys, Wipro, startups"},
            {"career": "GATE Exam → PSU Jobs", "desc": "BHEL, ONGC, IOCL — Govt engineering jobs via GATE score"},
        ],
        "Business": [
            {"career": "MBA (CAT — IIM)", "desc": "2-year management PG — top colleges via CAT exam"},
            {"career": "MBA (MAT / CMAT / XAT)", "desc": "Management PG via state-level entrance exams"},
            {"career": "CA Final / CFA / CMA", "desc": "Professional finance certifications — banking & finance careers"},
            {"career": "Start Own Business", "desc": "Entrepreneurship — leverage your degree in your domain"},
            {"career": "Corporate Job — Finance / Marketing / HR", "desc": "Direct industry placement in management roles"},
        ],
        "Creative": [
            {"career": "MA Journalism / Mass Communication", "desc": "PG in media — editor, reporter, content strategist"},
            {"career": "M.Des — Master of Design", "desc": "NID, NIFT PG programs — product, UX, fashion design"},
            {"career": "UX / UI Design (PG Certificate)", "desc": "Product design roles in tech companies"},
            {"career": "Content & Digital Marketing Career", "desc": "Writing, SEO, social media — growing field"},
        ],
        "Healthcare": [
            {"career": "MD / MS (NEET-PG)", "desc": "Postgraduate medical specialisation after MBBS"},
            {"career": "M.Pharm / MBA Pharma", "desc": "Pharma industry management and R&D"},
            {"career": "MPH — Master of Public Health", "desc": "WHO, NGO, Govt health policy roles"},
            {"career": "Research Fellowship (ICMR / DBT)", "desc": "Funded research in Indian biomedical institutions"},
        ],
        "general": [
            {"career": "UPSC Civil Services (IAS/IPS/IFS)", "desc": "India's top Govt exam — 2-3 years preparation"},
            {"career": "SSC CGL / CHSL", "desc": "Central Govt jobs — Tax Inspector, Auditor, Clerk"},
            {"career": "Banking Exams (IBPS / SBI PO)", "desc": "Bank PO, Clerk — stable Govt banking jobs"},
            {"career": "State PSC Exams", "desc": "State government administrative services"},
            {"career": "B.Ed + TGT / PGT Teaching", "desc": "Govt school teacher — KVS, NVS, State Board exams"},
        ],
    },

    "pg": {
        "Technology": [
            {"career": "Senior Software Engineer (Product Companies)", "desc": "Google, Microsoft, Amazon — 5-8 LPA to 50+ LPA"},
            {"career": "AI / ML Engineer / Researcher", "desc": "Deep learning, NLP, computer vision — highest demand"},
            {"career": "PhD in CS / AI (IIT / IISc / Abroad)", "desc": "Research career — academia or industry R&D labs"},
            {"career": "Scientist at ISRO / DRDO / CDAC", "desc": "Govt research organisations — stable, prestigious"},
            {"career": "NIC — National Informatics Centre", "desc": "Central Govt IT services — Scientist B post"},
            {"career": "Startup CTO / Tech Lead", "desc": "Build your own product or lead early-stage tech team"},
        ],
        "Business": [
            {"career": "Product Manager (Tech Companies)", "desc": "Strategy + tech — PM roles at Google, Flipkart, startups"},
            {"career": "Management Consultant (McKinsey / BCG)", "desc": "Top-tier consulting — MBA from IIM preferred"},
            {"career": "Investment Banking / VC", "desc": "Finance careers — CFA + MBA combination strong"},
            {"career": "Entrepreneur / Startup Founder", "desc": "Launch your own venture with PG expertise"},
        ],
        "Creative": [
            {"career": "Creative Director / Design Lead", "desc": "Senior creative roles in agencies or product companies"},
            {"career": "UX Research Lead", "desc": "User research, product strategy — tech + empathy"},
            {"career": "Independent Filmmaker / Content Creator", "desc": "OTT era — strong demand for original content"},
            {"career": "University Professor (NET / SET)", "desc": "Teaching + research in design / media / arts colleges"},
        ],
        "Healthcare": [
            {"career": "DM / MCh — Superspeciality Medical", "desc": "Cardiology, Neurosurgery etc — top of medical career"},
            {"career": "Medical Research Scientist (ICMR / AIIMS)", "desc": "Clinical trials, drug development, public health"},
            {"career": "WHO / UN Health Programme Officer", "desc": "International health organisations — MPH preferred"},
            {"career": "Medical College Faculty (Professor)", "desc": "Teaching + patient care — MD required"},
        ],
        "general": [
            {"career": "IAS / IPS / IFS (UPSC)", "desc": "Civil services — most prestigious Govt career in India"},
            {"career": "State PSC (Deputy Collector / DSP)", "desc": "State administration — SDM, BDO, DSP level posts"},
            {"career": "University Professor (UGC-NET)", "desc": "Teaching + research in colleges — NET exam required"},
            {"career": "Defence Officer (CDS / AFCAT)", "desc": "Indian Army, Navy, Air Force officer entry after graduation"},
        ],
    },
}

SALARY_RANGES = {
    # 10th streams
    "Science with PCM":                        {"min": "₹3L", "max": "₹8L",  "note": "After completing engineering/tech degree"},
    "Science with PCB":                        {"min": "₹4L", "max": "₹12L", "note": "After completing MBBS/medical degree"},
    "Commerce with Maths":                     {"min": "₹3L", "max": "₹10L", "note": "After CA / BBA / B.Com"},
    "Arts / Humanities":                       {"min": "₹3L", "max": "₹8L",  "note": "After BA + further studies"},
    "Diploma in Computer Science":             {"min": "₹2L", "max": "₹5L",  "note": "Entry level IT roles"},
    "Diploma in Nursing (ANM/GNM)":            {"min": "₹2L", "max": "₹4L",  "note": "Govt and private hospitals"},

    # 12th degrees
    "B.Tech / B.E (JEE)":                     {"min": "₹4L", "max": "₹25L", "note": "Varies by branch and college tier"},
    "BCA — Bachelor of Computer Applications": {"min": "₹3L", "max": "₹10L", "note": "Software developer roles"},
    "MBBS (NEET-UG)":                         {"min": "₹6L", "max": "₹30L", "note": "After internship + specialisation"},
    "CA Foundation":                           {"min": "₹7L", "max": "₹40L", "note": "CA Final qualification required"},
    "BBA — Bachelor of Business Administration":{"min": "₹3L", "max": "₹8L", "note": "Entry management roles"},
    "B.Des — Bachelor of Design (NID/NIFT)":   {"min": "₹4L", "max": "₹18L", "note": "Design industry — top colleges matter"},
    "NDA — National Defence Academy":          {"min": "₹6L", "max": "₹15L", "note": "Plus allowances and govt benefits"},

    # Grad level
    "MCA — Master of Computer Applications":   {"min": "₹5L", "max": "₹20L", "note": "Software / product companies"},
    "M.Tech / M.E (GATE)":                    {"min": "₹6L", "max": "₹25L", "note": "PSUs offer ₹8-12L starting"},
    "MBA (CAT — IIM)":                        {"min": "₹10L", "max": "₹50L", "note": "IIM graduates — top packages"},
    "UPSC Civil Services (IAS/IPS/IFS)":      {"min": "₹7L", "max": "₹18L", "note": "Plus perks, housing, allowances"},
    "Software Engineer (Campus/Off-campus)":   {"min": "₹4L", "max": "₹20L", "note": "Product > Service companies"},
    "GATE Exam → PSU Jobs":                   {"min": "₹8L", "max": "₹15L", "note": "BHEL, ONGC, IOCL CTC"},

    # PG level
    "Senior Software Engineer (Product Companies)": {"min": "₹15L", "max": "₹60L", "note": "FAANG can go much higher"},
    "AI / ML Engineer / Researcher":           {"min": "₹12L", "max": "₹80L", "note": "Highest demand in 2024-25"},
    "PhD in CS / AI (IIT / IISc / Abroad)":   {"min": "₹8L", "max": "₹50L", "note": "Academia or research lab"},
    "Scientist at ISRO / DRDO / CDAC":        {"min": "₹8L", "max": "₹18L", "note": "Plus Govt perks and stability"},
    "IAS / IPS / IFS (UPSC)":                 {"min": "₹7L", "max": "₹18L", "note": "Prestige + power + perks"},
    "DM / MCh — Superspeciality Medical":      {"min": "₹20L", "max": "₹1Cr+","note": "Private practice can be much higher"},
}

ROADMAP_STEPS = {
    "10th": ["10th Exam", "Choose Stream", "Class 11-12", "Graduation", "Career"],
    "12th": ["12th Exam", "Entrance Exam", "Degree (3-5 yrs)", "Job / PG", "Career"],
    "grad": ["Graduation", "Entrance / Job Hunt", "PG / Certification", "Senior Role", "Career"],
    "pg":   ["PG Degree", "Specialisation", "Industry / Research", "Leadership", "Career"],
}

LEVEL_LABELS = {
    "10th": {"title": "Recommended streams after 10th",   "subtitle": "Choose the path that fits your interests best"},
    "12th": {"title": "Best degree options after 12th",   "subtitle": "Your stream + interest points to these degrees"},
    "grad": {"title": "Your next best step after graduation", "subtitle": "PG programs, jobs, and Govt exam paths"},
    "pg":   {"title": "Career paths after post graduation",   "subtitle": "Specialisation, research, and leadership roles"},
}
