import Templator from "./Templator.js";

const el = document.querySelector("#app");

const t = new Templator(el);

const instance = t.create({
  user: {
    name: "Harshit",
  },
});

instance.set({
  user: {
    name: "someusername",
  },
});

console.log(instance);
