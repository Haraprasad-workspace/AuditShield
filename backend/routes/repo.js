import express from "express";
import { connectRepo, disconnectRepo, listRepos } from "../controllers/repoController.js";

const router = express.Router();

router.post("/connect", connectRepo);       // register webhook
router.post("/disconnect", disconnectRepo); // remove webhook
router.get("/list", listRepos);             // list connected repos

export default router;