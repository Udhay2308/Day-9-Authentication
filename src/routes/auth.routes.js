const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authRouter = express.Router() // This is used when we want to create api in file other than app.js
const crypto = require("crypto")

authRouter.post("/register",async(req,res)=>{
    const {name,email,password} = req.body
    
    const isUserAlreadyExists = await userModel.findOne({email})
    if(isUserAlreadyExists){
        res.status(409).json({
            message : "User already exists with this email..."
        })
    }
    const hash = crypto.createHash("md5").update(password).digest("hex")
    const user = await userModel.create({
        name,email,password:hash
    })
    const token = jwt.sign(
        {
            id : user._id,
            email : user.email,
        },
        process.env.JWT_SECRET
    )
    res.cookie("Jwt_token",token)
    res.status(201).json({
        message : "User registered successfully..",user,token
    })
})
authRouter.post("/protected",(req,res)=>{
    console.log(req.cookies)
    res.status(200).json({
        message : "This is protected api..."
    })
})
authRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        res.status(404).json({
            message : "User does not exists with this email.."
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")

    if(!isPasswordMatched){
        res.status(401).json({
            message : "Invalid password"
        })
    }
    
    const token = jwt.sign(
        {
            id : user._id
        },
        process.env.JWT_SECRET
    )
    res.cookie("Jwt_token",token)
    res.status(200).json({
        message : "User logged In..",user,token
    })
})
module.exports = authRouter