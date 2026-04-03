import express from 'express';
import { generateExecutiveReport } from '../controllers/reportController.js';

const router = express.Router();

// Generate on-demand intelligence report
router.get('/generate', generateExecutiveReport);

export default router;