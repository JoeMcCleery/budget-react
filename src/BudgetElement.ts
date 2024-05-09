const RESERVED_PROPS = {
  key: true,
  ref: true,
};

type ElementType = string | Function;
type KeyType = string | number;
type PropType = string | number | Function | ChildrenType;
type PropsType = Record<string, PropType>;
type ConfigType = Record<string, PropType>;
type BudgetNode = string | BudgetElement;
type ChildrenType = BudgetNode | BudgetNode[];

export class BudgetElement {
  type: ElementType;
  key: KeyType;
  props: PropsType;

  constructor(type: ElementType, key: KeyType, props: PropsType) {
    this.type = type;
    this.key = key;
    this.props = props;
  }
}

function isKeyType(key: PropType): key is KeyType {
  return typeof key === "string" || typeof key === "number";
}

export function createElement(
  type: ElementType,
  config: ConfigType,
  children: ChildrenType
) {
  // Set key
  let key: KeyType = "";
  if (isKeyType(config.key)) {
    key = config.key;
  }

  // Set props
  const props: PropsType = {};
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
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return new BudgetElement(type, key, props);
}
