import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IUser } from "../interfaces";
import { mainContext } from "../context/Mainprovider";
import supabase from "../utils/supabase";

interface IUserProps {
    user: IUser
    setUser: (value: IUser) => void
}

export interface ILoggedInProps {
    isLoggedIn: boolean
    setIsLoggedIn: (value: boolean) => void
}

const SignUp = () => {

    const navigate = useNavigate()

    //aus dem Mainprovider, um überall auf user zugreifen zu können
    //interface in interfaces.ts
    const {user, setUser} = useContext(mainContext) as IUserProps
    const {isLoggedIn, setIsLoggedIn} = useContext(mainContext) as ILoggedInProps

    //useRef um auf die Input Inhalte zugreifen zu können
    const usernameRef = useRef<HTMLInputElement>(null)
    const vornameRef = useRef<HTMLInputElement>(null)
    const nachnameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    
    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //um entsprechend Log Out zu sehen statt Sign Up
        setIsLoggedIn(true)

        //zunächst hole ich mir die Inhalte aus den Inputfeldern
        const username = usernameRef.current?.value || ""
        const vorname = vornameRef.current?.value || ""
        const nachname = nachnameRef.current?.value || ""
        const email = emailRef.current?.value || ""
        const password = passwordRef.current?.value || ""

        //hier gebe ich diese Werte dann mit dem Setter weiter an das Objekt "user"
        //! Wozu brauche ich user überhaupt? --> um bei BEdarf auf ID zugreifen zu können --> evtl. noch Profile.tsx anlegen
        if (user) {
            setUser({
                ...user,
                username: username,
                firstname: vorname,
                lastname: nachname,
                email: email,
                password: password
            })
        }
        console.log(user);

        //hier signUp Befehl von supabase
        //erwartet immer email und password
        //unter options, dann data können noch weitere keys hinzugefügt werden (die die man in supabase in der Tabelle angelegt hat)
        //da ich eine Funktion im Hintergrund bei supabase laufen habe, wird user direkt in die Tabelle customers hinzugefügt
        try {
            const {data, error} = await supabase
            .auth
            .signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username,
                        firstname: vorname,
                        lastname: nachname,
                        email: email
                    }
                }
            })
            if (error) {
                console.log("Einloggen hat nicht geklappt", error);

            } else {
                console.log(data);
            }
            //wenn man eingeloggt ist, kommt man auf die Seite Recipes
            //! hier viell zu Profile ändern?!
            navigate("/recipes")
        } catch (e) {
            console.log(e);
        }
    }

    return ( 
        <form onSubmit={handleSignUp} className="flex flex-col items-center gap-5 p-10">
            <h1 className="text-5xl pb-10 self-start">Sign up für Rezeptwelt:</h1>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60"  htmlFor="username">Username:</label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" type="text" id="username" placeholder="z.B. Mia123" ref={usernameRef}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60"  htmlFor="vorname">Vorname:</label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" type="text" id="vorname" placeholder="z.B. Mia" ref={vornameRef}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60"  htmlFor="nachname">Nachname:</label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" id="nachname" type="text" placeholder="z.B. Mustermensch" ref={nachnameRef}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60"  htmlFor="emailadresse">Emailadresse:</label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" id="emailadresse" type="email" placeholder="z.B. Mia@mammamia.de" ref={emailRef}/>
            </div>
            <div className="flex flex-row gap-5 items-center">
            <label className="w-60"  htmlFor="passwort">Passwort:</label>
            <input className="bg-violet-100 p-2 w-100 rounded-lg" id="passwort" type="password" placeholder="Wähle ein Passwort mit mind. 6 Zeichen" ref={passwordRef} />
            </div>
            <div className="flex gap-5">
                <p className="w-60"></p>
                <div className="w-100 flex justify-between">
                <Link className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer" to={"/login"}>Already signed up?</Link>
                <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer">Sign Up</button>
                </div>
            </div>            
        </form>
     );
}
 
export default SignUp;