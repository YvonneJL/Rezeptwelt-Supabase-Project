import { useContext, useEffect, useState } from "react";
import { mainContext } from "../context/Mainprovider";
import { IUserProps } from "./SignUp";
import supabase from "../utils/supabase";


const Profile = () => {

    const {user, setUser} = useContext(mainContext) as IUserProps

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [newUsername, setNewUsername] = useState<string>("")
    const [newEmail, setNewEMail] = useState<string>("")

 
    //fetch hier, um an die Daten von genau dem Customer zu kommen, der gerade eingeloggt ist
    //nötig, da ich später die Daten update in handleSave --> dafür ist der fetch nötig!
    const fetchUserData = async () => {
        const {data: customer, error} = await supabase
        .from("customers")
        .select("*")
        .eq("id", user.id)

        if(error) {
            console.log("Der Fetch hat an dieser Stelle nicht geklappt", error);
        } else {
            setUser(customer?.[0] || null)
        }
    }

    //hier wird obiger fetch ausgeführt
    //ist notwendig, da sich die Daten nach der Änderung sonst nicht direkt aktualisieren
    useEffect(()=> {
        fetchUserData()
    }, [])

    console.log(user);

    //Funktion, um sowohl Email, also auch userName zu ändern
    function handleChangeData(){
        if(user){
            setNewEMail(user.email)
            setNewUsername(user.username)
            setIsEditing(true)
        }
    }

    async function handleSave(){
        //nur wenn der neue Username nicht dem alten gleicht, das update ausführen
        if(user && newUsername !== user.username){

           const {error} = await supabase
           .from("customers")
           .update({
            username: newUsername,
            email: newEmail
           })
           .eq("id", user.id)
           if(error){
            console.error("Fehler beim Speichern", error);
           }else {
            //um die aktualisierten Daten auch gleich wieder zu ziehen
            fetchUserData()
           }
        }
        setIsEditing(false)
    }




    return ( 
        <>
            <h1 className="p-10 text-3xl">Account von {newUsername ? newUsername : user.username}</h1>
        <section className="flex justify-center p-10">
            {/* input Felder erscheinen nur, wenn isEditing true ist */}
            {/* isEditing wird tru durch handleChangeData, die ausgelöst wird beim Click auf "Daten ändern" */}
        {user && (
            <div className="flex flex-col gap-5">
                <div className="flex gap-5 items-center cursor-pointer">
                    <label className="w-60" htmlFor="username-profile">Username:</label>
                    {
                       isEditing ? (
                       <input className="bg-violet-100 p-2 w-100 rounded-lg"
                       type="text"
                       placeholder='change your username'
                       value={newUsername}
                       onChange={(e)=> setNewUsername(e.target.value)}
                       id="username-profile"
                       /> ) : (
                       <p>
                        {user.username}
                       </p>
                       )
                    }
                </div>

                <div className="flex gap-5 items-center cursor-pointer">
                    <label className="w-60" htmlFor="email-profile">Email:</label>
                    {
                       isEditing ? (
                       <input className="bg-violet-100 p-2 w-100 rounded-lg"
                       type="email"
                       placeholder='change your email'
                       value={newEmail}
                       onChange={(e)=> setNewEMail(e.target.value)}
                       id="email-profile"
                       /> ) : (
                       <p>
                        {user.email}
                       </p>
                       )
                    }
                </div>
                <div className="flex gap-5">
                <p className="w-60">Firstname: </p>
                    <p>{user.firstname}</p>
                </div>
                <div className="flex gap-5">
                <p className="w-60">Lastname: </p>
                    <p>{user.lastname} </p>
                </div>
                {/* button wechselt onClick Funktion je nachdem ob gerade editiert wird oder nicht */}
        <button className=" bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer" onClick={isEditing ? handleSave : handleChangeData}>{isEditing ? "Änderung speichern" : "Daten ändern"}</button>
            </div>
        )}
        </section>
        </>
     );
}
 
export default Profile;