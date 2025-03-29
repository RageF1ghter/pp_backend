import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    category: {type: String, required: true},
    duration: {type: Number, required: true},
    date: {type: Date, required: true},
    notes: {type: String, default: ""}
});

const Workout = mongoose.model("Workout", workoutSchema, "workouts");
export default Workout;