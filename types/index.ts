import { EffectTag, Fragment } from "budget-react";

export type DomContainer = HTMLElement | Fragment;
export type FiberDom = DomContainer | Text;

export type Type = string | FunctionComponent;
export type Key = string | number | bigint;
export type Primitve = string | number | bigint | boolean;
export type BudgetNode = BudgetElement | Primitve;
export type Children = BudgetNode | BudgetNode[] | null | undefined;
export type Props = Record<string, unknown> & {
  children?: Children;
  textContent?: string;
};
export type Config = Props & { key?: Key };
export type FunctionComponent = (props: Props) => Element;

export interface BudgetElement {
  type: Type;
  props: Props;
  key?: Key;
}

export interface Fiber {
  type?: Type;
  props: Props;
  key?: Key;
  dom?: FiberDom;
  parent?: Fiber;
  child?: Fiber;
  sibling?: Fiber;
  alternate?: Fiber;
  effect?: EffectTag;
  hooks?: object[];
  hookIndex?: number;
}

export interface UseStateHook<T> {
  state: T;
  actions: SetStateAction<T>[];
}

export type SetStateAction<T> = (current: T) => T;

export interface UseEffectHook {
  action: UseEffectAction;
  deps: any[];
  destructor?: Function;
}

export type UseEffectAction = () => Function | void;

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
