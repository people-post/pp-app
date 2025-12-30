import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcMain } from './FvcMain.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() { return new FvcMain(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.Gateway = Gateway;
}
