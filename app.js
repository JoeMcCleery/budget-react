import BudgetElement from "./framework/budgetElement.js";
import Card from "./components/card.js";
import Counter from "./components/counter.js";

function App() {
  return new BudgetElement(
    null,
    {
      style: "display: flex; flex-direction: column; gap: 8px;",
    },
    [
      new Card(
        { title: "Budget React" },
        { style: "background-color: darkslategrey;" },
        [new BudgetElement("p", null, ["Hello World"])]
      ),
      Card({ title: "DevX" }, null, [
        new BudgetElement("p", null, ["So good lol"]),
      ]),
      Card(
        {
          title: "Performance",
        },
        null,
        [new BudgetElement("p", null, ["Blazingly fast! 😅"])]
      ),
      Card(
        {
          title: "Interactivity",
        },
        null,
        [
          new BudgetElement("p", null, ["Very cool"]),
          new BudgetElement(
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
