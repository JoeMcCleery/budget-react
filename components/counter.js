import useState from "../framework/useState.js";
import Button from "./button.js";

function Counter() {
  const [count, setCount] = useState(0);

  return Button({
    style:
      "color: white; padding: 1rem; background-color: darkslategrey; border: none; border-radius: 1rem; cursor: pointer;",
    children: [`Click me! ${count}`],
    onClick: () => setCount(count + 1),
  });
}

export default Counter;
