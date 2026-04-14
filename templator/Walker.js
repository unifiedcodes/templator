// Walker.js
export default class Walker {
  constructor(directiveMap = {}, templator) {
    this.directiveMap = directiveMap;
    this.templator = templator;
  }

  walk(root) {
    return this.processNode(root, []);
  }

  processNode(node, path) {
    const instructions = [];

    node.childNodes.forEach((child, index) => {
      const currentPath = [...path, index];

      // traverse non-elements
      if (child.nodeType !== 1) {
        instructions.push(...this.processNode(child, currentPath));
        return;
      }

      let isStructural = false;

      // 🔥 only check actual attributes
      if (child.hasAttributes()) {
        for (const attr of child.attributes) {
          const directive = this.directiveMap[attr.name];

          if (!directive) continue;

          if (directive.isStructural) {
            isStructural = true;
          }

          const result = directive.compile(
            child,
            currentPath,
            attr.value,
            this.templator,
          );

          if (Array.isArray(result)) {
            instructions.push(...result);
          } else if (result) {
            instructions.push(result);
          }
        }
      }

      if (!isStructural) {
        instructions.push(...this.processNode(child, currentPath));
      }
    });

    return instructions;
  }
}
