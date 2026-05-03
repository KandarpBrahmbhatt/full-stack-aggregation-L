// models/result.model.js
import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    studentId: mongoose.Schema.Types.ObjectId,
    standard: Number,
    subject: String,
    marks: Number
});

export default mongoose.model("Result", resultSchema);