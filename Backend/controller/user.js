//todo: bcrypt = bcrypt is a library used to hash passwords before saving them in the database.

//? It converts a normal password like:
//!mypassword123

//? Into something like:
//! $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Q8pCkK0N7Kc2kP9Z1jGq.

//? This process is called hashing.



const User=require("../models/user")
const bcrypt = require("bcrypt")
const jwt= require("jsonwebtoken")

const userSignUp=async(req, res)=> {
    const {email, password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"Email and password is required"})
    }
    let user= await User.findOne({email})
    if(user){
        return res.status(400).json({error:"Email is already exist"})
    }
    const hashPwd=await bcrypt.hash(password, 10)
    const newUser = await User.create({
        email, password:hashPwd
    })
    let token = jwt.sign({
        email, id:newUser._id
    }, process.env.SECRET_KEY)
    return res.status(200).json({token, user:newUser})

}
const userLogin=async(req, res)=> {
    const {email, password}=req.body
    if(!email || !password){
        return res.status(400).json({message:"Email and password is required"})
    }
    let user= await User.findOne({email})
    if(user && await bcrypt.compare(password, user.password)){

         let token = jwt.sign({
        email, id:user._id
    }, process.env.SECRET_KEY)
    return res.status(200).json({token, user})

    }
    else{
        return res.status(400).json({error:"Invalid credentials"})
    }
}

const getUser=async(req, res)=> {
    const user=await User.findById(req.params.id)
    res.json({email:user.email})
}


module.exports={userLogin, userSignUp, getUser};



