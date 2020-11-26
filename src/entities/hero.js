class Hero {
  constructor({ name, age, power }) {
    this.id = Math.floor(Math.random() * 100) + Date.now();
    this.name = name;
    this.age = age;
    this.power = power;
  }

  isValid() {
    const propertyNames = Object.getOwnPropertyNames(this);
    const invalidProperty = propertyNames.map((property) =>
      !!this[property] ? null : `${property} is missing!`
    );
    const amountInvalid = invalidProperty.filter((item) => !!item);
    return {
      valid: amountInvalid.length === 0,
      error: amountInvalid,
    };
  }
}

module.exports = Hero;
