// Templator.js
import Walker from "./Walker.js";
import Renderer from "./Renderer.js";
import Bind from "./directives/Bind.js";
import { reactive } from "./Reactive.js";

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

    // compile on actual structure
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

  buildDepsMap(runtimes) {
    const map = {};

    for (const r of runtimes) {
      if (!r.deps) continue;

      for (const dep of r.deps) {
        if (!map[dep]) {
          map[dep] = [];
        }

        map[dep].push(r);
      }
    }

    return map;
  }

  create(data = {}) {
    const fragment = this.isTemplate
      ? this.template.cloneNode(true)
      : this.template;

    const root = fragment.firstElementChild || fragment;

    // 🔥 runtimes
    const runtimes = this.instructions.map((inst) => ({
      node: this.resolveNode(fragment, inst.path),
      update: inst.update,
      deps: inst.deps,
      scope: null, // assigned after proxy
    }));

    // 🔥 depsMap
    const depsMap = this.buildDepsMap(runtimes);

    // 🔥 onChange handler
    const onChange = (path) => {
      const list = depsMap[path];
      if (list) {
        this.renderer.run(list);
      }
    };

    // 🔥 reactive scope (shallow for now)
    const scope = reactive(data, onChange);

    // assign scope to runtimes
    for (const r of runtimes) {
      r.scope = scope;
    }

    // initial render
    this.renderer.run(runtimes);

    return {
      root,
      fragment,

      appendTo: (parent) => {
        if (this.isTemplate) {
          parent.appendChild(fragment);
        }
      },

      get scope() {
        return scope;
      },
    };
  }
}
