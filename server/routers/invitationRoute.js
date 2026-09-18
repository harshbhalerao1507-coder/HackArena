import express from "express";
import { sendInvitation,acceptInvitation , rejectInvitation,getInvitations} from "../controllers/invitationControllers.js";
import { reqAuth } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
const router = express.Router()
router.post("/:token/accept",reqAuth,requireRole("Student"),acceptInvitation)
router.post("/:token/reject",reqAuth,requireRole("Student"),rejectInvitation)
router.get("/",reqAuth,requireRole("Student"),getInvitations)
router.post("/:teamId",reqAuth,requireRole("Student"),sendInvitation)
export default router