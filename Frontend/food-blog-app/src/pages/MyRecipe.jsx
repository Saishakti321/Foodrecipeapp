


import React from "react"
import RecipeItems from "../components/RecipeItems"

export default function MyRecipe() {
  return (
    <div className="section">
      <h2 className="section-title">My Recipes</h2>

    
      <RecipeItems isMyRecipePage={true} />
    </div>
  )
}