const mongoose = require("mongoose")

const connectDb = async()=> {  //
    await mongoose.connect(process.env.CONNECTION_STRING)  
    .then(() =>console.log("Connected ...")) // mongoose.connect() returns a Promise (.then()) runs after MongoDB connects successfully. "Connected" is just a confirmation log.
    
}  //Create a function that connects your backend to MongoDB using Mongoose.

module.exports=connectDb