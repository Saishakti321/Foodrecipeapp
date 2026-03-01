

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
  const [trendingRecipes, setTrendingRecipes] = useState([])

  const addRecipe = () => {
    let token = localStorage.getItem("token")
    if (token) navigate("/addRecipe")
    else setIsOpen(true)
  }

  useEffect(() => {
    axios.get("http://localhost:5000/recipe/trending")
      .then(res => setTrendingRecipes(res.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>

      
      <section className="hero-banner">

        <div className="hero-left">
          <img src={foodrecipe} alt="hero" />
        </div>

        <div className="hero-right">
          <h1>Chilli Lime Fish</h1>
          <p>
            Discover restaurant-style recipes made simple.
            Cook better, eat better, and share your creations.
          </p>

          <button className="primary-btn" onClick={addRecipe}>
            Get The Recipe
          </button>
        </div>

      </section>

      
      <section className="section">
        <h2 className="section-title">Trending Recipes</h2>

        <div className="card-container">
          {trendingRecipes.map((item) => (
            <div
              key={item._id}
              className="card modern-card"
              onClick={() => navigate(`/recipe/${item._id}`)}
            >
              <img
                src={
                  item.source === "api"
                    ? item.coverImage
                    : item.coverImage
                      ? `http://localhost:5000/images/${item.coverImage}`
                      : foodrecipe
                }
                className="card-image"
                alt={item.title}
                onError={(e) => (e.target.src = foodrecipe)}
              />

              <div className="card-body">
                <div className="title">{item.title}</div>

                <div className="rating">
                  {"⭐".repeat(Math.round(item.averageRating || 0))}
                  <span>
                    ({item.averageRating?.toFixed(1) || 0})
                  </span>
                </div>
              </div>

              <div className="icons">
                <div className="timer">
                  {item.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="section light-bg">
        <h2 className="section-title">Quick Dinners</h2>

        <div className="card-container">
          {trendingRecipes.slice(0, 4).map((item) => (
            <div
              key={item._id}
              className="card modern-card"
              onClick={() => navigate(`/recipe/${item._id}`)}
            >
              <img
                src={
                  item.source === "api"
                    ? item.coverImage
                    : item.coverImage
                      ? `http://localhost:5000/images/${item.coverImage}`
                      : foodrecipe
                }
                className="card-image"
                alt={item.title}
                onError={(e) => (e.target.src = foodrecipe)}
              />

              <div className="card-body">
                <div className="title">{item.title}</div>
                <div className="timer">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    
      <section className="section">
        <h2 className="section-title">Latest Recipes</h2>
        <RecipeItems />
      </section>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}

    </div>
  )
}