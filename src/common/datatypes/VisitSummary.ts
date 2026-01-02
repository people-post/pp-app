import { ServerDataObject } from './ServerDataObject.js';

interface VisitSummaryData {
  sub_query_key?: string;
  sub_query_value?: string;
  name?: string;
  total?: number;
  [key: string]: unknown;
}

export class VisitSummary extends ServerDataObject {
  protected declare _data: VisitSummaryData;

  getSubQueryKey(): string | undefined {
    return this._data.sub_query_key as string | undefined;
  }

  getSubQueryValue(): string | undefined {
    return this._data.sub_query_value as string | undefined;
  }

  getName(): string | undefined {
    return this._data.name as string | undefined;
  }

  getTotal(): number | undefined {
    return this._data.total as number | undefined;
  }
}

