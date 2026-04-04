import express from 'express';
import { remediateSecretsController } from '../controllers/remediateSecretsController.js';
const router = express.Router();

router.post('/remediate-secrets', remediateSecretsController);

export default router;
