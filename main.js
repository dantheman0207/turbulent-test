const WSServer = require('./websocket')
const Storage = require('./storage.js')

const store = new Storage('./storage.txt')
new WSServer(store)