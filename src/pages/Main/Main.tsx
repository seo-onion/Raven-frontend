import { 
    Outlet, 
    Navigate, 
    useLocation 
} from "react-router-dom"
import "./Main.css"

// import Sidebar from "../../components/common/Sidebar/Sidebar"
import Navbar from "@/components/common/Navbar/Navbar"
import Footer from "../../components/common/Footer/Footer"

import routes from '@/routes/routes'

const Main = () => {

    const location = useLocation()

    // NOTE this is for adding conditions like isLogged, isAdmin and Navigate the user to some page

    // Only show the landing page on the exact root URL
    const isLandingPage = location.pathname === "/"

    return (
        <>
            {!isLandingPage ? (
                <div className="main-app-container">
                    {/* <Sidebar /> */}
                    <Navbar/>
                    <div className="main-content-wrapper">
                        <Outlet />
                        <Footer />
                    </div>
                </div>
            ) : (
                <Navigate to={routes.home} />
            )}
        </>
    )
}

export default Main