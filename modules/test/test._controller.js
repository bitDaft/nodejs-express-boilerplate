import { exampleGetAllData } from './test.db.js';

export const ping = async () => 'pong';

export const slow = async () => {
  let start_time = Date.now();
  let payload = 'the sum is ';
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i;
  }
  payload = payload + sum;
  let end_time = Date.now();
  return {
    start_time,
    end_time,
    difference: end_time - start_time,
    payload: payload,
  };
};

export const fast = async () => {
  let start_time = Date.now();
  let payload = 'the sum is ';
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += i;
  }
  payload = payload + sum;
  let end_time = Date.now();
  return {
    start_time,
    end_time,
    difference: end_time - start_time,
    payload: payload,
  };
};
