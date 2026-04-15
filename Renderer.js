// Renderer.js
export default class Renderer {
  run(runtimes) {
    for (const r of runtimes) {
      if (r.update.length === 1) {
        // foreach style
        r.update(r);
      } else {
        // bind style
        r.update(r.node, r.scope);
      }
    }
  }
}
