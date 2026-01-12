import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import Render from '../../lib/ui/renders/Render.js';

export const CF_ICON_UPLOADER = {
  ON_ICON_CHANGE : "CF_ICON_UPLOADER_1",
};

const _CFT_ICON_UPLOADER = {
  MAIN : `
    <div class="profile-icon inline-block s-icon1 s-cprimebg">
       <img class="photo" src="__SRC__" alt="Icon" onclick="javascript:this.nextElementSibling.click()">
       <input type="file" accept="image/*" style="display:none" onchange="javascript:G.action('${CF_ICON_UPLOADER.ON_ICON_CHANGE}', this.files[0])">
    </div>`,
};

export class FIconUploader extends Fragment {
  #iconUrl: string | null = null;
  
  setIconUrl(url: string | null): void { this.#iconUrl = url; }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_ICON_UPLOADER.ON_ICON_CHANGE:
      (this._delegate as { onIconUploaderFragmentRequestUpdateIcon(f: FIconUploader, file: File): void }).onIconUploaderFragmentRequestUpdateIcon(this, args[0] as File);
      break;
    default:
      super.action.apply(this, Array.from(arguments) as any);
      break;
    }
  }

  _renderOnRender(render: Render): void {
    let s = _CFT_ICON_UPLOADER.MAIN;
    s = s.replace("__SRC__", this.#iconUrl ? this.#iconUrl : "");
    render.replaceContent(s);
  }
}

