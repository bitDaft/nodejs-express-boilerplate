import express from 'express';

import { getData } from '#controller/_template';

const router = express.Router();

const getHandler = async (req, res) => await getData();

router.get('/', getHandler);

export default router;
