import User from "../models/userSchema.js";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const jwt_secret = process.env.JWT_SECRET;


router.get("/", (req, res) => {
    res.send("Auth route");
});

router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({$or: [{email}, {username}]});
        if(existingUser){
            res.status(409).json({message: "User already exists"});
            return;
        }else{
            const newUser = await User.create({ username, email, password });
            res.status(201).json(newUser);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);
    try{
        const user = await User.findOne({email, password});

        if(user){
            console.log('login success');
            const jwt_token = jwt.sign({id: user._id, email: user.email}, jwt_secret, {expiredIn: "1h"});
            res.status(200).json({user, jwt_token});
        }else{
            return res.status(401).json({message: "Invalid credentials"});
        }
    }catch(error){
        return res.status(500).json({ error: error.message });
    }
});


export default router;
