import { createContext, useContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  });
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// custom hook for useContext
export const getUser = () => useContext(UserContext);
