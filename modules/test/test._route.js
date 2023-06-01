import express from 'express';

import { ping, slow, fast } from '#controller/test';

const router = express.Router();

const pingHandler = async (req, res) => await ping();
const slowHandler = async (req, res) => await slow();
const fastHandler = async (req, res) => await fast();

router.get(`/ping`, pingHandler);
router.get(`/slow`, slowHandler);
router.get(`/fast`, fastHandler);

export default router;
