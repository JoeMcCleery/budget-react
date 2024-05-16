const RESERVED_PROPS = {
  key: true,
};

export declare namespace Budget {
  const TextNode = "jsx.Text";
  const Fragment = "jsx.Fragment";

  type Type = string | FunctionComponent;
  type Key = string | number;
  type Primitve = string | number | bigint | boolean;
  type Child = Element | Primitve;
  type Node = Child | null | undefined;
  type Children = Node | Node[];
  type Props = Record<string, unknown> & {
    children?: Children;
    key?: Key;
    nodeValue?: string;
  };
  type FunctionComponent = (props: Props) => Element;

  interface Element {
    type: Type;
    props: Props;
    key?: Key;
  }
}

export function createElement(
  type: Budget.Type,
  config: Budget.Props,
  children: Budget.Children
): Budget.Element {
  // Set key
  let key: Budget.Key = config.key || "";

  // Set props
  const props: Budget.Props = {};
  for (const propName in config) {
    if (!RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName];
    }
  }

  // Set children
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    const childArray: Budget.Node[] = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Return new element
  return { type, props, key };
}
