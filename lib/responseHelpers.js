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
      data = 'No data received to send';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'SUCCESS';
    this.statusCode = !code ? 200 : code;
    this.type = type;
    this.data = data;
  }
}

export class Failure extends ResponseObject {
  constructor(err, code = 422, type = 'FAIL') {
    super();
    if (err === null || err === undefined) {
      err = 'No error received to send';
      code = 500;
      type = 'INTERNAL';
    }
    type = type.toUpperCase();
    this.status = 'FAILURE';
    this.statusCode = !code ? 422 : code;
    this.type = type;
    this.err = err;
  }
}
