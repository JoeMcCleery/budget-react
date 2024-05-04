import Element from "../framework/element.js";

function H1({ text }) {
  return new Element("h1", { children: [text] });
}

export default H1;
