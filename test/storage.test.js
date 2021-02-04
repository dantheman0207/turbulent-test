const chai = require('chai')
const expect = chai.expect
const fs = require('fs')
const Storage = require('./../storage.js')

describe('storage', () => {
    it('should be able to access the storage file', function(done) {
        const file = './test/storage.test.txt'
        fs.closeSync(fs.openSync(file, 'w')) // reset to blank file
        new Storage(file)
        done()
    })
  
    it('should save an event to file and read it back', function(done) {
      const store = new Storage()
      const event = {
          name: 'test',
          date: new Date(),
      }
      const data = store.loadMessages()
      const msg = JSON.stringify(event)

      store.addEvent(msg)
      expect(store.loadMessages()).eql(data.concat([msg]))
      done()
    })
})
