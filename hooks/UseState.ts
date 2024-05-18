import type { SetStateAction, UseStateHook } from "budget-react";
import { getOldHook, renderLoop, wipFiber } from "budget-react";

export function useState<T>(initalValue: T) {
  // Get old hook
  const oldHook = getOldHook<UseStateHook<T>>(wipFiber);

  // Init hook
  const hook: UseStateHook<T> = {
    state: oldHook ? oldHook.state : initalValue,
    actions: [],
  };

  // Update hook
  const actions = oldHook ? oldHook.actions : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  // Set state
  const setState = (action: SetStateAction<T>) => {
    hook.actions.push(action);
    window.requestIdleCallback(() => renderLoop());
  };

  // Update fiber
  wipFiber.hooks!.push(hook);
  wipFiber.hookIndex!++;

  return [hook.state, setState] as const;
}
