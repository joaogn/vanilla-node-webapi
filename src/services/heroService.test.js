const { rejects, deepStrictEqual } = require("assert");
const { join } = require("path");
const { writeFile } = require("fs/promises");
const HeroRepository = require("../repositories/heroRepository");
const HeroService = require("../services/heroService");

const fileName = join(__dirname, "../../mocks", "data.json");

const heroRepository = new HeroRepository({ file: fileName });
const heroService = new HeroService({ heroRepository });

const clearMock = async () => {
  await writeFile(
    fileName,
    JSON.stringify([{ id: 1, name: "NaMaria", age: 100, power: "Ancient" }])
  );
};

(async () => {
  {
    console.log("It should return NaMaria Hero");
    const result = await heroService.find(1);
    const expected = { id: 1, name: "NaMaria", age: 100, power: "Ancient" };
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
  {
    console.log("It should return all Heros");
    const result = await heroService.find();
    const expected = [{ id: 1, name: "NaMaria", age: 100, power: "Ancient" }];
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
  {
    console.log("It should reject 'name is missing!'");
    const newHero = { age: 60, power: "Super annoying" };
    const rejection = new Error("name is missing!");
    const result = heroService.create(newHero);
    await rejects(result, rejection);
  }
  {
    console.log("It should reject 'age is missing!'");
    const newHero = { name: "Fauston", power: "Super annoying" };
    const rejection = new Error("age is missing!");
    const result = heroService.create(newHero);
    await rejects(result, rejection);
  }
  {
    console.log("It should reject 'power is missing!'");
    const newHero = { name: "Fauston", age: 60 };
    const rejection = new Error("power is missing!");
    const result = heroService.create(newHero);
    await rejects(result, rejection);
  }
  {
    console.log(
      "It should reject 'name is missing!,age is missing!,power is missing!'"
    );
    const newHero = {};
    const rejection = new Error(
      "name is missing!,age is missing!,power is missing!"
    );
    const result = heroService.create(newHero);
    await rejects(result, rejection);
  }
  {
    console.log("Id should be create a new Hero");
    const newHero = { name: "Fauston", age: 60, power: "Super annoying" };
    const id = await heroService.create(newHero);
    const result = await heroService.find(id);
    const expected = { id, ...newHero };
    await clearMock();
    deepStrictEqual(JSON.stringify(result), JSON.stringify(expected));
  }
})();
