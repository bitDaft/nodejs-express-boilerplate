import Layer from 'express/lib/router/layer.js';

import log from '#logger';
import { isObject } from '#utils/isObject';
import { Success } from '#lib/responseHelpers';
import { standardSuccessHandler } from '#lib/responseHandlers';

let successLayer = new Layer('/', {}, standardSuccessHandler);

const handleSuccessWrapper =
  (fn) =>
  async (...args) => {
    const output = await fn(...args);
    let response = output;
    let _wrapSuccess = true;
    if (
      isObject(output) &&
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
      // TODO: needs more testing for this case
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
