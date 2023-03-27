export class BaseComponent {
  constructor(htmlString) {
    const template = document.createElement("template");
    template.innerHTML = htmlString;
    this.element = template.content.firstElementChild;
  }

  attachTo(parent, position = "beforeend") {
    parent.insertAdjacentElement(position, this.element);
  }

  removeFrom(parent) {
    if (parent !== this.element.parentElement) {
      throw Error("This is parent mismatching");
    }

    parent.removeChild(this.element);
  }
}
  