class Element {
  constructor(tagName, attributes, children) {
    this.tagName = tagName || "div";
    this.attributes = attributes;
    this.children = children;
  }
}

export default Element;
