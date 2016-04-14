# cycle-chokidar
Cycle.js driver [chokidar.js](https://github.com/paulmillr/chokidar) node.js file watcher.

## API
Everything in accordance with chokidar API:
https://github.com/paulmillr/chokidar#methods--events

`makeWatcherDriver` will create watcher instance which can handle requested events and execute instructions send to driver.

Events api has main method `on` (or `events` as alias) which takes event name and produces stream of this events:
```js
  watcher
    .on('addDir')
    .map(([path, details])) // get array of arguments passed to `chokidar watcher` event handler callback.
    ...
```

also there is `watcher.all()` shortcut for `all` events.

You may send instructions to driver: in the form like `{add: 'some/path/to/add'}`, there is two methods you may use here: 
`add` and `unwatch`. 

You can also send instruction `getWatched` to driver, and it will push result into `watcher.getWatched` stream: 

```js  
  const main = ({watcher}) => {
    return {
      watcher: O.of('getWatched'),
      log: watcher.getWatched
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

On `dispose` driver will execute `close()` on created `watcher`.

### Install
```bash
npm install cycle-chokidar
```

### Tests
```
npm install
npm run test
```