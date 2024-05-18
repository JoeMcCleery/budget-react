import type { UseEffectAction, UseEffectHook } from "budget-react";
import { wipFiber, getOldHook } from "budget-react";

export function useEffect(action: UseEffectAction, deps: any[]) {
  // Get old hook
  const oldHook = getOldHook<UseEffectHook>(wipFiber);

  // Init hook
  const hook: UseEffectHook = {
    action,
    deps,
  };

  // Update hook
  if (!oldHook || oldHook.deps.some((dep, i) => dep !== hook.deps[i])) {
    hook.destructor = hook.action()!;
  }

  // Update fiber
  wipFiber.hooks!.push(hook);
  wipFiber.hookIndex!++;
}
