import SetupView from "../SetupView.js";

export default class extends SetupView {
  constructor() {
    super();
    this.setTitle("환경설정");
  }
  getViewHtml() {
    return `
    <h1>환경설정 화면</h1
    `;
  }
}
