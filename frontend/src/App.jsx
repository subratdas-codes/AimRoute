import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ScrollToTop     from "./components/ScrollToTop";
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

import AdminPanel      from "./pages/AdminPanel";
import AdminLogin      from "./pages/AdminLogin";

const ADMIN_ROUTES = ["/admin", "/admin-login"];

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" state={{ from: "protected" }} replace />;
  return children;
}

function App() {
  const location = useLocation();
  const isAdminRoute = ADMIN_ROUTES.some(path => location.pathname.startsWith(path));

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <Routes>
        {/* Public */}
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

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/settings"  element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin"       element={<AdminPanel />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminRoute && <ChatBot />}
    </>
  );
}

export default App;