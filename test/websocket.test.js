const chai = require('chai')
const expect = chai.expect
const WebSocket = require('ws')
const WSServer = require('./../websocket')
const Storage = require('./../storage.js')
const store = new Storage('./test/storage.test.txt')
const _ = new WSServer(store)
const url = 'ws://localhost:8080'

describe('websocket', () => {
    it('should handle a single subscriber', function(done) {
        const player = new WebSocket(url)
        const message = {
            name: 'test',
            date: new Date(),
        }
        player.once('open', () => {
            player.send(JSON.stringify(message))
        })
        player.once('message', function (msg) {
            expect(JSON.stringify(message.name)).equal(msg)
            done()
        })
    })
    it('should handle multiple subscribers', function() {
        const nrClients = 100
        let responses = []
        const message = {
            name: 'test',
            date: new Date(),
        }
        let player
        for (let i = 0; i < nrClients; i++) {
            player = new WebSocket(url)
            // Resolve this promise when the subscriber receives the msg
            const promise = new Promise((resolve) => {
                player.once('message', function (msg) {
                    expect(JSON.stringify(message.name)).equal(msg)
                    resolve()
                })
            })
            responses.push(promise)
        }
        player.once('open', () => {
            player.send(JSON.stringify(message))
        })
        // Return when all subscriber's have received the message
        return Promise.all(responses)
    })
    it('should handle multiple events', function() {
        const player = new WebSocket(url)
        const nrEvents = 100
        let responses = []
        let message = {
            name: 'test',
            date: new Date(),
        }

        player.once('open', () => {
            for (let i = 0; i < nrEvents; i++) {
                message.name = i
                player.send(JSON.stringify(message))
                const promise = new Promise((resolve) => {
                    player.on('message', function (msg) {
                        if(msg === `${i}`) resolve()
                    })
                })
                responses.push(promise)
            }
        })
        return Promise.all(responses)
    })
})
