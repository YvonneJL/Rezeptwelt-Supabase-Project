import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { mainContext } from "../context/Mainprovider";
import supabase from "../utils/supabase";
import { ILoggedInProps } from "../pages/SignUp";


const Nav = () => {

    //um bei Log Out funktion dann auf die Home zu kommen
    const navigate = useNavigate()

    //um Link "SignUp" nicht anzuzeigen, wenn ich auf der SignUp Page selbst bin
    const location = useLocation()
    const hideSignUp = location.pathname === "/signup" || location.pathname === "/login"

    //aus dem Mainprovider, um es hier und in SignUp.tsx und Login.tsx zu verwenden (Props sind importiert)
    const {isLoggedIn, setIsLoggedIn} = useContext(mainContext) as ILoggedInProps
    console.log(isLoggedIn);

    // einfacher Befehl von supabase mit .signOut()
     const logout = async () => {
        //hier auf false, um unten die Buttons zu toggeln je nachdem ob man eingeloggt ist oder nicht erscheint Sign Up oder Log Out
        setIsLoggedIn(false)
        const {error} = await supabase
        .auth
        .signOut()
        if (error) {
            console.log("User ist nicht ausgeloggt");
        }
        navigate("/")
    }

    return ( 
        <nav className="flex lg:px-20 lg:py-7 p-2 justify-between">
            <article className="flex gap-2 lg:pl-70">
                <img className="h-5" src="/images/Ico.svg" alt="coffee cup" />
                <p className="text-sm">Rezeptwelt</p>
            </article>
            <article className="flex lg:gap-15 gap-3">
                <Link to={"/"} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Home</Link>
                <Link to={"/recipes"} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Rezepte</Link>
                <Link to={"/about"} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Über uns</Link>
                <Link to={"/addrecipe"} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Rezept anlegen</Link>
            </article>
            {/* hier wird getoggelt je nachdem ob man eingeloggt ist oder nicht */}
            {!hideSignUp && !isLoggedIn && <Link to={"/signup"} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Sign up</Link>}
            {isLoggedIn && <button onClick={logout} className="font-bold text-sm transform hover:scale-120 transition-all duration-300">Log Out</button>}
        </nav>
     );
}
 
export default Nav;