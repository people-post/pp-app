import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Render } from '../../lib/ui/renders/Render.js';
import { RemoteFile } from '../datatypes/RemoteFile.js';

const _CFT_MEDIA_FILE = {
  IMAGE :
      `<img class="hmax100 wmax100 clickable" src="__URL__" onclick="window.open('__DOWNLOAD_URL__', '_blank')"/>`,
  VIDEO :
      `<video class="hls" playsinline controls manifest-url="__URL__"></video>`,
};

export class FMediaFile extends Fragment {
  #file: RemoteFile | null = null;

  getFile(): RemoteFile | null { return this.#file; }

  setFile(file: RemoteFile | null): void { this.#file = file; }

  _renderOnRender(render: Render): void {
    if (this.#file) {
      this.#renderFile(render, this.#file);
    }
  }

  #renderFile(panel: Render, file: RemoteFile): void {
    let s = "";
    if (file.isImage()) {
      s = _CFT_MEDIA_FILE.IMAGE;
      s = s.replace("__URL__", file.getImageUrl() || "");
      s = s.replace("__DOWNLOAD_URL__", file.getDownloadUrl() || "");
    } else if (file.isVideo()) {
      s = _CFT_MEDIA_FILE.VIDEO;
      s = s.replace("__URL__", file.getVideoManifestUrl() || "");
    }
    panel.replaceContent(s);
  }
}

