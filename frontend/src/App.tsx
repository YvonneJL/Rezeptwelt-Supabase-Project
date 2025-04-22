import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import AllRecipes from "./pages/AllRecipes"
import About from "./pages/About"
import RecipeDetail from "./pages/RecipeDetail"
import AddRecipe from "./pages/AddRecipe"
import EditRecipe from "./pages/EditRecipe"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Profile from "./pages/Profile"
import { useContext, useEffect } from "react"
import supabase from "./utils/supabase"
import { IUser } from "./interfaces"
import { mainContext } from "./context/Mainprovider"

//brauche ich auch in der ProtectedRoute
export interface IMainProps {
  user: IUser | null,
  setUser: (user: IUser) => void;
  isLoggedIn: boolean,
  setIsLoggedIn: (value: boolean) => void
  loading: boolean,
  setLoading: (value: boolean) => void
}


function App() {

  //für useEffect nötigen States aus Mainprovider
  const {isLoggedIn, setIsLoggedIn, setUser, setLoading} = useContext(mainContext) as IMainProps

  //kommt aus ProtectedRoute
  //Authentifizierung User
  //muss hier rein, sonst geht isLoggedIn auf false, wenn ich die Seite refreshe
 const checkLoginStatus = async () => {
    const {data: user} = await supabase
    .auth
    .getUser()

    //musste diesen Fetch auch noch in die App.tsx hinzu, damit ich mir die genauen Daten vom suer ziehen kann
    //nur der Fetch oben drüber häte nur den Token geholt - so wären nicht gleich die Daten vom eingeloggten user geladen worden sondern die von der Person davor
    //jetzt laden direkt die Daten vom neuen User - nicht erst wenn ich auf Profile.tsx klicke
    const { data: customer, error } = await supabase
    .from("customers")
    .select("*")
    // hier muss ich user.user schrieben, da ich aus dem ersten Fetch eins drüber user als Objekt zurück bekomme und dann da rein muss
    //wenn ich oben const data: {user} geschrieben hätte, hätte ich schon destructured und müsste es nicht mit .user rein navigieren
    .eq("id", user?.user?.id);

  if (error) {
    console.log("Der Fetch hat an dieser Stelle nicht geklappt", error);
    setLoading(false)
  } else {
    setUser(customer?.[0] || null);
    setIsLoggedIn(true)
  }


    // console.log(user);
    // if (user.user !== null) {
    //     //setUser(user.user as unknown as IUser)
    // }
}

  useEffect(()=> {
    checkLoginStatus()
}, [setUser, isLoggedIn])

// useEffect(() => {
//   const { data: subscription } = supabase.auth.onAuthStateChange(
//     async (event, session) => {
//       console.log("Auth event:", event);
//       if (session?.user) {
//         setUser(session.user as unknown as IUser);
//         setIsLoggedIn(true);
//       } else {
//         //setUser(null);
//         setIsLoggedIn(false);
//       }
//       setLoading(false);
//     }
//   );

//   return () => {
//     subscription?.subscription.unsubscribe();
//   };
// }, []);


  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
<Route index element={<Home/>}/>
<Route path="/recipes" element={<AllRecipes/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/:recipeIdParam" element={<RecipeDetail/>}/>
<Route path="/addrecipe" element={
  <ProtectedRoute>
    <AddRecipe/>
  </ProtectedRoute>
  }/>
<Route path="/editrecipe/:idParam" element={
  <ProtectedRoute>
    <EditRecipe/>
  </ProtectedRoute>
  }/>
<Route path="/signup" element={<SignUp/>}/>
<Route path="/login" element={<Login/>}/>
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile/>
  </ProtectedRoute>
  }/>
    </Route>
  ))

  return (
    <main className="bg-violet-100">
    <RouterProvider router={router}/>
    </main>
  )
}

export default App
