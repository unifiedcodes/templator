import Templator from "./Templator.js";

const el = document.querySelector("#app");

const t = new Templator(el);

const instance = t.create({
  user: {
    name: "Harshit",
  },
});

instance.scope.user.name = "something";

console.log(instance);
