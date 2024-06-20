import { Outlet } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Time from "../components/Time";

const RootLayout = () => {
  return (
    <>
      <Header/>
      <Time/>
      <Outlet/>
      <Footer/>
    </>
  )
}

export default RootLayout