import { WebConfig } from './WebConfig.js';
import { WorkshopTeam } from '../datatypes/WorkshopTeam.js';
import { Tag } from '../datatypes/Tag.js';
import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { api } from '../plt/Api.js';
import { Project } from '../datatypes/Project.js';

export const Workshop = function() {
  let _lib = new Map();
  let _config = null;

  function _isOpen() { return WebConfig.isWorkshopOpen(); }
  function _getTeam(id) {
    let d = WebConfig.getRoleData(id);
    return d ? new WorkshopTeam(d) : null;
  }
  function _getTeamIds() { return __getTeams().map(r => r.id); }
  function _getOpenTeamIds() {
    return __getTeams().filter(r => r.is_open).map(r => r.id);
  }
  function _getProject(id) {
    if (!id) {
      return null;
    }
    if (!_lib.has(id)) {
      __asyncLoadProject(id);
    }
    return _lib.get(id);
  }

  function _getConfig() {
    if (!_config) {
      __asyncLoadConfig();
    }
    return _config;
  }

  function _updateProject(project) {
    _lib.set(project.getId(), project);
    FwkEvents.trigger(PltT_DATA.PROJECT, project);
  }

  function _reloadProject(id) {
    if (id) {
      __asyncLoadProject(id);
    }
  }

  function __getTeams() {
    return WebConfig.getRoleDatasByTagId(Tag.T_ID.WORKSHOP);
  }

  function __setConfig(config) {
    _config = config;
    FwkEvents.trigger(PltT_DATA.WORKSHOP_CONFIG, config);
  }

  function __asyncLoadProject(id) {
    let url = "api/workshop/project?id=" + id;
    api.asyncRawCall(url, r => __onProjectRRR(r));
  }

  function __onProjectRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateProject(new Project(response.data.project));
    }
  }

  function __asyncLoadConfig() {
    let url = "api/workshop/config";
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

  return {
    isOpen : _isOpen,
    getProject : _getProject,
    getTeam : _getTeam,
    getTeamIds : _getTeamIds,
    getOpenTeamIds : _getOpenTeamIds,
    getConfig : _getConfig,
    updateProject : _updateProject,
    reloadProject : _reloadProject,
  };
}();

