(function(gui) {
gui.CF_GALLERY = {
  PREV_IMAGE_SLIDE : Symbol(),
  NEXT_IMAGE_SLIDE : Symbol(),
  SHOW_IMAGE_SLIDE : Symbol(),
  ON_SCROLL : Symbol(),
};

const _CFT_GALLERY = {
  PREPROC :
      `<div class="info-message">Preprocessing files, please wait...__PROGRESS__</div>`,
  SLIDE_SHOW : `<div class="center-align h100">
      <div class="h100 relative x-scroll x-scroll-snap no-wrap flex flex-start" onscroll="javascript:G.action(gui.CF_GALLERY.ON_SCROLL, this)">
        __SLIDES__
      </div>
      <div class="slide-show-nav slide-show-prev" onclick="javascript:G.action(gui.CF_GALLERY.PREV_IMAGE_SLIDE)">&#10094;</div>
      <div class="slide-show-nav slide-show-next" onclick="javascript:G.action(gui.CF_GALLERY.NEXT_IMAGE_SLIDE)">&#10095;</div>
      <div class="absolute w100 bottom0px center-align">__DOTS__</div>
    </div>`,
  SLIDE_SHOW_SLIDE : `<div class="slide-show-label">__LABEL__</div>
    <div class="s-photo bgblack h100">__CONTENT__</div>`,
  SINGLE_CONENT : `<div class="media-frame">__CONTENT__</div>`,
  MEDIA_CONTENT : {
    IMAGE :
        `<img class="hmax100 wmax100 clickable" src="__URL__" onclick="window.open('__DOWNLOAD_URL__', '_blank')"/>`,
    VIDEO :
        `<video class="hls" playsinline controls manifest-url="__URL__"></video>`,
  },
};

class FGallery extends ui.Fragment {
  #slideIndex = 0;
  #scrollTimeoutAction = null;
  #files = [];
  #pendingFiles = [];
  #statusChecker;

  constructor() {
    super();
    this.#statusChecker = new ext.CronJob();
  }

  isLivestreaming() {
    return this.#files.some(f => {f.isVideo() && f.isLivestreaming()});
  }
  setFiles(files) { this.#files = files; }
  setSelection(idx) {
    if (this.#files && this.#files.length > idx) {
      this.#slideIndex = idx;
    }
  }

  action(type, ...args) {
    switch (type) {
    case gui.CF_GALLERY.NEXT_IMAGE_SLIDE:
      this.#switchToNextSlide();
      break;
    case gui.CF_GALLERY.PREV_IMAGE_SLIDE:
      this.#switchToPrevSlide();
      break;
    case gui.CF_GALLERY.SHOW_IMAGE_SLIDE:
      this.#switchToSlide(args[0]);
      break;
    case gui.CF_GALLERY.ON_SCROLL:
      this.#onScroll(args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  handleSessionDataUpdate(dataType, data) {
    switch (dataType) {
    case plt.T_DATA.ADDON_SCRIPT:
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
    if (!this.#files || this.#files.length < 1) {
      return;
    }

    this.#pendingFiles = this.#getPendingFiles(this.#files);
    if (this.#pendingFiles.length > 0) {
      this.#initStatusChecker();
      this.#renderPreprocProgress(render);
      return;
    }

    if (this.#files.length > 1) {
      render.replaceContent(this.#renderSlideShow(this.#files));
      this.#switchToSlide(this.#slideIndex);
    } else {
      render.replaceContent(this.#renderSingleFile(this.#files[0]));
    }
    this.#assignVideoPlayers();
  }

  #renderSingleFile(file) {
    let s = _CFT_GALLERY.SINGLE_CONENT;
    s = s.replace("__CONTENT__", this.#renderFile(file));
    return s;
  }

  _onBeforeRenderDetach() {
    this.#statusChecker.stop();
    super._onBeforeRenderDetach();
  }

  #getPendingFiles(files) { return files.filter(f => f.isPending()); }
  #hasVideo(files) { return files.some(f => f.isVideo()); }

  #initStatusChecker() {
    if (!this.#statusChecker.isSet()) {
      this.#statusChecker.reset(() => this.#asyncCheckStatus(), 3000);
    }
  }

  #switchToNextSlide() { this.#switchToSlide(this.#slideIndex + 1); }
  #switchToPrevSlide() { this.#switchToSlide(this.#slideIndex - 1); }
  #switchToSlide(index) {
    let e = this.#getContainerElement();
    if (!e) {
      return;
    }
    // Normalize index
    let elements = e.getElementsByClassName("slide-show-slide");
    if (index < 0) {
      this.#slideIndex = elements.length - 1;
    } else if (index >= elements.length) {
      this.#slideIndex = 0;
    } else {
      this.#slideIndex = index;
    }

    // Scroll
    let xNew = e.offsetWidth * this.#slideIndex;
    e.firstElementChild.scrollTo({left : xNew, behavior : "smooth"});

    this.#updateDots();
  }

  #getContainerElement() {
    return this.getRender().getDomElement().firstElementChild;
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
    let eSlides = this.getRender().getDomElement().firstElementChild;
    if (!eSlides) {
      return;
    }
    let elements = Array.from(eSlides.getElementsByClassName("slide-show-dot"));
    for (let [i, e] of elements.entries()) {
      if (i == this.#slideIndex) {
        e.style.backgroundColor = "CornflowerBlue";
      } else {
        e.style.backgroundColor = "lightgrey";
      }
    }
  }

  #assignVideoPlayers() {
    if (this.#statusChecker.isSet()) {
      return;
    }
    if (this.#files && this.#hasVideo(this.#files) &&
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

  #renderSlideShow(files) {
    let items = [];
    let dotItems = [];
    let tShow = _CFT_GALLERY.SLIDE_SHOW;
    let tSlide = _CFT_GALLERY.SLIDE_SHOW_SLIDE;
    let s;
    for (let [i, file] of files.entries()) {
      let e = document.createElement("div");
      e.className = "slide-show-slide scroll-snap-start w100 flex-noshrink";
      s = tSlide.replace("__CONTENT__", this.#renderFile(file));
      s = s.replace("__LABEL__", (i + 1).toString() + " / " + files.length);
      e.innerHTML = s;
      items.push(e.outerHTML);

      e = document.createElement("span");
      e.className = "slide-show-dot";
      e.setAttribute("onclick",
                     "javascript:G.action(gui.CF_GALLERY.SHOW_IMAGE_SLIDE, " +
                         i + ")");
      if (i == 0) {
        e.style.backgroundColor = "CornflowerBlue";
      } else {
        e.style.backgroundColor = "lightgrey";
      }
      dotItems.push(e.outerHTML);
    }
    s = tShow.replace("__SLIDES__", items.join(""));
    s = s.replace("__DOTS__", dotItems.join(""));
    return s;
  }

  #renderFile(file) {
    let s = "";
    if (file.isImage()) {
      s = _CFT_GALLERY.MEDIA_CONTENT.IMAGE;
      s = s.replace("__URL__", file.getImageUrl());
      s = s.replace("__DOWNLOAD_URL__", file.getDownloadUrl());
    } else if (file.isVideo()) {
      s = _CFT_GALLERY.MEDIA_CONTENT.VIDEO;
      s = s.replace("__TYPE__", file.getVideoManifestType());
      s = s.replace("__URL__", file.getVideoManifestUrl());
    }
    return s;
  }

  #asyncCheckStatus() {
    let url = "api/user/file_infos";
    let fd = new FormData();
    for (let f of this.#pendingFiles) {
      fd.append("ids", f.getId());
    }
    plt.Api.asyncFragmentPost(this, url, fd)
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

gui.FGallery = FGallery;
}(window.gui = window.gui || {}));
