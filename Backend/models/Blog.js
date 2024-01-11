import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema({
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        require: true,
    },
    likes: {
        type: Array,
        require: true,
    },
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        required: true,
    }],
},{ timestamps: true });

export default mongoose.model("Blog",blogSchema);