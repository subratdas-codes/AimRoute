import { useEffect, useState } from "react";
import { getResult } from "../services/quizService";
import Loader from "../components/Loader";

function Result() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await getResult();
      setResult(res.data);
    } catch {
      console.log("Backend not ready");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Career Recommendation</h2>

      {result ? (
        <h3>{result.career}</h3>
      ) : (
        <p>No result available</p>
      )}
    </div>
  );
}

export default Result;