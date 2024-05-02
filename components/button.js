import Element from "../framework/element.js";

function Button({ style = "", children = [], onClick = () => {} }) {
  const button = Element({ tag: "button", style: style, children: children });
  button.addEventListener("click", (e) => onClick(e));
  return button;
}

export default Button;
