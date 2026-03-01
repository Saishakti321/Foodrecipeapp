




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
    axios.get(`http://localhost:5000/recipe/${id}`)
      .then(res => setRecipe(res.data))
      .catch(err => console.log(err))
  }, [id])


  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      alert("Please login to add review")
      navigate("/")
      return
    }

    const formData = new FormData()
    formData.append("rating", rating)
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

      alert("Review added successfully")

      
      const updated = await axios.get(`http://localhost:5000/recipe/${id}`)
      setRecipe(updated.data)

      
      setRating("")
      setComment("")
      setReviewImage(null)

    } catch (err) {
      console.log(err.response?.data || err)
    }
  }

  if (!recipe) return <h2 style={{textAlign:"center"}}>Loading...</h2>

  return (
    <div className="details-container">

      
      <div className="details-image">
        <img
          src={
            recipe.coverImage
              ? `http://localhost:5000/images/${recipe.coverImage}`
              : ""
          }
          alt=""
        />
      </div>

      <div className="details-content">
        <h1>{recipe.title}</h1>
        <p className="time">⏱ {recipe.time}</p>

        <div className="rating-display">
          {"⭐".repeat(Math.round(recipe.averageRating || 0))}
          <span> ({recipe.averageRating?.toFixed(1) || 0})</span>
        </div>

        <h3>Ingredients</h3>
        <ul>
          {recipe.ingredients.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h3>Instructions</h3>
        <p>{recipe.instructions}</p>
      </div>

 
      <div className="reviews-section">
        <h2>Reviews</h2>

        {recipe.reviews.length === 0 && <p>No reviews yet.</p>}

        {recipe.reviews.map((review, index) => (
          <div className="review-card" key={index}>
            <div className="review-stars">
              {"⭐".repeat(review.rating)}
            </div>

            <p>{review.comment}</p>

            
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

      
      <div className="review-form">
        <h2>Add Review</h2>

        <form onSubmit={handleReviewSubmit}>
          <input
            type="number"
            min="1"
            max="5"
            placeholder="Rating (1-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />

          <textarea
            placeholder="Write your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <input
            type="file"
            onChange={(e) => setReviewImage(e.target.files[0])}
          />

          <button type="submit">Submit Review</button>
        </form>
      </div>

    </div>
  )
}