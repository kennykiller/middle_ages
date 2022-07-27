import { RequestHandler } from "express";
import { Op } from "sequelize";
import { Session } from "../models/session";
import { Seat } from "../models/seat";
import { Order } from "../models/order";

export const getSessions: RequestHandler = async (req, res, next) => {
  const id = +req.params.id;

  const dateStart = new Date(req.body.date).setUTCHours(0, 0, 0, 0);
  const dateEnd = new Date(req.body.date).setUTCHours(23, 59, 59, 999);

  try {
    const sessions = await Session.findAll({
      where: {
        filmId: id,
        filmStart: {
          [Op.gte]: dateStart,
          [Op.lte]: dateEnd,
        },
      },
      order: [["filmStart", "ASC"]],
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!sessions) {
      throw new Error("Сеансы на эту дату не найдены");
    }
    res.status(200).json({ sessions });
  } catch (e) {
    next(e);
  }
};

export const getSeats: RequestHandler = async (req, res, next) => {
  const sessionId = +req.params.sessionId;

  try {
    const seatsResponse = await Seat.findAll({
      where: {
        sessionId,
      },
      // include: { model: Order },
    });
    console.log(seatsResponse, "response");
  } catch (e) {
    next(e);
  }
};
