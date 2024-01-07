import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CommetSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        require: true,
    },
    blog: {
        type: mongoose.Types.ObjectId,
        ref: "Blog",
        required: true,
    },
    likes: {
        type: Array,
        require: true,
    },
},{ timestamps: true });

export default mongoose.model("Comment",CommetSchema);