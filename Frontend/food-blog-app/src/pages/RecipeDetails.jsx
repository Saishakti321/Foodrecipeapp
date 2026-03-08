
import React, { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

export default function RecipeDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [recipe, setRecipe] = useState(null)
  const [rating, setRating] = useState("")
  const [comment, setComment] = useState("")
  const [reviewImage, setReviewImage] = useState(null)

  useEffect(() => {

    const fetchRecipe = async () => {

      try {

        const res = await axios.get(
          `http://localhost:5000/recipe/${id}`
        )

        setRecipe(res.data)

      } catch (err) {
        console.log(err)
      }

    }

    fetchRecipe()

  }, [id])


  const handleReviewSubmit = async (e) => {

    e.preventDefault()

    if (!rating || !comment) {
      alert("Please enter rating and comment")
      return
    }

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login to add review")
      navigate("/")
      return
    }

    const formData = new FormData()

    formData.append("rating", Number(rating))
    formData.append("comment", comment)

    if (reviewImage) {
      formData.append("image", reviewImage)
    }

    try {

      await axios.post(
        `http://localhost:5000/recipe/${id}/review`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data"
          }
        }
      )

      // refresh recipe after review 

      const updated = await axios.get(
        `http://localhost:5000/recipe/${id}`
      )

      setRecipe(updated.data)

      setRating("")
      setComment("")
      setReviewImage(null)

      alert("Review added successfully")

    } catch (err) {
      console.log(err.response?.data || err)
    }

  }

  if (!recipe)
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>


  return (
    <div className="recipe-page">

      <div className="recipe-wrapper">


        <div className="recipe-left">

          <img
            src={
              recipe.coverImage?.startsWith("http")
                ? recipe.coverImage
                : recipe.coverImage
                ? `http://localhost:5000/images/${recipe.coverImage}`
                : ""
            }
            alt={recipe.title}
            className="recipe-main-image"
          />

          <h1 className="recipe-title">{recipe.title}</h1>

          <div className="recipe-meta">

            <span>⏱ {recipe.time}</span>

            <span>
              {"⭐".repeat(Math.round(recipe.averageRating || 0))}
              ({recipe.averageRating?.toFixed(1) || 0})
            </span>

          </div>

      

          <div className="recipe-section">

            <h3>Ingredients</h3>

            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

          </div>

          <div className="recipe-section">

            <h3>Instructions</h3>

            <p>{recipe.instructions}</p>

          </div>

        </div>


        <div className="recipe-right">


          <div className="reviews-block">

            <h2>Reviews</h2>

            {recipe.reviews.length === 0 && (
              <p className="no-review">No reviews yet.</p>
            )}

            {recipe.reviews.map((review, index) => (

              <div className="review-card" key={index}>

                <div className="review-stars">
                  {"⭐".repeat(review.rating)}
                </div>

                <p className="review-text">
                  {review.comment}
                </p>

                {review.image && (

                  <img
                    src={`http://localhost:5000/reviews/${review.image}`}
                    alt=""
                    className="review-photo"
                  />

                )}

              </div>

            ))}

          </div>


          <div className="review-form-card">

            <h3>Add Review</h3>

            <form onSubmit={handleReviewSubmit}>

              <input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value)
                }
                required
              />

              <textarea
                placeholder="Write your review"
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                required
              />

              <input
                type="file"
                onChange={(e) =>
                  setReviewImage(e.target.files[0])
                }
              />

              <button type="submit">
                Submit Review
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  )

}















