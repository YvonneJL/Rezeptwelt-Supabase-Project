import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import AllRecipes from "./pages/AllRecipes"
import About from "./pages/About"
import { useEffect } from "react"
import supabase from "./utils/supabase"
import RecipeDetail from "./pages/RecipeDetail"
import AddRecipe from "./pages/AddRecipe"
import EditRecipe from "./pages/EditRecipe"
import SignUp from "./pages/SignUp"
import Login from "./pages/Login"


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
<Route index element={<Home/>}/>
<Route path="/recipes" element={<AllRecipes/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/:recipeIdParam" element={<RecipeDetail/>}/>
<Route path="/addrecipe" element={<AddRecipe/>}/>
<Route path="/editrecipe/:idParam" element={<EditRecipe/>}/>
<Route path="/signup" element={<SignUp/>}/>
<Route path="/login" element={<Login/>}/>
    </Route>
  ))

  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App
