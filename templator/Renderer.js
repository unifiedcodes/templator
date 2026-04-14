// Renderer.js
export default class Renderer {
  run(runtimes) {
    for (const r of runtimes) {
      r.update(r.node, r.scope);
    }
  }
}
