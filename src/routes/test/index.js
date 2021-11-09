import express from "express";

import { Pong } from "#controllers/test";
import { Success } from "#utils/responseHelpers";

const router = express.Router();

const pingHandler = async (req, res, next) => {
  let response_data = await Pong();
  req.x = new Success(response_data);
  next();
};

router.get("/ping", pingHandler);

export default router;
