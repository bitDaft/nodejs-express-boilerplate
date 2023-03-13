import express from 'express';

import { injectSuccessHandlerMiddleware } from '#lib/routerInjectSuccesHandler';

import config from '#config';

import test from '#route/test';
import auth from '#route/auth';

const router = express.Router();

// # Healthcheck
router.get('/healthcheck', (_, res) => res.status(204).send());

// # Favicon handler
router.get('/favicon.ico', (_, res) => res.status(404).send());

// # Test route
if (config.isDev) {
  router.use('/test', test);
}

// # Auth route
  router.use('/auth', auth);

// # Other routes
//
//

// # Inject Success handler
injectSuccessHandlerMiddleware(router);

export default router;
