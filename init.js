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

  // instance.scope.items = [
  //   { name: "Harshit u" },
  //   { name: "Rahul u" },
  //   { name: "Someone u" },
  // ];
}, 1000);
