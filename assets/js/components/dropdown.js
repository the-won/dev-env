export class DropDown {
  constructor(configuration) {
    //라벨이 없을 경우
    this.emptyLabel = "선택하세요";
    this.currentIndex = -1;

    this.idField = configuration.idField || "id";
    this.labelField = configuration.labelField || "label";
    // 데이터 리스트
    this.data = configuration.data;
    this.dropdownLabel = this.initialize(
      document.querySelector(configuration.selector),
      this.emptyLabel
    );

    // backdrop 영역 element setup
    this.backdrop = this.initializeBackdrop(
      document.querySelector(configuration.selector)
    );
    this.dropdownItem = this.displayDropdownItemList(
      this.backdrop,
      configuration.data
    );
    // event listen
    this.selectDropdownItem();
    this.eventBinding();
  }

  initialize(selector, emptyLabel) {
    const dropdownLabel = document.createElement("label");
    dropdownLabel.classList.add("label");
    dropdownLabel.textContent = emptyLabel;
    selector.appendChild(dropdownLabel);
    return dropdownLabel.parentElement;
  }

  initializeBackdrop(selector) {
    const backdrop = document.createElement("div");
    backdrop.classList.add("menu");
    backdrop.setAttribute("tabindex", "-1");
    backdrop.setAttribute("aria-expanded", "false");
    selector.appendChild(backdrop);
    return backdrop;
  }

  displayDropdownItemList(selector, data) {
    if (!selector) return;
    let render = "";
    data.forEach((_item, index) => {
      render += `
        <div class="item" role="option" tabindex="0">${
          _item[this.labelField]
        }</div>
      `;
    });
    selector.innerHTML = render;
  }

  selectDropdownItem(_index) {
    let index =
      _index != null
        ? _index
        : this.data.findIndex(data => data.selected === true);

    if (index > -1 && index < this.data.length) this.setValue(index);
  }

  eventBinding(selector) {
    document.addEventListener("click", e => {
      if (
        !this.backdrop.contains(e.target) &&
        !this.dropdownLabel.contains(e.target)
      )
        this.toggle(false);
    });

    this.dropdownLabel.addEventListener("keydown", e => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        // enter, space
        this.toggle();
        this.backdrop.children[0].focus();
      } else if (e.keyCode === 27) {
        // escape
        this.toggle(false);
      }
    });

    this.backdrop.addEventListener("keydown", e => {
      if (e.keyCode === 38 && e.target.previousElementSibling) {
        e.target.previousElementSibling.focus();
      } else if (e.keyCode === 40 && e.target.nextElementSibling) {
        e.target.nextElementSibling.focus();
      } else if (e.keyCode === 13 || e.keyCode === 32) {
        const index = [...this.backdrop.children].findIndex(
          (item, index) => item.innerText === e.target.innerText
        );

        this.setValue(index);
      } else if (e.keyCode === 27) {
        this.toggle(false);
      }
    });

    // label 영역 클릭 시 이벤트
    this.dropdownLabel.addEventListener("click", e => {
      this.toggle();
    });

    [...this.backdrop.children].forEach((item, index) => {
      item.addEventListener("click", event => {
        this.setValue(index);
      });
    });
  }

  setValue(index) {
    const currentOption = this.retriveOptionByIndex(index);

    if (this.currentIndex > -1) {
      this.unselectedDropdownItem(this.currentIndex);
    }
    this.currentIndex = index;

    if (this.currentIndex > -1) {
      this.selectedDropdownItem(this.currentIndex);
    }

    this.dispatchEvent(
      {
        id: currentOption[this.idField],
        label: currentOption[this.labelField],
      },
      currentOption
    );
  }

  dispatchEvent(item, currentOption) {
    // 선택된 아이템의 라벨로 변경하고, dropdown item 영역을 화면에서 보이지 않도록 하시오.
    this.dropdownLabel.firstElementChild.innerHTML = item[this.labelField];
    // 외부에 변경된 정보 전달
    const value = {
      id: currentOption[this.idField],
      label: currentOption[this.labelField],
    };

    this.backdrop.dispatchEvent(
      new CustomEvent("dropdown-change", {
        detail: value,
      })
    );
  }

  retriveOptionByIndex(index) {
    const targetOption = this.data[index];
    !targetOption.label ? this.emptyLabel : targetOption.label;
    return targetOption;
  }

  selectedDropdownItem(index) {
    [...this.backdrop.children][index].classList.add("selected");
  }

  unselectedDropdownItem(index) {
    [...this.backdrop.children][index].classList.remove("selected");
  }

  toggle(expand = null) {
    expand =
      expand === null
        ? this.backdrop.getAttribute("aria-expanded") !== "true"
        : expand;

    this.backdrop.setAttribute("aria-expanded", expand);

    if (expand) {
      this.dropdownLabel.classList.add("active");
    } else {
      this.dropdownLabel.classList.remove("active");
    }
  }

  onChange = cb =>
    this.backdrop.addEventListener("dropdown-change", e => cb(e.detail));
}
