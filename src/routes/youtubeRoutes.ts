import { Router } from "express";
import { getLatestVideo, getLatestShort } from "../controllers/youtubeController";

const router = Router();

router.get("/latest-video/:channelId?", getLatestVideo);
router.get("/latest-short/:channelId?", getLatestShort);

export default router;
