function BudgetReact(rootComponent) {
  this.mount = document.getElementById("app");
  this.root = rootComponent;
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
