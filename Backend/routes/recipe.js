

// const express = require("express")

// const {
//   getRecipes,
//   getRecipe,
//   addRecipe,
//   editRecipe,
//   deleteRecipe,
//   addReview,
//   getTrendingRecipes,
//   getMyRecipes,
//   toggleFavorite,
//   getFavoriteRecipes,
//   upload,
//   reviewUpload
// } = require("../controller/recipeController")

// const verifyToken = require("../middleware/auth")

// const router = express.Router()


// router.get("/trending", getTrendingRecipes)
// router.get("/my", verifyToken, getMyRecipes)
// router.get("/favorites", verifyToken, getFavoriteRecipes)
// router.put("/favorite/:id", verifyToken, toggleFavorite)


// router.get("/", getRecipes)

// router.post("/", verifyToken, upload.single("coverImage"), addRecipe)
// router.post("/:id/review", verifyToken, reviewUpload.single("image"), addReview)
// router.put("/:id", verifyToken, upload.single("coverImage"), editRecipe)
// router.delete("/:id", verifyToken, deleteRecipe)


// router.get("/:id", getRecipe)


// module.exports = router














// const express = require("express")

// const {
//   getRecipes,
//   getRecipesByCategory,
//   getRecipe,
//   addRecipe,
//   editRecipe,
//   deleteRecipe,
//   addReview,
//   getTrendingRecipes,
//   getMyRecipes,
//   toggleFavorite,
//   getFavoriteRecipes,
//   upload,
//   reviewUpload
// } = require("../controller/recipeController")

// const verifyToken = require("../middleware/auth")

// const router = express.Router()


// router.get("/trending", getTrendingRecipes)
// router.get("/my", verifyToken, getMyRecipes)
// router.get("/favorites", verifyToken, getFavoriteRecipes)
// router.put("/favorite/:id", verifyToken, toggleFavorite)


// router.get("/category/:name", getRecipesByCategory)


// router.get("/", getRecipes)

// router.post("/", verifyToken, upload.single("coverImage"), addRecipe)
// router.post("/:id/review", verifyToken, reviewUpload.single("image"), addReview)
// router.put("/:id", verifyToken, upload.single("coverImage"), editRecipe)
// router.delete("/:id", verifyToken, deleteRecipe)


// router.get("/:id", getRecipe)


// module.exports = router







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
  upload
} = require("../controller/recipeController")

const verifyToken = require("../middleware/auth")

const router = express.Router()

router.get("/trending", getTrendingRecipes)
router.get("/my", verifyToken, getMyRecipes)
router.get("/favorites", verifyToken, getFavoriteRecipes)
router.put("/favorite/:id", verifyToken, toggleFavorite)

router.get("/category/:name", getRecipesByCategory)
router.get("/", getRecipes)

router.post("/", verifyToken, upload.single("coverImage"), addRecipe)

router.get("/:id", getRecipe)

module.exports = router