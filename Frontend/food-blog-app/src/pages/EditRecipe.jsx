import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

export default function EditRecipe() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: "",
    instructions: "",
    time: "",
    category: ""
  })

  useEffect(() => {

    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/recipe/${id}`)
        const data = res.data

        setRecipe({
          title: data.title,
          ingredients: data.ingredients.join(", "),
          instructions: data.instructions,
          time: data.time,
          category: data.category
        })

      } catch (err) {
        console.log(err)
      }
    }

    fetchRecipe()

  }, [id])

  const handleChange = (e) => {
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const token = localStorage.getItem("token")

      await axios.put(
        `http://localhost:5000/recipe/${id}`,
        {
          ...recipe,
          ingredients: recipe.ingredients.split(",").map(i => i.trim())
        },
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )

      navigate("/myRecipe")

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="section">

      <h2 className="section-title">Edit Recipe</h2>

      <form className="edit-form" onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          placeholder="Title"/>
        <input
          type="text"
          name="ingredients"
          value={recipe.ingredients}
          onChange={handleChange}
          placeholder="Ingredients (comma separated)"/>

        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          placeholder="Instructions" />

        <input
          type="text"
          name="time"
          value={recipe.time}
          onChange={handleChange}
          placeholder="Cooking Time"
        />

        <input
          type="text"
          name="category"
          value={recipe.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <button type="submit" className="primary-btn">
          Update Recipe
        </button>

      </form>

    </div>
  )
}