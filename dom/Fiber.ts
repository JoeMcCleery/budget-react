import type { Fiber, BudgetNode, Props } from "budget-react";
import { BudgetFragment, BudgetTextNode, getNodeType } from "budget-react";

export enum EffectTag {
  UPDATE = "Update",
  PUT = "PUT",
  DELETE = "DELETE",
  REPLACE = "REPLACE",
}

const customAttributes = ["children", "key", "props"];

const isStandardAttribute = (key: string) => !customAttributes.includes(key);
const isNew = (prev: Props, next: Props) => (key: string) =>
  prev[key] !== next[key];
const isGone = (next: Props) => (key: string) => !(key in next);

let wipRoot: Fiber | undefined;
let currentRoot: Fiber | undefined;

export let wipFiber: Fiber;

const deletions: Fiber[] = [];

let nextUnitOfWork: Fiber | undefined;

export function render(container: Node, node: BudgetNode) {
  // Create root fiber
  wipRoot = {
    dom: container,
    props: { children: node },
    alternate: currentRoot,
  };

  // Clear deletions
  deletions.length = 0;

  // Set next unit of work
  nextUnitOfWork = wipRoot;
}

export function rerender() {
  render(currentRoot!.dom!, currentRoot!.props.children as BudgetNode);
}

// Start work loop
requestIdleCallback(workLoop);
function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;

  while (nextUnitOfWork && !shouldYield) {
    // Perform work and get next unit of work
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // Bail if taking too long
    shouldYield = deadline.timeRemaining() < 1;
  }

  // If work completed commit to dom
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  // Continue work loop during next idle
  requestIdleCallback(workLoop);
}

function commitRoot() {
  // Commit deletions
  deletions.forEach((fiber) => commitWork(fiber));

  // Append dom elements to container
  commitWork(wipRoot!.child);

  // Set current root
  currentRoot = wipRoot;
  wipRoot = undefined;
}

function commitWork(fiber?: Fiber) {
  if (!fiber) return;

  // Get parent dom
  let domParentFiber = fiber.parent!;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent!;
  }

  // Append dom to parent container
  const domParent = domParentFiber.dom;
  if (fiber.effect === EffectTag.PUT && fiber.dom) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effect === EffectTag.UPDATE) {
    updateDom(fiber.dom!, fiber.alternate!.props, fiber.props);
  } else if (fiber.effect === EffectTag.DELETE) {
    commitDeletion(fiber, domParent);
  } else if (fiber.effect === EffectTag.REPLACE && fiber.alternate) {
    commitReplacement(fiber, fiber.alternate, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitReplacement(fiber: Fiber, alternate: Fiber, domParent: Node) {
  if (fiber.dom && alternate.dom) {
    domParent.replaceChild(fiber.dom, alternate.dom);
  } else {
    commitReplacement(
      fiber.dom ? fiber : fiber.child!,
      alternate.dom ? alternate : alternate.child!,
      domParent
    );
  }
}

function commitDeletion(fiber: Fiber, domParent: Node) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child!, domParent);
  }
}

function performUnitOfWork(fiber: Fiber) {
  if (typeof fiber.type === "function") {
    updateFunctionComponent(fiber);
  } else {
    if (fiber.type == BudgetFragment) {
      reconcileChildren(fiber);
    } else {
      updateHostComponent(fiber);
    }
  }

  // Return next unit of work
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber: Fiber | undefined = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function updateFunctionComponent(fiber: Fiber) {
  // Set wipFiber to use inside hooks
  wipFiber = fiber;
  wipFiber.hooks = [];
  wipFiber.hookIndex = 0;

  // Get children from running function
  // @ts-ignore
  fiber.props.children = fiber.type(fiber.props);

  // Create child fibers
  reconcileChildren(fiber);
}

function updateHostComponent(fiber: Fiber) {
  // Create dom element
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // Create child fibers
  reconcileChildren(fiber);
}

function reconcileChildren(fiber: Fiber) {
  // @ts-ignore
  const children: BudgetNode[] = (
    Array.isArray(fiber.props.children)
      ? fiber.props.children
      : [fiber.props.children]
  ).filter((c) => c !== undefined && c !== null);
  let index = 0;
  let alternate = fiber.alternate && fiber.alternate.child;
  let prevSibling: Fiber | undefined;
  while (index < children.length || alternate != null) {
    let newFiber: Fiber | undefined;
    const child = children[index];
    const childType = getNodeType(child);
    const childProps: Props =
      typeof child === "object"
        ? child.props
        : (child && { textContent: child.toString() }) || {};
    const sameType = alternate && child && childType === alternate.type;

    if (sameType && alternate) {
      // Update fiber
      newFiber = {
        type: alternate.type,
        props: childProps,
        dom: alternate.dom,
        parent: fiber,
        alternate,
        effect: EffectTag.UPDATE,
      };
    } else {
      if (child !== undefined) {
        if (alternate) {
          // Replace fiber
          newFiber = {
            type: childType,
            props: childProps,
            parent: fiber,
            effect: EffectTag.REPLACE,
            alternate,
          };
          alternate.child = undefined;
        } else {
          // Add fiber
          newFiber = {
            type: childType,
            props: childProps,
            parent: fiber,
            effect: EffectTag.PUT,
          };
        }
      } else if (alternate) {
        // Delete old fiber
        alternate.effect = EffectTag.DELETE;
        deletions.push(alternate);
      }
    }

    // Set child relationships
    if (index === 0) {
      fiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }

    // Prep for next child
    if (alternate) {
      alternate = alternate.sibling;
    }
    prevSibling = newFiber;
    index++;
  }
}

function updateDom(dom: Node, prevProps: Props, nextProps: Props) {
  // Remove old attributes
  Object.keys(prevProps)
    .filter(isStandardAttribute)
    .filter(isGone(nextProps))
    .forEach((name) => {
      // @ts-ignore
      dom.removeAttribute(name);
    });
  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isStandardAttribute)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // @ts-ignore
      dom[name] = nextProps[name];
    });
}

function createDom(fiber: Fiber): Node {
  // Create text element
  if (fiber.type === BudgetTextNode) {
    return document.createTextNode(fiber.props.textContent || "");
  }

  // Create element/fragment
  const dom = document.createElement(fiber.type as string);

  // Set element attributes
  const props = fiber.props;
  Object.keys(props)
    .filter(isStandardAttribute)
    .forEach((name) => {
      // @ts-ignore
      dom[name] = props[name];
    });

  return dom;
}
