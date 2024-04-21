import { useState, createContext, useEffect } from "react";
import axios from "axios";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async (token) => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_REACT_APP_TOKEN_CHECKIN_URL,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response);

        if (response.status === 200) {
          setUser(response.data.user);
        }
      } catch (err) {
        if (err.response.status == 401) {
          alert("Session expired, please login again!!");
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    };

    const cookies = document.cookie;
    if (cookies) {
      const tokenCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="))
        .split("=")[1];

      if (tokenCookie) {
        fetchData(tokenCookie);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
