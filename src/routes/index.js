import express from 'express';

import test from '#routes/test';
import auth from '#routes/auth';
import { Failure } from '#lib/responseHelpers';

const router = express.Router();

// ^Healthcheck
router.get('/healthcheck', (_, res) => res.status(204).send());

// ^Favicon handler
router.get('/favicon.ico', (_, res) => res.status(404).send());

// ^Test route
router.use('/test', test);

// ^Auth route
router.use('/auth', auth);

// ^Other routes
//
//

export default router;
