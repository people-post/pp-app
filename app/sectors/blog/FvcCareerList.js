import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FCareerList } from './FCareerList.js';

export class FvcCareerList extends FScrollViewContent {
  #fList;

  constructor() {
    super();
    this.#fList = new FCareerList();
    this.setChild("list", this.#fList);
  }

  _renderContentOnRender(render) {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.blog = window.blog || {};
  window.blog.FvcCareerList = FvcCareerList;
}
