import Element from "../framework/element.js";
import H1 from "./h1.js";

function Card({ title, children }) {
  return new Element(null, {
    style:
      "background-color: darkcyan; color: white; padding: 2rem; text-align: center; border-radius: 1rem;",
    children: [H1({ text: title }), ...children],
  });
}

export default Card;
