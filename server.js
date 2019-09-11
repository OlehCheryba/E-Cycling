const express     = require('express');
const bodyParser  = require('body-parser');
const path        = require('path');
const formidable  = require('formidable');
const mv          = require('mv');
const fs          = require('fs');
const MongoClient = require("mongodb").MongoClient;
const app         = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './')));

const mongoClient = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true});

const saveData = (collectionName, data, res) => {
  mongoClient.connect(function(err, client){
    const db = client.db("e-cycling");
    const collection = db.collection(collectionName);
    collection.insertOne(data, function(err, result){
      if (err) return console.log(err);
      console.log(result.ops);
      client.close();
      res.send();
    });
  });
}

const getData = (collectionName, res) => {
  MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    let docs = await client.db('e-cycling').collection(collectionName).find().toArray()
    res.send(docs)
    client.close();
  });
}

app.post('/addOrder', (req, res) => saveData('orders', req.body, res));
app.post('/callMe', (req, res) => saveData('call-me', req.body, res));
app.post('/addFastOrder', (req, res) => saveData('fast-orders', req.body, res));

app.get('/getProducts', (req, res) => getData('products', res));
app.get('/getOrders', (req, res) => getData('orders', res));
app.get('/getFastOrders', (req, res) => getData('fast-orders', res));
app.get('/getCallMe', (req, res) => getData('call-me', res));

app.post('/login', (req, res) => {
	req.body.login === '' && req.body.password === '' ? res.send('true') : res.send('false');
});

app.post('/addItem', (req, res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
    let ok = JSON.parse(fields.item)
		const oldpath = files.filetoupload.path;
    const newpath = 'img/products/' + files.filetoupload.name;
    console.log(newpath)
		mv(oldpath, newpath, e => {
      console.log(ok.name)
      saveData('products', ok, res);
		});
	});
});

app.post('/delItem', (req, res) => {
	MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    await client.db('e-cycling').collection('products').deleteOne({name: req.body.nameToRemove});
    res.send();
    client.close();
  });
});

app.post('/delData', (req, res) => {
	MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    await client.db('e-cycling').collection(req.body.nameToRemove).deleteMany();
    res.send();
    client.close();
  });
});

app.listen(process.env.port || 3000, process.env.IP || '0.0.0.0');