
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { BsStopwatch } from "react-icons/bs"
import { FaHeart, FaEdit, FaTrash } from "react-icons/fa"

const RecipeItems = ({
  category,
  isMyRecipePage,
  isTrending,
  customData,
  hidePagination
}) => {

  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {

    if (customData) {
      setRecipes(customData)
      return
    }

    const fetchRecipes = async () => {
      try {

        const token = localStorage.getItem("token")
        let url = ""
        let config = {}

        if (isTrending) {
          url = `http://localhost:5000/recipe/trending?page=${page}&limit=10`
        }

        else if (category && category !== "") {
          url = `http://localhost:5000/recipe/category/${category}?page=${page}&limit=10`
        }

        else if (location.pathname === "/myRecipe") {
          if (!token) return
          url = `http://localhost:5000/recipe/my?page=${page}&limit=10`
          config = { headers: { Authorization: "Bearer " + token } }
        }

        else {
          url = `http://localhost:5000/recipe?page=${page}&limit=10`
        }

        const res = await axios.get(url, config)

        setRecipes(res.data.recipes || res.data)
        setTotalPages(res.data.totalPages || 1)

      } catch (err) {
        console.log(err)
      }
    }

    fetchRecipes()

  }, [category, page, location.pathname, isTrending, customData])
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const res = await axios.get(
          "http://localhost:5000/recipe/favorites",
          { headers: { Authorization: "Bearer " + token } }
        )

        setFavorites(res.data.map(r => r._id))

      } catch (err) {
        console.log(err)
      }
    }

    fetchFavorites()
  }, [])

  const handleFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return alert("Please login first")

      await axios.put(
        `http://localhost:5000/recipe/favorite/${id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      )

      setFavorites(prev =>
        prev.includes(id)
          ? prev.filter(f => f !== id)
          : [...prev, id]
      )

    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recipe?")) return

    try {
      const token = localStorage.getItem("token")

      await axios.delete(
        `http://localhost:5000/recipe/${id}`,
        { headers: { Authorization: "Bearer " + token } }
      )

      setRecipes(prev => prev.filter(r => r._id !== id))

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>

      <div className="card-container">

        {recipes.map((item) => {

          const isFavorited = favorites.includes(item._id)
          const avgRating = item.averageRating || 0
          const reviewCount = item.reviews?.length || 0

          return (
            <div
              key={item._id}
              className="modern-card"
              onClick={() => navigate(`/recipe/${item._id}`)}
            >

              {isMyRecipePage && (
                <div
                  className="action-icons"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaEdit
                    onClick={() => navigate(`/editRecipe/${item._id}`)}
                  />
                  <FaTrash
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
                </div>
              </div>

              <div className="icons">
                <div className="timer">
                  <BsStopwatch />
                  <span>{item.time || "30 mins"}</span>
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
                      color: isFavorited ? "red" : "#bbb"
                    }}
                  />
                  <span>{reviewCount}</span>
                </div>
              </div>

            </div>
          )
        })}

      </div>

      {!hidePagination && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

    </div>
  )
}

export default RecipeItems