import util from 'util';

const __print = Symbol.for('nodejs.util.inspect.custom');

// # https://github.com/nodejs/node/blob/90cd3dd44e164ac7670516512cc364bb2b18eb4c/lib/internal/util/inspect.js#L210
// ^ Check the link above to see how to define colors and styles
util.inspect.styles['failure'] = 'red';
util.inspect.styles['success'] = 'green';
util.inspect.styles['bracket'] = 'green';
util.inspect.styles['inverse'] = 'inverse';
util.inspect.styles['white'] = 'white';

export class ResponseObject {
  constructor() {
    this.status = null;
    this.statusCode = null;
    this.type = null;
    this.error = null;
    this.data = null;
  }

  [__print](depth, option, inspect) {
    let output = '';
    const lb = option.stylize('[', 'white');
    const rb = option.stylize(']', 'white');
    const w = (_, ...p) => `${lb}${p.join(' ')}${rb}`;
    output += w`${option.stylize(this.status, this.status.toLowerCase())} ${option.stylize(
      this.statusCode,
      'null'
    )}`;
    output += w`${option.stylize(new Date().toLocaleString(), 'number')}`;
    return `${output}: `;
  }
}

export class Success extends ResponseObject {
  constructor(data, code = 200, type = 'OK') {
    super();
    if (data === null || data === undefined || (Array.isArray(data) && !data?.length)) {
      data = 'Unknown data recieved';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'SUCCESS';
    this.statusCode = code;
    this.type = type;
    this.data = data;
  }
  [__print](depth, option, inspect) {
    let info = this.data;
    if (typeof info === 'object') info = '\n' + JSON.stringify(info, null, 2);
    return super[__print](depth, option, inspect) + option.stylize(info, 'white');
  }
}

export class Failure extends ResponseObject {
  constructor(err, code = 400, type = 'FAIL') {
    super();
    if (err === null || err === undefined || (Array.isArray(err) && !err?.length)) {
      err = 'Unknown error occured';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'FAILURE';
    this.statusCode = code;
    this.type = type;
    this.error = err;
  }
  [__print](depth, option, inspect) {
    let info = this.error;
    if (typeof info === 'object') info = '\n' + JSON.stringify(info, null, 2);
    return super[__print](depth, option, inspect) + option.stylize(info, 'white');
  }
}
