import type {
  BudgetElement,
  Config,
  Key,
  Type,
  BudgetNode,
  Props,
} from "budget-react";

export const BudgetFragment = "Budget.Fragment";
export const BudgetTextNode = "Budget.TextNode";

export function createElement(type: Type, props: Config): BudgetElement {
  // Set key
  let key: Key = props.key || "";

  // Remove key from props
  delete props.key;

  // Return new element
  return { type, props, key };
}

export function getNodeType(node: BudgetNode): Type {
  return typeof node === "object" ? node.type : BudgetTextNode;
}

export function createFragment(props: Props): BudgetElement {
  return {
    type: BudgetFragment,
    props,
  };
}
