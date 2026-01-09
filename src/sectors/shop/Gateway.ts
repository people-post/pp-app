import type { FViewContentBase } from '../../lib/ui/controllers/fragments/FViewContentBase.js';
import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcMain } from './FvcMain.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment(): FViewContentBase {
    return new FvcMain();
  }
};
