import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import { IIngredient, IRecipe } from "../interfaces";


const RecipeDetail = () => {

    const {recipeIdParam} = useParams()
    const navigate = useNavigate()


    const [recipeData, setRecipeData] = useState<IRecipe[] | null>()
    const [ingredientsData, setIngredientsData] = useState<IIngredient[] | null>()

    const fetchRecipeData = async () => {

        const resp = await supabase.from("recipes_two").select("*").eq("id", `${recipeIdParam}`)
        setRecipeData(resp.data)
    }

    useEffect(()=> {
        fetchRecipeData()
      }, [])

      useEffect(()=> {
        const fetchData = async () => {

            const resp = await supabase.from("ingredients_two").select("*").eq("recipe_id", `${recipeIdParam}`)
            console.log(resp.data);
            setIngredientsData(resp.data)
        }
        fetchData()
      }, [])

      const deleteRecipe = async (recipeIdParam: string) => {
        console.log("click");
        await supabase
        .from("recipes_two")
        .delete()
        .eq("id", recipeIdParam)
        navigate("/recipes")
      }



    return ( 
        <>
        {recipeData &&
        <section>
            <div className="relative lg:h-91 h-25 bg-no-repeat bg-cover bg-center w-screen flex justify-center items-center" style={{ backgroundImage: `url(${recipeData[0].url})` }}>
    <div className="absolute inset-0 bg-black opacity-20 h-24 md:h-91">
    </div>
</div>
    <section className="flex flex-col py-10 lg:px-20 px-10 gap-5">

            <h1 className="text-6xl font-semibold">{recipeData[0].name}</h1>
            

            <h2 className="text-2xl">Zutaten:</h2>
            {ingredientsData && 
                <ul className="flex flex-col gap-2">
                    {ingredientsData.map((ingredient, index)=> (
                        <li key={index}>{ingredient.quantity} {ingredient.unit} {ingredient.name}</li>
                    ))}
                </ul>
            }
            <h2 className="text-2xl">Schritte:</h2>
            <p className="font-semibold break-before-number">{`${recipeData[0].instructions} for ${recipeData[0].servings} servings`}</p>
            <button className="w-40 bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer items-center" onClick={()=>navigate(`/editrecipe/${recipeData[0].id}`)}>Rezept ändern</button>
            <button className="w-40 bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer items-center" onClick={()=>deleteRecipe(recipeData[0].id.toString())}>Rezept entfernen</button>
        </section>
        
        </section>
        
        }
        </>
     );
}
 
export default RecipeDetail;

