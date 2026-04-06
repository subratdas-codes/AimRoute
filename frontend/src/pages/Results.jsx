import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

export default function Results() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/assessments/results')
      .then(({ data }) => setResults(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading results…</p>

  return (
    <div className="results">
      <h1>Your Assessment Results</h1>
      {results.length === 0 ? (
        <p>No assessments completed yet. <Link to="/assessment">Take one now</Link>.</p>
      ) : (
        results.map((r) => (
          <div key={r.assessment_id} className="result-card">
            <h2>Assessment #{r.assessment_id}</h2>
            <p className="date">Completed: {new Date(r.completed_at).toLocaleString()}</p>
            <ol className="match-list">
              {r.matches.map((m) => (
                <li key={m.career_domain_id}>
                  <strong>{m.name}</strong> — score: {m.score}
                  {m.description && <p>{m.description}</p>}
                </li>
              ))}
            </ol>
          </div>
        ))
      )}
      <Link to="/">← Back to Dashboard</Link>
    </div>
  )
}
