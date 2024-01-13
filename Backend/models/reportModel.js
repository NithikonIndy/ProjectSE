import mongoose from "mongoose";
import reasons from "../utils/constants.js";

const reportSchema = mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    reason: {
        type: String,
        enum: [reasons.reasons_one, reasons.reasons_two, reasons.reasons_three],
        required: true,
        default: null,
    },
}, { timestamps: true });

const Report = mongoose.model('Report', reportSchema);

export default Report;
