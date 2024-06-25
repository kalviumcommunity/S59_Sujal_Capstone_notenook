import { useState, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = extractTokenFromCookie();

        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_GET_SESSION_ENDPOINT,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token || null}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          if (response.data.newToken) {
            document.cookie = `token=${response.data.newToken}; path=/`;
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        navigate("/");
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
