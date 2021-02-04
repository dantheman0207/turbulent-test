const fs = require('fs')

class Storage {
    constructor(file = './storage.txt') {
        this.file = file
        try {
            fs.accessSync(this.file, fs.constants.W_OK);
        } catch (err) {
            console.error(`Cannot access storage file: ${err}`);
        }
    }

    loadMessages() {
        try {
            return fs.readFileSync(this.file, 'utf8')
                .split('\n') // split each line into a message
                .slice(0,-1) // remove trailing whitespace
        } catch(err) {
            console.log(`Failed to read file with error ${err}`)
        }
    }

    addEvent(msg) {
        try {
            fs.appendFileSync(this.file, `${msg}\n`)
        } catch (err) {
            console.log(`Failed to append to file with error ${err}`)
        }
    }
}

module.exports = Storage