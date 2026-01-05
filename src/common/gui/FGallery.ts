import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import Render from '../../lib/ui/renders/Render.js';
import { FMediaFile } from './FMediaFile.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import { T_DATA } from '../plt/Events.js';
import { RemoteFile } from '../datatypes/RemoteFile.js';
import { Env } from '../plt/Env.js';
import { Api } from '../plt/Api.js';

export const CF_GALLERY = {
  PREV_IMAGE_SLIDE : Symbol(),
  NEXT_IMAGE_SLIDE : Symbol(),
  SHOW_IMAGE_SLIDE : Symbol(),
  ON_SCROLL : Symbol(),
};

const _CFT_GALLERY = {
  PREPROC :
      `<div class="info-message">Preprocessing files, please wait...__PROGRESS__</div>`,
  SLIDE_SHOW : `<div class="center-align h100">
      <div id="__ID_SLIDES__" class="h100 relative x-scroll x-scroll-snap no-wrap flex flex-start" onscroll="javascript:G.action(gui.CF_GALLERY.ON_SCROLL, this)">
      </div>
      <div class="slide-show-nav slide-show-prev" onclick="javascript:G.action(gui.CF_GALLERY.PREV_IMAGE_SLIDE)">&#10094;</div>
      <div class="slide-show-nav slide-show-next" onclick="javascript:G.action(gui.CF_GALLERY.NEXT_IMAGE_SLIDE)">&#10095;</div>
      <div id="__ID_DOTS__" class="absolute w100 bottom0px center-align"></div>
    </div>`,
  SLIDE_SHOW_SLIDE : `<div id="__ID_LABEL__" class="slide-show-label"></div>
    <div id="__ID_IMAGE__" class="s-photo bgblack h100"></div>`
};

class PSlide extends Panel {
  #pLabel: Panel;
  #pImage: PanelWrapper;

  constructor() {
    super();
    this.#pLabel = new Panel();
    this.#pImage = new PanelWrapper();
  }

  getLabelPanel(): Panel { return this.#pLabel; }
  getImagePanel(): PanelWrapper { return this.#pImage; }

  _renderFramework(): string {
    let s = _CFT_GALLERY.SLIDE_SHOW_SLIDE;
    s = s.replace("__ID_LABEL__", this._getSubElementId("L"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pLabel.attach(this._getSubElementId("L"));
    this.#pImage.attach(this._getSubElementId("I"));
  }
}

class PGallery extends Panel {
  #pSlides: ListPanel;
  #pDots: ListPanel;

  constructor() {
    super();
    this.#pSlides = new ListPanel();
    this.#pDots = new ListPanel();
  }

  getSlidesPanel(): ListPanel { return this.#pSlides; }
  getDotsPanel(): ListPanel { return this.#pDots; }

  _renderFramework(): string {
    let s = _CFT_GALLERY.SLIDE_SHOW;
    s = s.replace("__ID_SLIDES__", this._getSubElementId("S"));
    s = s.replace("__ID_DOTS__", this._getSubElementId("D"));
    return s;
  }

  _onFrameworkDidAppear(): void {
    super._onFrameworkDidAppear();
    this.#pSlides.attach(this._getSubElementId("S"));
    this.#pDots.attach(this._getSubElementId("D"));
  }
}

interface FileInfo {
  id: string;
  state: string;
  status: string;
  progress: number;
}

interface FileStatusResponse {
  files: FileInfo[];
}

declare const Hls: {
  isSupported(): boolean;
  Events: {
    ERROR: string;
  };
  ErrorTypes: {
    NETWORK_ERROR: string;
    MEDIA_ERROR: string;
  };
  new(): {
    on(event: string, callback: (evt: unknown, data: unknown) => void): void;
    loadSource(url: string): void;
    attachMedia(element: HTMLVideoElement): void;
    startLoad(): void;
    recoverMediaError(): void;
    destroy(): void;
  };
};

export class FGallery extends Fragment {
  #slideIndex = 0;
  #scrollTimeoutAction: number | null = null;
  #fFiles: FMediaFile[] = [];
  #pendingFiles: RemoteFile[] = [];
  #statusChecker: CronJob;
  #pGallery: PGallery | null = null;

  constructor() {
    super();
    this.#statusChecker = new CronJob();
  }

  isLivestreaming(): boolean {
    return this.#fFiles.some(
        f => {const file = f.getFile(); return file ? file.isVideo() && file.isLivestreaming() : false;});
  }

  setFiles(files: RemoteFile[] | null): void {
    this.#fFiles = [];
    if (files) {
      for (const file of files) {
        const f = new FMediaFile();
        f.setFile(file);
        this.#fFiles.push(f);
      }
    }
  }

  setSelection(idx: number): void {
    if (this.#fFiles.length > idx) {
      this.#slideIndex = idx;
    }
  }

  action(type: symbol, ...args: unknown[]): void {
    // eslint-disable-next-line prefer-rest-params
    switch (type) {
    case CF_GALLERY.NEXT_IMAGE_SLIDE:
      this.#switchToNextSlide();
      break;
    case CF_GALLERY.PREV_IMAGE_SLIDE:
      this.#switchToPrevSlide();
      break;
    case CF_GALLERY.SHOW_IMAGE_SLIDE:
      this.#switchToSlide(args[0] as number);
      break;
    case CF_GALLERY.ON_SCROLL:
      this.#onScroll(args[0] as HTMLElement);
      break;
    default:
      super.action(type, ...args);
      break;
    }
  }

  handleSessionDataUpdate(dataType: symbol, data: unknown): void {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == Env.SCRIPT.PLAYER.id) {
        this.#assignVideoPlayers();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate(dataType, data);
  }

  _renderOnRender(render: Render): void {
    if (this.#fFiles.length < 1) {
      return;
    }

    this.#pendingFiles =
        this.#getPendingFiles(this.#fFiles.map(f => f.getFile()).filter((f): f is RemoteFile => f !== null));
    if (this.#pendingFiles.length > 0) {
      this.#initStatusChecker();
      this.#renderPreprocProgress(render);
      return;
    }

    if (this.#fFiles.length > 1) {
      const p = new PGallery();
      if ('wrapPanel' in render) {
        (render as any).wrapPanel(p);
      }
      this.#pGallery = p;
      this.#renderSlideShow(p, this.#fFiles);
      this.#switchToSlide(this.#slideIndex);
    } else {
      const p = new PanelWrapper();
      p.setClassName("media-frame");
      if ('wrapPanel' in render) {
        (render as any).wrapPanel(p);
      }
      const f = this.#fFiles[0];
      f.attachRender(p);
      f.render();
    }
    this.#assignVideoPlayers();
  }

  _onBeforeRenderDetach(): void {
    this.#statusChecker.stop();
    super._onBeforeRenderDetach();
  }

  #getPendingFiles(files: RemoteFile[]): RemoteFile[] { return files.filter(f => f.isPending()); }
  #hasVideo(fFiles: FMediaFile[]): boolean { return fFiles.some(f => {const file = f.getFile(); return file ? file.isVideo() : false;}); }

  #initStatusChecker(): void {
    if (!this.#statusChecker.isSet()) {
      this.#statusChecker.reset(() => this.#asyncCheckStatus(), 3000, null, null);
    }
  }

  #switchToNextSlide(): void { this.#switchToSlide(this.#slideIndex + 1); }
  #switchToPrevSlide(): void { this.#switchToSlide(this.#slideIndex - 1); }
  #switchToSlide(index: number): void {
    const eSlides = this.#getSlideShowContainerElement();
    if (!eSlides) {
      return;
    }

    // Normalize index
    const elements = eSlides.getElementsByClassName("slide-show-slide");
    if (index < 0) {
      this.#slideIndex = elements.length - 1;
    } else if (index >= elements.length) {
      this.#slideIndex = 0;
    } else {
      this.#slideIndex = index;
    }

    // Scroll
    const xNew = eSlides.offsetWidth * this.#slideIndex;
    const firstChild = eSlides.firstElementChild as HTMLElement | null;
    if (firstChild && 'scrollTo' in firstChild) {
      (firstChild as { scrollTo(options: { left: number; behavior: string }): void }).scrollTo({left : xNew, behavior : "smooth"});
    }

    this.#updateDots();
  }

  #getSlideShowContainerElement(): HTMLElement | null {
    const domEl = this.#pGallery?.getDomElement();
    return domEl ? (domEl.firstElementChild as HTMLElement) : null;
  }

  #renderPreprocProgress(panel: Render): void {
    const items: string[] = [];
    for (const f of this.#pendingFiles) {
      const p = f.getProgress();
      if (p) {
        items.push(p + "%");
      }
    }
    let s = _CFT_GALLERY.PREPROC;
    s = s.replace("__PROGRESS__", items.join(" "));
    panel.replaceContent(s);
  }

  #updateDots(): void {
    const eSlides = this.#getSlideShowContainerElement();
    if (!eSlides) {
      return;
    }
    const elements = Array.from(eSlides.getElementsByClassName("slide-show-dot"));
    for (const [i, e] of elements.entries()) {
      if (i == this.#slideIndex) {
        e.className = (e.className as string).replace("s-csecondarybg", "s-cfuncbg");
      } else {
        e.className = (e.className as string).replace("s-cfuncbg", "s-csecondarybg");
      }
    }
  }

  #assignVideoPlayers(): void {
    if (this.#statusChecker.isSet()) {
      return;
    }
    if (this.#hasVideo(this.#fFiles) &&
        Env.isScriptLoaded(Env.SCRIPT.PLAYER.id)) {
      const render = this.getRender();
      const e = render ? render.getDomElement() : null;
      if (e) {
        this.#initVideos(e.getElementsByTagName("video"));
      }
    }
  }

  #initVideos(elements: HTMLCollectionOf<HTMLVideoElement>): void {
    for (const e of elements) {
      const url = e.getAttribute("manifest-url");
      if (url) {
        if (Hls.isSupported()) {
          const player = new Hls();
          player.on(Hls.Events.ERROR, (evt, d) => this.#handleHlsError(evt, d));
          player.loadSource(url);
          player.attachMedia(e);
        } else if (e.canPlayType('application/vnd.apple.mpegurl')) {
          e.src = url;
          e.removeAttribute("manifest-url");
        }
      }
    }
  }

  #handleHlsError(_evt: unknown, data: unknown): void {
    const d = data as { fatal?: boolean; type?: string };
    if (d.fatal) {
      switch (d.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.log("Hls network error, trying to reload.");
        // Note: hls variable not available, this might need fixing
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.log("Hls media error, trying to recover.");
        // Note: hls variable not available, this might need fixing
        break;
      default:
        // Note: hls variable not available, this might need fixing
        break;
      }
    }
  }

  #renderSlideShow(pGallery: PGallery, fFiles: FMediaFile[]): void {
    const pSlides = pGallery.getSlidesPanel();
    const pDots = pGallery.getDotsPanel();

    for (const [i, fFile] of fFiles.entries()) {
      const p = new PSlide();
      p.setClassName("slide-show-slide scroll-snap-start w100 flex-noshrink");
      pSlides.pushPanel(p);
      let pp = p.getLabelPanel();
      pp.replaceContent((i + 1).toString() + " / " + fFiles.length);
      pp = p.getImagePanel();
      fFile.attachRender(pp);
      fFile.render();

      const pDot = new Panel();
      pDot.setAttribute("onclick",
                     "javascript:G.action(gui.CF_GALLERY.SHOW_IMAGE_SLIDE, " +
                         i + ")");
      let className = "slide-show-dot";
      if (i == 0) {
        className += " s-cfuncbg";
      } else {
        className += " s-csecondarybg";
      }
      pDot.setClassName(className);
      pDots.pushPanel(pDot);
    }
  }

  #asyncCheckStatus(): void {
    const url = "api/user/file_infos";
    const fd = new FormData();
    for (const f of this.#pendingFiles) {
      const id = (f as { getId?(): string | undefined }).getId?.();
      if (id) {
        fd.append("ids", id);
      }
    }
    Api.asFragmentPost(this, url, fd)
        .then((d: unknown) => this.#onFileStatusRRR(d as FileStatusResponse));
  }

  #onFileStatusRRR(data: FileStatusResponse): void {
    const infoMap = new Map<string, FileInfo>();
    for (const f of data.files) {
      infoMap.set(f.id, f);
    }
    for (const f of this.#pendingFiles) {
      const id = (f as { getId?(): string | undefined }).getId?.();
      if (id) {
        const nf = infoMap.get(id);
        if (nf) {
          f.setState(nf.state);
          f.setStatus(nf.status);
          f.setProgress(nf.progress);
        }
      }
    }
    this.#pendingFiles = this.#getPendingFiles(this.#pendingFiles);
    if (this.#pendingFiles.length == 0) {
      this.#statusChecker.stop();
      this.render();
    } else {
      //  Can be reduced to only update progress
      this.render();
    }
  }

  #onScroll(e: HTMLElement): void {
    if (this.#scrollTimeoutAction !== null) {
      window.clearTimeout(this.#scrollTimeoutAction);
    }
    this.#scrollTimeoutAction =
        window.setTimeout(() => this.#onScrollFinished(e), 100);
  }

  #onScrollFinished(e: HTMLElement): void {
    const parent = e.parentElement;
    if (!parent) {
      return;
    }
    const w = parent.offsetWidth;
    const x = e.scrollLeft;
    this.#slideIndex = Math.floor(x / w + 0.5);
    this.#updateDots();
  }
}

