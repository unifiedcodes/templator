// Directive.js
export default class Directive {
  constructor(name, isStructural = false) {
    if (!name) {
      throw new Error("Directive must have a name");
    }

    this.name = name;
    this.isStructural = isStructural;
  }

  // Called during compile phase
  compile(node, path, value, templator) {
    return null;
  }
}
