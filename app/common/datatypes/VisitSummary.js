(function(dat) {
class VisitSummary extends dat.ServerDataObject {
  getSubQueryKey() { return this._data.sub_query_key; }
  getSubQueryValue() { return this._data.sub_query_value; }
  getName() { return this._data.name; }
  getTotal() { return this._data.total; }
};

dat.VisitSummary = VisitSummary;
}(window.dat = window.dat || {}));
