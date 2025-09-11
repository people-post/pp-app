(function(wksp) {
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() { return new wksp.FvcMain(); }
};

wksp.Gateway = Gateway;
}(window.wksp = window.wksp || {}));
