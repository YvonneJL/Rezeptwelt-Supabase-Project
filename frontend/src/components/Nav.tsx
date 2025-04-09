import { Link } from "react-router-dom";

const Nav = () => {
    return ( 
        <nav className="flex lg:px-20 lg:py-7 p-2 justify-between">
            <article className="flex gap-2 lg:pl-70">
                <img className="h-5" src="/images/Ico.svg" alt="coffee cup" />
                <p className="text-sm">Rezeptwelt</p>
            </article>
            <article className="flex lg:gap-15 gap-3">
                <Link to={"/"} className="font-bold text-sm">Home</Link>
                <Link to={"/recipes"} className="font-bold text-sm">Rezepte</Link>
                <Link to={"/about"} className="font-bold text-sm">Über uns</Link>
                <Link to={"/addrecipe"} className="font-bold text-sm">Rezept anlegen</Link>
            </article>
            <p className="font-bold text-sm">Login</p>
        </nav>
     );
}
 
export default Nav;