import { Router } from "express";
import { getStreamerPosition, getStreamerTarget } from "../controllers/futureLegendsController";

const router = Router();

router.get("/:streamer", getStreamerPosition);

router.get("/:streamer/top/:meta", getStreamerTarget);

export default router;
