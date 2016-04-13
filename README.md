# cycle-chokidar
Cycle.js driver [chokidar.js](https://github.com/paulmillr/chokidar) node.js file watcher.

## API
Everything in accordance with chokidar API:
https://github.com/paulmillr/chokidar#methods--events

`makeWatcherDriver` will create watcher instance which can handle requested events and execute instructions send to driver.

Events api has main method `on` (or `events` as alias) which takes event name and produces stream of this events:
```js
  watcher
    .events('addDir')
    .map(([path, details])) // produces array of arguments passed to `chokidar watcher` event handler callback.
    ...
```

also there is `watcher.all()` shortcut for `all` events.

You may send instructions to driver: in form like `{add: 'some/path/to/add'}`, there is two methods you probably want to use: 
`add`, `unwatch`. 

`close()` on created `watcher` instance will be executed on driver `dispose`. 

You can also send instruction `getWatched` to driver, and get response on `watcher.getWatch`: 

```js  
  const main = ({watcher}) => {
    return {
      watcher: O.of('getWatch'),
      log: watcher.getWatch
    }
  }
  run(main, {
    watcher: makeWatcherDriver('.', {ignored: /[\/\\]\./}),
    log: (message$) => {
      message$.forEach(message => {
        console.log(message)
      })
    }
  })
```

### Tests
```
npm install
npm run test
```