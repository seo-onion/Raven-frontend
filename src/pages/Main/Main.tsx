import {
    Outlet,
    useLocation
} from "react-router-dom"
import "./Main.css"

// import Sidebar from "../../components/common/Sidebar/Sidebar"
import Navbar from "@/components/common/Navbar/Navbar"
import Footer from "../../components/common/Footer/Footer"
import Welcome from "@/pages/Welcome/Welcome"

const Main = () => {

    const location = useLocation()

    // NOTE this is for adding conditions like isLogged, isAdmin and Navigate the user to some page

    // Only show the welcome page on the exact root URL
    const isWelcomePage = location.pathname === "/"

    return (
        <>
            {isWelcomePage ? (
                <Welcome />
            ) : (
                <div className="main-app-container">
                    {/* <Sidebar /> */}
                    <Navbar/>
                    <div className="main-content-wrapper">
                        <Outlet />
                        <Footer />
                    </div>
                </div>
            )}
        </>
    )
}

export default Main