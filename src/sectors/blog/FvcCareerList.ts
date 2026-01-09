import { FScrollViewContent } from '../../lib/ui/controllers/fragments/FScrollViewContent.js';
import { FCareerList } from './FCareerList.js';
import type Render from '../../lib/ui/renders/Render.js';

export class FvcCareerList extends FScrollViewContent {
  #fList: FCareerList;

  constructor() {
    super();
    this.#fList = new FCareerList();
    this.setChild("list", this.#fList);
  }

  _renderContentOnRender(render: Render): void {
    this.#fList.attachRender(render);
    this.#fList.render();
  }
}
