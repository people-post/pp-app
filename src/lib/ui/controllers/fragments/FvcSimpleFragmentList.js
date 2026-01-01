import { FScrollViewContent } from './FScrollViewContent.js';
import { FSimpleFragmentList } from './FSimpleFragmentList.js';

export class FvcSimpleFragmentList extends FScrollViewContent {
  #fList;

  constructor() {
    super();
    this.#fList = new FSimpleFragmentList();
    this.setChild("main", this.#fList);
  }

  append(fragment) { this.#fList.append(fragment); }

  clear() { this.#fList.clear(); }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};
