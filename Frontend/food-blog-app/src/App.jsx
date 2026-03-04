


import React from "react"
import "./App.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"

import MainNavigation from "./components/MainNavigation"
import Home from "./pages/Home"
import MyRecipe from "./pages/MyRecipe"
import FavRecipe from "./pages/FavRecipe"
import AddFoodRecipe from "./pages/AddFoodRecipe"
import EditRecipe from "./pages/EditRecipe"
import RecipeDetails from "./pages/RecipeDetails"
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,   
    children: [

    
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/category/:name",
        element: <Home />
      },

    
      {
        path: "/myRecipe",
        element: <MyRecipe />
      },
      {
        path: "/favRecipe",
        element: <FavRecipe />
      },

      
      {
        path: "/addRecipe",
        element: <AddFoodRecipe />
      },

      
      {
        path: "/editRecipe/:id",
        element: <EditRecipe />
      },

      
      {
        path: "/recipe/:id",
        element: <RecipeDetails />
      }

    ]
  }
])

function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      }
    />
  )
}

export default App