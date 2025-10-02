import { Router } from "express";
import {
  getStreamerPosition,
  getFutureLegendsStats,
  getFutureLegendsIntervalStats,
} from "../controllers/futureLegendsController";

const router = Router();

router.get("/:streamer/position", getStreamerPosition);
router.get("/:streamer/stats", getFutureLegendsStats);
router.get("/:streamer/interval-stats", getFutureLegendsIntervalStats);

export default router;