import mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }
    catch(e){
        process.exit(1);
    }
}
export default connectDB;
