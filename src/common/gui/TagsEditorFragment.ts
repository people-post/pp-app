import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import Utilities from '../../lib/ext/Utilities.js';
import { View } from '../../lib/ui/controllers/views/View.js';
import { FvcUserInput } from '../hr/FvcUserInput.js';
import { TextInput } from '../../lib/ui/controllers/fragments/TextInput.js';
import { Events, T_ACTION } from '../../lib/framework/Events.js';
import { MAX } from '../constants/Constants.js';
import { R } from '../constants/R.js';
import { Tag } from '../datatypes/Tag.js';

export const CF_TAGS_EDITOR = {
  TOGGLE : "CF_TAGS_EDITOR_1",
  NEW_TAG : "CF_TAGS_EDITOR_2",
  REMOVE_EXTRA_TAG : "CF_TAGS_EDITOR_3",
} as const;

const _CFT_TAGS_EDITOR = {
  MAIN : `<div>
      <span>__TAGS__</span>
      <span id="ID_EXTRA_TAGS">__EXTRA_TAGS__</span>
    </div>`,
  BTN_NEW_TAG :
      `<span class="button-like small s-primary" onclick="javascript:G.action('${CF_TAGS_EDITOR.NEW_TAG}')">+New tag</span>`,
  TAG :
      `<span name="__NAME__" class="__CLASS__" value="__VALUE__" onclick="javascript:G.action('${CF_TAGS_EDITOR.TOGGLE}', this)">__TEXT__</span>`,
  EXTRA_TAG :
      `<span class="tag selected">__TEXT__ <span class="button-like tiny" onclick="javascript:G.action('${CF_TAGS_EDITOR.REMOVE_EXTRA_TAG}', '__VALUE__')">x</span></span>`,
};

export interface TagsEditorFragmentDataSource {
  getTagsForTagsEditorFragment(f: TagsEditorFragment): Tag[];
  getInitialCheckedIdsForTagsEditorFragment(f: TagsEditorFragment): string[];
}

export interface TagsEditorFragmentDelegate {
  onRequestNewTagInTagsEditorFragment(f: TagsEditorFragment): void;
  onRequestRemoveExtraTagInTagsEditorFragment(f: TagsEditorFragment, name: string): void;
}

export class TagsEditorFragment extends Fragment {
  #elementName: string;
  #extraTagNames: string[] = [];
  #shouldEnableNewTags = false;
  #nMax = MAX.N_TAGS;

  constructor(_elementId?: string) {
    super();
    this.#elementName = "EDIT_TAG_" + Utilities.uuid();
  }

  getNewTagNames(): string[] { return this.#extraTagNames; }
  getSelectedTagIds(): string[] {
    let ids: string[] = [];
    for (let e of document.getElementsByName(this.#elementName)) {
      if (this.#isTagSelected(e as HTMLElement)) {
        let value = e.getAttribute("value");
        if (value) {
          ids.push(value);
        }
      }
    }
    return ids;
  }

  setEnableNewTags(b: boolean): void { this.#shouldEnableNewTags = b; }

  _renderContent(): string {
    let allTags = this.getDataSource<TagsEditorFragmentDataSource>()?.getTagsForTagsEditorFragment(this) || [];
    let checkedTagIds =
        this.getDataSource<TagsEditorFragmentDataSource>()?.getInitialCheckedIdsForTagsEditorFragment(this) || [];
    let s = _CFT_TAGS_EDITOR.MAIN;
    let items: string[] = [];
    for (let tag of allTags) {
      let ss = this.#renderTag(tag, checkedTagIds.includes(tag.getId() as string || ""));
      items.push(ss);
    }
    s = s.replace("__TAGS__", items.join(""));
    let n = 0;
    if (this.#shouldEnableNewTags) {
      n = this.#nMax - allTags.length - this.#extraTagNames.length;
      if (n > 0) {
        n = MAX.N_TAGS_PER_ITEM - checkedTagIds.length -
            this.#extraTagNames.length;
      }
    }
    s = s.replace("__EXTRA_TAGS__",
                  this.#renderExtraTags(this.#extraTagNames, n > 0));
    return s;
  }

  action(type: string | symbol, ...args: unknown[]): void {
    switch (type) {
    case CF_TAGS_EDITOR.TOGGLE:
      this.#onToggleTag(args[0] as HTMLElement);
      break;
    case CF_TAGS_EDITOR.NEW_TAG:
      this.#onNewTag();
      break;
    case CF_TAGS_EDITOR.REMOVE_EXTRA_TAG:
      this.#onRemoveExtraTag(args[0] as string);
      break;
    default:
      break;
    }
  }

  #onNewTag(): void {
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

  #addTag(name: string): void {
    this.#extraTagNames.push(name);
    this.#updateExtraTags();
  }

  #countTags(): number {
    return document.getElementsByName(this.#elementName).length +
           this.#extraTagNames.length;
  }

  #countSelectedTags(): number {
    return this.getSelectedTagIds().length + this.#extraTagNames.length;
  }

  #renderExtraTags(tagNames: string[], shouldEnableNewTag: boolean): string {
    let items: string[] = [];
    for (let name of tagNames) {
      items.push(this.#renderExtraTag(name));
    }
    let s = items.join("");
    if (shouldEnableNewTag) {
      s += _CFT_TAGS_EDITOR.BTN_NEW_TAG;
    }
    return s;
  }

  #updateExtraTags(): void {
    let e = document.getElementById("ID_EXTRA_TAGS");
    if (e) {
      let n = 0;
      if (this.#shouldEnableNewTags) {
        n = this.#nMax - this.#countTags();
        if (n > 0) {
          n = MAX.N_TAGS_PER_ITEM - this.#countSelectedTags();
        }
      }
      e.innerHTML = this.#renderExtraTags(this.#extraTagNames, n > 0);
    }
  }

  #onToggleTag(eTag: HTMLElement): void {
    if (this.#isTagSelected(eTag)) {
      eTag.className = "tag";
    } else {
      if (this.#countSelectedTags() < MAX.N_TAGS_PER_ITEM) {
        eTag.className = "tag selected";
      } else {
        this.onLocalErrorInFragment(
            this,
            R.get("EL_N_MAX_TAG").replace("__N_MAX__", MAX.N_TAGS_PER_ITEM.toString()));
      }
    }
    this.#updateExtraTags();
  }

  #isTagSelected(eTag: HTMLElement): boolean { return eTag.className.indexOf("selected") > 0; }

  #renderExtraTag(name: string): string {
    let s = _CFT_TAGS_EDITOR.EXTRA_TAG;
    s = s.replace("__TEXT__", name);
    s = s.replace("__VALUE__", name);
    return s;
  }

  #onRemoveExtraTag(name: string): void {
    let i = this.#extraTagNames.indexOf(name);
    if (i >= 0) {
      this.#extraTagNames.splice(i, 1);
      this.#updateExtraTags();
    }
  }

  #renderTag(tag: Tag, isChecked: boolean): string {
    let s = _CFT_TAGS_EDITOR.TAG;
    s = s.replace("__NAME__", this.#elementName);
    s = s.replace("__VALUE__", tag.getId() as string || "");
    if (isChecked) {
      s = s.replace("__CLASS__", "tag selected");
    } else {
      s = s.replace("__CLASS__", "tag");
    }
    s = s.replace("__TEXT__", tag.getName() || "");
    return s;
  }
}

export default TagsEditorFragment;
