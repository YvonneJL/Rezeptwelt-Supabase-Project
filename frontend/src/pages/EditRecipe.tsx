import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import { useEffect, useRef, useState } from "react";
import { IRecipe } from "../interfaces";

const EditRecipe = () => {

    const [recipeData, setRecipeData] = useState<IRecipe | null>()
    const [newRecipeName, setNewRecipeName] = useState<string>()
    const [newRecipeDesc, setNewRecipeDesc] = useState<string>()
    const [newRecipeServings, setNewRecipeServings] = useState<string>()
    const [newRecipeInst, setNewRecipeInst] = useState<string>()
    const [newRecipeUrl, setNewRecipeUrl] = useState<string>()

    const {idParam} = useParams()
    const navigate = useNavigate()

    const fetchData = async () => {
        const response = await supabase
        .from("recipes_two")
        .select("*")
        .eq("id", idParam)
        setRecipeData(response?.data?.[0])
        setNewRecipeName(response?.data?.[0].name)
        setNewRecipeDesc(response?.data?.[0].description)
        setNewRecipeServings(response?.data?.[0].servings)
        setNewRecipeInst(response?.data?.[0].instructions)
        setNewRecipeUrl(response?.data?.[0].url)
    }

    useEffect(()=> {
        fetchData()
    }, [])


    const recipeCategory = useRef<HTMLSelectElement>(null)
        const recipeName = useRef<HTMLInputElement>(null)
        const recipeDesc = useRef<HTMLTextAreaElement>(null)
        const recipeServings = useRef<HTMLInputElement>(null)
        const recipeInstructions = useRef<HTMLTextAreaElement>(null)
        const recipeUrl = useRef<HTMLInputElement>(null)


        const editRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
    
            //const newUuid = uuidv4();
            const {error: InsertError} = await supabase.from("recipes_two")
            .update({
                    name: recipeName.current?.value || "",
                    description: recipeDesc.current?.value || "",
                    servings: recipeServings.current?.value || "",
                    instructions: recipeInstructions.current?.value || "",
                    category_id: recipeCategory.current?.value || "",
                    url: recipeUrl.current?.value || ""
            })
            .eq("id", idParam)
    
            if (InsertError) {
                console.log("Fehler beim Editieren", InsertError);
            } else {
                console.log("Rezept wurde verändert");
                navigate(`/${idParam}`)
            }
        }

        const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewRecipeName(e.target.value)
        }
        const handleChangeServings = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewRecipeServings(e.target.value)
        }
        const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
            setNewRecipeUrl(e.target.value)
        }
        const handleChangeTextAreaInst = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewRecipeInst(e.target.value)
        }
        const handleChangeTextAreaDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setNewRecipeDesc(e.target.value)
        }

    return ( 
        <>
         <form onSubmit={editRecipe} className="flex flex-col items-center gap-5 p-10">
            <div className="flex justify-evenly w-full">
            <h1 className="font-bold text-3xl">Tippe deine gewünschten Änderungen ein</h1>
            <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer">Rezept ändern</button>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="category">Wähle eine Kategorie:</label>
        <select className="w-100 bg-violet-100 p-2 rounded-lg" name="category" id="category" value={recipeData?.category_id} ref={recipeCategory}>
                <option value="">Wähle eine Kategorie</option>
                <option value="c1e7ccd5-2783-444a-b895-19375e092625">Asiatisch</option>
                <option value="80bc3000-5b83-4ee9-92e2-627029b1921d">Italienisch</option>
                <option value="30131ac3-9416-4ace-be0b-e536cbefeb16">Dessert</option>
            </select>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="name_rezept">Name des Rezepts: </label>
            <input onChange={handleChangeName} className="bg-violet-100 p-2 w-100 rounded-lg" id="name_rezept" type="text" placeholder="z.B. Kaiserschmarrn" value={newRecipeName} ref={recipeName}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60" htmlFor="desc_rezept">Beschreibung des Rezepts: </label>
            <textarea onChange={handleChangeTextAreaDesc} className="bg-violet-100 p-2 w-100 rounded-lg" id="desc_rezept" placeholder="z.B. Ein leckeres Dessert aus Tirol" value={newRecipeDesc} ref={recipeDesc}/>
            </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="servings_rezept">Anzahl der Portionen: </label>
           <input onChange={handleChangeServings}  className="bg-violet-100 p-2 w-100 rounded-lg" id="servings_rezept" type="number" value={newRecipeServings} ref={recipeServings}/>
           </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="instructions_rezept">Anleitung des Rezepts: </label>
           <textarea onChange={handleChangeTextAreaInst} className="bg-violet-100 p-2 w-100 rounded-lg h-50" id="instructions_rezept" placeholder="z.B. 1. Mehl und Milch mischen..." value={newRecipeInst} ref={recipeInstructions}/>
           </div>
           <div className="flex flex-row gap-5 items-center">
           <label className="w-60" htmlFor="url_rezept">Url zum Bild: </label>
           <input onChange={handleChangeUrl} className="bg-violet-100 p-2 w-100 rounded-lg" id="url_rezept" type="text" value={newRecipeUrl} ref={recipeUrl}/>
           </div>
        </form>
        </>
     );
}
 
export default EditRecipe;