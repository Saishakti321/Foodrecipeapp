

import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import RecipeDetails from './pages/RecipeDetails'
import MyRecipe from './pages/MyRecipe'
import EditRecipe from './pages/EditRecipe'
import FavRecipe from './pages/FavRecipe'


const getAllRecipes = async () => {
  try {
    const res = await axios.get("http://localhost:5000/recipe")
    return res.data
  } catch (err) {
    return []
  }
}

const getMyRecipe = async () => {
  try {
    const token = localStorage.getItem("token")
    if (!token) return []

    const res = await axios.get(
      "http://localhost:5000/recipe/my",
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    )

    return res.data
  } catch (err) {
    return []
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [

      { 
        path: "/", 
        element: <Home />, 
        loader: getAllRecipes 
      },
      
      { path: "/recipe", element: <Home />, loader: getAllRecipes },

      { 
        path: "/myRecipe", 
        element: <MyRecipe />, 
        
      },
      {
  path: "/editRecipe/:id",
  element: <EditRecipe />
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
        path: "/recipe/:id", 
        element: <RecipeDetails /> 
      }

    ]
  }
])

const App = () => {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<h2 style={{ textAlign: "center" }}>Loading...</h2>}
    />
  )
}

export default App