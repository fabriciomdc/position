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

    const posicao = index + 1;
    const pontuacaoAtual = rank[index].a;

    let mensagem = `${streamer} está na posição ${posicao} com ${pontuacaoAtual} pontos.`;

    if (index > 0) {
      const pontuacaoProximo = rank[index - 1].a;
      const faltando = pontuacaoProximo - pontuacaoAtual;
      mensagem += ` Faltam ${faltando.toFixed(2)} pontos para alcançar a posição ${posicao - 1}.`;
    } else {
      mensagem += ` Parabéns! Ele está em primeiro lugar 🏆.`;
    }

    res.send(mensagem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
