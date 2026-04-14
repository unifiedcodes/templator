// Templator.js
import Walker from "./Walker.js";
import Renderer from "./Renderer.js";
import Bind from "./directives/Bind.js";

export default class Templator {
  constructor(template) {
    if (!(template instanceof Node)) {
      throw new Error("Template must be a DOM node");
    }

    this.isTemplate = template instanceof HTMLTemplateElement;

    this.template = this.normalize(template);

    this.directiveMap = {
      "t-bind": new Bind(),
    };

    this.walker = new Walker(this.directiveMap, this);
    this.renderer = new Renderer();

    // 🔥 compile on actual structure
    this.instructions = this.walker.walk(this.template);
  }

  normalize(template) {
    if (template instanceof HTMLTemplateElement) {
      return template.content.cloneNode(true);
    }

    // mount mode → no clone
    return template;
  }

  resolveNode(root, path) {
    let node = root;

    for (const i of path) {
      node = node.childNodes[i];
    }

    return node;
  }

  create(data = {}) {
    const scope = data;

    let root, fragment;

    if (this.isTemplate) {
      // ✅ clone mode
      fragment = this.template.cloneNode(true);
      root = fragment.firstElementChild;
    } else {
      // ✅ mount mode
      root = this.template;
      fragment = this.template;
    }

    const runtimes = this.instructions.map((inst) => ({
      node: this.resolveNode(fragment, inst.path),
      update: inst.update,
      scope,
    }));

    this.renderer.run(runtimes);

    return {
      root,
      fragment,

      update: () => {
        this.renderer.run(runtimes);
      },

      set: (newData) => {
        Object.assign(scope, newData);
        this.renderer.run(runtimes);
      },

      appendTo: (parent) => {
        if (this.isTemplate) {
          parent.appendChild(fragment);
        }
      },
    };
  }
}
