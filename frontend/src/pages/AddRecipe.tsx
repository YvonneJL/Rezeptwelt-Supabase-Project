import { useContext, useRef, useState } from "react";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { mainContext } from "../context/Mainprovider";
import { IUserProps } from "./SignUp";

const AddRecipe = () => {
  // damit ich dann direkt per ButtonKlick auf die RezeptDetail Seite navigieren kann
  const navigate = useNavigate();

  //user, um "added_by" hinzuzufügen
const {user} = useContext(mainContext) as IUserProps

  // mit useRef, ref={} im Inputfeld und der hier geählten const.current?.value kann ich auf das value in den Input oä Feldern zugreifen
  const recipeCategory = useRef<HTMLSelectElement>(null);
  const recipeName = useRef<HTMLInputElement>(null);
  const recipeDesc = useRef<HTMLTextAreaElement>(null);
  const recipeServings = useRef<HTMLInputElement>(null);
  const recipeInstructions = useRef<HTMLTextAreaElement>(null);
  const recipeUrl = useRef<HTMLInputElement>(null);


  // diese Funktion wird dann innerhalb von addRecipeToBackend mit einem await aufgerufen
  // insert mit Hilfe von map, einzelnes Elemnt ist ein Objekt und wird destructured, sodass es den einzelnen Spalten hinzugefügt werden
  //recipeId als Parameter um später beim Aufruf uuiD vom dazu generierten Rezept hinzuzufügen
  const addIngredientsToBackend = async (recipeId: string) => {
    const { error } = await supabase.from("ingredients_two").insert(
      ingredients.map(({ name, quantity, unit, additional_info }) => ({
        recipe_id: recipeId,
        name,
        quantity,
        unit,
        additional_info,
      }))
    );

    if (error) {
      console.log("Fehler beim Hinzufügen der Zutaten", error);
    } else {
      console.log("Zutaten wurden hinzugefügt");
    }
  };

//Foto Upload Schritt 1
const uploadRecipeImg = async () => {
  //wenn kein Foto hochgeladen wird, gehe aus der Funktion
  if (!recipeImg) return null;

  const fileName = recipeImg.name;

  //upload erfolgt dann direkt im Root des Buckets "img-for-recipes"
  const { error } = await supabase.storage
    .from("img-for-recipes")
    .upload(fileName, recipeImg);

  if (error) {
    console.log("Fehler beim Hochladen des Fotos", error);
    return null;
  }

  const fotoUrl = supabase.storage
    .from("img-for-recipes")
    .getPublicUrl(fileName).data.publicUrl;

  return fotoUrl;
};

  //Funktion, um dann beim Submit der Form die Inhalte darin auszuführen
  const addRecipeToBackend = async (e: React.FormEvent<HTMLFormElement>) => {
    // damit beim Submit die Seite nicht neu geladen wird
    e.preventDefault();

    //uuid hier schon generiert, damit ich später mit navigate darauf zugreifen kann
    const newUuid = uuidv4();


    //hier gehts weiter mit Schritt 2 vom FotoUpload
    //hier wird Funktion ausgeführt und der returned Wert gespeichert
    //allerdings nur, wenn
    let uploadedImgUrl = null;
    if (recipeImg) {
      uploadedImgUrl = await uploadRecipeImg();
      if (!uploadedImgUrl) {
        console.log("Fehler beim Hochladen oder kein Bild");
      }
    }
    console.log(uploadedImgUrl);

    //hier werden über supabase Methode insert die Inhalte der Input Felder als neue Werte für die jeweilgen Spalten von recipe_two gesetzt
    // uuid wird da dann nur noch als Konstante benutzt
    // statt const response destructern wir schon und schreiben die key aus dem respone Objekt, die wir brauchen in {}
    // hinter den Doppelpunkt kommt dann der von mir dafür gewählte Name
    const { error: InsertError } = await supabase.from("recipes_two").insert({
      id: newUuid,
      name: recipeName.current?.value || "",
      description: recipeDesc.current?.value || "",
      servings: recipeServings.current?.value || 0,
      instructions: recipeInstructions.current?.value || "",
      category_id: recipeCategory.current?.value || "",
      url: recipeUrl.current?.value || "",
      upload_url: uploadedImgUrl,
      added_by: user.username
    });

    //Errorhandling
    //falls es nicht funktioniert wird Error in Konsole ausgegeben
    if (InsertError) {
      console.log("Fehler beim Einfügen", InsertError);
      //ansonsten wird direkt zur Rezeptseite navigiert
    } else {
      console.log("Rezept wurde hinzugefügt");
    }

    //hier ziehe ich mir immer die Id, die aktuell am höchsten ist, um sie dann immer +1 zu addieren für neue Zutaten
    //dies wäre nicht nötig gewesen, wenn ich die id auf uuid umgestellt hätte-->dann hätte ich nur neue uuid generieren können
    const { data, error } = await supabase
      .from("ingredients_two")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    // Standardwert, falls keine Zutaten existieren
    let nextIngredientId = 101;
    console.log(nextIngredientId) 

    // falls es Daten aus dem Backend gibt, wird hier die größte id +1 genommen
    if (data) {
      nextIngredientId = data.id + 1;
    } else {
      console.log("Keine Zutaten gefunden, Starte mit ID 101.", error);
    }

    //! die addIngredients Funktion wird hier aufgerufen, muss aber awaited werden, damit die richtige UUid mit übermittelt werden kann
    await addIngredientsToBackend(newUuid);

    // Rezept-Detail-Seite nach dem Hinzufügen aufrufen
    navigate(`/${newUuid}`);

    
  };

  //!Ab hier Zutaten (oben ja auch schon in der Funktion)
  //Typ MUSS alle Spalten aus Tabelle enthalten
  interface IIngredient {
    id: number;
    recipe_id: string;
    name: string;
    quantity: number;
    unit: string;
    additional_info: string;
  }

  //useState als Array von Zutatenobjekt
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  //useState für den FotoUpload
  const [recipeImg, setRecipeImg] = useState<File | null>(null);





  //index als Parameter weil es mehrere Inputfelder gibt, um so eine einmalige id für label und input zu erhalten
  //field als Parameter, weil untersch. Inputfelder
  //value als Parameter, um auf jedes value einzeln zugreifen zu können
  const handleZutatenChange = (
    index: number,
    field: keyof IIngredient,
    value: string
  ) => {
    //erste einmal State kopieren, damit nicht nur überschrieben wird
    const newIngredients = [...ingredients];

    //hier muss mit ternary operator  das value aus Input zu number umgewandelt werden, da ich sonst in nächster Zeile "convertedValue" bzw. wäre das dann "value" gewesen nicht zuordnen kann, weil die keys aus dem Interface untersch. Datentypen haben
    const convertedValue =
      field === "quantity" || field === "id" ? Number(value) : value;

    //! hier muss ich as never hinzufügen - weiss nicht ganz was das macht
    newIngredients[index][field] = convertedValue as never;
    // Inputfeld wird dann der neuen Ingredient hinzugefügt
    setIngredients(newIngredients);
  };

  //hier wird dann jedes mal die neue zutat dem State hinzugefügt, um dann das ganze Array per map beim Button Klick "Rezept hinzufügen" ins Backend hinzuzufügen
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: 101,
        recipe_id: "",
        name: "",
        quantity: Number(""),
        unit: "",
        additional_info: `für ${recipeName.current?.value}`,
      },
    ]);

  };


  return (
    <>
      <form
        //   hier wird Funktion von oben aufgerufen (e muss ich dabei gar nicht weiter geben)
        onSubmit={addRecipeToBackend}
        className="flex flex-col items-center gap-5 p-10"
      >
        <div className="flex justify-evenly w-full">
          <h1 className="font-bold lg:text-3xl text-xl">Füge ein neues Rezept hinzu</h1>
          <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg lg:p-3 p-1 cursor-pointer">
            Rezept hinzufügen
          </button>
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="category">
            Wähle eine Kategorie:
          </label>
          <select
            className="lg:w-100 w-50 bg-violet-200 p-2 rounded-lg"
            name="category"
            id="category"
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
            Name des Rezepts:
          </label>
          <input
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="name_rezept"
            type="text"
            placeholder="z.B. Kaiserschmarrn"
            ref={recipeName}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="desc_rezept">
            Beschreibung des Rezepts:
          </label>
          <textarea
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="desc_rezept"
            placeholder="z.B. Ein leckeres Dessert aus Tirol"
            ref={recipeDesc}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="servings_rezept">
            Anzahl der Portionen:
          </label>
          <input
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="servings_rezept"
            type="number"
            ref={recipeServings}
          />
        </div>

        <div className="flex flex-col gap-5">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex flex-row gap-5 items-center">
              <p className="lg:w-60 w-20">{index === 0 ? "Zutaten:" : ""}</p>
              <div className="flex gap-5">
                <div className="flex flex-col">
                  <label htmlFor={`menge-${index}`}>Menge:</label>
                  <input
                    className="bg-violet-200 p-2 w-30 rounded-lg"
                    type="text"
                    id={`menge-${index}`}
                    value={ingredient.quantity}
                    onChange={(e) =>
                      handleZutatenChange(index, "quantity", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor={`einheit-${index}`}>Einheit:</label>
                  <input
                    className="bg-violet-200 p-2 w-30 rounded-lg"
                    type="text"
                    id={`einheit-${index}`}
                    value={ingredient.unit}
                    onChange={(e) =>
                      handleZutatenChange(index, "unit", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={`zutat-${index}`}>Zutat:</label>
                  <input
                    className="bg-violet-200 p-2 w-30 rounded-lg"
                    type="text"
                    id={`zutat-${index}`}
                    value={ingredient.name}
                    onChange={(e) =>
                      handleZutatenChange(index, "name", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-5">
            <p className="lg:w-60 w-20"></p>
            <div className="lg:w-100 w-50 flex gap-5">
              <p
                onClick={handleAddIngredient}
                className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer"
              >
                (Weitere) Zutat hinzufügen
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="instructions_rezept">
            Anleitung des Rezepts:
          </label>
          <textarea
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg h-50"
            id="instructions_rezept"
            placeholder="z.B. 1. Mehl und Milch mischen..."
            ref={recipeInstructions}
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <label className="lg:w-60 w-20" htmlFor="url_rezept">
            Url zum Bild:
          </label>
          <input
            className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
            id="url_rezept"
            type="text"
            ref={recipeUrl}
          />
        </div>
        <div className="flex gap-5">
          <label htmlFor="img-upload" className="lg:w-60 w-20">
                  Eigenes Bild hochladen:
                </label>
                <input
                  className="bg-violet-200 p-2 lg:w-100 w-50 rounded-lg"
                  type="file"
                  accept="image/*"
                  id="img-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      setRecipeImg(e.target.files[0]);
                    }
                  }}
                />
          </div>
      </form>
    </>
  );
};

export default AddRecipe;
