import express from "express"
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createSubmission } from "../controllers/submissionControllers.js";
const router=express.Router();
router.post("/",reqAuth,requireRole("Student"),upload.single("file"),createSubmission)
export default router