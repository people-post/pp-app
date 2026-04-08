import type { Fragment } from '../../lib/ui/controllers/fragments/Fragment.js';
import { Web3PeerPublisherAgent } from './Web3Publisher.js';

export interface Web3ServerRegistrationDelegate {
  onRegistrationCanceledInServerRegistrationContentFragment(f: Fragment): void;
  onRegistrationSuccessInServerRegistrationContentFragment(f: Fragment): void;
}

type Web3ServerRegistrationFactory = (
  agent: Web3PeerPublisherAgent,
  delegate: Web3ServerRegistrationDelegate
) => Fragment | null;

let gFactory: Web3ServerRegistrationFactory | null = null;

export class Web3ServerRegistrationFacade {
  static registerFactory(factory: Web3ServerRegistrationFactory): void {
    gFactory = factory;
  }

  static createRegistrationFragment(
      agent: Web3PeerPublisherAgent,
      delegate: Web3ServerRegistrationDelegate): Fragment | null {
    if (!gFactory) {
      return null;
    }
    return gFactory(agent, delegate);
  }
}

export default Web3ServerRegistrationFacade;
