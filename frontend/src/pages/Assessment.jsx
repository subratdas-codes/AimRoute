import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const LIKERT = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
]

export default function Assessment() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/assessments/questions')
      .then(({ data }) => setQuestions(data))
      .finally(() => setLoading(false))
  }, [])

  function setAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.post('/api/assessments/submit', {
        answers: Object.entries(answers).map(([question_id, answer_value]) => ({
          question_id: Number(question_id),
          answer_value,
        })),
      })
      navigate('/results')
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p>Loading questions…</p>

  return (
    <div className="assessment">
      <h1>Career Assessment</h1>
      <p>Rate each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <p><strong>Q{idx + 1}.</strong> {q.question_text}</p>
            <div className="likert-row">
              {LIKERT.map(({ value, label }) => (
                <label key={value} className={`likert-option ${answers[q.id] === value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`q_${q.id}`}
                    value={value}
                    checked={answers[q.id] === value}
                    onChange={() => setAnswer(q.id, value)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Assessment'}
        </button>
      </form>
    </div>
  )
}
