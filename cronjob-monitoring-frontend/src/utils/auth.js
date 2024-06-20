import { redirect } from "react-router-dom";

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token
}

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect('/login')
  }

  const expiration = new Date(JSON.parse(atob(token.split(".")[1])).exp);
  if (Date.now() >= expiration * 1000) {
    return redirect('/login')
  }
  return token
}