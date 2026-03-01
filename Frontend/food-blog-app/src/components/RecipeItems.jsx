

import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { BsStopwatch } from "react-icons/bs"
import { FaHeart, FaEdit, FaTrash } from "react-icons/fa"

const RecipeItems = ({ category, isMyRecipePage }) => {

  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([]) // ⭐ store favorite ids
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {

    const fetchRecipes = async () => {

      try {

        const token = localStorage.getItem("token")

        let url = ""
        let config = {}

        if (category) {
          url = `http://localhost:5000/recipe/category/${category}?page=${page}&limit=10`
        }

        else if (location.pathname === "/myRecipe") {

          if (!token) return

          url = `http://localhost:5000/recipe/my?page=${page}&limit=10`

          config = {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        }

        else if (location.pathname === "/favRecipe") {

          if (!token) return

          url = `http://localhost:5000/recipe/favorites`

          config = {
            headers: {
              Authorization: "Bearer " + token
            }
          }
        }

        else {
          url = `http://localhost:5000/recipe?page=${page}&limit=10`
        }

        const res = await axios.get(url, config)

        const recipeData = res.data.recipes || res.data || []

        setRecipes(recipeData)
        setTotalPages(res.data.totalPages || 1)

        // ⭐ fetch favorite list
        if (token) {
          const favRes = await axios.get(
            "http://localhost:5000/recipe/favorites",
            {
              headers: {
                Authorization: "Bearer " + token
              }
            }
          )

          const favIds = favRes.data.map(r => r._id)
          setFavorites(favIds)
        }

      } catch (err) {
        console.log("Error fetching recipes:", err)
        setRecipes([])
      }
    }

    fetchRecipes()

  }, [category, location.pathname, page])

  /* ================= FAVORITE ================= */

  const handleFavorite = async (id) => {

    try {

      const token = localStorage.getItem("token")
      if (!token) {
        alert("Please login first")
        return
      }

      await axios.put(
        `http://localhost:5000/recipe/favorite/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )

      // update UI instantly
      setFavorites(prev =>
        prev.includes(id)
          ? prev.filter(fav => fav !== id)
          : [...prev, id]
      )

    } catch (err) {
      console.log("Favorite error:", err)
    }
  }

  /* ================= DELETE ================= */

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm("Are you sure?")
    if (!confirmDelete) return

    try {

      const token = localStorage.getItem("token")

      await axios.delete(
        `http://localhost:5000/recipe/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token
          }
        }
      )

      setRecipes(prev => prev.filter(r => r._id !== id))

    } catch (err) {
      console.log("Delete error:", err)
    }
  }

  return (
    <div>

      {recipes.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No recipes found.
        </p>
      )}

      <div className="card-container">

        {recipes.map((item) => {

          const avgRating = item.averageRating || 0
          const reviewCount = item.reviews?.length || 0
          const isFavorited = favorites.includes(item._id)

          return (
            <div
              key={item._id}
              className="card modern-card"
              onClick={() => navigate(`/recipe/${item._id}`)}
            >

              {isMyRecipePage && (
                <div
                  className="action-icons"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEdit
                    className="edit-icon"
                    onClick={() => navigate(`/editRecipe/${item._id}`)}
                  />

                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(item._id)}
                  />
                </div>
              )}

              <img
                src={
                  item.source === "api"
                    ? item.coverImage
                    : item.coverImage
                      ? `http://localhost:5000/images/${item.coverImage}`
                      : "/fallback.jpg"
                }
                className="card-image"
                alt={item.title}
              />

              <div className="card-body">
                <div className="title">{item.title}</div>

                <div className="rating">
                  {"⭐".repeat(Math.round(avgRating))}
                  <span>({avgRating.toFixed(1)})</span>
                </div>
              </div>

              <div className="icons">

                <div className="timer">
                  <BsStopwatch />
                  {item.time}
                </div>

                <div
                  className="likes"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleFavorite(item._id)
                  }}
                >
                  <FaHeart
                    style={{
                      color: isFavorited ? "red" : "gray",
                      cursor: "pointer"
                    }}
                  />
                  <span>{reviewCount}</span>
                </div>

              </div>

            </div>
          )
        })}

      </div>

    </div>
  )
}

export default RecipeItems