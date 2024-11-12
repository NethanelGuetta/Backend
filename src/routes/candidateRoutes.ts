import { Router } from "express";
import { getCandidates, unVoteCandidate, voteCandidate } from "../controllers/candidateController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/', getCandidates);
router.put('/vote/:id', authMiddleware ,voteCandidate);
router.put('/unvote/:id', authMiddleware ,unVoteCandidate);

export default router