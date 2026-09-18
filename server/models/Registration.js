import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    hackathon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hackathon",
        required: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

registrationSchema.index({ student: 1, hackathon: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);
export default Registration;
