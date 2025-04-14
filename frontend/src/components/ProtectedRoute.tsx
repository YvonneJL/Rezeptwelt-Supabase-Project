import { useContext, useEffect, useState } from "react";
import { mainContext } from "../context/Mainprovider";
import { IUser } from "../interfaces";
import supabase from "../utils/supabase";
import { Navigate } from "react-router-dom";

interface IMainProps {
    user: IUser | null,
    setUser: (user: IUser) => void;
    isLoggedIn: boolean,
    setIsLoggedIn: (value: boolean) => void
}

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

const {isLoggedIn, setIsLoggedIn, setUser} = useContext(mainContext) as IMainProps
const [loading, setLoading] = useState<boolean>(true)

useEffect(()=> {
    const checkLoginStatus = async () => {
        const {data: user} = await supabase
        .auth
        .getUser()

        console.log(user);
        if (user.user !== null) {
            console.log("hallo");
            setUser(user.user as unknown as IUser)
            setIsLoggedIn(true)
        }
        setLoading(false)
    }
    checkLoginStatus()
}, [setUser, setIsLoggedIn])



if (loading) {
    return <div>Loading...</div>
}

    return ( 
        
        <>
        {isLoggedIn ? children : <Navigate to={"/login"} replace/>}
        </>
     );
}
 
export default ProtectedRoute;