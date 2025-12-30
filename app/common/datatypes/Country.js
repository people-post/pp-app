export class Country {
  constructor(data) { this._data = data; }

  getName() { return this._data.name; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Country = Country;
}