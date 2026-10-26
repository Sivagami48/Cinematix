
import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Login existing user
  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", {
      email: email.trim(),
      password,
    });

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  // Register new user
  const register = async (name, email, password) => {
    const { data } = await API.post("/auth/register", {
      name: name.trim(),
      email: email.trim(),
      password,
    });

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

