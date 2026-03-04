
import React, { useState, useEffect } from "react"
import axios from "axios"
import foodrecipe from "../assets/foodrecipe.webp"
import RecipeItems from "../components/RecipeItems"
import { useNavigate } from "react-router-dom"
import Modal from "../components/Modal"
import InputForm from "../components/InputForm"

export default function Home() {

  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const [quickRecipes, setQuickRecipes] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("general")

  const categories = [
    "general",
    "main course",
    "dessert",
    "breakfast",
    "snack"
  ]

  const addRecipe = () => {
    let token = localStorage.getItem("token")
    if (token) navigate("/addRecipe")
    else setIsOpen(true)
  }

  useEffect(() => {
    axios.get("http://localhost:5000/recipe?page=1&limit=10")
      .then(res => {
        const sorted = res.data.recipes.sort((a, b) => {
          const timeA = parseInt(a.time) || 0
          const timeB = parseInt(b.time) || 0
          return timeA - timeB
        })
        setQuickRecipes(sorted.slice(0, 4))
      })
      .catch(err => console.log(err))
  }, [])

  return (
    <div className="home-page">

    
      <section className="hero-banner">
        <div className="hero-left">
          <img src={foodrecipe} alt="hero" />
        </div>

        <div className="hero-right">
          <h1>Chilli Flame</h1>
          <p>
            Discover restaurant-style recipes made simple.
            Cook better, eat better, and share your creations.
          </p>

          <button className="primary-btn" onClick={addRecipe}>
            Add The Recipe
          </button>
        </div>
      </section>
      <section className="section">
        <h2 className="section-title">Categories</h2>

        <div className="category-container">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "40px" }}>
          <RecipeItems category={selectedCategory} />
        </div>
      </section>
      <section className="section">
        <h2 className="section-title">Quick Dining</h2>

        <div className="card-container">
          {quickRecipes.map((item) => (
            <RecipeItems key={item._id} customData={[item]} hidePagination />
          ))}
        </div>
      </section>
      <section className="section">
        <h2 className="section-title">Trending Recipes</h2>

        <RecipeItems isTrending={true} />
      </section>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}

    </div>
  )
}
