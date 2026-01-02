import { Events as FwkEvents, T_DATA as FwkT_DATA } from '../../lib/framework/Events.js';
import { T_DATA as PltT_DATA } from '../plt/Events.js';
import { UniLongListIdRecord } from '../datatypes/UniLongListIdRecord.js';
import { Quiz as QuizDataType } from '../datatypes/Quiz.js';

export const Quiz = function() {
  let _lib = new Map();
  let _pendingResponses = [];
  let _idRecord = new UniLongListIdRecord();

  function _get(id) {
    if (!id) {
      return null;
    }
    if (!_lib.has(id)) {
      _asyncLoad(id);
    }
    return _lib.get(id);
  }
  function _getIdRecord() { return _idRecord; }

  function _update(quiz) {
    _lib.set(quiz.getId(), quiz);
    FwkEvents.trigger(PltT_DATA.QUIZ, quiz);
  }

  function _remove(quizId) {
    _idRecord.removeId(quizId);
    _lib.delete(quizId);
    FwkEvents.trigger(PltT_DATA.QUIZ_IDS);
  }

  function _reload(id) { _asyncLoad(id); }
  function _reloadIds() { _idRecord.clear(); }

  function _clear() {
    _lib.clear();
    _idRecord.clear();
    FwkEvents.trigger(PltT_DATA.QUIZ_IDS);
  }

  function _asyncLoad(id) {
    if (_pendingResponses.indexOf(id) >= 0) {
      return;
    }
    _pendingResponses.push(id);

    let url = "api/school/quiz?id=" + id;
    api.asyncRawCall(url, r => __onQuizRRR(r, id));
  }

  function __onQuizRRR(responseText, id) {
    let idx = _pendingResponses.indexOf(id);
    if (idx >= 0) {
      _pendingResponses.splice(idx, 1);
    }

    let response = JSON.parse(responseText);
    if (response.error) {
      FwkEvents.trigger(FwkT_DATA.REMOTE_ERROR, response.error);
    } else {
      if (response.data.quiz) {
        let e = new QuizDataType(response.data.quiz);
        _update(e);
      }
    }
  }

  return {
    get : _get,
    getIdRecord : _getIdRecord,
    reloadIds : _reloadIds,
    reload : _reload,
    update : _update,
    remove : _remove,
    clear : _clear,
  };
}();
