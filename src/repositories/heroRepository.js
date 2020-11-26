const { readFile, writeFile } = require("fs/promises");
class HeroRepository {
  constructor({ file }) {
    this.file = file;
  }
  async _currentFileContent() {
    return JSON.parse(await readFile(this.file));
  }
  async find(itemId) {
    const allData = await this._currentFileContent();
    if (!itemId) return allData;

    return allData.find((item) => item.id === itemId);
  }
  async create(data) {
    const currentFile = await this._currentFileContent();
    currentFile.push(data);

    await writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }
}
module.exports = HeroRepository;
