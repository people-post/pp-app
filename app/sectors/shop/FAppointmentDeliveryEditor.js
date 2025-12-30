
class FAppointmentDeliveryEditor extends shop.FServiceDeliveryEditor {
  _getType() { return dat.ProductDeliveryChoice.TYPE.SCHEDULE; }
};

shop.FAppointmentDeliveryEditor = FAppointmentDeliveryEditor;
}(window.shop = window.shop || {}));