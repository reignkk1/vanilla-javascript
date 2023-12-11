import SetupView from "../SetupView.js";

export default class extends SetupView {
  constructor() {
    super();
    this.setTitle("게시물");
  }
  getViewHtml() {
    return `
    <h1>게시물 화면</h1
    `;
  }
}
