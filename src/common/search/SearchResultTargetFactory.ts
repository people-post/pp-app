import type { View } from '../../lib/ui/controllers/views/View.js';

export interface SearchResultTarget {
  view: View;
  title: string;
  asDialog?: boolean;
}

export interface SearchResultTargetFactory {
  buildSearchResultTarget(itemType: string, itemId: string,
      layoutType: string | null): SearchResultTarget | null;
}