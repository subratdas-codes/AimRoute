import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [careers, setCareers] = useState([])

  useEffect(() => {
    api.get('/api/users/me').then(({ data }) => setUser(data))
    api.get('/api/careers').then(({ data }) => setCareers(data))
  }, [])

  if (!user) return <p>Loading…</p>

  return (
    <div className="dashboard">
      <header>
        <h1>AimRoute</h1>
        <div>
          <span>Welcome, {user.full_name}</span>
          <button onClick={() => { logout(); navigate('/login') }}>Sign out</button>
        </div>
      </header>

      <main>
        <section>
          <h2>Your Career Journey</h2>
          <p>Discover which career paths best match your skills and interests.</p>
          <Link to="/assessment">
            <button>Take Assessment</button>
          </Link>
          <Link to="/results">
            <button>View Past Results</button>
          </Link>
        </section>

        <section>
          <h2>Explore Career Domains</h2>
          <ul className="career-grid">
            {careers.map((c) => (
              <li key={c.id} className="career-card">
                <span className="career-icon">{c.icon}</span>
                <strong>{c.name}</strong>
                <p>{c.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
