
export class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() { return new shop.FvcMain(); }
};



// Backward compatibility
if (typeof window !== 'undefined') {
  window.shop = window.shop || {};
  window.shop.Gateway = Gateway;
}
