import { Outlet, useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroImage1 from "../components/HeroImage1";

const Layout = () => {

const location = useLocation()

const showHeroImage1 = location.pathname === "/" || location.pathname === "/about" || location.pathname === "/recipes" || location.pathname === "/addrecipes" || location.pathname === "/signup" || location.pathname === "/login"



    return ( 
        <>
        <Header/>
        {showHeroImage1 && <HeroImage1/>}
        <Outlet/>
        <Footer/>
        </>
     );
}
 
export default Layout;