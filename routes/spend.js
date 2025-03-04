import Spend from "../models/spendSchema.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();


router.get("/", async (req, res) => {
    const userId = req.query.userId;
    console.log(userId);
    if(!userId){
        return res.status(400).json({message: "userId is required"});
    }
    
    try{
        const result = await Spend.find({
            userId: userId,
        });
        if(!result){
            return res.status(404).json({message: "No spends found"});
        }else{
            return res.status(200).json(result);
        }
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

router.put('/add', async (req, res) => {
    const { userId, category, details, amount, date } = req.body;

    if(!userId || !category || !amount){
        return res.status(400).json({message: "userId, category and amount are required"});
    }

    try {
        const newSpend = await Spend.create({
            userId,
            category,
            details: details || "",
            amount,
            date: date ? new Date(date) : new Date()
        });
        return res.status(201).json(newSpend);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

export default router;

