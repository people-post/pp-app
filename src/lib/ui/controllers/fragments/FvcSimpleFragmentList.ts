import { FScrollViewContent } from './FScrollViewContent.js';
import { FSimpleFragmentList } from './FSimpleFragmentList.js';
import { Fragment } from './Fragment.js';

export class FvcSimpleFragmentList extends FScrollViewContent {
  #fList: FSimpleFragmentList;

  constructor() {
    super();
    this.#fList = new FSimpleFragmentList();
    this.setChild("main", this.#fList);
  }

  append(fragment: Fragment): void { this.#fList.append(fragment); }

  clear(): void { this.#fList.clear(); }

  _renderContentOnRender(render: any): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
}

