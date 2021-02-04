const WebSocket = require('ws')
const Storage = require('./storage.js')

class WSServer {
  constructor(store = new Storage()) {
    // Set up store for handling persistence
    this.store = store
    // Schedule broadcast of stored messages
    this.store.loadMessages().forEach((message) => {
      this.scheduleBroadcast(JSON.parse(message))
    })
    // Start server and listen for messages
    this.wss = new WebSocket.Server({ port: 8080 })
    this.wss.on('connection', (ws) => {
      ws.on('message', this.receiveMessage.bind(this))
    })
  }

  receiveMessage(message) {
    if (!message) return // do not parse empty message
    console.log(`Received message => ${message}`)

    this.store.addEvent(message)
    this.scheduleBroadcast(JSON.parse(message))
  }

  scheduleBroadcast({ name = '', date = new Date() }) {
    // time till event minus 1ms to account for processing time
    const timeTillEvent = Math.abs(new Date(date) - new Date()) - 1
    setTimeout(() => {
      this.broadcast(name)
    }, timeTillEvent)
  }

  broadcast(name = '') {
    console.log('Broadcasting message')
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(name))
      }
    })
  }
}

module.exports = WSServer