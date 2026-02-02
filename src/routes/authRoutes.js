import { Router } from "express";
import AuthController from "../controllers/AuthController.js"
import { tokenValidated } from "../middlewares/auth.js";
const router = router();
router.post("/register", tokenValidated, AuthController.register);
router.post("/login", AuthController.login);

export default router;