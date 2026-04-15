// Bind.js
import Directive from "./Directive.js";

export default class Bind extends Directive {
  constructor() {
    super("t-bind");
  }

  compile(node, path, value) {
    const expr = value;

    const getter = new Function("scope", `with(scope){ return ${expr} }`);

    return {
      path,
      deps: [expr],

      // compiled instruction
      update: (node, scope) => {
        const result = getter(scope);
        node.textContent = result ?? "";
      },
    };
  }
}
