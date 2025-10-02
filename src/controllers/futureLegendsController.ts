import { Request, Response } from "express";
import { fetchStreamerPosition } from "../services/futureLegendsService";
import { formatFutureLegendsMessage } from "../utils/formatMessages";

export const getStreamerPosition = async (req: Request, res: Response) => {
  const streamer = req.params.streamer;

  try {
    const data = await fetchStreamerPosition(streamer);
    if (!data) return res.status(404).send("Streamer not found");

    const { position, score, nextScore } = data;
    const faltando = nextScore !== null ? +(nextScore - score).toFixed(2) : undefined;

    const mensagem = formatFutureLegendsMessage(streamer, position, score, faltando);

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
    const faltando = score < pontosMeta ? +(pontosMeta - score).toFixed(2) : undefined;

    const mensagem = formatFutureLegendsMessage(streamer, position, score, faltando);

    res.send(mensagem);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar posição.");
  }
};
