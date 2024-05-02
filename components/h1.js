import Element from "../framework/element.js";

function H1({ text = "" }) {
  return Element({ tag: "h1", children: text });
}

export default H1;
