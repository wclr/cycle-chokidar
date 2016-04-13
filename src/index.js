import chokidar from 'chokidar'
import {Observable, Subject} from 'rx' 

export const makeWatcherDriver = (path, options = {}) => {
  const watcher = chokidar.watch(path, options)
  const getWatchedSubject = new Subject()
  return (command$) => {
    command$.forEach((command) => {
      if (command == 'getWatched'){
        return getWatchedSubject.onNext(watcher.getWatched())
      }
      var method = Object.keys(command)
        .filter(key => typeof watcher[key] === 'function')[0]
      if (!method){
        throw new Error(`No valid watcher method in command`)
      }
      watcher[method](command[method])
    })
    var events = (event) =>
        Observable.fromEventPattern(handler =>
          watcher.on(event, (...args) => {
            handler(args)
          })
        )
    return {
      getWatched: getWatchedSubject,
      events,
      on: events,
      all: () => events('all'),
      dispose: () => watcher.close()
    }
  }
} 