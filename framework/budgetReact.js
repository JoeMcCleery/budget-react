class BudgetReact {
  constructor(mount, root) {
    this.mount = mount;
    this.root = root;
    this.statePointer = 0;

    window.budgetReact = this;
  }

  render() {
    const dom = this.root();
    this.mount.replaceChildren(dom.render());
  }

  reRender() {
    this.statePointer = 0;
    this.render();
  }
}

export default BudgetReact;
