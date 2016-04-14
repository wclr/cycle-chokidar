'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeWatcherDriver = undefined;

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeWatcherDriver = exports.makeWatcherDriver = function makeWatcherDriver(path) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var watcher = _chokidar2.default.watch(path, options);
  var getWatchedSubject = new _rx.Subject();
  return function (instruction$) {
    instruction$.forEach(function (instruction) {
      if (instruction === 'getWatched') {
        return getWatchedSubject.onNext(watcher.getWatched());
      }
      var method = Object.keys(instruction).filter(function (key) {
        return key === 'add' || key === 'unwatch';
      })[0];
      if (!method) {
        throw new Error('Instruction does not contain valid method');
      }
      watcher[method](instruction[method]);
    });
    var events = function events(event) {
      return _rx.Observable.fromEventPattern(function (handler) {
        return watcher.on(event, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          handler(args);
        });
      });
    };
    return {
      getWatched: getWatchedSubject,
      events: events,
      on: events,
      all: function all() {
        return events('all');
      },
      dispose: function dispose() {
        return watcher.close();
      }
    };
  };
};
