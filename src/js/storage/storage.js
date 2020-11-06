import fs from 'fs'

const text = "something to store"

//appendFile for changing files

//readFile returns 
function write() {
    fs.writeFile('something.bin', text, 'binary')
}

export default {write}