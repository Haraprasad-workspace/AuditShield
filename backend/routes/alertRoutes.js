import express from 'express';
import { getAlerts, getRecentAlerts, resolveAlert } from '../controllers/alertController.js';

const router = express.Router();

// Define Perimeter Audit Endpoints
router.get('/', getAlerts);           // Matches: GET /api/alerts
router.get('/recent', getRecentAlerts); // Matches: GET /api/alerts/recent
router.patch('/:id/resolve', resolveAlert); // Matches: PATCH /api/alerts/:id/resolve

export default router;