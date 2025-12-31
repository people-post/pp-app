import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Panel } from '../../lib/ui/renders/panels/Panel.js';
import { PanelWrapper } from '../../lib/ui/renders/panels/PanelWrapper.js';
import { ListPanel } from '../../lib/ui/renders/panels/ListPanel.js';
import { FMediaFile } from './FMediaFile.js';
import { CronJob } from '../../lib/ext/CronJob.js';
import { SimpleProgress } from '../../lib/ui/controllers/fragments/SimpleProgress.js';
import { T_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';

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
  #pLabel;
  #pImage;

  constructor() {
    super();
    this.#pLabel = new Panel();
    this.#pImage = new PanelWrapper();
  }

  getLabelPanel() { return this.#pLabel; }
  getImagePanel() { return this.#pImage; }

  _renderFramework() {
    let s = _CFT_GALLERY.SLIDE_SHOW_SLIDE;
    s = s.replace("__ID_LABEL__", this._getSubElementId("L"));
    s = s.replace("__ID_IMAGE__", this._getSubElementId("I"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pLabel.attach(this._getSubElementId("L"));
    this.#pImage.attach(this._getSubElementId("I"));
  }
};

class PGallery extends Panel {
  #pSlides;
  #pDots;

  constructor() {
    super();
    this.#pSlides = new ListPanel();
    this.#pDots = new ListPanel();
  }

  getSlidesPanel() { return this.#pSlides; }
  getDotsPanel() { return this.#pDots; }

  _renderFramework() {
    let s = _CFT_GALLERY.SLIDE_SHOW;
    s = s.replace("__ID_SLIDES__", this._getSubElementId("S"));
    s = s.replace("__ID_DOTS__", this._getSubElementId("D"));
    return s;
  }

  _onFrameworkDidAppear() {
    super._onFrameworkDidAppear();
    this.#pSlides.attach(this._getSubElementId("S"));
    this.#pDots.attach(this._getSubElementId("D"));
  }
};

export class FGallery extends Fragment {
  #slideIndex = 0;
  #scrollTimeoutAction = null;
  #fFiles = [];
  #pendingFiles = [];
  #statusChecker;
  #pGallery;

  constructor() {
    super();
    this.#statusChecker = new CronJob();
  }

  isLivestreaming() {
    return this.#fFiles.some(
        f => {f.getFile().isVideo() && f.getFile().isLivestreaming()});
  }

  setFiles(files) {
    this.#fFiles = [];
    if (files) {
      for (let file of files) {
        let f = new FMediaFile();
        f.setFile(file);
        this.#fFiles.push(f);
      }
    }
  }

  setSelection(idx) {
    if (this.#fFiles.length > idx) {
      this.#slideIndex = idx;
    }
  }

  action(type, ...args) {
    switch (type) {
    case CF_GALLERY.NEXT_IMAGE_SLIDE:
      this.#switchToNextSlide();
      break;
    case CF_GALLERY.PREV_IMAGE_SLIDE:
      this.#switchToPrevSlide();
      break;
    case CF_GALLERY.SHOW_IMAGE_SLIDE:
      this.#switchToSlide(args[0]);
      break;
    case CF_GALLERY.ON_SCROLL:
      this.#onScroll(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case T_DATA.ADDON_SCRIPT:
      if (data == glb.env.SCRIPT.PLAYER.id) {
        this.#assignVideoPlayers();
      }
      break;
    default:
      break;
    }
    super.handleSessionDataUpdate.apply(this, arguments);
  }

  _renderOnRender(render) {
    if (this.#fFiles.length < 1) {
      return;
    }

    this.#pendingFiles =
        this.#getPendingFiles(this.#fFiles.map(f => f.getFile()));
    if (this.#pendingFiles.length > 0) {
      this.#initStatusChecker();
      this.#renderPreprocProgress(render);
      return;
    }

    if (this.#fFiles.length > 1) {
      let p = new PGallery();
      render.wrapPanel(p);
      this.#pGallery = p;
      this.#renderSlideShow(p, this.#fFiles);
      this.#switchToSlide(this.#slideIndex);
    } else {
      let p = new PanelWrapper();
      p.setClassName("media-frame");
      render.wrapPanel(p);
      let f = this.#fFiles[0];
      f.attachRender(p);
      f.render();
    }
    this.#assignVideoPlayers();
  }

  _onBeforeRenderDetach() {
    this.#statusChecker.stop();
    super._onBeforeRenderDetach();
  }

  #getPendingFiles(files) { return files.filter(f => f.isPending()); }
  #hasVideo(fFiles) { return fFiles.some(f => f.getFile().isVideo()); }

  #initStatusChecker() {
    if (!this.#statusChecker.isSet()) {
      this.#statusChecker.reset(() => this.#asyncCheckStatus(), 3000);
    }
  }

  #switchToNextSlide() { this.#switchToSlide(this.#slideIndex + 1); }
  #switchToPrevSlide() { this.#switchToSlide(this.#slideIndex - 1); }
  #switchToSlide(index) {
    let eSlides = this.#getSlideShowContainerElement();
    if (!eSlides) {
      return;
    }

    // Normalize index
    let elements = eSlides.getElementsByClassName("slide-show-slide");
    if (index < 0) {
      this.#slideIndex = elements.length - 1;
    } else if (index >= elements.length) {
      this.#slideIndex = 0;
    } else {
      this.#slideIndex = index;
    }

    // Scroll
    let xNew = eSlides.offsetWidth * this.#slideIndex;
    eSlides.firstElementChild.scrollTo({left : xNew, behavior : "smooth"});

    this.#updateDots();
  }

  #getSlideShowContainerElement() {
    return this.#pGallery ? this.#pGallery.getDomElement().firstElementChild
                          : null;
  }

  #renderPreprocProgress(panel) {
    let items = [];
    for (let f of this.#pendingFiles) {
      let p = f.getProgress();
      if (p) {
        items.push(p + "%");
      }
    }
    let s = _CFT_GALLERY.PREPROC;
    s = s.replace("__PROGRESS__", items.join(" "));
    panel.replaceContent(s);
  }

  #updateDots() {
    let eSlides = this.#getSlideShowContainerElement();
    if (!eSlides) {
      return;
    }
    let elements = Array.from(eSlides.getElementsByClassName("slide-show-dot"));
    for (let [i, e] of elements.entries()) {
      if (i == this.#slideIndex) {
        e.className = e.className.replace("s-csecondarybg", "s-cfuncbg");
      } else {
        e.className = e.className.replace("s-cfuncbg", "s-csecondarybg");
      }
    }
  }

  #assignVideoPlayers() {
    if (this.#statusChecker.isSet()) {
      return;
    }
    if (this.#hasVideo(this.#fFiles) &&
        glb.env.isScriptLoaded(glb.env.SCRIPT.PLAYER.id)) {
      let e = this.getRender().getDomElement();
      this.#initVideos(e.getElementsByTagName("video"));
    }
  }

  #initVideos(elements) {
    for (let e of elements) {
      let url = e.getAttribute("manifest-url");
      if (url) {
        if (Hls.isSupported()) {
          let player = new Hls();
          player.on(Hls.Events.ERROR, (e, d) => this.#handleHlsError(e, d));
          player.loadSource(url);
          player.attachMedia(e);
        } else if (e.canPlayType('application/vnd.apple.mpegurl')) {
          e.src = url;
          e.removeAttribute("manifest-url");
        }
      }
    }
  }

  #handleHlsError(evt, data) {
    if (data.fatal) {
      switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.log("Hls network error, trying to reload.");
        hls.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.log("Hls media error, trying to recover.");
        hls.recoverMediaError();
        break;
      default:
        hls.destroy();
        break;
      }
    }
  }

  #renderSlideShow(pGallery, fFiles) {
    let pSlides = pGallery.getSlidesPanel();
    let pDots = pGallery.getDotsPanel();

    let tSlide = _CFT_GALLERY.SLIDE_SHOW_SLIDE;
    let s, p, pp;
    let className;
    for (let [i, fFile] of fFiles.entries()) {
      p = new PSlide();
      p.setClassName("slide-show-slide scroll-snap-start w100 flex-noshrink");
      pSlides.pushPanel(p);
      pp = p.getLabelPanel();
      pp.replaceContent((i + 1).toString() + " / " + fFiles.length);
      pp = p.getImagePanel();
      fFile.attachRender(pp);
      fFile.render();

      p = new Panel();
      p.setAttribute("onclick",
                     "javascript:G.action(gui.CF_GALLERY.SHOW_IMAGE_SLIDE, " +
                         i + ")");
      className = "slide-show-dot";
      if (i == 0) {
        className += " s-cfuncbg";
      } else {
        className += " s-csecondarybg";
      }
      p.setClassName(className);
      pDots.pushPanel(p);
    }
  }

  #asyncCheckStatus() {
    let url = "api/user/file_infos";
    let fd = new FormData();
    for (let f of this.#pendingFiles) {
      fd.append("ids", f.getId());
    }
    api.asyncFragmentPost(this, url, fd)
        .then(d => this.#onFileStatusRRR(d));
  }

  #onFileStatusRRR(data) {
    let infoMap = new Map();
    for (let f of data.files) {
      infoMap.set(f.id, f);
    }
    for (let f of this.#pendingFiles) {
      let nf = infoMap.get(f.getId());
      if (nf) {
        f.setState(nf.state);
        f.setStatus(nf.status);
        f.setProgress(nf.progress);
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

  #onScroll(e) {
    window.clearTimeout(this.#scrollTimeoutAction);
    this.#scrollTimeoutAction =
        setTimeout(() => this.#onScrollFinished(e), 100);
  }

  #onScrollFinished(e) {
    let w = e.parentElement.offsetWidth;
    let x = e.scrollLeft;
    this.#slideIndex = Math.floor(x / w + 0.5);
    this.#updateDots();
  }
};

