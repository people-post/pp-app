import { DataObject } from './DataObject.js';

export class UserBase extends DataObject {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.UserBase = UserBase;
}
