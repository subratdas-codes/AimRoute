import { useEffect, useState } from "react";
import { getQuizQuestions, submitQuiz } from "../services/quizService";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getQuizQuestions();
      setQuestions(res.data);
    } catch {
      console.log("Backend not ready");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async () => {
    try {
      await submitQuiz(answers);
      alert("Quiz Submitted ✅");
      navigate("/result");
    } catch {
      alert("Backend not ready");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Quiz Page</h2>

      {questions.map((q) => (
        <div key={q.id}>
          <p>{q.question}</p>

          <input
            placeholder="Your Answer"
            onChange={(e) =>
              handleChange(q.id, e.target.value)
            }
          />
        </div>
      ))}

      <br />
      <button onClick={handleSubmit}>
        Submit Quiz
      </button>
    </div>
  );
}

export default Quiz;