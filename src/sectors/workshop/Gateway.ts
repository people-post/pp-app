import { SectorGateway } from '../../common/plt/SectorGateway.js';
import { FvcMain } from './FvcMain.js';
import { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';

export class Gateway extends SectorGateway {
  createMainViewContentFragment(): Fragment { return new FvcMain(); }
};
