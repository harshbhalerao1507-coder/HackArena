import app from '../server/app.js';
import dotenv from "dotenv";
import connectDB from '../server/config/db.js';
dotenv.config();
connectDB();


const PORT=process.env.PORT;
app.listen(PORT)
