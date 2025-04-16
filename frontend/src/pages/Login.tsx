import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { mainContext } from "../context/Mainprovider";

export interface ILoggedInProps {
    isLoggedIn: boolean
    setIsLoggedIn: (value: boolean) => void
}

const Login = () => {

    const navigate = useNavigate()

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    //um beim Eingeben falsches PW oder Email eine message anzeigen zu lassen
    const [message, setMessage] = useState<string>("")

    //brauche ich hier, weil ich isLoggedIn auf falsch setze, falls beim Login was schief läuft
    const {isLoggedIn, setIsLoggedIn} = useContext(mainContext) as ILoggedInProps

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // um auf die Inputfelder zugreifen zu können
        const email = emailRef.current?.value || ""
        const password = passwordRef.current?.value || "" 

        try {
            const {error} = await supabase
            .auth
            //supabase Befehl, muss email und password sein
            // wird mit Werten aus Input gefüllt
            .signInWithPassword({
                email: email,
                password: password
            })
            //falls beim Login etwas schief geht
            //navigate sorgt dafü, dass man auf login page bleibt
            //Message wird angezeigt
            //setIsLoggedIn um dementsprechend Logout oder Sign In zu zeigen
            if (error) {
                console.log(error);
                navigate("/login")
                //setIsLoggedIn(false)
                setMessage("Du hast ein falsches Passwort oder einen falschen Benutzernamen eingegeben")
            } else {
                setIsLoggedIn(true)
                navigate("/profile")
            }
        } catch (error) {
            console.log(error);
        }
    }

    
    return ( 
        <form  onSubmit={handleLogin} className="flex flex-col items-center gap-5 p-10">
        <h1 className="text-5xl pb-10 self-start">Login:</h1>
        <div className="flex flex-row gap-5 items-center">
        <label className="lg:w-60 w-20"  htmlFor="emailLogin">Email:</label>
        <input className="bg-violet-100 p-2 lg:w-100 w-50 rounded-lg" type="email" id="emailLogin" ref={emailRef}/>
        </div>
        <div className="flex flex-row gap-5 items-center">
        <label className="lg:w-60 w-20"  htmlFor="passwortLogin">Passwort:</label>
        <input className="bg-violet-100 p-2 lg:w-100 w-50 rounded-lg" id="passwortLogin" type="password" ref={passwordRef}/>
        </div>
        <div className="flex gap-5">
            <p className="lg:w-60 w-20"></p>
            <div className="lg:w-100 w-50 flex justify-between">
            <Link className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer" to={"/signup"}>Not yet signed up?</Link>
            <button className="inline-flex bg-violet-200 border-2 border-violet-400 rounded-lg p-3 cursor-pointer">Log In</button>
            </div>
        </div>            
        {!isLoggedIn && <p className="text-red-300">{message}</p>}
    </form>
     );
}
 
export default Login;