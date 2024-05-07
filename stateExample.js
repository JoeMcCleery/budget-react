import useState from "./framework/useState.js";
import Element from "./framework/element.js";

function SomeComponent() {
  const [state, setState] = useState(0);

  return new Element("button", { onclick: (e) => setState(state + 1) }, [
    state,
  ]);
}

export default SomeComponent;
