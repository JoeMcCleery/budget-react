# budget-react

A bad react clone

## Usage

All important files in ./framework folder

./app.js

```js
// ./app.js
import BudgetElement from "./framework/budgetElement.js";

// Entry point for your app, do whatever you want but must return an Element or string.
function App() {
  return new BudgetElement("h1", { style: "font-size: 5rem;" }, [
    "Hello World",
  ]);
}

export default App;
```

./index.js

```js
// ./index.js
import BudgetReact from "./framework/budgetReact.js";
import App from "./app.js";

const container = document.getElementById("app");
new BudgetReact().render(App, container);
```

useState example

```js
// ./stateExample.js
import useState from "./framework/useState.js";
import BudgetElement from "./framework/budgetElement.js";

function SomeComponent() {
  const [state, setState] = useState(0);

  return new BudgetElement("button", { onclick: (e) => setState(state + 1) }, [
    state,
  ]);
}

export default SomeComponent;
```
