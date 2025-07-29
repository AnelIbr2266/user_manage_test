import { Router } from "express";
import {AuthController} from "../controllers/user_controller";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.me);
router.get("/:id", authMiddleware, authController.getById);
router.get("/", authMiddleware, authController.getAll);
router.patch("/:id/block", authMiddleware, authController.block);

export default router;