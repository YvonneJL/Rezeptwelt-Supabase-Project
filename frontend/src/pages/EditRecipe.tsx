import { useNavigate, useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import { useEffect, useRef, useState } from "react";
import { IRecipe } from "../interfaces";

const EditRecipe = () => {
  // dieser State wird mit den Daten vom Fetch für das Rezept mit der Id von der Detailseite von der aus man hier gelandet ist gefüllt
  //! brauche ich jetzt nur für category, hätte ich so nicht gebraucht -evtl. noch umbauen?
  const [recipeData, setRecipeData] = useState<IRecipe | null>();

  //useStates für die einzelnen Inputfelder/Textarea oder Select
  // zunächst füllt man den State mit den Daten aus dem Fetch, sodass die Daten vom Rezept schon in den Inputfeldern stehen
  // value={} wird dann mit den jeweiligen States gefüllt
  // damit ich die Inputfelder dann bearbeiten kann --> dafür braucht es dann noch die onChange Funktion
  const [newRecipeName, setNewRecipeName] = useState<string>("");
  const [newRecipeDesc, setNewRecipeDesc] = useState<string>("");
  const [newRecipeServings, setNewRecipeServings] = useState<string>("");
  const [newRecipeInst, setNewRecipeInst] = useState<string>("");
  const [newRecipeUrl, setNewRecipeUrl] = useState<string>("");

  //idParam muss genauso heißen wie der dafür gewählte Namen in der App.tsx für den Pfad
  //sodass die Id aus der vorherigen Seite übernommen werden kann
  // mit der id bestimme im zum Einen den Pfad auf diese Seite in der App.tsx aber brauche sie auch um die Daten zu dem einen Rezept fetchen zu können
  const { idParam } = useParams();
  // um beim Klicken auf "Rezept ändern" auf der Detailseite zu landen
  const navigate = useNavigate();

  // mit dem dafür vorgesehenen Befehl das Rezept mit passender id (idParam) rausziehen (eq.)
  // hier dann die einzelnen States füllen, die mit den Inputfeldern connected sind, sodass in den Inputfeldern direkt die Daten aus dem Rezept stehen und einfach geändert werden können
  const fetchData = async () => {
    const response = await supabase
      .from("recipes_two")
      .select("*")
      .eq("id", idParam);
    setRecipeData(response?.data?.[0]);
    setNewRecipeName(response?.data?.[0].name);
    setNewRecipeDesc(response?.data?.[0].description);
    setNewRecipeServings(response?.data?.[0].servings);
    setNewRecipeInst(response?.data?.[0].instructions);
    setNewRecipeUrl(response?.data?.[0].url);
  };

  //fetch immer erst im useEffect ausführen
  useEffect(() => {
    fetchData();
  }, []);

  // useRef, um die Verbindung zwischen Inputfeld und den Daten, die dann wieder in die Datenbank hinzugefügt/abgeändert werden sollen herzustellen
  // ref={} bei den Inputfeldern hierfür nötig und
  // beim .update mit supabase dann Name der const.current?.value
  const recipeCategory = useRef<HTMLSelectElement>(null);
  const recipeName = useRef<HTMLInputElement>(null);
  const recipeDesc = useRef<HTMLTextAreaElement>(null);
  const recipeServings = useRef<HTMLInputElement>(null);
  const recipeInstructions = useRef<HTMLTextAreaElement>(null);
  const recipeUrl = useRef<HTMLInputElement>(null);

  //Funktion, um beim Button Klick (Submit) die Änderungen in die Datenbank zu übernehmen
  const editRecipe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // response wieder destructured mit {}
    // mit Befehl .update und den Spalten, die geupdated werden sollen die Tabelle editieren
    const { error: InsertError } = await supabase
      .from("recipes_two")
      .update({
        name: recipeName.current?.value || "",
        description: recipeDesc.current?.value || "",
        servings: recipeServings.current?.value || "",
        instructions: recipeInstructions.current?.value || "",
        category_id: recipeCategory.current?.value || "",
        url: recipeUrl.current?.value || "",
      })
      .eq("id", idParam);

    //errorHandling
    if (InsertError) {
      console.log("Fehler beim Editieren", InsertError);
    //wenns klappt --> direkt auf Detailseite navigieren
    } else {
      console.log("Rezept wurde verändert");
      navigate(`/${idParam}`);
      //! Alternativ würde auch das gehen, weil ich ja immer von der
      //! Detailseite komme wenn ich auf der Änderungsseite lande,
      //!  also geht auch -1 => zurück
      //navigate(-1)
    }
  };

  // für jedes Input usw Feld braucht es diese onChange Funktion
  // settet dann den Inhalt des values nochmal neu, sodass die Änderungen übernommen werden können
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipeName(e.target.value);
  };
  const handleChangeServings = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipeServings(e.target.value);
  };
  const handleChangeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRecipeUrl(e.target.value);
  };
  const handleChangeTextAreaInst = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewRecipeInst(e.target.value);
  };
  const handleChangeTextAreaDesc = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewRecipeDesc(e.target.value);
  };

  return (
    <>
      <form
        onSubmit={editRecipe}
        className="flex flex-col items-center gap-5 p-10"
      >
        <div className="flex justify-evenly w-full">
          <h1 className="font-bold lg:text-3xl text-lg">
            Tippe deine gewünschten Änderungen ein
          </h1>
          <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg lg:p-3 p-1 cursor-pointer">
            Rezept ändern
          </button>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="category">
            Wähle eine Kategorie:
          </label>
          {/* select kann nicht verändert werden, daher hier ohne onChange Funktion */}
          <select
            className="lg:w-100 w-50 bg-violet-200 p-2 rounded-lg"
            name="category"
            id="category"
            value={recipeData?.category_id}
            ref={recipeCategory}
          >
            <option value="">Wähle eine Kategorie</option>
            <option value="c1e7ccd5-2783-444a-b895-19375e092625">
              Asiatisch
            </option>
            <option value="80bc3000-5b83-4ee9-92e2-627029b1921d">
              Italienisch
            </option>
            <option value="30131ac3-9416-4ace-be0b-e536cbefeb16">
              Dessert
            </option>
          </select>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="name_rezept">
            Name des Rezepts:{" "}
          </label>
          <input
            onChange={handleChangeName}
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="name_rezept"
            type="text"
            placeholder="z.B. Kaiserschmarrn"
            value={newRecipeName}
            ref={recipeName}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="desc_rezept">
            Beschreibung des Rezepts:{" "}
          </label>
          <textarea
            onChange={handleChangeTextAreaDesc}
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="desc_rezept"
            placeholder="z.B. Ein leckeres Dessert aus Tirol"
            value={newRecipeDesc}
            ref={recipeDesc}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="servings_rezept">
            Anzahl der Portionen:{" "}
          </label>
          <input
            onChange={handleChangeServings}
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="servings_rezept"
            type="number"
            value={newRecipeServings}
            ref={recipeServings}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="instructions_rezept">
            Anleitung des Rezepts:{" "}
          </label>
          <textarea
            onChange={handleChangeTextAreaInst}
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg h-50"
            id="instructions_rezept"
            placeholder="z.B. 1. Mehl und Milch mischen..."
            value={newRecipeInst}
            ref={recipeInstructions}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="url_rezept">
            Url zum Bild:{" "}
          </label>
          <input
            onChange={handleChangeUrl}
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="url_rezept"
            type="text"
            value={newRecipeUrl}
            ref={recipeUrl}
          />
        </div>
      </form>
    </>
  );
};

export default EditRecipe;
