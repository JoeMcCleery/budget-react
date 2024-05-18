import type { Fiber } from "budget-react";

export function getOldHook<T extends object>(fiber: Fiber) {
  return (
    fiber.alternate &&
    fiber.alternate.hooks &&
    (fiber.alternate.hooks[fiber.hookIndex!] as T)
  );
}

export * from "./UseEffect";
export * from "./UseState";
