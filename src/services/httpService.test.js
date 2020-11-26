const { deepStrictEqual } = require("assert");
const HttpService = require("../services/httpService");
const request = require("../utils/httpRequest");
const PORT = 3001;
const DEFAULT_ROUTE = "default";
const DEFAULT_RESPONSE = { message: "tested route" };
const DEFAULT_ERROR = { error: "Internal Server Error" };

let httpService = null;

const beforeEach = async () => {
  if (httpService !== null) {
    await httpService.close();
  }
  httpService = new HttpService();
  await httpService.init(PORT);
};

const afterAll = async () => {
  if (httpService !== null) {
    await httpService.close();
  }
};

(async () => {
  {
    console.log("It should add new route");
    await beforeEach();
    const newRoute = {
      key: "/test:get",
      fn: (request, response) => {
        response.writeHead(200, httpService.DEFAULT_HEADER);
        response.write(JSON.stringify(DEFAULT_RESPONSE));
      },
    };
    httpService.addRoute(newRoute.key, newRoute.fn);
    const keys = Object.keys(httpService.routes);
    const values = Object.values(httpService.routes);
    deepStrictEqual(keys[1], newRoute.key);
    deepStrictEqual(values[1], newRoute.fn);
  }
  {
    console.log("It should exist default route when initialize the service");
    await beforeEach();
    const keys = Object.keys(httpService.routes);
    deepStrictEqual(keys[0], DEFAULT_ROUTE);
  }
  {
    console.log("It should create route and use");
    await beforeEach();
    const newRoute = {
      key: "/test:get",
      fn: async (request, response) => {
        response.writeHead(200, httpService.DEFAULT_HEADER);
        return response.write(JSON.stringify(DEFAULT_RESPONSE));
      },
    };
    const expected = DEFAULT_RESPONSE;
    httpService.addRoute(newRoute.key, newRoute.fn);

    const result = await request("http://localhost:3001/test");
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
  {
    console.log(
      "It should receive a internal server error if route throw a error"
    );
    await beforeEach();
    const newRoute = {
      key: "/test:get",
      fn: async (request, response) => {
        return Promise.reject("");
      },
    };
    const expected = DEFAULT_ERROR;
    httpService.addRoute(newRoute.key, newRoute.fn);

    const result = await request("http://localhost:3001/test").catch(
      (result) => {
        deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
      }
    );
  }
  {
    await afterAll();
  }
})();
