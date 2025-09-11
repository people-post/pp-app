(function(ftpg) {
class FvcBriefDonation extends ui.FViewContentBase {
  _renderOnRender(render) { render.replaceContent("Donation"); }
};

ftpg.FvcBriefDonation = FvcBriefDonation;
}(window.ftpg = window.ftpg || {}));
