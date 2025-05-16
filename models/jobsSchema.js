import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: "" },
})

const Jobs = mongoose.model("Jobs", jobsSchema, "jobs");
export default Jobs;