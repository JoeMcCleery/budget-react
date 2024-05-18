export class Fragment extends DocumentFragment {
  #childNodes: (Node | string)[] = [];

  #appendChild = (node: Node | string) => {
    this.#removeChild(node);
    this.#childNodes.push(node);
  };

  #removeChild = (node: Node | string) => {
    const i = this.#childNodes.indexOf(node);
    if (-1 < i) this.#childNodes.splice(i, 1);
  };

  appendChild<T extends Node>(node: T) {
    this.#appendChild(node);
    return super.appendChild(node);
  }

  append(...nodes: (Node | string)[]) {
    nodes.forEach(this.#appendChild);
    return super.append(...nodes);
  }

  removeChild<T extends Node>(node: T) {
    this.#removeChild(node);
    return super.removeChild(node);
  }

  // the value of this Fragment when moved around
  valueOf() {
    this.append(...this.#childNodes);
    return this;
  }
}
