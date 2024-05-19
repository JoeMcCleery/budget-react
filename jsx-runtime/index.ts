import type { Key, Props, Type } from "budget-react";
import { createElement, BudgetFragment } from "budget-react";

export function jsx(type: Type, props: Props, key?: Key) {
  props.key = key;
  return createElement(type, props);
}

export const Fragment = BudgetFragment;

export const jsxs = jsx;
