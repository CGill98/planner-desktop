console.log("server running")

// Require express and create an instance of it
var express = require('express');
var app = express();
var cors = require('cors')
//const db = require('./db/db.js')
const fs = require('./storage/file-system')

app.use(cors())

// on the request to root (localhost:3000/)
app.get('/', function (req, res) {
    res.send('<b>My</b> worst express http server');
});

//
app.post('/setItem/:item', function (req, res) {
    console.log(req.params)
    fs.writeItem(req.params.item)
});

app.get('/getItem/:key', function (req, res) {
    console.log(req.params)
    res.json(fs.readItem(req.params.key))
});

app.get('/getAllData', function (req, res) {
    console.log(req.params)
    res.json(fs.getAllData())
});


app.delete('/deleteItem/:key', function (req, res) {
    const key = req.params.key;
    fs.deleteItem(key)
})


// start the server in the port 3000 !
app.listen(3050, function () {
    console.log('Example app listening on port 3000.');
});
