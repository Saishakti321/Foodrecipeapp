

import React, { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const AddFoodRecipe = () => {

  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, files } = e.target

    let updatedValue

    if (name === "ingredients") {
      updatedValue = value.split(",").map(item => item.trim())
    } 
    else if (name === "coverImage") {
      updatedValue = files[0]
    } 
    else {
      updatedValue = value
    }

    setRecipeData(prev => ({
      ...prev,
      [name]: updatedValue
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!recipeData.title || !recipeData.instructions || !recipeData.ingredients) {
      alert("Please fill all required fields")
      return
    }

    const formData = new FormData()

    formData.append("title", recipeData.title)
    formData.append("instructions", recipeData.instructions)
    formData.append("time", recipeData.time || "")
    formData.append("category", recipeData.category || "general")

    const ingredientList = Array.isArray(recipeData.ingredients)
      ? recipeData.ingredients
      : [recipeData.ingredients]

    ingredientList.forEach(item => {
      formData.append("ingredients", item)
    })

    if (recipeData.coverImage) {
      formData.append("coverImage", recipeData.coverImage)
    }

    try {
      await axios.post(
        "http://localhost:5000/recipe",
        formData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      )

      navigate("/")

    } catch (err) {
      console.log(err.response?.data)
    }
  }

  return (
    <div className="container2">

      <div className="left-side">
        <h1>Add Your Recipe</h1>
        <p>
          Share your delicious creations with others.
          Inspire people through your cooking.
        </p>

        <div className="food-icons">
          <span>🍕</span>
          <span>🍔</span>
          <span>🍟</span>
          <span>🍩</span>
          <span>🍣</span>
        </div>
      </div>

      <form className="form2" onSubmit={handleSubmit}>

        <div className="form-control2">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="input"
            onChange={handleChange}
          />
        </div>

        <div className="form-control2">
          <label>Time</label>
          <input
            type="text"
            name="time"
            className="input"
            onChange={handleChange}
          />
        </div>

        <div className="form-control2">
          <label>Category</label>
          <select
            name="category"
            className="input"
            onChange={handleChange}
          >
            <option value="general">General</option>
            <option value="main course">Main Course</option>
            <option value="dessert">Dessert</option>
            <option value="breakfast">Breakfast</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div className="form-control2">
          <label>Ingredients</label>
          <input
            type="text"
            name="ingredients"
            className="input"
            placeholder="cheese, tomato, onion"
            onChange={handleChange}
          />
        </div>

        <div className="form-control2">
          <label>Instructions</label>
          <textarea
            name="instructions"
            className="input"
            rows="4"
            onChange={handleChange}
          />
        </div>

        <div className="form-control2">
          <label>Recipe Image</label>
          <input
            type="file"
            name="coverImage"
            className="input"
            onChange={handleChange}
          />
        </div>

        <button className="btn" type="submit">
          Add Recipe
        </button>

      </form>

    </div>
  )
}

export default AddFoodRecipe;