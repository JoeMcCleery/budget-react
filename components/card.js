import Element from "../framework/element.js";

function Card({ title = "" } = {}, attributes, children = []) {
  return new Element(
    null,
    {
      ...attributes,
      style: [
        "background-color: darkcyan; color: white; padding: 2rem; text-align: center; border-radius: 1rem;",
        attributes?.style,
      ].join(""),
    },
    [new Element("h1", null, [title]), ...children]
  );
}

export default Card;
