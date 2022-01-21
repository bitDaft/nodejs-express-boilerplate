// # Acts like an error handler for routes and middleware, when error is thrown
// # Emulates the error handling functionality of express 5
export const routerExceptionHandler = ({ _router: { stack = [] } }, bound = false) => {
  for (let layer of stack) {
    switch (bound ? 'default' : layer.name) {
      case 'default':
        layer.handle = wrapperHandlerFunction(layer.handle);
        break;
      case 'router':
        routerExceptionHandler({ _router: layer.handle });
        break;
      case 'bound dispatch':
        routerExceptionHandler({ _router: layer.route }, true);
        break;
    }
  }
};

// # Route error handling decorator
const wrapperHandlerFunction = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (e) {
    next(e);
  }
};
