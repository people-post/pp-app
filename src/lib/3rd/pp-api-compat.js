/**
 * Compatibility layer for pp-api
 * Imports from pp-api and exposes as global 'pp' object
 */

import * as ppApi from 'pp-api';

// Create the global pp object with the expected structure
// pp-api exports: sys, User, Owner, RemoteServer, PublisherAgent, ServerAgent, StorageAgent, Ipfs, dat, asInit
const pp = {
  sys: ppApi.sys,
  User: ppApi.User,
  Owner: ppApi.Owner,
  RemoteServer: ppApi.RemoteServer,
  PublisherAgent: ppApi.PublisherAgent,
  ServerAgent: ppApi.ServerAgent,
  StorageAgent: ppApi.StorageAgent,
  Ipfs: ppApi.Ipfs,
  dat: ppApi.dat,
  asInit: ppApi.asInit
};

// Export for ES modules
export default pp;

// Also set as global for backward compatibility
if (typeof window !== 'undefined') {
  window.pp = pp;
}

// Make it available globally
globalThis.pp = pp;
