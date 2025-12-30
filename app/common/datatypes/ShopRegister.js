export class ShopRegister extends dat.ServerDataObject {
  getName() { return this._data.name; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ShopRegister = ShopRegister;
}
