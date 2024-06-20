import { Outlet, redirect, useLoaderData } from "react-router-dom";
import axios from 'axios';
import { useEffect } from "react";

import '../index.css';
import Segment from "../components/Segment";

import { useDispatch } from "react-redux";
import { fetchData } from "../redux/summary/action";
import { landing } from "../redux/header/action";

const Dashboard = () => {
  const data = useLoaderData();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(landing());
    dispatch(fetchData(data.data));
  }, [data.data, dispatch]);

  return (
    <>
      <Outlet/>
      <div className="container">
        <Segment title="AKTIFITAS CRON HARI INI" isChart={true} endpoint='' />
      </div>
    </>
  )
}

export default Dashboard;

export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token
}

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return { status: false, data: redirect('/login') }
  }
  
  const expiration = new Date(JSON.parse(atob(token.split(".")[1])).exp);
  if (Date.now() >= expiration * 1000) {
    return { status: false, data: redirect('/login') }
  }

  return { status: true, data: token }
}

export const loader = async () => {

  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL
  
  const check = checkAuthLoader()
  if (!check.status) {
    return check.data
  }
  const config = {
    headers: {
      Authorization: `Bearer ${check.data}`,
    },
  };

  try {
    const response = await axios.get(`${apiUrl}/cron/summary`, config)
    return response
  } catch (error) {
    return redirect('/login')
  }
}