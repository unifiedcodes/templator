// Foreach.js
import Directive from "./Directive.js";

export default class Foreach extends Directive {
  constructor() {
    super("t-foreach", true);
  }

  compile(node, path, value, templator) {
    const [itemName, , listExpr] = value.split(" ");

    const listGetter = new Function(
      "scope",
      `with(scope){ return ${listExpr} }`,
    );

    // clone template
    const templateNode = node.cloneNode(true);
    templateNode.removeAttribute("t-foreach");

    const childTemplator = templator.createChildTemplator(templateNode);

    return {
      path,
      deps: [listExpr],

      setup(runtime, node) {
        const anchor = document.createComment("foreach");
        node.parentNode.replaceChild(anchor, node);

        runtime.anchor = anchor;
        runtime.instances = [];
      },

      update(runtime) {
        console.log("foreach update called");

        const { anchor, scope } = runtime;
        const parent = anchor.parentNode;

        const list = listGetter(scope) || [];

        // remove old nodes (simple reset)
        for (const inst of runtime.instances) {
          inst.root.remove();
        }
        runtime.instances = [];

        // create fragment
        const fragment = document.createDocumentFragment();

        // create all instances
        for (const item of list) {
          const childScope = Object.create(scope);
          childScope[itemName] = item;

          const inst = childTemplator.create(childScope, scope);

          runtime.instances.push(inst);
          fragment.appendChild(inst.root);
        }

        // insert in one go
        parent.insertBefore(fragment, anchor);
      },
    };
  }
}
