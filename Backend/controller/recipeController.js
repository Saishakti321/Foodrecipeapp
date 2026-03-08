

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

    const existing = user.favorites.find(
      fav => fav.recipeId.toString() === recipeId
    )

    if (existing) {

      user.favorites = user.favorites.filter(
        fav => fav.recipeId.toString() !== recipeId
      )

    } else {

      user.favorites.push({ recipeId })

    }

    await user.save()

    res.json(user.favorites)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error updating favorites" })
  }

}



const updateRecipe = async (req, res) => {

  try {

    const recipe = await Recipes.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    const { title, ingredients, instructions, time, category } = req.body

    recipe.title = title || recipe.title
    recipe.ingredients = ingredients || recipe.ingredients
    recipe.instructions = instructions || recipe.instructions
    recipe.time = time || recipe.time
    recipe.category = category || recipe.category

    if (req.file) {
      recipe.coverImage = req.file.filename
    }

    await recipe.save()

    res.json(recipe)

  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "Error updating recipe" })

  }

}


const getFavoriteRecipes = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)

    const recipeIds = user.favorites.map(f => f.recipeId)

    const recipes = await Recipes.find({
      _id: { $in: recipeIds }
    })

    res.json(recipes)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching favorites" })
  }

}

const addReview = async (req, res) => {

  try {

    const recipe = await Recipes.findById(req.params.id)

    const review = {
      user: req.user.id,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      image: req.file ? req.file.filename : null
    }

    recipe.reviews.push(review)

    const totalRatings = recipe.reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    )

    recipe.averageRating = totalRatings / recipe.reviews.length

    await recipe.save()

    res.json(recipe)

  } catch {
    res.status(500).json({ message: "Error adding review" })
  }

}


// const deleteRecipe = async (req, res) => {

//   try {

//     const recipe = await Recipes.findById(req.params.id)

//     if (!recipe) {
//       return res.status(404).json({ message: "Recipe not found" })
//     }

//     if (recipe.createdBy.toString() !== req.user.id) {
//       return res.status(403).json({ message: "Not authorized" })
//     }

//     await recipe.deleteOne()

//     res.json({ message: "Recipe deleted successfully" })

//   } catch (error) {

//     console.log(error)
//     res.status(500).json({ message: "Error deleting recipe" })

//   }

// }




const deleteRecipe = async (req, res) => {

  try {

    const recipe = await Recipes.findById(req.params.id)

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" })
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" })
    }

    await recipe.deleteOne()

    res.json({ message: "Recipe deleted successfully" })

  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "Error deleting recipe" })

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
  addReview,
  updateRecipe,
  deleteRecipe,
  upload,
  reviewUpload
}

