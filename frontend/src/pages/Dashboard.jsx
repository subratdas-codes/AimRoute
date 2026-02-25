import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <div>
      <h1>Dashboard Page ✅</h1>

      <br />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;