import chokidar from 'chokidar'
import {Observable, Subject} from 'rx' 

export const makeWatcherDriver = (path, options = {}) => {
  const watcher = chokidar.watch(path, options)
  const getWatchedSubject = new Subject()
  return (instruction$) => {
    instruction$.forEach((instruction) => {
      if (instruction === 'getWatched'){
        return getWatchedSubject.onNext(watcher.getWatched())
      }
      var method = Object.keys(instruction)
        .filter(key => key === 'add' || key === 'unwatch')[0]
      if (!method){
        throw new Error(`Instruction does not contain valid method`)
      }
      watcher[method](instruction[method])
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