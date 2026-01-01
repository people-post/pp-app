import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcMain } from './FvcMain.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment() { return new FvcMain(); }
};
