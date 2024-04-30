import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import extractTokenFromCookie from "../Functions/ExtractTokenFromCookie";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
          navigate("/");
        }
      }
    };

    const token = extractTokenFromCookie();
    if (token) {
      fetchData(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserContext, UserProvider };
