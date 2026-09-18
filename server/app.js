import express from 'express';
import authRoute from "../server/routers/authRoute.js"
import hackathonRoute from "../server/routers/hackathonRoute.js"
import teamRoute from "../server/routers/teamRoute.js"
import invitationRoute from "../server/routers/invitationRoute.js"
import submissonRoute from "../server/routers/submissionRoute.js"
import cors from "cors"
const app=express()
app.use(cors())
app.use(express.json());
app.get('/',(req,res)=>{
    res.status(200).json({ message: "API Listening" });
})
app.use("/api/auth",authRoute);
app.use("/api/hackathons",hackathonRoute)
app.use("/api/team",teamRoute)
app.use("/api/invite",invitationRoute)
app.use("/api/submission",submissonRoute)
export default app;
