import Element from "../framework/element.js";

function Button({ style, children, onClick }) {
  return new Element("button", {
    style: style,
    children: children,
    onClick: onClick,
  });
}

export default Button;
