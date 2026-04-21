import { FvcWeb3ServerRegistration } from '../../sectors/hosting/FvcWeb3ServerRegistration.js';
import { Web3PeerPublisherAgent } from '../../common/pdb/Web3Publisher.js';
import {
  Web3ServerRegistrationFacade,
  type Web3ServerRegistrationDelegate
} from '../../common/pdb/Web3ServerRegistrationFacade.js';

export function registerWeb3ServerRegistrationFactory(): void {
  Web3ServerRegistrationFacade.registerFactory((agent: Web3PeerPublisherAgent, delegate: Web3ServerRegistrationDelegate) => {
    const fragment = new FvcWeb3ServerRegistration();
    fragment.setAgent(agent);
    fragment.setDelegate(delegate as {
      onRegistrationCanceledInServerRegistrationContentFragment(f: FvcWeb3ServerRegistration): void;
      onRegistrationSuccessInServerRegistrationContentFragment(f: FvcWeb3ServerRegistration): void;
    });
    return fragment;
  });
}
