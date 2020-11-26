const HeroEntity = require("../entities/hero");

class HeroService {
  constructor({ heroRepository, heroEntity }) {
    this.heroRepository = heroRepository;
  }

  async find(itemId) {
    return this.heroRepository.find(itemId);
  }
  async create(data) {
    const hero = new HeroEntity(data);
    const { error, valid } = hero.isValid();
    if (!valid) {
      throw new Error(error.join(","));
    }
    return this.heroRepository.create(hero);
  }
}

module.exports = HeroService;
