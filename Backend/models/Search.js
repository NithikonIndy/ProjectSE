import mongoose from "mongoose";

const Schema = mongoose.Schema;

const searchSchema = new Schema({
    description: {
        type: String,
        require: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },

},{ timestamps: true });

export default mongoose.model("Search",searchSchema);