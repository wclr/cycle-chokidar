import {makeWatcherDriver} from '../lib'
import fs from 'fs'
import path from 'path'
import test from 'tape'
import {Observable as O} from 'rx'

const dummy = path.normalize(__dirname + '/dummy.txt')
const unlinkDummy = () => {
  if (fs.existsSync(dummy)){
    fs.unlinkSync(dummy)
  }
}

test('just watch initial dir', (t) => {
  unlinkDummy()
  let driver = makeWatcherDriver(__dirname)
  let watcher = driver(O.empty())
  watcher.on('add')
    .filter(([path]) => !/test\.js$/.test(path))
    .take(1).subscribe(([path]) => {
      t.is(path, dummy)
      t.end()
    })
  fs.writeFileSync(dummy, 'test')
})

test('add path to watch', (t) => {
  unlinkDummy()
  let driver = makeWatcherDriver()
  let watcher = driver(O.of({add: dummy}))

    watcher.all().take(1).subscribe((res) => {
      t.is(res[0], 'add', 'event ok')
      t.is(res[1], dummy, 'path ok')
      t.end()
    })
  setTimeout(function(){
    fs.writeFileSync(dummy, 'test')
  }, 100)
})

test('getWatch', (t) => {
  unlinkDummy()
  let driver = makeWatcherDriver(__dirname)
  let watcher = driver(O.of('getWatched').delay(100))

  watcher.getWatched.take(1).subscribe((watched) => {
    t.ok(watched[__dirname], 'getWatch correct')
    t.end()
  })
})


test('THE END', (t) => {
  unlinkDummy()
  t.end()
})