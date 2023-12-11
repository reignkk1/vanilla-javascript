import SetupView from "../SetupView.js";

export default class extends SetupView {
  constructor() {
    super();
    this.setTitle("홈");
  }
  getViewHtml() {
    return `
    <h1>홈 화면</h1
    `;
  }
}
