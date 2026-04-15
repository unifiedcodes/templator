// Templator.js
import Walker from "./Walker.js";
import Renderer from "./Renderer.js";
import { reactive } from "./Reactive.js";
import Bind from "./directives/Bind.js";
import Foreach from "./directives/Foreach.js";

export default class Templator {
  constructor(template, options = {}) {
    if (!(template instanceof Node)) {
      throw new Error("Template must be a DOM node");
    }

    this.isTemplate =
      options.forceTemplate || template instanceof HTMLTemplateElement;

    this.useSelfAsRoot = options.useSelfAsRoot || false;

    this.template = template;

    this.directiveMap = {
      "t-bind": new Bind(),
      "t-foreach": new Foreach(),
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

  createChildTemplator(template) {
    return new this.constructor(template, {
      forceTemplate: true,
      useSelfAsRoot: true,
    });
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

  normalizeNode() {
    let fragment, root;

    if (this.isTemplate) {
      if (this.template instanceof HTMLTemplateElement) {
        fragment = this.template.content.cloneNode(true);
        root = fragment.firstElementChild;
      } else {
        // clone directly
        const cloned = this.template.cloneNode(true);

        fragment = cloned;

        // root strategy
        root = this.useSelfAsRoot ? cloned : cloned.firstElementChild;
      }
    } else {
      // mount mode
      fragment = this.template;
      root = this.template;
    }

    return { fragment, root };
  }

  create(data = {}, parentScope = null) {
    const { fragment, root } = this.normalizeNode();

    // runtimes
    const runtimes = this.instructions.map((inst) => {
      const node = this.resolveNode(fragment, inst.path);

      const runtime = {
        node,
        update: inst.update,
        deps: inst.deps,
        scope: null,
        anchor: null,
        instances: null,
      };

      // call setup if exists
      if (inst.setup) {
        inst.setup(runtime, node);
      }

      return runtime;
    });

    // depsMap
    const depsMap = this.buildDepsMap(runtimes);

    // onChange handler
    const onChange = (path) => {
      const list = [];

      for (const key in depsMap) {
        if (path.startsWith(key)) {
          list.push(...depsMap[key]);
        }
      }

      console.log(list);

      if (list.length) {
        this.renderer.run(list);
      }
    };

    // reactive scope
    const scope = parentScope || reactive(data, onChange);

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
