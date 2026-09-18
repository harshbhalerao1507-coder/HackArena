import express from "express";
import { createHackathons, deleteHackathon, getHackathons, getHackathonsbyId, registerForHackathon, updateHackathon } from "../controllers/hackathonControllers.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router=express.Router();
router.get("/",reqAuth,requireRole("Student","Organiser"),getHackathons)
router.post("/",reqAuth,requireRole("Organiser"),upload.single("ps"),createHackathons)
router.post("/:id/register",reqAuth,requireRole("Student"),registerForHackathon);
router.get("/:id",reqAuth,requireRole("Student","Organiser"),getHackathonsbyId);
router.delete("/:id",reqAuth,requireRole("Organiser"),deleteHackathon);
router.patch("/:id",reqAuth,requireRole("Organiser"),updateHackathon);

export default router
