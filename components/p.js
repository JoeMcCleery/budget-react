import Element from "../framework/element.js";

function P({ text = "" }) {
  return Element({ tag: "p", children: text });
}

export default P;
