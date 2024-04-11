import React, { useState, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState({ isLoggedIn: false, username: null });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
