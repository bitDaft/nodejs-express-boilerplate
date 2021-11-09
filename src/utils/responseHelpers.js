export class ResponseObject {
  constructor() {
    this.status = null;
    this.statusCode = null;
    this.type = null;
    this.error = null;
    this.data = null;
  }
}

export class Success extends ResponseObject {
  constructor(data, code = 200, type = "OK") {
    super();
    this.status = "SUCCESS";
    this.statusCode = code;
    this.type = type;
    this.data = data;
  }
}

export class Failure extends ResponseObject {
  constructor(err, code = 400, type = "FAIL") {
    super();
    this.status = "FAILURE";
    this.statusCode = code;
    this.type = type;
    this.error = err;
  }
}
