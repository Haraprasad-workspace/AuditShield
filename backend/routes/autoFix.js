import express from 'express';
import { autoFixController } from '../controllers/autoFixController.js';

const router = express.Router();
router.post('/autofix', autoFixController);

export default router;
