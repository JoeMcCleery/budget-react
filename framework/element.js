function Element({ tag = "div", style = "", classList = "", children = [] }) {
  const element = document.createElement(tag);
  element.style = style;
  element.classList = classList;
  appendChildren(element, children);

  return element;
}

function appendChildren(element, children) {
  if (Array.isArray(children)) {
    children.forEach((child) => appendChildren(element, child));
  } else {
    element.append(children);
  }
}

export default Element;
