import express from 'express';

import template from '#route/_template';
import auth from '#route/auth';

const router = express.Router();

// # Healthcheck
router.get('/healthcheck', (_, res) => res.status(204).send());

// # Favicon handler
router.get('/favicon.ico', (_, res) => res.status(404).send());

// # Test route
router.use('/test', template);

// # Auth route
router.use('/auth', auth);

// # Other routes
//
//

export default router;
