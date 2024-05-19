import type { Fiber, BudgetNode, Props } from "budget-react";
import {
  BudgetFragment,
  BudgetTextNode,
  createFragment,
  getNodeType,
} from "budget-react";

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

let currentRoot: Fiber;
export let wipFiber: Fiber;

const deletions: Fiber[] = [];

export function renderLoop(rootFiber?: Fiber) {
  // Get root fiber
  rootFiber = rootFiber || {
    dom: currentRoot.dom,
    props: currentRoot.props,
  };

  // Clear deletions
  deletions.length = 0;

  // Set alternate
  rootFiber.alternate = currentRoot;

  // Generate fiber tree
  let nextUnitOfWork: Fiber | undefined = rootFiber;
  while (nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // Commit work
  commitRoot(rootFiber);
}

function commitRoot(rootFiber: Fiber) {
  // Commit deletions
  deletions.forEach((fiber) => commitWork(fiber));

  // Append dom elements to container
  commitWork(rootFiber.child);

  // Set current root
  currentRoot = rootFiber;
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
        : { textContent: child.toString() };
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
      if (child) {
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
  const dom = document.createElement((fiber.type as string) || "");

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

export function createFiber(
  node: BudgetNode,
  parent: Fiber,
  alternate?: Fiber
): Fiber {
  return typeof node === "object"
    ? {
        type: node.type,
        props: node.props,
        parent,
        alternate,
      }
    : {
        type: BudgetTextNode,
        props: {
          textContent: node.toString(),
        },
        parent,
        alternate,
      };
}
