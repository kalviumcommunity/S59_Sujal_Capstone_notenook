import { useState, createContext, useEffect } from "react";
import axios from "axios";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const token = extractTokenFromCookie();

        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_GET_SESSION_ENDPOINT,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 && response.data.newToken) {
          document.cookie = `token=${response.data.newToken}; path=/`;
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
