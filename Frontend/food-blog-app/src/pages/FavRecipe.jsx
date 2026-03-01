import React from "react"
import RecipeItems from "../components/RecipeItems"

export default function FavRecipe() {
  return (
    <div className="section">
      <h2 className="section-title">My Favorites</h2>
      <RecipeItems type="favorite" />
    </div>
  )
}