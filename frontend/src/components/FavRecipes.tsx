import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { IIngredient, IRecipe } from "../interfaces";
import { Link, useLocation, useParams } from "react-router-dom";

const FavRecipes = () => {

    const [recipesData, setRecipesData] = useState<IRecipe[] | null>([])

    const fetchData = async () => {
      const resp = await supabase.from("recipes_two").select("*")
      setRecipesData(resp.data)
    }

    useEffect(()=> {
        fetchData()
      }, [])

      console.log(recipesData);

      const location = useLocation()
      const favStyling = location.pathname === "/"


      const deleteRecipe = async (recipeId: string) => {
        console.log("click");
        await supabase
        .from("recipes_two")
        .delete()
        .eq("id", recipeId)
        //um die Liste der Recipes wieder zu aktualisieren
        fetchData()
      }


    return ( 
    <>
    <h1 className="text-center font-semibold text-5xl mb-10">{favStyling ?"Unsere Favouriten" : "Alle Rezepte"}</h1>
   <section className={favStyling ? "flex lg:flex-row flex-col justify-between lg:px-20 px-10 gap-5" : "flex flex-wrap gap-10"}>

   {favStyling ? (recipesData?.slice(3, 6).map((recipe, index) => (
      <article key={index} className="flex flex-col bg-violet-400 rounded-2xl border-3 border-violet-500 w-80 transform hover:scale-105 transition-all duration-300">
        <div>
          <img className="rounded-t-2xl h-80 object-cover" src={recipe.url} alt={recipe.name} />
        </div>
        <div className="p-5 flex flex-col justify-between h-full gap-3">
          <h4 className="font-semibold text-lg">{recipe?.name}</h4>
          <p className="text-sm">{recipe.description}</p>
          <Link className="bg-violet-600 p-3 self-baseline rounded-xl transform hover:scale-110 transition-all duration-300" to={`/${recipe.id}`}>Zum Rezept</Link>
        </div>
      </article>  ))) : (
        recipesData?.map((recipe, index) => (
          <article key={index} className="flex flex-col bg-violet-400 rounded-2xl border-3 border-violet-500 w-100 mx-auto transform hover:scale-105 transition-all duration-300">
            <div className="w-full h-80 overflow-clip">
              <img className="rounded-t-2xl h-full w-full object-cover" src={recipe.url} alt={recipe.name} />
            </div>
            <div className="p-5 flex flex-col gap-3">
              <h4 className="font-semibold text-lg">{recipe?.name}</h4>
              <p className="text-sm w-1/2">{recipe.description}</p>
              <Link className="bg-violet-600 p-3 self-baseline rounded-xl transform hover:scale-110 transition-all duration-300" to={`/${recipe.id}`}>Zum Rezept</Link>
              <button className="self-end bg-violet-200 border-2 border-violet-400 rounded-lg p-2 text-sm cursor-pointer transform hover:scale-110 transition-all duration-300" onClick={()=>deleteRecipe(recipe.id.toString())}>Rezept entfernen</button>
            </div>
          </article>  ))
      )}
   </section>
    </> 
    );
  }

 
export default FavRecipes;