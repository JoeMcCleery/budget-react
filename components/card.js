import BudgetElement from "../framework/budgetElement.js";

function Card({ title = "" } = {}, attributes, children = []) {
  return new BudgetElement(
    null,
    {
      ...attributes,
      style: [
        "background-color: darkcyan; color: white; padding: 2rem; text-align: center; border-radius: 1rem;",
        attributes?.style,
      ].join(""),
    },
    [new BudgetElement("h1", null, [title]), ...children]
  );
}

export default Card;
