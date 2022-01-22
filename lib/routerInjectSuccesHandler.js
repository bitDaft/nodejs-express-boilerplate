import Layer from 'express/lib/router/layer.js';
import { standardSuccessHandler } from '#lib/responseHandlers';
import { Success } from '#lib/responseHelpers';

let successLayer = new Layer('/', {}, standardSuccessHandler);

const handleSuccessWrapper =
  (fn) =>
  async (...args) => {
    const response = await fn(...args);
    const [req, res, next] = args;
    if (response instanceof Success) {
      req.x = response;
      return next();
    } else if (response === res) {
      // ^ Nothing to do here
      // ^ The response is being sent as a stream
    } else {
      // ^ The data is any other other type, sent to express to handle
      let simpleValue = response;
      if (simpleValue === undefined || simpleValue === null) return next();
      if (!isNaN(+response)) simpleValue = response.toString();
      console.log(simpleValue);
      return res.status(200).send(simpleValue);
    }
  };

export const injectSuccessHandlerMiddleware = ({ path = '/', stack }) => {
  for (let layer of stack) {
    if (layer.method) {
      layer.handle = handleSuccessWrapper(layer.handle);
      return stack.push(successLayer);
    } else if (layer.route?.stack.length) {
      injectSuccessHandlerMiddleware(layer.route);
    } else if (layer.handle?.stack.length) {
      injectSuccessHandlerMiddleware(layer.handle);
    }
  }
};
