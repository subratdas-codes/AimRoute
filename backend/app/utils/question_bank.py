"""Generates the large extras question pool (brings each level to ~100 questions).

Each generated question offers one option per career category
(Technology, Business, Creative, Healthcare) so any random subset
still produces a complete, valid score. Questions are authored to be
level-appropriate for 10th / 12th / graduation / post-graduation.
"""

from typing import Dict, List

CATEGORIES = ["Technology", "Business", "Creative", "Healthcare"]

# Existing seed question count per level (non-start questions from seed.py).
# The generator tops each level up to TARGET_PER_LEVEL.
SEED_COUNT = {"10th": 17, "12th": 17, "grad": 14, "pg": 16}
SEED_START = {"10th": 1061, "12th": 2061, "grad": 3061, "pg": 4061}
TARGET_PER_LEVEL = 100


# ── Per-level question stems (context/scenario) ───────────────────
STEMS: Dict[str, List[str]] = {
    "10th": [
        "If you had a free Saturday with no homework,",
        "When you pick a story to read or watch,",
        "If you joined a new after-school activity,",
        "During a long summer vacation,",
        "If your school asked you to choose a project,",
        "When you hang out with your friends,",
        "If a teacher gave you a big open-ended assignment,",
        "When you think about your dream classroom,",
        "If you could help your family with something,",
        "When you are left alone for an afternoon,",
        "If you had to teach something to a younger cousin,",
        "During an exam, when you revise at home,",
        "If a school friend launched a small idea,",
        "When you think about the subjects you love,",
        "If you could talk to a famous person for a day,",
        "When your city organises a science or book fair,",
        "If your class had to prepare for a competition,",
        "When you imagine your life ten years from now,",
        "If you won a small state-level award,",
        "When you watch documentaries at home,",
        "If you were made the class monitor for a week,",
        "When you think about which subject comes easiest,",
        "If you had to plan a day for your school friends,",
        "When you scroll through inspiring reels and posts,",
        "If your neighbourhood needed small volunteers,",
    ],
    "12th": [
        "As you apply for college after 12th,",
        "If you could design your ideal degree program,",
        "When you choose between two entrance exams,",
        "If a college festival needed a coordinator,",
        "During your gap time before joining college,",
        "If a startup offered students a summer internship,",
        "When you decide which stream subjects to master,",
        "If you had to write your college application essay,",
        "When you think about a degree that suits your nature,",
        "If your college had an open innovation lab,",
        "When you compare education options in India and abroad,",
        "If a mentor gave you advice for your future,",
        "When you think about the college canteen project,",
        "If you were to choose a skill to learn in 6 months,",
        "When you look at the careers of people you admire,",
        "If a photography, tech or debate club asked you to lead,",
        "During college admissions, if fees were not a concern,",
        "If you had to pick between research and industry to start,",
        "When you think about making your parents proud,",
        "If a friend wanted to start a business with you,",
        "When you decide what to do with your first salary,",
        "If you were choosing between online and campus learning,",
        "When you imagine studying abroad for two years,",
        "If your dream college gave you a project to present,",
        "When you think about which subject never bores you,",
    ],
    "grad": [
        "After completing graduation,",
        "If a company offered you your first job role,",
        "When you decide between a job and higher studies,",
        "If you had to choose a specialisation now,",
        "During your first professional year,",
        "If your city needed professionals to volunteer,",
        "When you compare MBA, M.Tech and a direct job,",
        "If you were given a small team to lead,",
        "When you think about the gap between campus and industry,",
        "If an ed-tech platform invited you to create a course,",
        "During your own career planning,",
        "If you could interview a leader in your field,",
        "When you evaluate which skills employers value most,",
        "If a networking event had one table you could join,",
        "When you think about freelancing versus a steady job,",
        "If someone offered you a foreign internship,",
        "During a career counselling session,",
        "If you were to start a small venture with friends,",
        "When you think about adding a certification to your CV,",
        "If your college alumni reached out with an opportunity,",
        "When you decide your focus for the next three years,",
        "If a senior told you to follow your strengths,",
        "During a project that would define your portfolio,",
        "If you had to explain your college project to strangers,",
        "When you think about work-life balance in your career,",
    ],
    "pg": [
        "With a postgraduate background,",
        "If you had to choose your next big career move,",
        "When you decide between a PhD and the industry,",
        "If an institute invited you to lead a research group,",
        "During your postgraduation years,",
        "If the government asked for experts in your field,",
        "When you compare teaching, research and corporate paths,",
        "If you were mentoring students who just graduated,",
        "When you think about contributing cutting-edge ideas,",
        "If an international university offered you a role,",
        "During a high-stakes project people depend on,",
        "If you could shape a policy in your domain,",
        "When you evaluate which of your skills is most rare,",
        "If a deep-tech lab offered you a senior scientist post,",
        "When you think about your ideal professional legacy,",
        "If an NGO needed expert guidance from your field,",
        "During the design of a national programme in your domain,",
        "If you were writing a book on your specialisation,",
        "When you choose a conference or journal to be part of,",
        "If a startup asked you to be its technical or domain head,",
        "During the birth of a new field that needs leaders,",
        "If you had to pick collaborators for a big project,",
        "When you think about how your work helps society,",
        "If a doctoral candidate asked you to guide their thesis,",
        "When you plan the next five years of your career,",
    ],
}

# ── Short context tails that keep question text unique ─────────
FACETS: Dict[str, List[str]] = {
    "10th": [
        "what would you love to spend that time doing?",
        "which choice would make you happiest?",
        "what would you most likely pick?",
        "which option feels most like you?",
        "what would you be most excited to try?",
    ],
    "12th": [
        "which path would you choose?",
        "what would you focus on most?",
        "which direction feels right for you?",
        "what would you most like to pursue?",
        "which opportunity would you grab?",
    ],
    "grad": [
        "which direction would you take?",
        "what would you invest your effort in?",
        "which role would suit you best?",
        "what would you prioritise?",
        "which move would you make?",
    ],
    "pg": [
        "which contribution would you make?",
        "what would you lead with?",
        "which path would give you the most impact?",
        "what would you dedicate yourself to?",
        "which initiative would you champion?",
    ],
}

# ── Per-level category option phrases (rotated per question) ────
OPTION_PHRASES: Dict[str, Dict[str, List[str]]] = {
    "Technology": {
        "10th": [
            "Tinker with computers, gadgets and technology",
            "Learn how machines, apps and games are built",
            "Do science experiments and engineering projects",
            "Solve technical puzzles and maths challenges",
            "Explore coding, robotics or space technology",
            "Figure out how things around you work",
            "Try new tech tools, apps and devices",
            "Build something useful with simple tools",
        ],
        "12th": [
            "Prepare for a B.Tech, B.Sc or engineering degree",
            "Dive deep into programming, AI and data",
            "Build websites, apps or smart devices",
            "Study applied maths, physics or computer science",
            "Join coding clubs, hackathons and tech fests",
            "Work with electronics, machines or drones",
            "Learn cybersecurity, blockchain or cloud tech",
            "Do research projects in technology labs",
        ],
        "grad": [
            "Pursue M.Tech, MS or data science specialisation",
            "Join a software or product engineering team",
            "Build scalable tech products and systems",
            "Work at the frontier of AI, data and clouds",
            "Automate processes and optimise systems",
            "Learn cloud, DevOps and platform engineering",
            "Solve technical problems for real companies",
            "Design experiments and analyse data deeply",
        ],
        "pg": [
            "Lead advanced research and technology teams",
            "Drive innovation in AI, systems or applied science",
            "Guide PhD scholars and high-end engineering",
            "Shape technology policy and standards at scale",
            "Champion open-source and technical communities",
            "Direct large infrastructure and product platforms",
            "Found technical ventures with deep expertise",
            "Publish high-impact research and patents",
        ],
    },
    "Business": {
        "10th": [
            "Manage money, savings and simple accounts",
            "Sell ideas, products or services to people",
            "Lead a team and organise events",
            "Plan projects, budgets and campaigns",
            "Start small ventures and community businesses",
            "Negotiate and convince others to agree",
            "Keep track of resources and plan ahead",
            "Run fundraising or donation drives",
        ],
        "12th": [
            "Aim for commerce, CA, BBA or finance careers",
            "Manage teams, budgets and campus businesses",
            "Study markets, strategy and entrepreneurship",
            "Build a startup or manage your family business",
            "Prepare for competitive finance and banking exams",
            "Run college fests, shops and student ventures",
            "Pitch ideas and present to investors",
            "Understand how companies make money",
        ],
        "grad": [
            "Aim for an MBA or finance/consulting career",
            "Manage people, budgets and business strategy",
            "Grow a startup or lead corporate functions",
            "Drive marketing, sales and business development",
            "Work in banking, consulting or operations",
            "Analyse markets, risk and company performance",
            "Run projects, teams and client relationships",
            "Build partnerships and investor networks",
        ],
        "pg": [
            "Lead organisations, strategy and large programmes",
            "Scale ventures, products and market presence",
            "Advise boards on decisions, growth and governance",
            "Drive entrepreneurship and business ecosystems",
            "Direct investment, finance and policy decisions",
            "Restructure and turn around large businesses",
            "Shape company vision as a CXO or founder",
            "Govern public-private business partnerships",
        ],
    },
    "Creative": {
        "10th": [
            "Draw, paint, design or write creatively",
            "Make videos, music, photography or artwork",
            "Tell stories, act or perform on stage",
            "Design posters, logos, spaces or fashion",
            "Create school magazines, blogs or campaigns",
            "Invent imaginative worlds and characters",
            "Decorate rooms, boards and celebration themes",
            "Turn everyday things into art",
        ],
        "12th": [
            "Pursue design, media, film or fine arts",
            "Write, edit, photograph or create content",
            "Study psychology, art or mass communication",
            "Build a strong creative portfolio and personal brand",
            "Design for brands, films or social media",
            "Perform, direct or produce creative shows",
            "Blend art with technology for new media",
            "Explore fashion, interior or product design",
        ],
        "grad": [
            "Pursue design, media, UX or creative direction",
            "Create compelling content, brands and campaigns",
            "Prototype products with a strong creative lens",
            "Build your own creative studio or media brand",
            "Direct film, music or digital experiences",
            "Design user experiences for real audiences",
            "Write, document or craft visual storytelling",
            "Bring ideas to life across platforms",
        ],
        "pg": [
            "Lead design, media or creative organisations",
            "Shape creative industries and set new standards",
            "Nurture artists, creators and cutting-edge studios",
            "Pioneer the intersection of art, tech and culture",
            "Direct cultural institutions and global brands",
            "Author thought-leading work in your craft",
            "Design visionary products and experiences",
            "Bridge creative talent with industry funding",
        ],
    },
    "Healthcare": {
        "10th": [
            "Help people stay healthy and well",
            "Learn biology, health and the human body",
            "Care for patients, elders or the community",
            "Teach others about food, fitness and wellness",
            "Support classmates emotionally and practically",
            "Organise cleanliness and hygiene drives",
            "Learn first aid and safety basics",
            "Grow plants or start a small kitchen garden",
        ],
        "12th": [
            "Aim for MBBS, nursing, pharmacy or biotech",
            "Volunteer in health camps and local clinics",
            "Study medicine, life sciences or public health",
            "Help communities with health awareness projects",
            "Prepare for NEET and medical entrance exams",
            "Work in labs, pharmacies or fitness centres",
            "Care for patients and support recovery",
            "Combine biology with technology and research",
        ],
        "grad": [
            "Pursue public health, medicine or research careers",
            "Improve hospitals, clinics and community health",
            "Shape health policy or run wellness programmes",
            "Combine biology and technology for new cures",
            "Work in health-tech, pharma or diagnostics",
            "Counsel and support people's mental health",
            "Manage health data, trials and quality systems",
            "Advocate for healthy living in society",
        ],
        "pg": [
            "Lead public health programmes and policy",
            "Direct hospitals, research centres and health bodies",
            "Advance medicine, vaccines and life sciences",
            "Improve healthcare delivery for millions of people",
            "Govern health systems, regulation and standards",
            "Pioneer precision medicine and health research",
            "Shape global health strategy and funding",
            "Mentor the next generation of medical leaders",
        ],
    },
}


def build_extra_questions() -> List[dict]:
    questions: List[dict] = []
    qid = {level: SEED_START[level] for level in SEED_START}

    for level in ["10th", "12th", "grad", "pg"]:
        needed = TARGET_PER_LEVEL - SEED_COUNT[level]
        stems = STEMS[level]
        facets = FACETS[level]
        pool = {c: OPTION_PHRASES[c][level] for c in CATEGORIES}

        for i in range(needed):
            stem = stems[i % len(stems)]
            facet = facets[(i * 3 + (i // len(stems))) % len(facets)]
            question_text = f"{stem} {facet}".strip()

            options = []
            for cat in CATEGORIES:
                phrase_list = pool[cat]
                text = phrase_list[(i + list(CATEGORIES).index(cat) * 3) % len(phrase_list)]
                options.append({"text": text, "tag": cat, "next_id": None})

            questions.append({
                "id": qid[level],
                "level": level,
                "phase": "extra",
                "order_index": 100 + i,
                "is_start": False,
                "question_text": question_text,
                "options": options,
            })
            qid[level] += 1

    return questions


EXTRA_QUESTIONS = build_extra_questions()