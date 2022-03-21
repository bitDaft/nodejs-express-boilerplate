import express from 'express';

import { Pong } from '#controllers/_template';

const router = express.Router();

const pingHandler = async (req, res) => await Pong();

router.get('/ping', pingHandler);

export default router;
