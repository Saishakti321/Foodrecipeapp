

const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
  image: {
    type: String
  }
}, { timestamps: true })

const recipeSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  ingredients: {
    type: Array,
    required: true
  },

  instructions: {
    type: String,
    required: true
  },

  time: {
    type: String
  },

  coverImage: {
    type: String
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  source: {
    type: String,
    default: "user"
  },

  category: {
    type: String,
    default: "general"
  },

  reviews: [reviewSchema],

  averageRating: {
    type: Number,
    default: 0
  }

}, { timestamps: true })

module.exports = mongoose.model("Recipes", recipeSchema)