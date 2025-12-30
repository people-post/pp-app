
export class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() { return new wksp.FvcMain(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.wksp = window.wksp || {};
  window.wksp.Gateway = Gateway;
}
