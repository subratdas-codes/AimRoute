// frontend/src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ScrollToTop from "./components/ScrollToTop";
import Navbar          from "./components/Navbar";
import Home            from "./pages/Home/Home";
import Login           from "./pages/login";
import Signup          from "./pages/signup";
import Dashboard       from "./pages/Dashboard";
import Quiz            from "./pages/Quiz";
import ChatBot         from "./components/ChatBot";
import Result          from "./pages/Result";
import Roadmap         from "./pages/Roadmap";
import CareerPath      from "./pages/CareerPath";
import CareerQuestions from "./pages/CareerQuestions";
import Services        from "./pages/Services";
import ResetPassword   from "./pages/ResetPassword";
import Settings        from "./pages/Settings";

// ── Route guard — redirects guests to /login ─────────────────
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" state={{ from: "protected" }} replace />;
  return children;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public — guests can access */}
        <Route path="/"                   element={<Home />} />
        <Route path="/login"              element={<Login />} />
        <Route path="/signup"             element={<Signup />} />
        <Route path="/services"           element={<Services />} />
        <Route path="/career-path"        element={<CareerPath />} />
        <Route path="/career-path/:level" element={<CareerQuestions />} />
        <Route path="/result"             element={<Result />} />
        <Route path="/roadmap"            element={<Roadmap />} />
        <Route path="/quiz"               element={<Quiz />} />
        <Route path="/reset-password"     element={<ResetPassword />} />

        {/* Protected — login required */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
       <ChatBot />
    </> 
  );
}

export default App;