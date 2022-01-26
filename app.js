// # Special function to handle throwing error globally within every route and middleware
import '#lib/routerExceptionHandler';

// # Package imports
import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from "cookie-parser";

// # Other imports
import routes from '#routes';
import { finalErrorHandler, normalErrorHandler, standardErrorHandler } from '#lib/responseHandlers';
import { rateLimiterMiddleware } from '#middlewares';
import { injectSuccessHandlerMiddleware } from '#lib/routerInjectSuccesHandler';
import config from '#config';

// # Create express application
let app = express();

// # Check proxy enabled or not
if (config.proxy) app.set('trust proxy', config.proxy);

var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    callback(null, origin);
  },
};

// # Setup middlewares
app.use(logger('dev'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimiterMiddleware);

// # Initialize routes
app.use(routes);

// # Inject Success handler
injectSuccessHandlerMiddleware(routes);

// # Response handlers
app.use(normalErrorHandler);
app.use(standardErrorHandler);
app.use(finalErrorHandler);

export default app;
