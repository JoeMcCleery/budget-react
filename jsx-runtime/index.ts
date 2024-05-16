import { Budget, createElement } from "../src/Element";

declare global {
  namespace JSX {
    interface Element extends Budget.Element {}

    interface ElementAttributesProperty {
      props: Record<string, unknown>;
    }

    interface ElementChildrenAttribute {
      children: Budget.Children;
    }

    interface IntrinsicAttributes {
      // Jsx
      key?: Budget.Key;
      className?: string;
      // Standard
      [key: string]: any;
    }

    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes;
    }
  }
}

export const Fragment = Budget.Fragment;

export function jsx(
  type: Budget.Type,
  props: Budget.Props,
  key?: Budget.Key
): JSX.Element {
  switch (typeof type) {
    case "function":
      // Function component
      return type(props);
    default:
      // Jsx
      return createElement(type, props, props.children);
  }
}

export const jsxs = jsx;
export const jsxDEV = jsx;
