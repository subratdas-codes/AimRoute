from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
import httpx
import os
#from app.utils.dependencies import get_current_user_optional

router = APIRouter(prefix="/chat", tags=["Chat"])

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: dict = {}

def build_system_prompt(context: dict) -> str:
    if not context:
        return """You are AimRoute AI, a friendly and expert Indian career guidance counsellor.
Help students with career advice, college selection, exam preparation, salary insights,
and skill development. Keep responses concise, practical, and encouraging.
Use Indian context — INR salaries, Indian colleges, Indian exams (JEE/NEET/CAT/GATE).
Always respond in a warm, mentor-like tone. Use bullet points for clarity."""

    top_careers = ""
    for i, c in enumerate(context.get("top_careers", []), 1):
        top_careers += f"\n  {i}. {c.get('career','N/A')} ({c.get('fit','N/A')}) — {c.get('salary_min','N/A')} to {c.get('salary_max','N/A')}"

    return f"""You are AimRoute AI, a friendly and expert Indian career guidance counsellor built into the AimRoute platform.

STUDENT PROFILE:
- Education Level: {context.get('level','N/A').upper()} passed
- Academic Score: {context.get('percentage','N/A')}%
- Dominant Interest: {context.get('dominant_category','N/A')}
- Top Career Matches: {top_careers}

AIMROUTE PLATFORM FEATURES YOU CAN GUIDE ABOUT:
- Career Quiz: Students can take quiz at /career-path for all levels (10th/12th/grad/pg)
- Result Page: Shows top career matches, salary ranges, roadmap, college suggestions
- College Finder: Suggests colleges filtered by state and percentage from NIRF 2024 data
- Roadmap Page: Step by step career path with exams, skills, timeline
- Dashboard: Tracks all quiz attempts, history, career stats
- Settings: Change password, manage account

YOUR EXPERTISE:
1. Career depth analysis — deep dive into their specific career paths with Indian context
2. College guidance — which colleges suit their % and interest (NIRF ranked)
3. Exam preparation — specific exams with timeline (JEE/NEET/CAT/GATE/GRE etc)
4. Salary insights — realistic INR salary ranges and negotiation tips
5. Skill gap analysis — what skills they're missing for their top career
6. Career comparison — compare career options side by side
7. Platform help — guide them to use AimRoute features effectively

RULES:
- Always reference their actual data ({context.get('percentage','N/A')}%, {context.get('dominant_category','N/A')}, {context.get('level','N/A')})
- Keep responses under 250 words unless asked for more detail
- Use bullet points for lists
- Be encouraging but realistic
- Suggest next actionable steps always
- If they ask about colleges, remind them to use the state filter on the Result page
- If they ask about their roadmap, remind them to visit /roadmap page
- Use Indian rupees (₹) for all salary mentions"""


@router.post("/message")
async def chat_message(request: ChatRequest):
    system_prompt = build_system_prompt(request.context)

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 1000,
                "system": system_prompt,
                "messages": [{"role": m.role, "content": m.content} for m in request.messages],
            },
        )
        data = response.json()
        reply = data.get("content", [{}])[0].get("text", "Sorry, I could not process that.")
        return {"reply": reply}