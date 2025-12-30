export class Web3ResolverAgent extends pp.ServerAgent {};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.pdb = window.pdb || {};
  window.pdb.Web3ResolverAgent = Web3ResolverAgent;
}
