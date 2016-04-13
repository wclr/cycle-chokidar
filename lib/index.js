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
  return function (command$) {
    command$.forEach(function (command) {
      if (command == 'getWatched') {
        return getWatchedSubject.onNext(watcher.getWatched());
      }
      var method = Object.keys(command).filter(function (key) {
        return typeof watcher[key] === 'function';
      })[0];
      if (!method) {
        throw new Error('No valid watcher method in command');
      }
      watcher[method](command[method]);
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
