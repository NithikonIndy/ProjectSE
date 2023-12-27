import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
        default: 'USER',
    },
    password: {
        type: String,
        require: true,
        default: null,
    },
}, { timestamps: true });

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;