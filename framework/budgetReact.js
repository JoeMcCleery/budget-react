class BudgetReact {
  constructor(mount, root) {
    this.mount = mount;
    this.root = root;
    this.statePointer = 0;

    window.budgetReact = this;
  }

  init() {
    this.render(this.root(), this.mount);
  }

  render(el, container) {
    if (typeof el !== "object") {
      container.appendChild(document.createTextNode(el));
      return;
    }

    // Create document element
    const domEl = document.createElement(el.tagName);

    // Handle attributes
    if (el.attributes) {
      for (let [attribute, value] of Object.entries(el.attributes)) {
        domEl[attribute] = value;
      }
    }

    // Render children
    el.children?.forEach((childEl) => this.render(childEl, domEl));

    // Append to container
    container.appendChild(domEl);
  }

  reRender() {
    this.statePointer = 0;
    this.mount.innerHTML = "";
    this.render(this.root(), this.mount);
  }
}

export default BudgetReact;
