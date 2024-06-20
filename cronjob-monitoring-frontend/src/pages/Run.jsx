import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import '../index.css';
import FormData from "../components/FormData";
import { clearHeader } from "../redux/header/action";

const Run = ({title, subtitle}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  return (
    <>
      <Outlet/>
      <div className="container">
        <FormData title={title} subtitle={subtitle} />
      </div>
    </>
  )
}

export default Run