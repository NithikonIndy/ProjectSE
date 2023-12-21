import mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected to ${conn.connection.host}`);
    }catch(error){
        console.error(`Error connecting to ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;