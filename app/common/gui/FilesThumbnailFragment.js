(function(gui) {
gui.CF_FILES_THUMBNAIL = {
  ON_CLICK : Symbol(),
};

const _CFC_FILES_THUMBNAIL = {
  GRID_TYPE : {
    N1 : [ "1-1" ],
    N2 : [ "1-2", "1-2" ],
    N3 : [ "2-2", "2-2", "2-1" ],
    N4 : [ "2-2", "2-2", "2-2", "2-2" ],
    N5 : [ "3-22", "3-22", "3-13", "3-13", "3-13" ],
    N6 : [ "2-3", "2-3", "2-3", "2-3", "2-3", "2-3" ],
    N7 : [ "3-12", "3-13", "3-12", "3-13", "3-13", "3-13", "3-13" ],
    N8 : [ "3-12", "3-13", "3-13", "3-13", "3-13", "3-13", "3-13", "3-13" ],
    N9 : [
      "3-13", "3-13", "3-13", "3-13", "3-13", "3-13", "3-13", "3-13", "3-13"
    ],
  }
};

const _CFT_FILES_THUMBNAIL = {
  ITEM :
      `<span class="thumbnail-grid thumbnail-grid-__THUMBNAIL_GRID_TYPE__" onclick="javascript:G.action(gui.CF_FILES_THUMBNAIL.ON_CLICK, __IDX__)" style="background-image:url('__URL__');__BG_COLOR__">__CONTENT__</span>
    `,
  LIVE_ICON_MASK : `
    <div class="live-thumbnail-mask top0px"></div>
    <div class="live-thumbnail-mask bottom0px"></div>
    <svg class="w100 h100" viewBox="0 0 32 32">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="live-text">LIVE</text>
    </svg>`,
  VIDEO_ICON_MASK : `
    <div class="video-thumbnail-mask top0px"></div>
    <div class="video-thumbnail-mask bottom0px"></div>`,
};

class FilesThumbnailFragment extends ui.Fragment {
  action(type, ...args) {
    switch (type) {
    case gui.CF_FILES_THUMBNAIL.ON_CLICK:
      this._delegate.onThumbnailClickedInThumbnailFragment(this, args[0]);
      break;
    default:
      super.action.apply(this, arguments);
      break;
    }
  }

  _renderOnRender(render) {
    let files = this._dataSource.getFilesForThumbnailFragment(this);
    if (!files) {
      return;
    }
    let p = new ui.Panel();
    p.setClassName("thumbnail-grid-wrapper");
    render.wrapPanel(p);
    this.#renderFiles(files, p);
  }

  #renderFiles(files, panel) {
    let gridTypes = _CFC_FILES_THUMBNAIL.GRID_TYPE["N" + files.length];
    let items = [];
    let w = panel.getWidth();
    // Calculations are rough, should be good enough
    if (files.length > 3) {
      w = w / 2;
    }
    for (let [i, file] of files.entries()) {
      items.push(this.#renderFile(file, gridTypes[i], i, w));
    }
    panel.replaceContent(items.join(""));
  }

  #renderFile(file, gridType, idx, forWidth) {
    let s = _CFT_FILES_THUMBNAIL.ITEM;
    s = s.replace("__THUMBNAIL_GRID_TYPE__", gridType);
    s = s.replace("__IDX__", idx);
    let bg = file.getBackgroundColor();
    if (bg && bg.length) {
      s = s.replace("__BG_COLOR__", "background-color:" + bg + ";");
    } else {
      s = s.replace("__BG_COLOR__", "");
    }
    s = s.replace("__URL__", file.getThumbnailUrl(forWidth));
    if (file.isVideo()) {
      if (file.isLivestreaming()) {
        s = s.replace("__CONTENT__", _CFT_FILES_THUMBNAIL.LIVE_ICON_MASK);
      } else {
        s = s.replace("__CONTENT__", _CFT_FILES_THUMBNAIL.VIDEO_ICON_MASK);
      }
    } else {
      s = s.replace("__CONTENT__", "");
    }
    return s;
  }
};

gui.FilesThumbnailFragment = FilesThumbnailFragment;
}(window.gui = window.gui || {}));
