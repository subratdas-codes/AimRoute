import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Services from "./pages/Services";

function App() {
  return (
    <div className="min-h-screen ">

      <Navbar />

    <Routes>
  <Route path="/" element={<h1>Working</h1>} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/quiz" element={<Quiz />} />
  <Route path="/result" element={<Result />} />
  <Route path="/services" element={<Services />} />
</Routes>

    </div>
  );
}

export default App;