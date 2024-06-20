import { Outlet } from "react-router-dom";
import { CFooter } from "./components/Footer/CFooter";
import { CSidebar } from "./components/Sidebar/CSidebar";

export function RootLayout() {
    return (
        <>
            <CSidebar />
            <CFooter />
        </>
    )
}