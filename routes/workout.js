import Workout from "../models/workoutSchema.js";
import express from "express";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const date = req.query.date;

    console.log(userId);
    if(!userId){
        return res.status(400).json({message: "userId is required"});
    }

    try{
        // Get the first and last day of the current month
        const now = new Date(date); // e.g., "2025-04-01"
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        const startOfNextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
        console.log(startOfMonth, startOfNextMonth);
        const records = await Workout.find({
            userId: userId,
            date: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
            }
        });
        // console.log(records);
        return res.status(200).json(records);
        
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.post('/add', async (req, res) =>{
    const { userId, category, duration, date, notes } = req.body;
    if(!userId){
        return res.status(400).json({message: "userId is required"});
    }

    if(!category || !duration || !date){
        return res.status(400).json({message: "category, duration and date are required"});
    }

    try{
        const record = await Workout.create({
            userId,
            category,
            duration,
            date: new Date(date),
            notes: notes || ""
        });
        await record.save();
        return res.status(201).json({message: "Record added successfully"});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
});

router.delete('/delete', async (req, res) => {
    try{
        const {_id} = req.body;
        if(!_id){
            return res.status(404).json({message: "id is required"});
        }
        await Workout.findByIdAndDelete(_id);
        return res.status(200).json({message: "Record deleted successfully"});
    }catch (error){
        return res.status(500).json({error: error.message});
    }
    
});

router.put('/update', async (req, res) => {
    try{
        const {record} = req.body;
        if(!record._id){
            return res.status(400).json({message: "id is required"});
        }else{
            const workout = await Workout.findById(record._id);
            if(workout){
                workout.category = record.category || workout.category;
                workout.duration = record.duration || workout.duration;
                workout.notes = record.notes || workout.notes;
                await workout.save();
                return res.status(200).json({message: "Record updated successfully"});
            }else{
                return res.status(404).json({message: "Record not found"});
            }
        }
    } catch (error){
        return res.status(500).json({error: error.message});
    }
});

export default router;