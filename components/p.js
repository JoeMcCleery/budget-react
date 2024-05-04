import Element from "../framework/element.js";

function P({ text }) {
  return new Element("p", { children: [text] });
}

export default P;
