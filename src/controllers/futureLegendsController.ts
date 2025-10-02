import { Request, Response } from "express";
import { fetchStreamerPosition } from "../services/futureLegendsService";
import { formatFutureLegendsMessage } from "../utils/formatMessages";

export const getStreamerPosition = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;
  const customText = req.query.text as string | undefined;

  try {
    const data = await fetchStreamerPosition(streamer);

    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, nextScore } = data;

    let mensagem = formatFutureLegendsMessage(streamer, position, score, customText);

    if (nextScore !== null) {
      const faltando = nextScore - score;
      mensagem += ` Faltam ${faltando.toFixed(2)} pontos para alcançar a próxima posição.`;
    } else {
      mensagem += ` Parabéns! Ele está em primeiro lugar 🏆.`;
    }

    res.send(mensagem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
};

export const getStreamerTarget = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;
  const meta = parseInt(req.params.meta, 10);

  if (isNaN(meta) || meta <= 0) {
    return res.status(400).send("Meta inválida. Use um número positivo (ex: 50, 20, 10, 1).");
  }

  try {
    const data = await fetchStreamerPosition(streamer);

    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, rankList } = data;
    const target = rankList[meta - 1];

    if (!target) return res.status(404).send(`Não existe posição top ${meta}.`);

    const pontosMeta = target.a;

    let mensagem = `O streamer ${streamer} está na posição ${position} com ${score} pontos. `;

    if (score < pontosMeta) {
      const diff = pontosMeta - score;
      mensagem += `Faltam ${diff.toFixed(2)} pontos para entrar no top ${meta}.`;
    } else {
      mensagem += `Já está no top ${meta}! 🎉`;
    }

    res.send(mensagem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
};
