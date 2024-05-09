import useState from "../framework/useState.js";
import BudgetElement from "../framework/budgetElement.js";

function Counter({ increment = 1 } = {}, attributes, children = []) {
  const [count, setCount] = useState(0);

  return new BudgetElement(
    "button",
    {
      ...attributes,
      style: [
        "color: white; padding: 1rem; background-color: darkslategrey; border: none; border-radius: 1rem; cursor: pointer;",
        attributes?.style,
      ].join(""),
      onclick: () => setCount(count + increment),
    },
    [`Click me! ${count}`, ...children]
  );
}

export default Counter;
