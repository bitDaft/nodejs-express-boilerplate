import Layer from 'express/lib/router/layer.js';
import Router from 'express/lib/router/index.js';

// # Modified from https://github.com/davidbanham/express-async-errors
// # Acts like an error handler for routes and middleware, when error is thrown
const routerExceptionHandler = () => {
  Object.defineProperty(Layer.prototype, 'handle', {
    enumerable: true,
    get() {
      return this.__handle;
    },
    set(fn) {
      let newFn = fn;
      newFn = wrapperHandlerFunction(fn);
      Object.defineProperty(newFn, 'length', {
        value: fn.length,
        writable: false,
      });
      for (let _ in fn) newFn[_] = fn[_];
      this.__handle = newFn;
    },
  });
  const origParamFn = Router.prototype.constructor.param;
  Router.param = (name, fn) => origParamFn(name, wrapperHandlerFunction(fn));
};

// # Route error handling decorator
const wrapperHandlerFunction =
  (fn) =>
  async (...args) => {
    const [req, res, next] = args;
    try {
      return await fn(...args);
    } catch (e) {
      next(e);
    }
  };

routerExceptionHandler();
