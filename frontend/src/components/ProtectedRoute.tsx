import { useContext } from "react";
import { mainContext } from "../context/Mainprovider";
import { Navigate } from "react-router-dom";
import { IMainProps } from "../App";


const ProtectedRoute = ({children}: {children: React.ReactNode}) => {

const {isLoggedIn, loading} = useContext(mainContext) as IMainProps


//! Das kann ich die App.tsx --> global, da Authentifizierung global sein kann/muss
// useEffect(()=> {
//     const checkLoginStatus = async () => {
//         const {data: user} = await supabase
//         .auth
//         .getUser()

//         console.log(user);
//         if (user.user !== null) {
//             console.log("hallo");
//             setUser(user.user as unknown as IUser)
//             setIsLoggedIn(true)
//         }
//         setLoading(false)
//     }
//     checkLoginStatus()
// }, [setUser, setIsLoggedIn])



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