import express from "express";
import youtubeRoutes from "./routes/youtubeRoutes";
import futureLegendsRoutes from "./routes/futureLegendsRoutes";
import dotenv from "dotenv";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/youtube", youtubeRoutes);
app.use("/futureLegends", futureLegendsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
