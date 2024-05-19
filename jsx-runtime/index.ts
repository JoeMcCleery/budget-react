import type { Key, Props, Type } from "budget-react";
import { BudgetFragment, createElement, createFragment } from "budget-react";

export function jsx(type: Type, props: Props, key?: Key) {
  props.key = key;
  return createElement(type, props);
}

export const Fragment = createFragment;

export const jsxs = jsx;
