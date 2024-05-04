function BudgetReact(mount, root) {
  this.mount = mount;
  this.root = root;
  this.statePointer = 0;

  this.render = () => {
    this.mount.append(this.root());
  };

  this.reRender = () => {
    this.mount.innerHTML = "";
    this.statePointer = 0;
    this.render();
  };

  window.budgetReact = this;
}

export default BudgetReact;
