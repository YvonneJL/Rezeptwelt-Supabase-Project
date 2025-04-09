import FavRecipes from "../components/FavRecipes";

const AllRecipes = () => {
    return ( 
        // hier wird nur FavRecipes eingebunden, da es dieselbe Komponente ist
        // braucht aber einen anderen Pfad, daher eine extra Seite
        <section className="py-10">
        <FavRecipes/>
        </section>
     );
}
 
export default AllRecipes;