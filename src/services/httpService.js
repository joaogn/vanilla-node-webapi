const http = require("http");

class HttpService {
  constructor() {
    this.routes = {};
    this.http = http;
    this.DEFAULT_HEADER = { "Content-Type": "application/json" };
    this.server = {};
  }

  handlerError = (response) => {
    return (error) => {
      console.error(error);
      response.writeHead(500, this.DEFAULT_HEADER);
      response.write(JSON.stringify({ error: "Internal Server Error" }));
      return response.end();
    };
  };

  handler = (request, response) => {
    const { url, method } = request;
    console.log({ url, method });
    const [_, route, id] = url.split("/");
    request.queryString = { id: isNaN(id) ? id : Number(id) };

    const key = `/${route}:${method.toLowerCase()}`;

    response.writeHead(200, this.DEFAULT_HEADER);

    const chosen = this.routes[key] || this.routes.default;

    return chosen(request, response).catch(this.handlerError(response));
  };

  async addRoute(key, fn) {
    Object.assign(this.routes, { [key]: fn });
  }

  init = (port) =>
    new Promise((resolve) => {
      this.addRoute("default", (request, response) => {
        response.write("This Server is working, but this route not exist");
        response.end();
      });

      this.server = this.http.createServer(this.handler).listen(port, () => {
        console.log(`Server running at ${port}`);
        resolve();
      });
    });

  close = () =>
    new Promise((resolve) => {
      this.server.close(() => {
        console.log(`Server is closed`);
        resolve();
      });
    });
}

module.exports = HttpService;
