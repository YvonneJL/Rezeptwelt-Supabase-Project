import { createContext, useState } from "react";
import { IUser } from "../interfaces";

export const mainContext = createContext({})

const MainProvider = ({children}: {children: React.ReactNode}) => {

const [user, setUser] = useState<IUser | null>(null)
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
const [loading, setLoading] = useState<boolean>(true)

    return ( 
        <mainContext.Provider value={{user, setUser, isLoggedIn, setIsLoggedIn, loading, setLoading}}>
            {children}
        </mainContext.Provider>
     );
}
 
export default MainProvider;