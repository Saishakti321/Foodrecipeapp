


const express= require("express")
const app = express();
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors =require("cors")

const PORT=process.env.PORT

connectDb()

app.use(express.json())
app.use(cors())

// Static folder for images
app.use(express.static("public"))

app.use("/", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

app.get("/", (req, res)=> {
    res.json({message:"hello"})
})

app.listen(PORT, ()=>{
    console.log(`app is listening on port ${PORT}`)
})