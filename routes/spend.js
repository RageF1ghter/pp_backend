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

router.post('/add', async (req, res) => {
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

router.put('/update', async (req, res) => {
    console.log(req.body);
    const { _id, category, details, amount, date } = req.body;
    
    if(!_id){
        console.log(id);
        return res.status(400).json({message: "id is required"});
    }else{
        try{
            const spend = await Spend.findById(_id);
            if(spend){
                spend.category = category || spend.category;
                spend.details = details || spend.details;
                spend.amount = amount || spend.amount;
                spend.date = date ? new Date(date) : spend.date;
                await spend.save();
                return res.status(200).json();
            }else{
                return res.status(404).json({message: "Spend not found"});
            }

        }catch(error){
            return res.status(500).json({error: error.message});
        }
    }
})

router.delete('/delete', async (req, res) => {
    const id = req.query.id;
    const record = Spend.findByIdAndDelete(id);
    if (!record) {
        return res.status(404).json({ message: "Spend not found" });
    }
    return res.status(200).json({message: "Spend deleted successfully"});
})

export default router;

