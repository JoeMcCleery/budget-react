import BudgetElement from "./budgetElement.js";
import Fiber from "./fiber.js";

class BudgetReact {
  statePointer = 0;
  nextUnitOfWork = null;
  wipRoot = null;
  currentRoot = null;
  deletions = null;

  constructor() {
    // Set global ref
    window.budgetReact = this;
  }

  commitRoot = () => {
    // First delete oldFibers no longer needed
    this.deletions.forEach(this.commitWork);
    // Recursively append all nodes to the dom
    this.commitWork(this.wipRoot.child);
    this.currentRoot = this.wipRoot;
    this.wipRoot = null;
  };

  commitWork = (fiber) => {
    if (!fiber) return;

    // Get parent dom node
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    const parentDom = fiberParent.dom;

    switch (fiber.effectTag) {
      case "PUT":
        parentDom.appendChild(fiber.dom);
        break;
      case "DELETE":
        this.commitDeletion(fiber, parentDom);
        break;
      case "UPDATE":
        this.updateDom(fiber);
    }

    this.commitWork(fiber.child);
    this.commitWork(fiber.sibling);
  };

  commitDeletion = (fiber, parentDom) => {
    if (fiber.dom) {
      parentDom.removeChild(fiber.dom);
    } else {
      this.commitDeletion(fiber.child, parentDom);
    }
  };

  render = (element, domContainer) => {
    // Clear deletions array
    this.deletions = [];
    // Create container element from domContainer
    const containerElement = new BudgetElement(
      domContainer.tagName,
      domContainer.attributes,
      [element]
    );
    // Create wipRoot fiber from domContainer
    this.wipRoot = new Fiber(containerElement, domContainer);
    this.wipRoot.alternate = this.currentRoot;
    // Start work on root fiber
    this.nextUnitOfWork = this.wipRoot;
    requestIdleCallback(this.workLoop);
  };

  workLoop = (deadline) => {
    let shouldYield = false;

    // Generate virtual dom (yield early if taking too long)
    while (this.nextUnitOfWork && !shouldYield) {
      this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork);
      shouldYield = deadline.timeRemaining() < 1;
    }

    // If no more work, render the dom
    if (!this.nextUnitOfWork) {
      this.commitRoot();
    } else {
      // Continue work during next idle period
      requestIdleCallback(this.workLoop);
    }
  };

  createDom = (fiber) => {
    // Get element type
    const isText = this.getElementType(fiber.element) === "TEXT";

    // Create dom node
    const dom = isText
      ? document.createTextNode(fiber.element)
      : document.createElement(fiber.element.tagName);

    // Set dom node attributes
    if (!isText && fiber.element.attributes) {
      for (let [attribute, value] of Object.entries(fiber.element.attributes)) {
        dom[attribute] = value;
      }
    }

    return dom;
  };

  updateDom = (fiber) => {
    const isNew = (prev, next) => (key) => prev[key] !== next[key];
    const isGone = (next) => (key) => !(key in next);
    const alternateAttributes = fiber.alternate.element.attributes;
    const attributes = fiber.element.attributes;
    // Remove old attributes
    Object.keys(alternateAttributes)
      .filter(isGone(attributes))
      .forEach((name) => fiber.dom.removeAttribute(name));
    // Set new or changed attributes
    Object.keys(attributes)
      .filter(isNew(alternateAttributes, attributes))
      .forEach((name) => (fiber.dom[name] = attributes[name]));
  };

  performUnitOfWork = (fiber) => {
    // Add dom node
    if (!fiber.dom) {
      fiber.dom = this.createDom(fiber);
    }

    // Add/Update/Remove child fibers
    if (fiber.element?.children) {
      this.reconcileChildren(fiber, fiber.element.children);
    }

    // Return next unit of work
    if (fiber.child) {
      // Depth first rendering
      return fiber.child;
    }
    // If no child search for parent siblings. If none exist then work is done!
    let nextFiber = fiber;
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling;
      }
      nextFiber = nextFiber.parent;
    }
  };

  reconcileChildren = (wipFiber, children) => {
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    let prevSibling;

    // TODO use element key to detect change in order of children
    // Loop element children and/or old fibers
    let index = 0;
    while (index < children.length || oldFiber != null) {
      let newFiber;
      // Get current child element
      const childElement = children[index];

      // Determine old and new element types
      const wipType = this.getElementType(childElement);
      const oldType = this.getElementType(oldFiber?.element);
      const sameType = wipType === oldType;

      // Update node
      if (sameType) {
        newFiber = new Fiber(
          oldFiber.element,
          oldFiber.dom,
          wipFiber,
          null,
          null,
          oldFiber,
          "UPDATE"
        );
      }
      // Add node
      if (childElement && !sameType) {
        newFiber = new Fiber(
          childElement,
          null,
          wipFiber,
          null,
          null,
          null,
          "PUT"
        );
      }
      // Delete old fiber's node
      if (oldFiber && !sameType) {
        oldFiber.effectTag = "DELETE";
        this.deletions.push(oldFiber);
      }

      if (oldFiber) {
        oldFiber = oldFiber.sibling;
      }

      // Set fiber relationships
      if (index === 0) {
        // Set first child
        wipFiber.child = newFiber;
      } else {
        // Set siblings
        prevSibling.sibling = newFiber;
      }

      prevSibling = newFiber;
      index++;
    }
  };

  getElementType = (element) => {
    return (
      element && (element instanceof BudgetElement ? element.tagName : "TEXT")
    );
  };
}

export default BudgetReact;
