(function(dat) {
class WalkinQueueItem extends dat.ServerDataObject {
  getCustomerUserId() { return this._data.customer_user_id; }
  getCustomerName() { return this._data.customer_name; }
  getProductId() { return this._data.product_id; }
  getState() { return this._data.state; }
  getStatus() { return this._data.status; }
  getUpdateTime() { return new Date(this._data.updated_at * 1000); }
  getAgentId() { return this._data.agent_id; }
};

dat.WalkinQueueItem = WalkinQueueItem;
}(window.dat = window.dat || {}));
