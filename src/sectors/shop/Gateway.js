import { SectorGateway } from '../../common/plt/SectorGateway.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() { return new shop.FvcMain(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.Gateway = Gateway;
}
