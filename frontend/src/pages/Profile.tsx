import { useContext, useEffect, useState } from "react";
import { mainContext } from "../context/Mainprovider";
import { IUserProps } from "./SignUp";
import supabase from "../utils/supabase";

const Profile = () => {
  const { user, setUser } = useContext(mainContext) as IUserProps;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmail, setNewEMail] = useState<string>("");

  //damit user Foto hochladen kann
  const [profileImg, setProfileImg] = useState<File | null>(null);


  //fetch hier, um an die Daten von genau dem Customer zu kommen, der gerade eingeloggt ist
  //nötig, da ich später die Daten update in handleSave --> dafür ist der fetch nötig!
  const fetchUserData = async () => {
    //hier nochmal User geholt, da sonst bei Profile user=null war und erst bei refresh die Daten geholt hat
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: customer, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id);

      if (error) {
        console.log("Der Fetch hat an dieser Stelle nicht geklappt", error);
      } else {
        setUser(customer?.[0] || null);
      }
    }
  };

  //hier wird obiger fetch ausgeführt
  //ist notwendig, da sich die Daten nach der Änderung sonst nicht direkt aktualisieren
  useEffect(() => {
    fetchUserData();
  }, []);

  //Foto Upload Schritt 1
  const uploadImg = async () => {
    //wenn kein Foto hochgeladen wird, gehe aus der Funktion
    if (!profileImg) return null;

    const fileName = profileImg.name;

    //upload erfolgt dann direkt im Root des Buckets "img-for-customers"
    const { error } = await supabase.storage
      .from("img-for-customer")
      .upload(fileName, profileImg);

    if (error) {
      console.log("Fehler beim Hochladen des Fotos", error);
      return null;
    }

    const fotoUrl = supabase.storage
      .from("img-for-customer")
      .getPublicUrl(fileName).data.publicUrl;

    return fotoUrl;
  };

  console.log(user);

  //Funktion, um sowohl Email, also auch userName zu ändern
  function handleChangeData() {
    if (user) {
      setNewEMail(user.email);
      setNewUsername(user.username);
      setIsEditing(true);
    }
  }

  async function handleSave() {
    setIsEditing(false);
    //hier gehts weiter mit Schritt 2 vom FotoUpload
    //hier wird Funktion ausgeführt und der returned Wert gespeichert
    //allerdings nur, wenn
    let uploadedImgUrl = null;
    if (profileImg) {
      uploadedImgUrl = await uploadImg();
      if (!uploadedImgUrl) {
        console.log("Fehler beim Hochladen oder kein Bild");
      }
    }
    //! auskommentiert, da bei keinem ausgewählten Bild handleSave sonst nicht klappt
    //Falls es keine Url gibt, geh aus der Funktion raus
    //if (!uploadedImgUrl) return null

    if (user) {
      const { data, error } = await supabase
        .from("customers")
        .update({
          username: newUsername,
          email: newEmail,
          //folgende Zeile nachträglich für den FotoUpload hinzugefügt
          // nach Fragezeichen (oder), den Wert aus Tabelle ziehen
          // wenn ich das nicht schreibe, wird "null" als neuer Wert für Tabelle genutzt und die URL aus usprünglich hochgeladenem Bild verschwindet
          img_url: uploadedImgUrl ?? user?.img_url,
        })
        .eq("id", user.id);
      console.log(data);
      if (error) {
        console.error("Fehler beim Speichern", error);
      } else {
        //um die aktualisierten Daten auch gleich wieder zu ziehen
        fetchUserData();
      }
    }
  }

  //Funktion, um Profilbild im Storage und in der Tabelle zu löschen
  const handleDelete = async () => {
    //hier speichere ich den den Pfad zur Datei
    const filePath = user?.img_url?.split("/img-for-customer/")[1];
    //wenn es keinen gibt, also kein Bild, dann wird die Funktion beendet
    if (!filePath) {
      return;
    }

    //hier lösche ich das Bild zuerst aus dem Storage mit HIlfe von filePath
    const {error: storageError} = await supabase
    .storage
    .from("img-for-customer")
    .remove([filePath])

    //error Handling
    if (storageError) {
      console.log("Bucket Löschen hat nicht geklappt", storageError);
    } else {
      console.log("Storage löschen successful");
    }

    //hier lösche ich bzw update ich die img_url aus der customer Tabelle beim entspr. customer
    const {data, error} =  await supabase
    .from("customers")
    .update({
      img_url: null
    })
    .eq("id", user.id)
    .select()

    //Errorhandling
    //bei Success wird auch user für UI geupdated, damit die Änderungen direkt sichtbar sind
    if (error) {
      console.log("Das Löschen hat nicht geklappt", error);
    } else {
      console.log("Löschen hat geklappt");
      setUser({
        ...user,
        img_url: null
      });
    }
  }


  return (
    <>
      <article className="flex flex-col p-10 items-center">
        {/* Bild wird nur angezeigt, wenn es eine url gibt ansonsten ein lila Kreis in derselben Größe */}
        {user?.img_url ? (
          <img src={user?.img_url} alt="Profilbild" className="w-40 h-40 rounded-full object-cover object-center" />
        ): <div className="flex justify-center items-center w-40 h-40 rounded-full object-cover object-center bg-violet-300 text-6xl">🧑‍🍳</div>}
        <h1 className="p-10 text-3xl">
          {user
            ? `Willkommen ${newUsername || user.username}`
            : "Profil lädt..."}
        </h1>
      </article>
      <section className="flex justify-center p-10">
        {/* input Felder erscheinen nur, wenn isEditing true ist */}
        {/* isEditing wird tru durch handleChangeData, die ausgelöst wird beim Click auf "Daten ändern" */}
        {user && (
          <div className="flex flex-col gap-5">
            <div className="flex gap-5 items-center cursor-pointer">
              <label className="w-60" htmlFor="username-profile">
                Username:
              </label>
              {isEditing ? (
                <input
                  className="bg-violet-200 p-2 w-100 rounded-lg"
                  type="text"
                  placeholder="change your username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  id="username-profile"
                />
              ) : (
                <p>{user.username}</p>
              )}
            </div>

            <div className="flex gap-5 items-center cursor-pointer">
              <label className="w-60" htmlFor="email-profile">
                Email:
              </label>
              {isEditing ? (
                <input
                  className="bg-violet-200 p-2 w-100 rounded-lg"
                  type="email"
                  placeholder="change your email"
                  value={newEmail}
                  onChange={(e) => setNewEMail(e.target.value)}
                  id="email-profile"
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>
            <div className="flex gap-5">
              <p className="w-60">Firstname: </p>
              <p>{user.firstname}</p>
            </div>
            <div className="flex gap-5">
              <p className="w-60">Lastname: </p>
              <p>{user.lastname} </p>
            </div>
            {/* Möglichkeit FotoUpload wird nur angezeigt, wenn isEditing true also beim Click des Buttons wurde */}
            {isEditing && (
              <div className="flex flex-col gap-5">
                <div className="flex gap-5">
                <label htmlFor="img-upload" className="w-60">
                  Profilbild:
                </label>
                <input
                  className="bg-violet-200 p-2 w-100 rounded-lg"
                  type="file"
                  accept="image/*"
                  id="img-upload"
                  onChange={(e) => {
                    if (e.target.files) {
                      setProfileImg(e.target.files[0]);
                    }
                  }}
                />
                </div>
                <div className="flex gap-5">
                  <p className="w-60"></p>
                  <p className=" bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer active:scale-95 transition-transform duration-150 ease-in-out" onClick={handleDelete}>Profilbild löschen</p>
                </div>
              </div>
            )}
            {/* button wechselt onClick Funktion je nachdem ob gerade editiert wird oder nicht */}
            <button
              className=" bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer"
              onClick={isEditing ? handleSave : handleChangeData}
            >
              {isEditing ? "Änderung speichern" : "Daten ändern"}
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Profile;
