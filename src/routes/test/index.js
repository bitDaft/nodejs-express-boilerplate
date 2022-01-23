import express from 'express';

import { Pong } from '#controllers/test';

const router = express.Router();

const pingHandler = async (req, res) => {
  let response_data = await Pong();
  return response_data;
};

router.get('/ping', pingHandler);

export default router;
