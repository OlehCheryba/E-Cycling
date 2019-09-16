const express     = require('express');
const bodyParser  = require('body-parser');
const path        = require('path');
const formidable  = require('formidable');
const mv          = require('mv');
const MongoClient = require("mongodb").MongoClient;
const app         = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './')));

const mongoClient = new MongoClient("mongodb://localhost:27017", {useNewUrlParser: true, useUnifiedTopology: true});

const saveData = (collectionName, data, res) => {
  MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    await client.db("e-cycling").collection(collectionName).insertOne(data)
    client.close();
    res.send();
  });
}

const getData = (collectionName, res) => {
  MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    let docs = await client.db('e-cycling').collection(collectionName).find().toArray()
    client.close();
    res.send(docs);
  });
}

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/our-office', (req, res) => res.sendFile(path.join(__dirname, 'our-office.html')));
app.get('/vacancies', (req, res) => res.sendFile(path.join(__dirname, 'vacancies.html')));
app.get('/clients', (req, res) => res.sendFile(path.join(__dirname, 'clients.html')));
app.get('/products', (req, res) => getData('products', res));
app.get('/orders', (req, res) => getData('orders', res));
app.get('/constructor-orders', (req, res) => getData('constructor-orders', res));
app.get('/call-me', (req, res) => getData('call-me', res));

app.post('/orders', (req, res) => saveData('orders', req.body, res));
app.post('/constructor-orders', (req, res) => saveData('constructor-orders', req.body, res));
app.post('/call-me', (req, res) => saveData('call-me', req.body, res));

app.post('/login', (req, res) => {
	req.body.login === '' && req.body.password === '' ? res.send('true') : res.send('false');
});

app.post('/products', (req, res) => {
	const form = new formidable.IncomingForm();
	form.parse(req, function (err, fields, files) {
    if (err) return console.log(err)
    let ok = JSON.parse(fields.item);
		const oldpath = files.filetoupload.path;
    const newpath = 'img/products/' + files.filetoupload.name;
		mv(oldpath, newpath, e => {
      saveData('products', ok, res);
		});
	});
});

app.delete('/products', (req, res) => {
	MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    await client.db('e-cycling').collection('products').deleteOne({name: req.body.nameToRemove});
    res.send();
    client.close();
  });
});

app.delete('/data', (req, res) => {
	MongoClient.connect("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
    await client.db('e-cycling').collection(req.body.nameToRemove).deleteMany();
    res.send();
    client.close();
  });
});

app.listen(process.env.port || 3000, process.env.IP || '0.0.0.0');