const { json } = require('express')
const fs = require('fs')

const file = 'data.json'
const options = {encoding: 'utf8'}

const fileExists = (file) => {
    try {
        console.log(fs.existsSync(file))
        return fs.existsSync(file)
    } catch (err) {
        console.error(err);
    }
}

let dataobj = {
    data : fileExists(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {},
    readFile: () => {this.data = JSON.parse(fs.readFileSync(file, 'utf8'))},
    replaceFile: () => {
        //deletefile
        //rewrite file
        writeItem({key: "@startID", data: this.data.startID}, false)
        writeItem({key: "@endID", data: this.data.endID})
        Object.keys(this.data.tasks).map((id) => {
            console.log(this.data.tasks[id])
            writeItem({key: id, data: this.data.tasks[id]})
        })

    }
}




const writeItem = (item, edit = true) => {
    //item '{"key":"@task:2","data":{"id":2,"title":"esdse","subTasks":[],"date":false,"time":false}}'
    let itemJSON;
    if (typeof item === 'string') {
        itemJSON = JSON.parse(item)
    } else {
        itemJSON = item
    }
    console.log("line 18")
    console.log(itemJSON)
    if (fileExists(file) && edit) {
        try {
            const jsonstr = fs.readFileSync(file, 'utf8');
            console.log("line 22")
            console.log(jsonstr.length)
            //let jsonData = JSON.parse(jsonstr)
            let jsonData = JSON.parse(jsonstr)
            console.log(jsonData)
            if (itemJSON.key === "@endID") {
                jsonData.endID = itemJSON.data;
            } else if (itemJSON.key === "@startID") {
                jsonData.startID = itemJSON.data;
            } else {
                const key = itemJSON.key
                jsonData.tasks = {...jsonData.tasks, [key]: itemJSON.data } 
            }

            const jsonToWrite = JSON.stringify(jsonData)
            fs.writeFileSync(file, jsonToWrite, options, (err) => {
                console.log(err)
            });
            
            dataobj.readFile()
            
        } catch(e) {
            console.log(e)
        }
    } else {
        let jsonData = {}
        
        if (itemJSON.key === "@endID") {
            jsonData.endID = itemJSON.data;
        } else if (itemJSON.key === "@startID") {
            jsonData.startID = itemJSON.data;
        } else {
            const key = itemJSON.key
            console.log("line 47")
            console.log({...jsonData.tasks, [key]: itemJSON.data })
            jsonData.tasks = {...jsonData.tasks, [key]: itemJSON.data } 
        }
        console.log(jsonData) // { tasks: { '@task:2': undefined } }
        const jsonToWrite = JSON.stringify(jsonData)
        console.log(jsonToWrite) // {"tasks":{}}
        fs.writeFileSync(file, jsonToWrite, options, (err) => {
            console.log(err)
        });
        dataobj.readFile()
    }
}

const readItem = (key) => {
    console.log("readItem(key) called, (file-system.js)")
    console.log(key)
    if (dataobj.data !== {}) {
        console.log(dataobj)
        if (key === "@endID") {
            console.log(dataobj.data[key])
            return {data: dataobj.data.endID}
        } else if (key === "@startID") {
            console.log(dataobj.data[key])
            return {data: dataobj.data.startID}
        } else {
            console.log(dataobj.data.tasks[key])
            return dataobj.data.tasks[key]
        }
    } else {
        return {msg: "No file as of yet"}
    }
}

//this only deletes tasks
const deleteItem = (key) => {
    console.log("deleteItem(key) called, (file-system.js)")
    console.log(key)
    if (dataobj.data.tasks !== {}) {
        dataobj.data.tasks = Object.keys(dataobj.data.tasks).reduce((newobj , id) => {
            console.log("id " + id)
            console.log("key " + key)
            return id === key ? newobj : {...newobj,  [id]: dataobj.data.tasks[id]}  
        }, {})
        console.log(dataobj.data.tasks)
        dataobj.replaceFile()
    } else {
        return {msg: "No file as of yet"}
    }
}

const getAllData = () => {
    if (dataobj.data === {} && fileExists(file)) {
        dataobj.readFile()
    }
    return dataobj.data
}



module.exports = {
    fileExists: fileExists,
    writeItem: writeItem,
    readItem: readItem,
    deleteItem: deleteItem,
    getAllData: getAllData,
}
//export default {fileExists}

//TODO
/*
1) read and load the data.json file on backend start (if it exists)
2) when an item is wrote to the file, write it and re-read it to this js file



*/