import os
import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

load_dotenv()  # ← load .env right here in this file too

router = APIRouter(prefix="/chat", tags=["chat"])

# ← Read keys inside functions, not at module level
def get_groq_key(): return os.getenv("GROQ_API_KEY", "")
def get_gemini_key(): return os.getenv("GEMINI_API_KEY", "")

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
        "model": "llama-3.3-70b-versatile",
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
    model = "gemini-2.0-flash"
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


@router.post("/message")
async def chat_message(request: ChatRequest):
    groq_key = get_groq_key()
    gemini_key = get_gemini_key()

    print(f"[Chat] Groq key present: {bool(groq_key)}, Gemini key present: {bool(gemini_key)}")

    if not groq_key and not gemini_key:
        raise HTTPException(status_code=500, detail="No AI API keys configured.")

    context_prefix = build_context_prefix(request.context or {})
    messages_payload = []
    for i, msg in enumerate(request.messages):
        content = msg.content
        if i == 0 and msg.role == "user" and context_prefix:
            content = context_prefix + content
        messages_payload.append({"role": msg.role, "content": content})

    if groq_key:
        try:
            reply = await call_groq(messages_payload, SYSTEM_PROMPT)
            return {"reply": reply}
        except Exception as e:
            print(f"[Groq failed] {e} — trying Gemini fallback")

    if gemini_key:
        try:
            reply = await call_gemini(messages_payload, SYSTEM_PROMPT)
            return {"reply": reply}
        except Exception as e:
            print(f"[Gemini failed] {e}")
            raise HTTPException(status_code=500, detail="Both AI providers failed. Please try again.")

    raise HTTPException(status_code=500, detail="No working AI provider available.")