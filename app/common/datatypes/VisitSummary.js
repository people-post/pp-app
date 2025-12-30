export class VisitSummary extends dat.ServerDataObject {
  getSubQueryKey() { return this._data.sub_query_key; }
  getSubQueryValue() { return this._data.sub_query_value; }
  getName() { return this._data.name; }
  getTotal() { return this._data.total; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.VisitSummary = VisitSummary;
}
