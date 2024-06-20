import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

import '../index.css';
import FormDataOrg from "../components/FormDataOrg";
import { clearHeader } from "../redux/header/action";

const Org = ({title, subtitle}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearHeader());
  }, [dispatch]);

  return (
    <>
      <Outlet/>
      <div className="container">
        <FormDataOrg title={title} subtitle={subtitle} />
      </div>
    </>
  )
}

export default Org

