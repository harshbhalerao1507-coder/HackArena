import express from "express";
import {reqAuth} from "../middleware/authMiddleware.js";
import {
    getStudentProfile,
    updateStudentProfile
} from "../controllers/studentControllers.js";

const router = express.Router();

router.get("/profile", reqAuth, getStudentProfile);

router.patch("/profile", reqAuth, updateStudentProfile);

export default router;