import { useState, createContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState({
    isLoggedIn: true,
    user: {
      username: "john_doe",
      fullname: "John Doe",
      email: "john.doe@example.com",
      password: "testPassword123",
      oauthProvider: "Google",
      oauthId: "google123",
      friends: [],
      notes: [1, 2, 3, 4],
      chats: [],
    },
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
