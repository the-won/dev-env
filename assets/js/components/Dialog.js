import { BaseComponent } from "./BaseComponent.js";

// export class DialogFrame extends BaseComponent {
//   constructor() {
//     super(`<div class="dialog"></div>`);
//   }

//   addChild(instance) {
//     instance.attachTo(this.element);
//   }

//   removeAllChild() {
//     this.element.replaceChildren();
//   }
// }

export class DialogContent extends BaseComponent {
  constructor(string) {
    super(string);
  }

  appendChild(item, selector = ".dialog-content") {
    this.attachTo(item.element.querySelector(selector));
  }
}

export class Dialog extends BaseComponent {
  constructor(options = {}) {
    options = {
      title: "Dialog",
      submitLabel: "Submit",
      cancelLabel: "Cancle",
      allowClickOut: true,
      ...options,
    };

    super(`
      <div class="dialog">
        <div class="dialog-container" tabindex="0" role="dialog" aria-label="${
          options.title
        }">
        ${
          options.title
            ? `
          <div class="dialog-header">
            <h3>${options.title}</h3>
          </div>
          `
            : ""
        }
        <div class="dialog-content">
        
        </div>
        <div class="dialog-footer">
          <button type="button" class="cancel-btn">${
            options.cancelLabel || "Cancel"
          }</button>
          ${
            options.submitLabel
              ? `<button type="button" class="submit-btn">${options.submitLabel}</button>`
              : ""
          }
          </div>
        </div>
      </div>
    `);

    this.data = {};

    this.eventBinding(options);
  }

  eventBinding(options) {
    if (options.allowClickOut) {
      document.addEventListener("click", e =>
        this.handleClickOut(e, this.element)
      );
    }

    this.element.querySelector(".cancel-btn").addEventListener("click", () => {
      this.close();
      this.element.dispatchEvent(new Event("dialog-cancel"));
    });

    if (this.element.querySelector(".submit-btn")) {
      this.element
        .querySelector(".submit-btn")
        .addEventListener("click", () => {
          this.close();
          this.element.dispatchEvent(new Event("dialog-submit"));
        });
    }
  }

  updateData = (key, value) => {
    this.data[key] = value;
  };

  handleClickOut(e, dialogElement) {
    if (e.target === dialogElement) this.close();
  }

  open() {
    this.attachTo(document.body);
  }

  close() {
    this.removeFrom(document.body);
    document.removeEventListener("click", this.handleClickOut);
    this.element.dispatchEvent(new Event("dialog-close"));
  }

  onClose = cb => {
    this.element.addEventListener("dialog-close", cb);
  };

  onCancel = cb => {
    this.element.addEventListener("dialog-cancel", cb);
  };

  onSubmit = cb => {
    this.element.addEventListener("dialog-submit", () => cb(this.data));
  };
}

export class InputDialog extends Dialog {
  constructor(initialValue = "", options = { submitLabel: "SAVE" }) {
    super(
      `<input type="text" class="input-field" value="${initialValue}">`,
      options
    );

    const inputElement = this.element.querySelector(".input-field");
    inputElement.addEventListener("input", e => {
      this.updateData("value", e.target.value);
    });

    this.onClose(() => {
      inputElement.value = "";
    });
  }
}

export class ConfirmDialog extends Dialog {
  constructor(description, options = { title: "Confirm" }) {
    super(`<p>${description}</p>`, { ...options, allowClickOut: false });
  }
}
