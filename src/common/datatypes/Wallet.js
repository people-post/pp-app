import { DataObject } from './DataObject.js';

export class Wallet extends DataObject {
  // BIP44: m/purpose'/coin_type'/account'/role/index
  // Purpose derivation (See BIP43)
  static T_PURPOSE = {
    CIP1852 : 1852, // see CIP 1852
    NFSC001: 8517,
  };
  static T_COIN = {
    CARDANO : 1815, // Cardano coin type (SLIP 44)
    NFSC001: 777,   //
  };
};
