import Layer from 'express/lib/router/layer.js';
import { standardSuccessHandler } from '#lib/responseHandlers';

let successLayer = new Layer('/', {}, standardSuccessHandler);
export const injectSuccessHandlerMiddleware = ({ stack }) => {
  for (let layer of stack) {
    if (layer.method) {
      return stack.push(successLayer);
    } else if (layer.route?.stack.length) {
      injectSuccessHandlerMiddleware(layer.route);
    } else if (layer.handle?.stack.length) {
      injectSuccessHandlerMiddleware(layer.handle);
    }
  }
};
