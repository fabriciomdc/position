import express from "express";
import youtubeRoutes from "./routes/youtubeRoutes";
import futureLegendsRoutes from "./routes/futureLegendsRoutes";
import dotenv from "dotenv";

import { runRecordNow } from "./scripts/recordPointsJob";
import "./scripts/recordPointsJob";

dotenv.config();

async function seedTwoRuns() {
  try {
    await runRecordNow(["haidtv"]);
    await new Promise((r) => setTimeout(r, 2000));
    await runRecordNow(["haidtv"]);
    console.log("Seed: two runs completed");
  } catch (err) {
    console.error("Seed error", err);
  }
}

if (process.env.NODE_ENV !== "production") {
  seedTwoRuns().catch((err) => console.error("Seed execution failed", err));
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/youtube", youtubeRoutes);
app.use("/futureLegends", futureLegendsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
