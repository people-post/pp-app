import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcMain } from './FvcMain.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() { return new FvcMain(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.Gateway = Gateway;
}
