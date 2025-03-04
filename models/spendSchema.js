import mongoose from "mongoose";

const spendSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    category: {type: String, required: true},
    details: {type: String, default: ""},
    amount: {type: Number, required: true},
    date: {type: Date, default: Date.now}
});

const Spend = mongoose.model("Spend", spendSchema, "spends");
export default Spend;
