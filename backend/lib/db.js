import mongoose from "mongoose"

const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log("database connected successfully");
    }
    catch(error){
        console.log("error :",error.message);
        process.exit(1);
    }
}

export default connectDB 