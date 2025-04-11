import { createContext, useState } from "react";

export const mainContext = createContext({})

const MainProvider = ({children}: {children: React.ReactNode}) => {

const [user, setUser] = useState<any>()
const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    return ( 
        <mainContext.Provider value={{user, setUser, isLoggedIn, setIsLoggedIn}}>
            {children}
        </mainContext.Provider>
     );
}
 
export default MainProvider;