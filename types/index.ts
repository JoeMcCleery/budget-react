export type DomContainer = HTMLElement | DocumentFragment;

export type Type = string | FunctionComponent;
export type Key = string | number | bigint;
export type Primitve = string | number | bigint | boolean;
export type Node = BudgetElement | Primitve;
export type Children = Node | Node[] | null | undefined;
export type Props = Record<string, unknown> & {
  children?: Children;
  text?: string;
};
export type Config = Props & { key?: Key };
export type FunctionComponent = (props: Props) => Element;

export interface BudgetElement {
  type: Type;
  props: Props;
  key?: Key;
}

declare global {
  namespace JSX {
    interface Element extends BudgetElement {}

    interface ElementAttributesProperty {
      props: Record<string, unknown>;
    }

    interface ElementChildrenAttribute {
      children: Children;
    }

    interface IntrinsicAttributes {
      // Jsx
      key?: Key;
      className?: string;
      // Standard
      [key: string]: any;
    }

    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes;
    }
  }
}
