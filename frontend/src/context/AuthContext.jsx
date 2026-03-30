import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // Initialize user from localStorage so login persists on refresh
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    // Save user to localStorage so it persists on refresh
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    // Clear everything from localStorage on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("career_result");
  };

  // Extra safety — if token disappears, log user out automatically
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && user) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}