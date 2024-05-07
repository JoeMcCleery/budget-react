# budget-react

A bad react clone

## Usage

All important files in ./framework folder

./app.js

```js
// ./app.js
import Element from "./framework/element.js";

// Entry point for your app, do whatever you want but must return an Element.
function App() {
  return new Element("h1", { style: "font-size: 5rem;" }, ["Hello World"]);
}

export default App;
```

./index.js

```js
// ./index.js
import BudgetReact from "./framework/budgetReact.js";
import App from "./app.js";

const mount = document.getElementById("app");
const root = App;
new BudgetReact(mount, root).init();
```

useState example

```js
// ./stateExample.js
import useState from "./framework/useState.js";
import Element from "./framework/element.js";

function SomeComponent() {
  const [state, setState] = useState(0);

  return new Element("button", { onclick: (e) => setState(state + 1) }, [
    state,
  ]);
}

export default SomeComponent;
```
