import type { BudgetNode, DomContainer, Fiber } from "budget-react";
import { renderLoop } from "budget-react";

export function createRoot(container: HTMLElement): Root {
  return new Root(container);
}

class Root {
  container: DomContainer;
  constructor(container: DomContainer) {
    this.container = container;
  }

  render(node: BudgetNode) {
    // Create root fiber
    const fiber: Fiber = {
      dom: this.container,
      props: {
        children: node,
      },
    };

    // Start rendering
    renderLoop(fiber);
  }
}
