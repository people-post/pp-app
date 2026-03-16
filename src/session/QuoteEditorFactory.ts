import { FvcQuoteEditor } from '../sectors/blog/FvcQuoteEditor.js';
import type { Fragment } from '../lib/ui/controllers/fragments/Fragment.js';
import type { QuoteEditorFactory } from '../common/social/QuoteEditorFactory.js';

type QuoteEditorDelegate = {
  onQuotePostedInQuoteEditorContentFragment(f: FvcQuoteEditor): void;
};

export class SessionQuoteEditorFactory implements QuoteEditorFactory {
  createQuoteEditor(itemId: string, itemType: string,
      delegate: unknown): Fragment {
    let fragment = new FvcQuoteEditor();
    fragment.setDelegate(delegate as QuoteEditorDelegate);
    fragment.setItem(itemId, itemType);
    return fragment;
  }
}