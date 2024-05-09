class BudgetElement {
  constructor(tagName, attributes, children, key) {
    this.tagName = tagName || "div";
    this.attributes = attributes;
    this.children = children;
    this.key = key;
  }
}

export default BudgetElement;
