import User from "../model/User.js";
import bcrypt from "bcrypt";




export const getAllUser = async (req, res , next) => {
    let users;
    try {
        users =await User.find();
    } catch (err) {
        console.log(err);
    }
    if (!users) {
        return res.status(404).json({ message: "No Users Found"});
    }
    return res.status(200).json({ users });
};

export const signup = async (req, res ,next) => {
    const { name,email,password } = req.body;
    let exitstingUser;
    try{
        exitstingUser = await User.findOne({ email });
    }catch(err){
        return console.log(err);
    }
    if(exitstingUser){
        return res
            .status(400)
            .json({message: "User Already Exits! Login Instead"});
    }
    const hashedPassword = bcrypt.hashSync(password,10);
    const user = new User({
        name,
        email,
        password: hashedPassword,
        blogs: [],
    });
     
    try{
        await user.save();
    }catch(err){
        return console.log(err);
    }
    return res.status(201).json({ user });
};

export const login = async (req, res ,next) => {
    const {email,password} =req.body;
    let exitstingUser;
    try{
        exitstingUser = await User.findOne({ email });
    }catch(err){
        return console.log(err);
    }
    if(!exitstingUser){
        return res
            .status(404)
            .json({message: "Coundn't Find User By This Email"});
    }
    
    const isPasswordCorrect = bcrypt.compareSync(password,exitstingUser.password); // password is plaintext before hash
    console.log(isPasswordCorrect);
    if(isPasswordCorrect){
        return res.status(200).json({message:"Login Succesful"})
    }
    return res.status(400).json({message:"InConrrect Password"});
}



