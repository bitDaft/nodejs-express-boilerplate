// #Acts like an error handler for routes and middleware, when error is thrown
// #Emulates the error handling functionality of express 5
export const routerHandler = (router) => {
  for (let layer of router.stack) {
    if (layer.name === "router") {
      routerHandler(layer.handle);
    } else if (layer.name === "default") {
      layer.handle = wrapperHandlerFunction(layer.handle);
    } else if (layer.name === "bound dispatch") {
      for (let innerlayer of layer.route?.stack || []) {
        innerlayer.handle = wrapperHandlerFunction(innerlayer.handle);
      }
    }
  }
};

// #Route error handling decorator
const wrapperHandlerFunction = (tmp_handler) => async (req, res, next) => {
  try {
    await tmp_handler(req, res, next);
  } catch (e) {
    next(e);
  }
};
