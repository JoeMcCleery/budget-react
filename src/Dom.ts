import { Fragment } from "../jsx-runtime";
import { Budget } from "./Element";

export function createRoot(container: HTMLElement): Root {
  return new Root(container);
}

export type DomContainer = HTMLElement | DocumentFragment;

const customAttributes = ["children", "key", "props"];

const isStandardAttribute = (key: string) => !customAttributes.includes(key);

class Root {
  container: DomContainer;
  constructor(container: DomContainer) {
    this.container = container;
  }

  render(node: Budget.Node, container?: DomContainer) {
    if (!node) return;

    // Get container
    container = container || this.container;

    // Create text element and append to container
    if (typeof node !== "object") {
      const textElement = document.createTextNode(node.toString());
      container.appendChild(textElement);
      return;
    }

    // Create element
    const element =
      node.type === Fragment
        ? document.createDocumentFragment()
        : document.createElement(node.type as string);

    // Set element attributes
    if (node.type !== Fragment) {
      const props = node.props;
      const propKeys = Object.keys(props);
      propKeys.filter(isStandardAttribute).forEach((name) => {
        // @ts-ignore
        element[name.toLowerCase()] = props[name];
      });
    }

    // Create children
    if (Array.isArray(node.props.children)) {
      node.props.children.forEach((child: Budget.Node) =>
        this.render(child, element)
      );
    } else if (node.props.children) {
      this.render(node.props.children, element);
    }

    // Append to container
    container.appendChild(element);
  }
}
