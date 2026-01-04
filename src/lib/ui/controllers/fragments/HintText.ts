import { Label } from './Label.js';

export class HintText extends Label {
  constructor(text: string = "") {
    super(text);
    this.setClassName("hint-text");
  }
}

