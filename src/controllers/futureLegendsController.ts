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
      mensagem += ` Faltam ${faltando.toFixed(2)} pontos para alcançar a próxima posição`;
    } else {
      mensagem += ` Parabéns! Ele está em primeiro lugar 🏆.`;
    }

    res.send(mensagem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
};
