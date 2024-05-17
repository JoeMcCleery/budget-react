import type { BudgetElement, Config, Key, Type } from "budget-react";

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
