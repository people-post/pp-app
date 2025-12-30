import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import Utilities from '../../lib/ext/Utilities.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';

export const CF_TAGS_EDITOR = {
  TOGGLE : Symbol(),
  NEW_TAG : Symbol(),
  REMOVE_EXTRA_TAG : Symbol(),
};

const _CFT_TAGS_EDITOR = {
  MAIN : `<div>
      <span>__TAGS__</span>
      <span id="ID_EXTRA_TAGS">__EXTRA_TAGS__</span>
    </div>`,
  BTN_NEW_TAG :
      `<span class="button-like small s-primary" onclick="javascript:G.action(gui.CF_TAGS_EDITOR.NEW_TAG)">+New tag</span>`,
  TAG :
      `<span name="__NAME__" class="__CLASS__" value="__VALUE__" onclick="javascript:G.action(gui.CF_TAGS_EDITOR.TOGGLE, this)">__TEXT__</span>`,
  EXTRA_TAG :
      `<span class="tag selected">__TEXT__ <span class="button-like tiny" onclick="javascript:G.action(gui.CF_TAGS_EDITOR.REMOVE_EXTRA_TAG, '__VALUE__')">x</span></span>`,
};

export class TagsEditorFragment extends Fragment {
  #elementName;
  #extraTagNames = [];
  #shouldEnableNewTags = false;
  #nMax = C.MAX.N_TAGS;

  constructor(elementId) {
    super();
    this.#elementName = "EDIT_TAG_" + Utilities.uuid();
  }

  getNewTagNames() { return this.#extraTagNames; }
  getSelectedTagIds() {
    let ids = [];
    for (let e of document.getElementsByName(this.#elementName)) {
      if (this.#isTagSelected(e)) {
        ids.push(e.getAttribute("value"));
      }
    }
    return ids;
  }

  setEnableNewTags(b) { this.#shouldEnableNewTags = b; }

  _renderContent() {
    let allTags = this._dataSource.getTagsForTagsEditorFragment(this);
    let checkedTagIds =
        this._dataSource.getInitialCheckedIdsForTagsEditorFragment(this);
    let s = _CFT_TAGS_EDITOR.MAIN;
    let items = [];
    for (let tag of allTags) {
      let ss = this.#renderTag(tag, checkedTagIds.includes(tag.getId()));
      items.push(ss);
    }
    s = s.replace("__TAGS__", items.join(""));
    let n = 0;
    if (this.#shouldEnableNewTags) {
      n = this.#nMax - allTags.length - this.#extraTagNames.length;
      if (n > 0) {
        n = C.MAX.N_TAGS_PER_ITEM - checkedTagIds.length -
            this.#extraTagNames.length;
      }
    }
    s = s.replace("__EXTRA_TAGS__",
                  this.#renderExtraTags(this.#extraTagNames, n > 0));
    return s;
  }

  action(type, ...args) {
    switch (type) {
    case CF_TAGS_EDITOR.TOGGLE:
      this.#onToggleTag(args[0]);
      break;
    case CF_TAGS_EDITOR.NEW_TAG:
      this.#onNewTag();
      break;
    case CF_TAGS_EDITOR.REMOVE_EXTRA_TAG:
      this.#onRemoveExtraTag(args[0]);
      break;
    default:
      break;
    }
  }

  #onNewTag() {
    let v = new View();
    let fvc = new FvcUserInput();
    let f = new TextInput();
    f.setConfig({
      title : "Please input new tag:",
      hint : "New tag",
      value : "",
      isRequired : true
    });
    fvc.addInputCollector(f);
    fvc.setConfig({
      fcnValidate : () => f.validate(),
      fcnOK : () => this.#addTag(f.getValue()),
    });
    v.setContentFragment(fvc);
    Events.triggerTopAction(T_ACTION.SHOW_DIALOG, this, v, "New tag",
                                false);
  }

  #addTag(name) {
    this.#extraTagNames.push(name);
    this.#updateExtraTags();
  }

  #countTags() {
    return document.getElementsByName(this.#elementName).length +
           this.#extraTagNames.length;
  }

  #countSelectedTags() {
    return this.getSelectedTagIds().length + this.#extraTagNames.length;
  }

  #renderExtraTags(tagNames, shouldEnableNewTag) {
    let items = [];
    for (let name of tagNames) {
      items.push(this.#renderExtraTag(name));
    }
    let s = items.join("");
    if (shouldEnableNewTag) {
      s += _CFT_TAGS_EDITOR.BTN_NEW_TAG;
    }
    return s;
  }

  #updateExtraTags() {
    let e = document.getElementById("ID_EXTRA_TAGS");
    if (e) {
      let n = 0;
      if (this.#shouldEnableNewTags) {
        n = this.#nMax - this.#countTags();
        if (n > 0) {
          n = C.MAX.N_TAGS_PER_ITEM - this.#countSelectedTags();
        }
      }
      e.innerHTML = this.#renderExtraTags(this.#extraTagNames, n > 0);
    }
  }

  #onToggleTag(eTag) {
    if (this.#isTagSelected(eTag)) {
      eTag.className = "tag";
    } else {
      if (this.#countSelectedTags() < C.MAX.N_TAGS_PER_ITEM) {
        eTag.className = "tag selected";
      } else {
        this.onLocalErrorInFragment(
            this,
            R.get("EL_N_MAX_TAG").replace("__N_MAX__", C.MAX.N_TAGS_PER_ITEM));
      }
    }
    this.#updateExtraTags();
  }

  #isTagSelected(eTag) { return eTag.className.indexOf("selected") > 0; }

  #renderExtraTag(name) {
    let s = _CFT_TAGS_EDITOR.EXTRA_TAG;
    s = s.replace("__TEXT__", name);
    s = s.replace("__VALUE__", name);
    return s;
  }

  #onRemoveExtraTag(name) {
    let i = this.#extraTagNames.indexOf(name);
    if (i >= 0) {
      this.#extraTagNames.splice(i, 1);
      this.#updateExtraTags();
    }
  }

  #renderTag(tag, isChecked) {
    let s = _CFT_TAGS_EDITOR.TAG;
    s = s.replace("__NAME__", this.#elementName);
    s = s.replace("__VALUE__", tag.getId());
    if (isChecked) {
      s = s.replace("__CLASS__", "tag selected");
    } else {
      s = s.replace("__CLASS__", "tag");
    }
    s = s.replace("__TEXT__", tag.getName());
    return s;
  }
};

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.gui = window.gui || {};
  window.gui.CF_TAGS_EDITOR = CF_TAGS_EDITOR;
  window.gui.TagsEditorFragment = TagsEditorFragment;
}
