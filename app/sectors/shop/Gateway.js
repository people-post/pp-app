(function(shop) {
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() { return new shop.FvcMain(); }
};

shop.Gateway = Gateway;
}(window.shop = window.shop || {}));
