import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import CareerPath from "./pages/CareerPath";
import CareerQuestions from "./pages/CareerQuestions";
import Services from "./pages/Services";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<Result />} />
        <Route path="/career-path" element={<CareerPath />} />
        <Route path="/career-path/:level" element={<CareerQuestions />} />
        <Route path="/Services" element={<Services />} />
      </Routes>
    </>
  );
}

export default App;