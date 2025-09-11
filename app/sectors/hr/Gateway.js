(function(hr) {
class Gateway extends plt.SectorGateway {
  createMainViewContentFragment() {
    let f = new ui.FViewContentMux();

    let ff = new blog.FvcCareerList();
    f.addTab(
        {name : R.t("Blog"), value : dat.Tag.T_ID.BLOG, icon : C.ICON.BLOG},
        ff);

    if (dba.Workshop.isOpen()) {
      ff = new wksp.FvcCareerList();
      f.addTab(
          {name : R.t("Workshop"), value : "WORKSHOP", icon : C.ICON.WORKSHOP},
          ff);
    }

    if (dba.Shop.isOpen()) {
      ff = new shop.FvcCareerList();
      f.addTab({name : R.t("Shop"), value : "SHOP", icon : C.ICON.SHOP}, ff);
    }

    f.switchTo(dat.Tag.T_ID.BLOG);
    return f;
  }
};

hr.Gateway = Gateway;
}(window.hr = window.hr || {}));
