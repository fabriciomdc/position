import { Router } from "express";
import { getStreamerPosition } from "../controllers/futureLegendsController";

const router = Router();

router.get("/:streamer", getStreamerPosition);

export default router;
