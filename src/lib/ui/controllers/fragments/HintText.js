import { Label } from './Label.js';

export class HintText extends Label {
  constructor(text = "") {
    super(text);
    this.setClassName("hint-text");
  }
}
