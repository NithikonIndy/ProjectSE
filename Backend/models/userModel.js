import mongoose from 'mongoose';
import roles from '../utils/constants.js';

const userSchema = mongoose.Schema({
    accountType: {
        type: String,
        require: true,
        unique: false,
    },
    name: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    organization: {
        type: String,
        require: true,
        unique: false
    },
    organizationCode: {
        type: String,
        require: true,
        unique: false,
    },
    role: {
        type: String,
        enum: [roles.user, roles.admin],
        default: 'USER',
    },
    blogs:[{
        type: mongoose.Types.ObjectId,
        ref:"Blog",
        required: true
    }],
    comments: [{
        type: mongoose.Types.ObjectId,
        ref: "Comment",
        required: true,
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;