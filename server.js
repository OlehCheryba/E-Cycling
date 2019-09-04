const express     = require('express');
const bodyParser  = require('body-parser');
const path        = require('path');
const http        = require('http');
var formidable    = require('formidable');
var mv = require('mv');
const app         = express();

app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, './')));

app.post('/fileupload', (request, res) => {
    var form = new formidable.IncomingForm();
    form.parse(request, function (err, fields, files) {
    	try {
	    	var oldpath = files.filetoupload.path;
	    	var newpath = 'img/' + files.filetoupload.name;
	    	mv(oldpath, newpath, e => {
                res.send()
            });
    	} catch (e) {
    		mv('bike-offroad.jpg', 'bike-offroad.jpg', e => {
                res.send()
            });
    	}
    });
});
app.post('/addorder', (req, res) => {
    const fs = require('fs');
    fs.appendFile('orders.txt', JSON.stringify(req.body) + '\n', () => {
        res.send('Ваші дані прийнято. Дякуємо за покупку.');
    });
});
app.post('/callme', (req, res) => {
	const fs = require('fs');
	fs.appendFile('callme.txt', JSON.stringify(req.body)+ '\n', () => {
       	res.send('Ваші дані прийнято. Зачекайте трохи, ми з вами звяжемося.');
    });
});
app.post('/login', (req, res) => {
    if (req.body.login == 'admin' && req.body.password == 'admin') res.send('true');
    else res.send('false');
});
app.post('/removeItems', (req, res) => {
    const fs = require('fs');
    let products = JSON.stringify(req.body.products);
    products[0] = '{';
    products[products.length - 1] = '}';
    fs.unlinkSync('./items.json');
    fs.appendFile('./items.json', products, () => {
        res.send('true');
    });
});
app.post('/addItem', (req, res) => {
    const fs = require('fs');
    let products = JSON.stringify(req.body.products);
    products[0] = '{';
    products[products.length - 1] = '}'
    fs.unlinkSync('./items.json');
    fs.appendFile('./items.json', products, () => {
        res.send('true');
    });
});
app.post('/addOrd', (req, res) => {
    const fs = require('fs');
    const datas = JSON.stringify(req.body);
    fs.appendFile('fastorders.txt', datas, () => {
        res.send('true');
    });
});

app.post('/delSomething', (req, res) => {
    const fs = require('fs');
    const file = req.body.file;
    console.log(req.body.file);
    fs.unlinkSync(file);
    fs.appendFile(file, ' ', () => {
        res.send('true');
    });
});

app.listen(process.env.port || 3000, process.env.IP || '0.0.0.0');
