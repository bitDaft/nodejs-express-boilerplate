import express from 'express';

import { Pong } from '#controllers/test';
import { Success } from '#lib/responseHelpers';
import { __dirname } from '#lib/getFileDir';

const router = express.Router();

const pingHandler = async (req, res) => {
  let response_data = await Pong();
  return new Success(response_data);
};

router.get('/ping', pingHandler);

export default router;
