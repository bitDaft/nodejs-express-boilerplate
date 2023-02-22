export class ResponseObject {
  constructor() {
    this.status = null;
    this.statusCode = null;
    this.type = null;
    this.err = null;
    this.data = null;
  }
}

export class Success extends ResponseObject {
  constructor(data, code = 200, type = 'OK') {
    super();
    if (data === undefined) {
      data = 'No data value given to send';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'SUCCESS';
    this.statusCode = isNaN(+code) ? 200 : +code;
    this.type = typeof code === 'string' && isNaN(+code) ? code : type;
    this.data = data;
  }
}

export class Failure extends ResponseObject {
  constructor(err, code = 400, type = 'FAIL') {
    super();
    if (err === null || err === undefined) {
      err = 'No error value given to send';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'FAILURE';
    this.statusCode = isNaN(+code) ? 400 : +code;
    this.type = typeof code === 'string' && isNaN(+code) ? code : type;
    this.err = err;
  }
}
