const express = require("express")
const userModel = require("../models/user.model")

const authRouter = express.Router() // This is used when we want to create api in file other than app.js

authRouter.post("/register",async(req,res)=>{
    const {name,email,password} = req.body
    
    const isUserAlreadyExists = await userModel.findOne({email})
    if(isUserAlreadyExists){
        res.status(400).json({
            message : "User already exists with this email..."
        })
    }
    const user = await userModel.create({
        name,email,password
    })
    res.status(201).json({
        message : "User registered successfully..",user
    })
})
module.exports = authRouter