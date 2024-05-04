import Element from "./framework/element.js";
import Card from "./components/card.js";
import P from "./components/p.js";
import Counter from "./components/counter.js";

function App() {
  return new Element(null, {
    style: "display: flex; flex-direction: column; gap: 8px;",
    children: [
      new Element(),
      Card({ title: "Budget React", children: [P({ text: "Hello World" })] }),
      Card({ title: "DevX", children: [P({ text: "So good lol" })] }),
      Card({
        title: "Performance",
        children: [P({ text: "Blazingly fast! 😅" })],
      }),
      Card({
        title: "Interactivity",
        children: [
          P({ text: "Very cool" }),
          new Element(null, {
            style:
              "display: flex; flex-direction: column; align-items: center; gap: 4px;",
            children: [Counter(), Counter()],
          }),
        ],
      }),
    ],
  });
}

export default App;
