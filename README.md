# AimRoute – AI Based Career Guidance Platform

A full-stack career guidance web platform that recommends
suitable career paths based on user interests and skills.

## Tech Stack
Python, FastAPI, React.js, MySQL, Git, Postman, GitHub Actions

## Features
- AI-based career path recommendation engine
- User authentication and profile management
- Dynamic questionnaire forms for skill and interest assessment
- RESTful APIs for authentication, profiles, and assessments
- MySQL database schema for user and career domain data
- API testing and validation with Postman
- CI/CD pipeline via GitHub Actions

## Architecture
- **Frontend:** React.js with dynamic forms and interactive UI
- **Backend:** FastAPI with RESTful API design
- **Database:** MySQL with structured schema for users and career data
- **Version Control:** Git feature branches with collaborative workflow

## API Endpoints
- `POST /auth/register` – User registration
- `POST /auth/login` – User authentication
- `GET /profile` – Fetch user profile
- `POST /assessment` – Submit skill and interest questionnaire
- `GET /recommendations` – Get career path recommendations

## How to Run

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Team
Developed as a college project at KIIT University, 2026.
Built using Git feature branches and collaborative workflow.
