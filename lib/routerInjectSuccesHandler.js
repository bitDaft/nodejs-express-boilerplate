import Layer from 'express/lib/router/layer.js';

import { standardSuccessHandler } from '#lib/responseHandlers';
import { Success } from '#lib/responseHelpers';
import log from '#lib/logger';

let successLayer = new Layer('/', {}, standardSuccessHandler);

const handleSuccessWrapper =
  (fn) =>
  async (...args) => {
    const output = await fn(...args);
    let response = output;
    let _wrapSuccess = true;
    if (
      typeof output === 'object' &&
      !Array.isArray(output) &&
      output !== null &&
      output.hasOwnProperty('_wrapSuccess') &&
      output.hasOwnProperty('_data')
    ) {
      const { _wrapSuccess: wrapOption, _data } = output;
      response = _data;
      _wrapSuccess = wrapOption;
    }
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
      if (response !== null && typeof response === 'string' && !isNaN(+response))
        simpleValue = +response + '';
      let wrappedSimpleValue = new Success(simpleValue);
      if (!_wrapSuccess) {
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

export const injectSuccessHandlerMiddleware = ({ path, stack }) => {
  if (path) {
    let layer = stack[stack.length - 1];
    layer.handle = handleSuccessWrapper(layer.handle);
    stack.push(successLayer);
  } else {
    for (let layer of stack) {
      if (layer.route?.stack.length) {
        injectSuccessHandlerMiddleware(layer.route);
      } else if (layer.handle?.stack.length) {
        injectSuccessHandlerMiddleware(layer.handle);
      }
    }
  }
};
