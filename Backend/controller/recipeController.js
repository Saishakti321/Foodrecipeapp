
const Recipes = require("../models/recipeSchema")
const User = require("../models/user")
const multer = require("multer")

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

const reviewStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/reviews"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
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

const getRecipesByCategory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const categoryName = req.params.name

    const total = await Recipes.countDocuments({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") }
    })

    const recipes = await Recipes.find({
      category: { $regex: new RegExp("^" + categoryName + "$", "i") }
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
    res.status(500).json({ message: "Error fetching category recipes" })
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

const getTrendingRecipes = async (req, res) => {
  const recipes = await Recipes.find()
    .sort({ averageRating: -1 })
    .limit(6)

  res.json(recipes)
}

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

const getFavoriteRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites")
    res.json(user.favorites || [])
  } catch {
    res.status(500).json({ message: "Error fetching favorites" })
  }
}

module.exports = {
  getRecipes,
  getRecipesByCategory,
  getRecipe,
  addRecipe,
  getTrendingRecipes,
  getMyRecipes,
  toggleFavorite,
  getFavoriteRecipes,
  upload,
  reviewUpload
}