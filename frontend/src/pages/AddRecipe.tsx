import { useRef } from "react";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from "react-router-dom";

const AddRecipe = () => {

    const navigate = useNavigate()

    const recipeCategory = useRef<HTMLSelectElement>(null)
    const recipeName = useRef<HTMLInputElement>(null)
    const recipeDesc = useRef<HTMLTextAreaElement>(null)
    const recipeServings = useRef<HTMLInputElement>(null)
    const recipeInstructions = useRef<HTMLTextAreaElement>(null)
    const recipeUrl = useRef<HTMLInputElement>(null)

    const addRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newUuid = uuidv4();
        const {error: InsertError} = await supabase.from("recipes_two")
        .insert({
                id: newUuid,
                name: recipeName.current?.value || "",
                description: recipeDesc.current?.value || "",
                servings: recipeServings.current?.value || "",
                instructions: recipeInstructions.current?.value || "",
                category_id: recipeCategory.current?.value || "",
                url: recipeUrl.current?.value || ""
        })

        if (InsertError) {
            console.log("Fehler beim Einfügen", InsertError);
        } else {
            console.log("Rezept wurde hinzugefügt");
            navigate(`/${newUuid}`)
        }
    }


    return ( 
        <>
        <form onSubmit={addRecipe}  className="flex flex-col items-center gap-5 p-10">
            <div className="flex justify-evenly w-full">
            <h1 className="font-bold text-3xl">Füge der Liste ein neues Rezept hinzu</h1>
            <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer">Rezept hinzufügen</button>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="category">Wähle eine Kategorie:</label>
        <select className="w-100 bg-violet-100 p-2 rounded-lg" name="category" id="category" ref={recipeCategory}>
                <option value="">Wähle eine Kategorie</option>
                <option value="c1e7ccd5-2783-444a-b895-19375e092625">Asiatisch</option>
                <option value="80bc3000-5b83-4ee9-92e2-627029b1921d">Italienisch</option>
                <option value="30131ac3-9416-4ace-be0b-e536cbefeb16">Dessert</option>
            </select>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="name_rezept">Name des Rezepts: </label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" id="name_rezept" type="text" placeholder="z.B. Kaiserschmarrn" ref={recipeName}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="desc_rezept">Beschreibung des Rezepts: </label>
            <textarea className="bg-violet-100 p-2 w-100 rounded-lg" id="desc_rezept" placeholder="z.B. Ein leckeres Dessert aus Tirol" ref={recipeDesc} />
            </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="servings_rezept">Anzahl der Portionen: </label>
           <input className="bg-violet-100 p-2 w-100 rounded-lg" id="servings_rezept" type="number" ref={recipeServings} />
           </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="instructions_rezept">Anleitung des Rezepts: </label>
           <textarea className="bg-violet-100 p-2 w-100 rounded-lg h-50" id="instructions_rezept" placeholder="z.B. 1. Mehl und Milch mischen..." ref={recipeInstructions} />
           </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="url_rezept">Url zum Bild: </label>
           <input className="bg-violet-100 p-2 w-100 rounded-lg" id="url_rezept" type="text" ref={recipeUrl} />
           </div>
        </form>
        </>
     );
}
 
export default AddRecipe;