import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import { IIngredient, IRecipe } from "../interfaces";
import { IFavRecipeProps } from "../components/FavRecipes";
import { mainContext } from "../context/Mainprovider";
import { IUserProps } from "./SignUp";

const RecipeDetail = () => {
  //Params gleicher Name (recipeIdParam), den ich in der App.tsx im Pfad dafür gewählt habe
  //benutze ich dann im fetch, damit die Verbindung hergestellt wird und die passenden Daten zum Rezept gefetched werden
  const { recipeIdParam } = useParams();
  // um bei Rezept ändern/löschen auf entsprechenden Seiten zu landen
  const navigate = useNavigate();

  // States für die Daten aus den beiden fetches (recipes und ingredients)
  const [recipeData, setRecipeData] = useState<IRecipe[] | null>();
  const [ingredientsData, setIngredientsData] = useState<IIngredient[] | null>();

  //isLoggedin ziehen, um button "Rezept entfernen" zu toggeln, ja nach Login Status
  const {isLoggedIn}  = useContext(mainContext) as IFavRecipeProps;
  //user, um Rezept löschen Button nur anzeigen zu lassen, wenn user Rezept ursprünglich hinzugefügt hat
  const {user} = useContext(mainContext) as IUserProps

  //fetch für das Rezept, mit der id=recipeIdParam
  const fetchRecipeData = async () => {
    const resp = await supabase
      .from("recipes_two")
      .select("*")
      .eq("id", `${recipeIdParam}`);
    setRecipeData(resp.data);
  };

  //hier wird fetch ausgeführt
  useEffect(() => {
    fetchRecipeData();
  }, []);


  //fetch für dementsprechende Ingredients, recipe_id muss recipeIdParam sein 
  useEffect(() => {
    const fetchData = async () => {
      const resp = await supabase
        .from("ingredients_two")
        .select("*")
        .eq("recipe_id", `${recipeIdParam}`);
      setIngredientsData(resp.data);
    };
    fetchData();
  }, []);

  // Funktion, um Rezept zu löschen
  //! ursprünglich habe ich hier einen Parameter rein gegeben, den braucht es aber gar nicht
  //! vermutlich weil ich recipeIdParam im globalen Scobe sowieso habe und so weiter geben kann?!
  const deleteRecipe = async () => {
    console.log("click");
    await supabase.
    from("recipes_two")
    .delete()
    .eq("id", recipeIdParam);
    navigate("/recipes");
  };

  return (
    <>
      {recipeData && (
        <section>
          <div
            className="relative lg:h-91 h-25 bg-no-repeat bg-cover bg-center w-screen flex justify-center items-center"
            //! Ich muss mit [0] arbeiten, da Daten zwar nur ein Objekt sind aber in einem Array verschachtelt
            style={{ backgroundImage: `url(${recipeData[0]?.upload_url ? recipeData[0].upload_url : recipeData[0].url})` }}
          >
            <div className="absolute inset-0 bg-black opacity-20 h-24 md:h-91"></div>
          </div>
          <section className="flex flex-col py-10 lg:px-20 px-10 gap-5">
            <h1 className="text-6xl font-semibold">{recipeData[0]?.name}</h1>

            <h2 className="text-2xl">Zutaten:</h2>
            {ingredientsData && (
              <ul className="flex flex-col gap-2">
                {ingredientsData.map((ingredient) => (
                  <li key={ingredient.id}>
                    {ingredient.quantity} {ingredient.unit} {ingredient.name}
                  </li>
                ))}
              </ul>
            )}
            <h2 className="text-2xl">Schritte:</h2>
            <p className="font-semibold break-before-number">{`${recipeData[0]?.instructions} for ${recipeData[0]?.servings} servings`}</p>
            { user.username === recipeData[0].added_by && <button
              className="w-40 bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer items-center"
              onClick={() => navigate(`/editrecipe/${recipeData[0]?.id}`)}
            >
              Rezept ändern
            </button>}
        {  user.username === recipeData[0].added_by &&  <button
              className="w-40 bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer items-center"
              onClick={deleteRecipe}
            >
              Rezept entfernen
            </button>}
          </section>
        </section>
      )}
    </>
  );
};

export default RecipeDetail;
