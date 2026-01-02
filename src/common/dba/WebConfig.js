import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { ColorTheme } from '../datatypes/ColorTheme.js';
import { FrontPageConfig } from '../datatypes/FrontPageConfig.js';
import { Tag } from '../datatypes/Tag.js';
import { User } from '../datatypes/User.js';
import { Menus } from './Menus.js';
import { api } from '../plt/Api.js';
import { ID, URL_PARAM } from '../constants/Constants.js';
import { glb } from '../../lib/framework/Global.js';

export const WebConfig = function() {
  let _data = null;
  let _themeId = null;
  let _bootTheme = null;

  function _reset(data) {
    _data = data;
    FwkEvents.trigger(FwkT_DATA.WEB_CONFIG);
  }
  function _resetRoles(roles) {
    if (_data) {
      _data.roles = roles;
      FwkEvents.trigger(PltT_DATA.GROUPS);
    }
  }
  function _resetTags(tags) {
    if (_data) {
      _data.tags = tags;
      FwkEvents.trigger(PltT_DATA.GROUPS);
    }
  }
  function _isShopOpen() { return _data && _data.is_shop_open; }
  function _isWorkshopOpen() { return _data && _data.is_workshop_open; }
  function _isDevSite() { return _data ? _data.is_dev_site : false; }
  function _isWebOwner(userId) { return userId && userId == _getOwnerId(); }
  function _getWebSocketUrl() { return _data ? _data.web_socket_url : null; }
  function _getLoginProxyUrl() { return _data ? _data.login_proxy_url : null; }
  function _getRtmpUrl() { return _data ? _data.rtmp_url : null; }
  function _getIceUrl() { return _data ? _data.ice_url : null; }
  function _getMaxNFrames() { return _data ? _data.max_n_frames : 2; }
  function _getHomeSector() {
    let sectorId = ID.SECTOR.BLOG;
    if (_data && _data.home_sector) {
      sectorId = _data.home_sector;
    }
    return sectorId;
  }
  function _getHomePageTitle() { return _data ? _data.home_page_title : null; }
  function _getOwnerId() {
    if (glb.env.isWeb3()) {
      return window.dba.Account.getId();
    }

    return _data ? _data.owner.uuid : null;
  }
  function _getOwner() {
    if (glb.env.isWeb3()) {
      return window.dba.Account;
    } else {
      if (!_data) {
        return null;
      }
      return new User(_data.owner);
    }
  }
  function _getHomeUrl() {
    if (glb.env.isWeb3()) {
      return "?";
    } else {
      return "/?" + URL_PARAM.USER + "=" + _getOwnerId();
    }
  }
  function _getSubUrl(sectorId) {
    return "/sub?" + URL_PARAM.USER + "=" + _getOwnerId() + "&" +
           URL_PARAM.SECTOR + "=" + sectorId;
  }
  function _getDefaultTheme() {
    return _data && _data.default_theme
               ? new ColorTheme(_data.default_theme)
               : _bootTheme;
  }
  function _getFrontPageConfig() {
    return _data && _data.front_page ? new FrontPageConfig(_data.front_page)
                                     : null;
  }
  function _getLeftSideFrameConfig() {
    let d = _data ? _data.side_frames : null;
    return d ? d.left : null;
  }
  function _getRightSideFrameConfig() {
    let d = _data ? _data.side_frames : null;
    return d ? d.right : null;
  }
  function _getTags() {
    let ds = _data ? _data.tags : [];
    let tags = [];
    for (let d of ds) {
      tags.push(new Tag(d));
    }
    return tags;
  }
  function _getTag(id) {
    let ds = _data ? _data.tags : [];
    if (id) {
      for (let d of ds) {
        if (d.id == id) {
          return new Tag(d);
        }
      }
    }
    return null;
  }

  function _getRoleDatasByTagId(tagId) {
    // TODO: This is a hack, use objects
    let ds = [];
    for (let d of __getRoleDatas()) {
      if (d.tag_ids.indexOf(tagId) >= 0) {
        ds.push(d);
      }
    }
    return ds;
  }

  function _getRoleData(id) {
    // TODO: This is a hack, use object
    if (id) {
      for (let d of __getRoleDatas()) {
        if (d.id == id) {
          return d;
        }
      }
    }
    return null;
  }

  function _getCurrentTheme() {
    if (_themeId) {
      let m = Menus.find(_themeId);
      if (m) {
        return m.getTheme();
      }
    }

    return _getDefaultTheme();
  }

  function _setThemeId(id) {
    if (_themeId != id) {
      _themeId = id;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG);
    }
  }
  function _setBootTheme(data) { _bootTheme = new ColorTheme(data); }
  function _setGroups(groups) {
    if (_data) {
      _data.groups = groups;
    }
  }
  function _setWorkshopOpen(v) {
    if (_data) {
      _data.is_workshop_open = v;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG);
    }
  }
  function _setShopOpen(v) {
    if (_data) {
      _data.is_shop_open = v;
      FwkEvents.trigger(FwkT_DATA.WEB_CONFIG);
    }
  }
  function _asyncSetHomeSector(sectorId) {
    let url = "api/user/set_home_sector";
    let fd = new FormData();
    fd.append("sector", sectorId);
    api.asyncRawPost(url, fd, r => __onSetHomeSectorRRR(r));
  }

  function _asyncUpdateGroupConfig(groupId, newName = null, themeKey = null,
                                   themeColor = null) {
    let url = "/api/user/update_group";
    let fd = new FormData();
    fd.append('id', groupId)
    if (newName) {
      fd.append('name', newName)
    }
    if (themeKey) {
      fd.append('key', themeKey)
    }
    if (themeColor) {
      fd.append('color', themeColor)
    }
    api.asyncRawPost(url, fd, r => __onUpdateGroupRRR(r));
  }

  function __getRoleDatas() {
    return (_data && _data.roles) ? _data.roles : [];
  }

  function __onSetHomeSectorRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _reset(response.data.web_config);
    }
  }

  function __onUpdateGroupRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _reset(response.data.web_config);
    }
  }

  return {
    reset : _reset,
    resetTags : _resetTags,
    resetRoles : _resetRoles,
    isShopOpen : _isShopOpen,
    isWorkshopOpen : _isWorkshopOpen,
    isDevSite : _isDevSite,
    isWebOwner : _isWebOwner,
    getHomeSector : _getHomeSector,
    getCurrentTheme : _getCurrentTheme,
    getMaxNFrames : _getMaxNFrames,
    getLeftSideFrameConfig : _getLeftSideFrameConfig,
    getRightSideFrameConfig : _getRightSideFrameConfig,
    getHomePageTitle : _getHomePageTitle,
    getOwnerId : _getOwnerId,
    getOwner : _getOwner,
    getHomeUrl : _getHomeUrl,
    getSubUrl : _getSubUrl,
    getDefaultTheme : _getDefaultTheme,
    getFrontPageConfig : _getFrontPageConfig,
    getTags : _getTags,
    getTag : _getTag,
    getRoleDatasByTagId : _getRoleDatasByTagId,
    getRoleData : _getRoleData,
    getWebSocketUrl : _getWebSocketUrl,
    getLoginProxyUrl : _getLoginProxyUrl,
    getRtmpUrl : _getRtmpUrl,
    getIceUrl : _getIceUrl,
    asyncSetHomeSector : _asyncSetHomeSector,
    asyncUpdateGroupConfig : _asyncUpdateGroupConfig,
    setThemeId : _setThemeId,
    setBootTheme : _setBootTheme,
    setGroups : _setGroups,
    setWorkshopOpen : _setWorkshopOpen,
    setShopOpen : _setShopOpen,
  };
}();
