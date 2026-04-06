# AimRoute — Career Guidance Platform

AimRoute is a full-stack web application that helps users discover suitable career paths based on their interests, skills, and assessment responses.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend](#backend-fastapi)
  - [Frontend](#frontend-react)
  - [Database](#database-mysql)
- [API Overview](#api-overview)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Testing](#api-testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication** — Register, login, and JWT-based session management.
- **User Profiles** — Store personal details, skills, and career interests.
- **Career Assessments** — Dynamic questionnaire to evaluate interests and aptitudes.
- **Career Recommendations** — Match assessment results to predefined career domains.
- **Admin Panel** — Manage career domains and assessment questions.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python · FastAPI · SQLAlchemy       |
| Database   | MySQL 8                             |
| Frontend   | React 18 · React Router · Axios     |
| Auth       | JWT (python-jose) · bcrypt          |
| Dev Tools  | Uvicorn · Vite · ESLint             |
| Testing    | Postman · pytest                    |

---

## Project Structure

```
AimRoute/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # Application entry point
│   │   ├── config.py         # Settings (loaded from .env)
│   │   ├── database.py       # SQLAlchemy engine & session
│   │   ├── models/           # ORM models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routers/          # Route handlers
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   └── assessments.py
│   │   ├── services/         # Business logic
│   │   └── utils/            # JWT helpers, password hashing
│   ├── requirements.txt
│   └── .env.example
├── frontend/                 # React application
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── api/              # Axios API client
│   │   ├── components/       # Shared UI components
│   │   ├── pages/            # Route-level pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   └── Results.jsx
│   │   ├── context/          # Auth context
│   │   └── styles/
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql            # MySQL schema with seed data
├── postman/
│   └── AimRoute.postman_collection.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Python ≥ 3.10
- Node.js ≥ 18
- MySQL 8

---

### Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and fill in values
cp .env.example .env

# Run database migrations (creates tables)
python -m app.database

# Start development server
uvicorn app.main:app --reload --port 8000
```

API docs are available at `http://localhost:8000/docs` (Swagger UI).

---

### Frontend (React)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template and fill in API base URL
cp .env.example .env

# Start development server
npm run dev
```

App is available at `http://localhost:5173`.

---

### Database (MySQL)

```bash
mysql -u root -p < database/schema.sql
```

This creates the `aimroute` database, all tables, and inserts seed career domains and sample questions.

---

## API Overview

| Method | Endpoint                        | Description                        | Auth |
|--------|---------------------------------|------------------------------------|------|
| POST   | `/api/auth/register`            | Create a new user account          | —    |
| POST   | `/api/auth/login`               | Authenticate and receive JWT token | —    |
| GET    | `/api/users/me`                 | Get current user profile           | ✓    |
| PUT    | `/api/users/me`                 | Update current user profile        | ✓    |
| GET    | `/api/assessments/questions`    | Fetch all assessment questions     | ✓    |
| POST   | `/api/assessments/submit`       | Submit answers and get results     | ✓    |
| GET    | `/api/assessments/results`      | Retrieve previous results          | ✓    |
| GET    | `/api/careers`                  | List all career domains            | ✓    |

Full interactive documentation is auto-generated by FastAPI at `/docs`.

---

## Environment Variables

### Backend (`backend/.env`)

```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/aimroute
SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (`frontend/.env`)

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Database Schema

Core tables:

| Table                 | Purpose                                          |
|-----------------------|--------------------------------------------------|
| `users`               | Stores user credentials and profile data         |
| `career_domains`      | Master list of career fields                     |
| `assessment_questions`| Question bank for the career assessment          |
| `user_assessments`    | Records each assessment attempt by a user        |
| `assessment_answers`  | Individual question-answer pairs per assessment  |
| `career_matches`      | Scored career matches generated per assessment   |

See [`database/schema.sql`](database/schema.sql) for the full DDL and seed data.

---

## API Testing

A Postman collection covering all endpoints is located at:

```
postman/AimRoute.postman_collection.json
```

Import it into Postman, set the `baseUrl` variable to `http://localhost:8000`, and run the **Auth** folder first to obtain a JWT token that is automatically applied to subsequent requests.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/<your-feature>`.
3. Commit your changes: `git commit -m "feat: describe your change"`.
4. Push to your fork: `git push origin feature/<your-feature>`.
5. Open a Pull Request against `main`.

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## License

This project is licensed under the [MIT License](LICENSE).
