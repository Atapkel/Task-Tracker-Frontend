import { createContext, useContext, useEffect, useState } from "react";
import { loginUser as loginAPI, registerUser as registerAPI } from "../api/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setisAuthenticated(true);
    }
    setisLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await loginAPI({ username, password });
      localStorage.setItem("access_token", response.ACCESS_TOKEN);

      setisAuthenticated(true);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || "login failed";
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      return { success: true, data: response };
    } catch (error) {
      const message = error.response?.data?.detail || "Registration failed";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setisAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
