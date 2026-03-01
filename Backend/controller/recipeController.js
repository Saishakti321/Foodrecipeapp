
const Recipes = require("../models/recipeSchema")
const User = require("../models/user")   
const multer = require("multer")
const axios = require("axios")



const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/reviews"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
})

const reviewUpload = multer({ storage: reviewStorage })



const getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Recipes.countDocuments()

    const recipes = await Recipes.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    })
  } catch {
    res.status(500).json({ message: "Error fetching recipes" })
  }
}



const getMyRecipes = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Recipes.countDocuments({
      createdBy: req.user.id
    })

    const recipes = await Recipes.find({
      createdBy: req.user.id
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.json({
      recipes,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    })

  } catch {
    res.status(500).json({ message: "Error fetching my recipes" })
  }
}



const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id)
    res.json(recipe)
  } catch {
    res.status(500).json({ message: "Error fetching recipe" })
  }
}



const addRecipe = async (req, res) => {
  try {

    const { title, instructions, time, category } = req.body
    let ingredients = req.body.ingredients

    if (!title || !instructions || !ingredients) {
      return res.status(400).json({ message: "Required fields missing" })
    }

    const ingredientArray = Array.isArray(ingredients)
      ? ingredients
      : [ingredients]

    const newRecipe = await Recipes.create({
      title,
      instructions,
      ingredients: ingredientArray,
      time,
      category: category || "general",
      coverImage: req.file ? req.file.filename : null,
      createdBy: req.user.id,
      source: "user"
    })

    res.json(newRecipe)

  } catch {
    res.status(500).json({ message: "Error adding recipe" })
  }
}


const addReview = async (req, res) => {
  try {

    const { rating, comment } = req.body
    const numericRating = Number(rating)

    if (!rating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Invalid rating" })
    }

    const recipe = await Recipes.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    recipe.reviews.push({
      user: req.user.id,
      rating: numericRating,
      comment: comment || "",
      image: req.file ? req.file.filename : null
    })

    const total = recipe.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    )

    recipe.averageRating = total / recipe.reviews.length

    await recipe.save()

    res.json({ message: "Review added" })

  } catch {
    res.status(500).json({ message: "Error adding review" })
  }
}

/* ================= EDIT RECIPE ================= */

const editRecipe = async (req, res) => {
  try {

    const recipe = await Recipes.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updatedRecipe)

  } catch {
    res.status(500).json({ message: "Error updating recipe" })
  }
}

/* ================= DELETE ================= */

const deleteRecipe = async (req, res) => {
  try {

    const recipe = await Recipes.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await Recipes.findByIdAndDelete(req.params.id)

    res.json({ message: "Recipe deleted" })

  } catch {
    res.status(500).json({ message: "Error deleting recipe" })
  }
}

/* ================= TOGGLE FAVORITE ================= */

const toggleFavorite = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
    const recipeId = req.params.id

    const index = user.favorites.indexOf(recipeId)

    if (index === -1) {
      user.favorites.push(recipeId)
    } else {
      user.favorites.splice(index, 1)
    }

    await user.save()

    res.json({ favorites: user.favorites })

  } catch {
    res.status(500).json({ message: "Error updating favorites" })
  }
}

/* ================= GET FAVORITES ================= */

const getFavoriteRecipes = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .populate("favorites")

    res.json(user.favorites)

  } catch {
    res.status(500).json({ message: "Error fetching favorites" })
  }
}

/* ================= TRENDING ================= */

const getTrendingRecipes = async (req, res) => {
  const recipes = await Recipes.find()
    .sort({ averageRating: -1 })
    .limit(6)

  res.json(recipes)
}

module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  addReview,
  getTrendingRecipes,
  getMyRecipes,
  toggleFavorite,
  getFavoriteRecipes,
  upload,
  reviewUpload
}