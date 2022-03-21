import express from 'express';

import { ping } from '#controller/_template';

const router = express.Router();

const pingHandler = async (req, res) => await ping();

router.get('/ping', pingHandler);

export default router;
