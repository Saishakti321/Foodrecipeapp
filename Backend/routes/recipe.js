

const express = require("express")

const {
  getRecipes,
  getRecipesByCategory,
  getRecipe,
  addRecipe,
  getTrendingRecipes,
  getMyRecipes,
  toggleFavorite,
  getFavoriteRecipes,
  addReview,
  updateRecipe,
  deleteRecipe,
  upload,
  reviewUpload
} = require("../controller/recipeController")

const verifyToken = require("../middleware/auth")

const router = express.Router()

router.get("/trending", getTrendingRecipes)

router.get("/my", verifyToken, getMyRecipes)

router.get("/favorites", verifyToken, getFavoriteRecipes)

router.put("/favorite/:id", verifyToken, toggleFavorite)

router.get("/category/:name", getRecipesByCategory)

router.get("/", getRecipes)

router.post(
  "/",
  verifyToken,
  upload.single("coverImage"),
  addRecipe
)

router.put(
  "/:id",
  verifyToken,
  upload.single("coverImage"),
  updateRecipe
)

router.delete(
  "/:id",
  verifyToken,
  deleteRecipe
)

router.post(
  "/:id/review",
  verifyToken,
  reviewUpload.single("image"),
  addReview
)

router.get("/:id", getRecipe)

module.exports = router

