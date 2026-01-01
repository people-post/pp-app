import { WebConfig } from './WebConfig.js';
import { SocialItem } from '../datatypes/SocialItem.js';
import { ShopTeam } from '../datatypes/ShopTeam.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { Product } from '../datatypes/Product.js';
import { SupplierOrderPrivate } from '../datatypes/SupplierOrderPrivate.js';
import { ItemLabel } from '../datatypes/ItemLabel.js';
import { PaymentTerminal } from '../datatypes/PaymentTerminal.js';
import { ShopRegister } from '../datatypes/ShopRegister.js';
import { ShopBranch } from '../datatypes/ShopBranch.js';

export const Shop = function() {
  let _productLib = new Map();
  let _orderLib = new Map();
  let _mBranch = new Map();
  let _mRegister = new Map();
  let _mTerminal = new Map();
  let _config = null;
  let _pendingResponses = [];
  let _addressLabels = null;
  let _branchLabels = null;

  function _isOpen() { return WebConfig.isShopOpen(); }

  function _getConfig() {
    if (!_config) {
      __asyncLoadConfig();
    }
    return _config;
  }

  function _getItemLayoutType() {
    let c = _getConfig();
    let t = c && c.item_layout ? c.item_layout.type : null;
    return t ? t : SocialItem.T_LAYOUT.MEDIUM;
  }

  function _getTeam(id) {
    let d = WebConfig.getRoleData(id);
    return d ? new ShopTeam(d) : null;
  }

  function _getTeamIds() { return __getTeams().map(r => r.id); }

  function _getOpenTeamIds() {
    return __getTeams().filter(r => r.is_open).map(r => r.id);
  }

  function _getCurrencyIds() {
    return [ "62868b631720e893fda37c5e", "62868b5d1720e893fda37c5d" ];
  }

  function _getAddressLabels() {
    if (_addressLabels) {
      return _addressLabels;
    } else {
      __asyncLoadAddressLabels();
      return [];
    }
  }

  function _getBranchLabels() {
    if (_branchLabels) {
      return _branchLabels;
    } else {
      __asyncLoadBranchLabels();
      return [];
    }
  }

  function _getAddressIds() {
    let labels = _getAddressLabels();
    return labels.map(l => l.getId());
  }

  function _getBranch(id) {
    if (id) {
      if (_mBranch.has(id)) {
        return _mBranch.get(id);
      } else {
        __asyncGetBranch(id);
      }
    }
    return null;
  }

  function _getRegister(id) {
    if (id) {
      if (_mRegister.has(id)) {
        return _mRegister.get(id);
      } else {
        __asyncGetRegister(id);
      }
    }
    return null;
  }

  function _getPaymentTerminal(id) {
    if (id) {
      if (_mTerminal.has(id)) {
        return _mTerminal.get(id);
      } else {
        __asyncGetPaymentTerminal(id);
      }
    }
    return null;
  }

  function _getProduct(id) {
    if (!id) {
      return null;
    }
    if (!_productLib.has(id)) {
      __asyncLoadProduct(id);
    }
    return _productLib.get(id);
  }

  function _getOrder(id) {
    if (!id) {
      return null;
    }
    if (!_orderLib.has(id)) {
      __asyncLoadOrder(id);
    }
    return _orderLib.get(id);
  }

  function __getTeams() {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.SHOP);
  }

  function __setConfig(config) {
    _config = config;
    FwkEvents.trigger(PltT_DATA.SHOP_CONFIG, config);
  }

  function _updateProduct(product) {
    _productLib.set(product.getId(), product);
    FwkEvents.trigger(PltT_DATA.PRODUCT, product);
  }

  function _updateOrder(order) {
    _orderLib.set(order.getId(), order);
    FwkEvents.trigger(PltT_DATA.SUPPLIER_ORDER, order);
  }

  function _resetAddressLabels(labels) {
    _addressLabels = [];
    for (let l of labels) {
      _addressLabels.push(new ItemLabel(l));
    }
    FwkEvents.trigger(PltT_DATA.SHOP_ADDRESS_LABELS);
  }

  function _resetBranchLabels(labels) {
    _branchLabels = [];
    for (let l of labels) {
      _branchLabels.push(new ItemLabel(l));
    }
    FwkEvents.trigger(PltT_DATA.SHOP_BRANCH_LABELS);
  }

  function _updateBranch(branch) {
    _mBranch.set(branch.getId(), branch);
    FwkEvents.trigger(PltT_DATA.SHOP_BRANCH, branch);
  }

  function _updateRegister(register) {
    _mRegister.set(register.getId(), register);
    FwkEvents.trigger(PltT_DATA.SHOP_REGISTER, register);
  }

  function _updatePaymentTerminal(terminal) {
    _mTerminal.set(terminal.getId(), terminal);
    FwkEvents.trigger(PltT_DATA.PAYMENT_TERMINAL, terminal);
  }

  function __asyncLoadProduct(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);

    let url = "api/shop/product?id=" + id;
    api.asyncRawCall(url, r => __onProductRRR(r, id));
  }

  function __onProductRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.product) {
        _updateProduct(new Product(response.data.product));
      }
    }
  }

  function __asyncLoadOrder(id) {
    let url = "api/shop/supplier_order?id=" + id;
    api.asyncRawCall(url, r => __onOrderRRR(r));
  }

  function __onOrderRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateOrder(new SupplierOrderPrivate(response.data.supplier_order));
    }
  }

  function _asyncQueryQueueSize(branchId, productId) {
    let url = "api/shop/queue_size";
    let fd = new FormData()
    fd.append("branch_id", branchId);
    if (productId && productId.length) {
      fd.append("product_id", productId);
    }
    api.asyncRawPost(url, fd, r => __onQueryQueueSizeRRR(r));
  }

  function __onQueryQueueSizeRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      FwkEvents.trigger(PltT_DATA.SERVICE_QUEUE_SIZE, response.data.size);
    }
  }

  function __asyncLoadConfig() {
    let url = "api/shop/config";
    api.asyncRawCall(url, r => __onConfigRRR(r));
  }

  function __onConfigRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      __setConfig(response.data.config);
    }
  }

  function _asyncUpdateConfig(config) {
    let url = "api/shop/update_config";
    let fd = new FormData()
    fd.append("name", config.name);
    api.asyncRawPost(url, fd, r => __onConfigRRR(r));
  }

  function __asyncLoadAddressLabels() {
    let url = "api/shop/address_labels";
    api.asyncRawCall(url, r => __onAddressLabelsRRR(r));
  }

  function __onAddressLabelsRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _resetAddressLabels(response.data.labels);
    }
  }

  function __asyncLoadBranchLabels() {
    let url = "api/shop/branch_labels";
    api.asyncRawCall(url, r => __onBranchLabelsRRR(r));
  }

  function __onBranchLabelsRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _resetBranchLabels(response.data.labels);
    }
  }

  function __asyncGetPaymentTerminal(id) {
    let url = "api/shop/payment_terminal";
    let fd = new FormData();
    fd.append("id", id);
    api.asyncRawPost(url, fd, r => __onPaymentTerminalRRR(r));
  }

  function __onPaymentTerminalRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _updatePaymentTerminal(new PaymentTerminal(response.data.terminal));
    }
  }

  function __asyncGetRegister(id) {
    let url = "api/shop/register";
    let fd = new FormData();
    fd.append("id", id);
    api.asyncRawPost(url, fd, r => __onRegisterRRR(r));
  }

  function __onRegisterRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateRegister(new ShopRegister(response.data.register));
    }
  }

  function __asyncGetBranch(id) {
    let url = "api/shop/branch";
    let fd = new FormData();
    fd.append("id", id);
    api.asyncRawPost(url, fd, r => __onBranchRRR(r));
  }

  function __onBranchRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateBranch(new ShopBranch(response.data.branch));
    }
  }

  return {
    isOpen : _isOpen,
    getConfig : _getConfig,
    getItemLayoutType : _getItemLayoutType,
    getTeam : _getTeam,
    getTeamIds : _getTeamIds,
    getOpenTeamIds : _getOpenTeamIds,
    getProduct : _getProduct,
    getOrder : _getOrder,
    getCurrencyIds : _getCurrencyIds,
    getAddressIds : _getAddressIds,
    getAddressLabels : _getAddressLabels,
    getBranchLabels : _getBranchLabels,
    getBranch : _getBranch,
    getRegister : _getRegister,
    getPaymentTerminal : _getPaymentTerminal,
    updateBranch : _updateBranch,
    updateRegister : _updateRegister,
    updatePaymentTerminal : _updatePaymentTerminal,
    updateProduct : _updateProduct,
    updateOrder : _updateOrder,
    asyncQueryQueueSize : _asyncQueryQueueSize,
    asyncUpdateConfig : _asyncUpdateConfig,
  };
}();
