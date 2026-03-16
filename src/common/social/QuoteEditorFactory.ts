import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export interface QuoteEditorFactory {
  createQuoteEditor(itemId: string, itemType: string,
      delegate: unknown): Fragment | null;
}