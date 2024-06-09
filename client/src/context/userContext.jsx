import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = extractTokenFromCookie();
        if (!token) {
          throw new Error("No token found in cookies");
        }

        const response = await axios.get(
          "http://localhost:8080/auth/getSession",
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.newToken) {
          document.cookie = `token=${response.data.token}; path=/`;
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchSession();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
