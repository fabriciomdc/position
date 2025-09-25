import { Router } from "express";
import { getLatestVideo, getLatestShort } from "../controllers/youtubeController";

const router = Router();

router.get("/latest-video", getLatestVideo);
router.get("/latest-short", getLatestShort);

export default router;
