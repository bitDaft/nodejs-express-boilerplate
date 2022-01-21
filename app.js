// # Package imports
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';

// # Other imports
import routes from '#routes';
import {
  finalErrorHandler,
  normalErrorHandler,
  standardErrorHandler,
  standardSuccessHandler,
} from '#lib/responseHandlers';
import { routerExceptionHandler } from '#lib/routerExceptionHandler';
import { rateLimiterMiddleware } from '#middlewares';
import config from '#config';

// # Create express application
let app = express();

// # Check proxy enabled or not
if (config.PROXY) app.set('trust proxy', config.PROXY);

// # Setup middlewares
app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimiterMiddleware);

// # Initialize routes
app.use(routes);

// # Special function to handle throwing error globally
// TODO: This functionality will be part of express 5
// TODO: So this should be removed once next express version releases
routerExceptionHandler(app);

// # Response handlers
app.use(standardSuccessHandler);
app.use(normalErrorHandler);
app.use(standardErrorHandler);
app.use(finalErrorHandler);

export default app;
