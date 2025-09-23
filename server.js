import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  const streamer = "furyzeera";

  try {
    const response = await fetch("https://sg-apps.vasdgame.com/ide/?instanceid=4008550&sIdeFlow=fpUvOr");
    const data = await response.json();

    const rank = data?.jData?.rank || [];

    rank.sort((p1, p2) => p2.a - p1.a);

    const index = rank.findIndex(player => player.ul.toLowerCase() === streamer.toLowerCase());

    if (index === -1) {
      return res.send(`${streamer} não encontrado no ranking.`);
    }

    res.send(`${streamer} está na posição ${index + 1}.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
