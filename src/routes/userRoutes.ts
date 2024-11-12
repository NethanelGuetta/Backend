import { Router } from "express";
import { getUsers, loginUser, registerUser } from "../controllers/userController";
import { authMiddleware, isAdminMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/' ,getUsers );
export default router;