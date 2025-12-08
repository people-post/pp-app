(function(ftpg) {
class FvcBriefDonationResult extends ui.FViewContentBase {
  static T_TYPE = {SUCCESS : Symbol(), FAILURE: Symbol()};

  #type;

  setType(t) { this.#type = t; }

  _renderOnRender(render) {
    switch (this.#type) {
    case this.constructor.T_TYPE.SUCCESS:
      render.replaceContent("Success");
      break;
    default:
      render.replaceContent("Success");
      break;
    }
  }
};

ftpg.FvcBriefDonationResult = FvcBriefDonationResult;
}(window.ftpg = window.ftpg || {}));
