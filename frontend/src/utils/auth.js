// utils/auth.js

export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  export const isLoggedIn = () => {
    const token = getToken();
    return !!token;
  };
  
  export const logout = () => {
    localStorage.removeItem("token");
  };
  