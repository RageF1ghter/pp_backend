import Jobs from "../models/jobsSchema.js";
import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const jobs = await Jobs.find({ userId: userId });
        return res.status(200).json(jobs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/getById', async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ message: "id is required" });
    }

    try {
        const job = await Jobs.findById(id);
        if (!job) {
            return res.status(404).json({ message: "Record not found" });
        }
        return res.status(200).json(job);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

router.post('/add', async (req, res) => {
    const { userId, company, status, dateString, notes } = req.body;
    console.log(req.body);
    if (!userId || !company || !status || !dateString) {
        return res.status(400).json({ message: "userId, company, status and date are required" });
    }

    try {
        const date = new Date(dateString);
        const job = await Jobs.create({
            userId,
            company,
            status,
            date,
            notes: notes || ""
        });
        await job.save();
        return res.status(201).json({ message: "Job added successfully", job });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.put('/update', async (req, res) => {
    const {_id, company, status, date, notes } = req.body;
    if (!_id) {
        return res.status(400).json({ message: "id is required" });
    }
    try {
        const job = await Jobs.findById(_id);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        job.company = company || job.company;
        job.status = status || job.status;
        job.date = date || job.date;
        job.notes = notes || job.notes;
        await job.save();
        return res.status(200).json({ message: "Job updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.delete('/delete', async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ message: "id is required" });
    }
    try {
        await Jobs.findByIdAndDelete(_id);
        return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get('/paged', async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 15;
    const userId = req.query.userId;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try{
        const job = await Jobs.find({userId: userId})
                                .sort({ date: -1 })
                                .skip((page - 1) * limit)
                                .limit(limit);
        res.status(200).json(job);
              
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
})

router.get('/summary', async (req, res) => {
    const userId = req.query.userId;

    if(!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const totalJobs = await Jobs.countDocuments({ userId: userId });
        const appliedJobs = await Jobs.countDocuments({ userId: userId, status: "applied" });
        const interviewedJobs = await Jobs.countDocuments({ userId: userId, status: "in progress" });
        const rejectedJobs = await Jobs.countDocuments({ userId: userId, status: "rejected" });

        return res.status(200).json({
            totalJobs,
            appliedJobs,
            interviewedJobs,
            rejectedJobs
        })
    } catch (error){
        return res.status(500).json({ error: error.message });
    }
})

export default router;