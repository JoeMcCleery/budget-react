class Element {
  constructor(tag, props) {
    this.tag = tag || "div";
    this.props = props || {};
  }

  render() {
    const tag = this.tag;
    const { style, classList, children, onClick } = this.props;

    const element = document.createElement(tag);
    if (style) element.style = style;
    if (classList) element.classList = classList;
    if (onClick) element.addEventListener("click", (e) => onClick(e));

    children?.forEach((e) => {
      element.append(e.render ? e.render() : e);
    });

    return element;
  }
}

export default Element;
