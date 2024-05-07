import Element from "./framework/element.js";
import Card from "./components/card.js";
import Counter from "./components/counter.js";
import SomeComponent from "./stateExample.js";

function App() {
  return new Element(
    null,
    {
      style: "display: flex; flex-direction: column; gap: 8px;",
    },
    [
      new Card(
        { title: "Budget React" },
        { style: "background-color: darkslategrey;" },
        [new Element("p", null, ["Hello World"])]
      ),
      Card({ title: "DevX" }, null, [new Element("p", null, ["So good lol"])]),
      Card(
        {
          title: "Performance",
        },
        null,
        [new Element("p", null, ["Blazingly fast! 😅"])]
      ),
      Card(
        {
          title: "Interactivity",
        },
        null,
        [
          new Element("p", null, ["Very cool"]),
          new Element(
            null,
            {
              style:
                "display: flex; flex-direction: column; align-items: center; gap: 4px;",
            },
            [Counter(), Counter({ increment: 10 })]
          ),
        ]
      ),
    ]
  );
}

export default App;
