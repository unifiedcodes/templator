// Test
import Templator from "./Templator.js";

const el = document.querySelector("#app");

const t = new Templator(el);

const instance = t.create({
  user: {
    name: "Harshit",
  },
  items: [{ name: "Harshit" }, { name: "Rahul" }, { name: "Someone" }],
});

setTimeout(() => {
  instance.scope.user.name = "something";

  instance.scope.items[0].name = "Updated Harshit";

  instance.scope.items = generateItems(100000);
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
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return Array.from({ length: numberOfItems }, () => ({
    name: randomName(),
  }));
}
