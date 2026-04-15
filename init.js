// Test
import Templator from "./Templator.js";

const el = document.querySelector("#app");

const t = new Templator(el);

const instance = t.create({
  user: {
    name: "someone",
  },
  items: [{ name: "a" }, { name: "b" }, { name: "c" }],
});

console.log("-------------");

setTimeout(() => {
  instance.scope.user.name = generateItems(1)[0].name;
  instance.scope.items[0].name = "Updated Harshit";

  console.log(JSON.parse(JSON.stringify(instance.scope)));
}, 1000);

function generateItems(numberOfItems) {
  const randomName = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const length = Math.floor(Math.random() * 6) + 5; // 5–10 chars
    let name = "";

    for (let i = 0; i < length; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }

    // Capitalize first letter
    return name;
  };

  return Array.from({ length: numberOfItems }, () => ({
    name: randomName(),
  }));
}
