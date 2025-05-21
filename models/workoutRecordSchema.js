import mongoose from "mongoose";

const workoutRecordSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    details:[
        {
            portion: { type: String, required: true },
            exercise: { type: String, required: true },
            duration: { type: Number, required: true },
            weight: { type: Number },
            repetition: { type: Number, default: 8 },
        }
    ]
});

const WorkoutRecord = mongoose.model("WorkoutRecord", workoutRecordSchema, "workoutrecords");
export default WorkoutRecord;