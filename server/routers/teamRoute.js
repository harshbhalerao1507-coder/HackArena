import express from "express"
import { createTeam, deleteTeamById, getTeamById, getTeams, getTeamsByUser, updateTeamById } from "../controllers/teamControllers.js"
import { reqAuth } from "../middleware/authMiddleware.js"
import { requireRole } from "../middleware/roleMiddleware.js"

const router=express.Router()
router.get("/",reqAuth,requireRole("Organiser"),getTeams)
router.get("/my-teams",reqAuth,requireRole("Student"),getTeamsByUser)
router.get("/:id",reqAuth,requireRole("Organiser"),getTeamById)
router.post("/",reqAuth,requireRole("Student"),createTeam)
router.patch("/:id",reqAuth,requireRole("Organiser"),updateTeamById)
router.delete("/:id",reqAuth,requireRole("Student"),deleteTeamById)


export default router
