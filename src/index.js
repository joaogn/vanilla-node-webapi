const PORT = 3000;

const HeroFactory = require("./factories/heroFactory");
const HttpFactory = require("./factories/httpFactory");

const heroService = HeroFactory.generateInstance();
const httpService = HttpFactory.generateInstance();

httpService.addRoute("/heroes:get", async (request, response) => {
  const { id } = request.queryString;
  const heroes = await heroService.find(id);
  response.write(JSON.stringify({ result: heroes }));
  return response.end();
});

httpService.addRoute("/heroes:post", async (request, response) => {
  for await (const data of request) {
    try {
      const id = await heroService.create(JSON.parse(data));

      response.writeHead(201, httpService.DEFAULT_HEADER);
      response.write(
        JSON.stringify({ success: "User Create with success", id })
      );

      //The return can be inside the for await because is one object by body
      //if is archive sended by demand is necessary remove the return from for await
      return response.end();
    } catch (error) {
      return httpService.handlerError(response)(error);
    }
  }
});

httpService.init(PORT);
