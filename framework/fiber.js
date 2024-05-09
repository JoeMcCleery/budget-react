class Fiber {
  constructor(element, dom, parent, child, sibling, alternate, effectTag) {
    this.element = element;
    this.dom = dom;
    this.parent = parent;
    this.child = child;
    this.sibling = sibling;
    this.alternate = alternate;
    this.effectTag = effectTag;
  }
}

export default Fiber;
