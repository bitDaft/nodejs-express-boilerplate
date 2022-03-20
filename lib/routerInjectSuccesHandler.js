import Layer from 'express/lib/router/layer.js';

import { standardSuccessHandler } from '#lib/responseHandlers';
import { Success } from '#lib/responseHelpers';
import log from '#lib/logger';

let successLayer = new Layer('/', {}, standardSuccessHandler);

const handleSuccessWrapper =
  (fn) =>
  async (...args) => {
    const output = await fn(...args);
    const [response, wrapSuccess = true] = Array.isArray(output) ? output : [output];
    const [req, res, next] = args;
    req.x = undefined;
    if (response instanceof Success) {
      req.x = response;
    } else if (response === res) {
      // # Nothing to do here
      // ^ The response is being sent as a stream
      if (!res.headersSent) log.info(new Success('Streaming data'));
      return;
    } else if (response !== undefined) {
      let simpleValue = response;
      if (response !== null && !isNaN(+response)) simpleValue = +response + '';
      let wrappedSimpleValue = new Success(simpleValue);
      if (!wrapSuccess) {
        if (res.headersSent) {
          log.warn('[Success] Sent already:', simpleValue);
          return;
        }
        log.info(wrappedSimpleValue);
        return res.status(200).send(simpleValue);
      }
      req.x = wrappedSimpleValue;
    }
    return next();
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
