export class BlogPost extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({
      mode: "open",
      delegatesFocus: true,
    });
    this.render();
  }

  connectedCallback() {
    console.log("mouted");
    //this.render();
  }

  disconnectedCallback() {
    console.log("unmouted");
  }

  static get observedAttributes() {
    return ["title", "description", "link"];
  }

  set data(value) {
    console.log("===", value);
    this.titleElement.textContent =
      value.title || this.titleElement.textContent;
    this.descriptionElement.textContent =
      value.description || this.descriptionElement.textContent;
    this.linkElement.setAttribute("href", value.link || this.linkElement.href);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log("atrributeChangedCallback");
    switch (name) {
      case "title":
        this.titleElement.textContent = newVal || "";
        break;
      case "description":
        this.descriptionElement.textContent = newVal || "";
        break;
      case "link":
        this.linkElement.setAttribute("href", newVal || "");
        break;
    }

    //this.render(); // 속성이 변경되 었을 경우 dom이 재 렌더링 되어야. 하지만 그럴경우 render함수 전체가 재 렌더링 되는 비용 발생
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div class="blog-post">
        <h2></h2>
        <p class="desc">
          
        </p>
        <a href="">learn more</a>
      </div>
    `;

    // 전체 렌더링의 문제를 해결하기 위해 사용자 지정 요소 콘텐츠를 간단하고 작게 유지하기 위해 렌더링 후 제목 설명, 링크요소에 대한 참조를 가져오자
    this.titleElement = this.shadowRoot.querySelector("h2");
    this.descriptionElement = this.shadowRoot.querySelector(".desc");
    this.linkElement = this.shadowRoot.querySelector("a");
  }
}
