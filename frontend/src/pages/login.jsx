import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        email,
        password,
      });

      console.log(response.data);

      // Save token
      localStorage.setItem("token", response.data.access_token);

      alert("Login Successful ✅");

      navigate("/dashboard");
    } catch (error) {
      console.log("Backend not ready yet");
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;