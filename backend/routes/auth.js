import express from "express";
import { 
  loginUser, 
  registerUser, 
  logoutUser // Import the new controller
} from "../controllers/authController.js";

const router = express.Router();

// --- Public Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);

// --- Session Management ---
router.post("/logout", logoutUser);

export default router;