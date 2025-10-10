import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";
      const url = `${baseUrl}/user/current`;
      console.log("Checking authentication...", "URL:", url, "Cookies:", document.cookie);
      try {
        const response = await axios.get(url, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Auth check response:", response.data.user.user, "Status:", response.status);
        console.log("Token:", response.data.user.token);
        const authUser = response.data.user.user;
        if (!authUser || !authUser._id) throw new Error("Invalid user data from auth check");
        setUser(authUser);
        userRef.current = authUser;
      } catch (err) {
        console.error("Auth check error:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: err.config?.url,
          headers: err.response?.headers,
        });
        setUser(null);
        userRef.current = null;
      } finally {
        setLoading(false);
        console.log("Authentication check completed, user:", user, "userRef:", userRef.current, "loading:", loading);
      }
    };
    checkAuth();
  }, []);

  // Ensure children only render when loading is false
  if (loading) {
    return <div>Loading...</div>; // This prevents the app from rendering until auth is resolved
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);