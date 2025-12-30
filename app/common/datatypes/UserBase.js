export class UserBase extends dat.DataObject {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.UserBase = UserBase;
}
