import type { Node, DomContainer } from "budget-react";
import { BudgetFragment } from "budget-react";

export function createRoot(container: HTMLElement): Root {
  return new Root(container);
}

const customAttributes = ["children", "key", "props"];

const isStandardAttribute = (key: string) => !customAttributes.includes(key);

class Root {
  container: DomContainer;
  constructor(container: DomContainer) {
    this.container = container;
  }

  render(node: Node, container?: DomContainer) {
    // Get container
    container = container || this.container;

    // Create text element and append to container
    if (typeof node !== "object") {
      const textElement = document.createTextNode(node.toString());
      container.appendChild(textElement);
      return;
    }

    // Create element/fragment
    const element =
      node.type === BudgetFragment
        ? document.createDocumentFragment()
        : document.createElement(node.type as string);

    // Set element attributes
    const props = node.props;
    Object.keys(props)
      .filter(isStandardAttribute)
      .forEach((name) => {
        // @ts-ignore
        element[name] = props[name];
      });

    // Create children
    if (node.props.children) {
      if (Array.isArray(node.props.children)) {
        node.props.children.forEach((node) => this.render(node, element));
      } else {
        this.render(node.props.children, element);
      }
    }

    // Append to container
    container.appendChild(element);
  }
}
