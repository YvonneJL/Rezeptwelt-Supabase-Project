import { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import { IRecipe } from "../interfaces";
import { Link, useLocation} from "react-router-dom";

const FavRecipes = () => {

    //hier werden die Daten für die erste Übersicht der Rezepte gespeichert aus dem recipe fetch
    const [recipesData, setRecipesData] = useState<IRecipe[] | null>([])

    //fetch aller recipe Spalten mit dem entsprechenden Befehl
    const fetchData = async () => {
      const resp = await supabase
      .from("recipes_two")
      .select("*")
      //setten der Daten
      setRecipesData(resp.data)
    }

    //erst im Useeffect wird dann der fetch ausgeführt
    useEffect(()=> {
        fetchData()
      }, [])


      //location, um im nächsten Schritt als Teil des booleans verwenden, von dem Styling und Anzeige der Rezepte abhängt
      // wenn true, also Pfad /, also die Homepage, dann wird entsprechend gestylet
      // in diesem Fall als ternary Operator benutzt --> erster Teil "unsere Favouriten", zweiter Teil "Alle Rezepte"
      const location = useLocation()
      const favStyling = location.pathname === "/"

      // die delete Funktion aus der Detailseite
      //hier muss ich den Parameter mitgeben, da erst später gemapped wird und die entsprechende Id für jedes Rezept gezogen wird
      const deleteRecipe = async (recipeId: string) => {
        await supabase
        .from("recipes_two")
        .delete()
        .eq("id", recipeId)
        //um die Liste der Recipes wieder zu aktualisieren
        fetchData()
      }


    return ( 
    <>
    {/* abhängig von favStyling */}
    <h1 className="text-center font-semibold text-5xl mb-10">{favStyling ?"Unsere Favouriten" : "Alle Rezepte"}</h1>
   <section className={favStyling ? "flex lg:flex-row flex-col justify-between lg:px-20 px-10 gap-5" : "flex flex-wrap gap-10"}>
      {/* hier wird der Ternary Operator benutzt --> auf Homeseite wird gemapped aber zuerst gesliced, sodass nur die ersten 3 angezeigt werden */}
      {/* styling unterscheidet sich auch */}
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
        // hier zweiter Teil vom Ternary Operator, hier wird über alle gemapped, plus Styling ist etwas anders
        // und den delete button gibt es nur hier
        recipesData?.map((recipe, index) => (
          <article key={index} className="flex flex-col bg-violet-400 rounded-2xl border-3 border-violet-500 w-100 mx-auto transform hover:scale-105 transition-all duration-300">
            <div className="w-full h-80 overflow-hidden">
              <img className="rounded-t-2xl h-full w-full object-cover" src={recipe.url} alt={recipe.name} />
            </div>
            <div className="p-5 flex flex-col justify-between h-80">
              <div className="h-full flex flex-col justify-between">
              <h4 className="font-semibold text-lg">{recipe?.name}</h4>
              <p className="text-sm w-1/2">{recipe.description}</p>
              <Link className="bg-violet-600 p-3 self-baseline rounded-xl transform hover:scale-110 transition-all duration-300" to={`/${recipe.id}`}>Zum Rezept</Link>
              </div>
              <button className="self-end bg-violet-200 border-2 border-violet-400 rounded-lg p-2 text-sm cursor-pointer transform hover:scale-110 transition-all duration-300" onClick={()=>deleteRecipe(recipe.id.toString())}>Rezept entfernen</button>
            </div>
          </article>  ))
      )}
   </section>
    </> 
    );
  }

 
export default FavRecipes;