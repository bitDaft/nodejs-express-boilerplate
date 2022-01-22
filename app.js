// # Special function to handle throwing error globally within every route and middleware
import '#lib/routerExceptionHandler';

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

// # Response handlers
app.use(standardSuccessHandler);
app.use(normalErrorHandler);
app.use(standardErrorHandler);
app.use(finalErrorHandler);

export default app;
