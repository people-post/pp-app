(function(dba) {

dba.Workshop = function() {
  let _lib = new Map();
  let _config = null;

  function _isOpen() { return dba.WebConfig.isWorkshopOpen(); }
  function _getTeam(id) {
    let d = dba.WebConfig.getRoleData(id);
    return d ? new dat.WorkshopTeam(d) : null;
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
    fwk.Events.trigger(plt.T_DATA.PROJECT, project);
  }

  function _reloadProject(id) {
    if (id) {
      __asyncLoadProject(id);
    }
  }

  function __getTeams() {
    return dba.WebConfig.getRoleDatasByTagId(dat.Tag.T_ID.WORKSHOP);
  }

  function __setConfig(config) {
    _config = config;
    fwk.Events.trigger(plt.T_DATA.WORKSHOP_CONFIG, config);
  }

  function __asyncLoadProject(id) {
    let url = "api/workshop/project?id=" + id;
    plt.Api.asyncRawCall(url, r => __onProjectRRR(r));
  }

  function __onProjectRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
    } else {
      _updateProject(new dat.Project(response.data.project));
    }
  }

  function __asyncLoadConfig() {
    let url = "api/workshop/config";
    plt.Api.asyncRawCall(url, r => __onConfigRRR(r));
  }

  function __onConfigRRR(responseText) {
    let response = JSON.parse(responseText);
    if (response.error) {
      fwk.Events.trigger(fwk.T_DATA.REMOTE_ERROR, response.error);
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
}(window.dba = window.dba || {}));
