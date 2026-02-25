import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "15px", background: "#eee" }}>
      <Link to="/">Home</Link> |{" "}
      {!token && <Link to="/login">Login</Link>} |{" "}
      {!token && <Link to="/signup">Signup</Link>} |{" "}
      {token && <Link to="/dashboard">Dashboard</Link>} |{" "}
      {token && (
        <button onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;