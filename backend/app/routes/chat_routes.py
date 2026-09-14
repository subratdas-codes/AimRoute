import os
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

load_dotenv()  # ← load .env right here in this file too

router = APIRouter(prefix="/chat", tags=["chat"])

# ← Read keys + model names inside functions, not at module level
def get_groq_key():    return os.getenv("GROQ_API_KEY", "")
def get_gemini_key():  return os.getenv("GEMINI_API_KEY", "")
def get_openai_key():  return os.getenv("OPENAI_API_KEY", "")
def get_groq_model():    return os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
def get_gemini_model():  return os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
def get_openai_model():  return os.getenv("OPENAI_MODEL", "gpt-4o-mini")

SYSTEM_PROMPT = """You are AimRoute's AI career counselor — a warm, knowledgeable guide helping Indian students (10th to PG level) make smart career decisions.

You help with:
- Career analysis and comparisons (e.g., "Should I choose CSE or ECE?")
- College guidance based on their NIRF scores, state, and percentage
- Entrance exam prep: JEE, NEET, CAT, CLAT, GATE, UPSC, etc.
- Skill gap analysis and what to learn next
- Salary expectations and growth paths
- Roadmap planning — what to do after 10th, 12th, graduation
- Navigating AimRoute features (quiz, results, dashboard, roadmap page)

Rules:
- Always relate answers to the student's level, percentage, and career match if provided in context
- Be encouraging but realistic — don't overpromise
- Keep responses concise (3-6 sentences usually) unless a detailed breakdown is needed
- Use simple English; avoid heavy jargon
- If asked something unrelated to careers/education, politely redirect
- Never mention that you are powered by Groq or Gemini or any third-party AI
- Always present yourself as AimRoute's built-in AI assistant"""


class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    context: Optional[Dict[str, Any]] = {}


def build_context_prefix(context: dict) -> str:
    if not context:
        return ""
    parts = []
    if context.get("level"):        parts.append(f"Student level: {context['level']}")
    if context.get("percentage"):   parts.append(f"Percentage: {context['percentage']}%")
    if context.get("dominant_category"): parts.append(f"Top interest area: {context['dominant_category']}")
    if context.get("top_career"):   parts.append(f"Best career match: {context['top_career']}")
    if context.get("fit_label"):    parts.append(f"Fit label: {context['fit_label']}")
    return "[Student profile: " + ", ".join(parts) + "]\n\n" if parts else ""


async def call_groq(messages_payload: list, system: str) -> str:
    key = get_groq_key()
    print(f"[Groq] Using key: {key[:12]}...")  # debug
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    body = {
        "model": get_groq_model(),
        "messages": [{"role": "system", "content": system}] + messages_payload,
        "max_tokens": 700,
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(url, json=body, headers=headers)
        print(f"[Groq] Status: {res.status_code}, Body: {res.text[:200]}")  # debug
        res.raise_for_status()
        data = res.json()
        return data["choices"][0]["message"]["content"].strip()


async def call_gemini(messages_payload: list, system: str) -> str:
    key = get_gemini_key()
    model = get_gemini_model()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
    contents = []
    for msg in messages_payload:
        role = "user" if msg["role"] == "user" else "model"
        contents.append({"role": role, "parts": [{"text": msg["content"]}]})
    body = {
        "system_instruction": {"parts": [{"text": system}]},
        "contents": contents,
        "generationConfig": {"maxOutputTokens": 700, "temperature": 0.7},
    }
    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(url, json=body)
        res.raise_for_status()
        data = res.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


async def call_openai(messages_payload: list, system: str) -> str:
    key = get_openai_key()
    if not key:
        raise RuntimeError("No OpenAI key configured")
    body = {
        "model": get_openai_model(),
        "messages": [{"role": "system", "content": system}] + messages_payload,
        "max_tokens": 700,
        "temperature": 0.7,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(
            "https://api.openai.com/v1/chat/completions",
            json=body,
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        )
        res.raise_for_status()
        data = res.json()
        return data["choices"][0]["message"]["content"].strip()


def fallback_reply(context: dict) -> str:
    level = (context.get("level") or "12th").lower()
    category = (context.get("dominant_category") or "General").lower()

    intro = "I couldn't reach the AI service just now, so here's expert guidance from AimRoute:"

    level_tips = {
        "10th": "After Class 10, your next big choice is the stream in Class 11-12. Pick based on interest, not peer pressure.",
        "12th": "Focus on your entrance exams (JEE / NEET / CUET / CLAT / NID) and keep your board percentage high — it decides college quality.",
        "grad": "Build a strong portfolio, internships and projects now. Your degree matters less than your skills and experience.",
        "pg": "Specialise deeply and target industry or research goals. Networking and published work open the best doors.",
    }
    category_tips = {
        "technology": "For tech careers: master fundamentals (algorithms, one strong language), build 2-4 real projects, and practise DSA for interviews. AI/ML, full-stack and cloud are in high demand.",
        "healthcare": "For healthcare careers: a strong NEET rank or allied-health course (nursing, pharmacy, physiotherapy) gives stable, meaningful careers. Keep a backup plan below your dream college.",
        "business": "For business careers: internships, communication skills and understanding of the market matter most. CA/MBA/startups are all strong if you build consistent execution habits.",
        "creative": "For creative careers: build a visible portfolio across design, writing, film or performance. Consistency and personal projects beat certificates.",
        "science": "For science careers: choose a research or application focus early. Practical lab skills and published work build the strongest profiles.",
    }

    starter = level_tips.get(level, level_tips["12th"])
    cat = category_tips.get(category, "Focus on your strengths and keep a realistic backup plan while chasing your dream career.")

    return f"{intro}\n\n{starter}\n\n{cat}\n\nTry me again shortly — once the AI service is back you'll get fully personalised answers."


@router.post("/message")
async def chat_message(request: ChatRequest):
    groq_key = get_groq_key()
    gemini_key = get_gemini_key()
    openai_key = get_openai_key()

    context_prefix = build_context_prefix(request.context or {})
    messages_payload = []
    for i, msg in enumerate(request.messages):
        content = msg.content
        if i == 0 and msg.role == "user" and context_prefix:
            content = context_prefix + content
        messages_payload.append({"role": msg.role, "content": content})

    errors = []

    if groq_key:
        try:
            return {"reply": await call_groq(messages_payload, SYSTEM_PROMPT)}
        except Exception as e:
            errors.append(f"Groq: {e}")

    if openai_key:
        try:
            return {"reply": await call_openai(messages_payload, SYSTEM_PROMPT)}
        except Exception as e:
            errors.append(f"OpenAI: {e}")

    if gemini_key:
        try:
            return {"reply": await call_gemini(messages_payload, SYSTEM_PROMPT)}
        except Exception as e:
            errors.append(f"Gemini: {e}")

    if errors:
        print(f"[Chat] All AI providers failed: {'; '.join(errors)}")

    return {"reply": fallback_reply(request.context or {})}