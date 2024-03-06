import mongoose from "mongoose";
import reasons from "../utils/constants.js";

const reportCommentSchema = mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    reason: {
        type: String,
        enum: [reasons.reasons_one, reasons.reasons_two, reasons.reasons_three],
        required: true,
        default: null,
    },
}, { timestamps: true });

const ReportComment = mongoose.model("ReportComment", reportCommentSchema);

export default ReportComment;