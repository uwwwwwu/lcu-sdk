'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

const asn = require('asn1.js')
const sha = require('js-sha256');

const multer = require('multer');

let network = require('./fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/setup-sample-users', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.submitTransaction('SetupSampleUsers');
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.endorsements[0].message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/user/:userId', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetUserById', req.params.userId.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.post('/add-product', async (req, res) => {
	if ((typeof req.body.supplierId === 'undefined' || req.body.supplierId === '') ||
		(typeof req.body.productId === 'undefined' || req.body.productId === '') ||
		(typeof req.body.productName === 'undefined' || req.body.productName === '') ||
		(typeof req.body.farmhouse === 'undefined' || req.body.farmhouse === '') ||
		(typeof req.body.price === 'undefined' || req.body.price === '') ||
		(typeof req.body.gapCertNum === 'undefined' || req.body.gapCertNum === '') ||
		(typeof req.body.greenCertNum === 'undefined' || req.body.greenCertNum === '') ||
		(typeof req.body.amount === 'undefined' || req.body.amount === '') ||
		(typeof req.body.unit === 'undefined' || req.body.unit === '') ||
		(typeof req.body.image === 'undefined' || req.body.image === '')) {
		res.send({ status: false, error: 'Missing body.' });
		return;
	}

	let networkObj = await network.connectToNetwork(appAdmin);
	var response;

	var supplierId = req.body.supplierId.toString();
	var productId = req.body.productId.toString();
	var productName = req.body.productName.toString();
	var farmhouse = req.body.farmhouse.toString();
	var price = req.body.price.toString();
	var gapCertNum = req.body.gapCertNum.toString();
	var greenCertNum = req.body.greenCertNum.toString();
	var amount = req.body.amount.toString();
	var unit = req.body.unit.toString();
	var image = req.body.image.toString();

	try {
		response = await networkObj.contract.submitTransaction('AddProduct', supplierId, productId, productName, farmhouse, price, gapCertNum, greenCertNum, amount, unit, image);
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.endorsements[0].message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.post('/buy-product', async (req, res) => {
	if ((typeof req.body.buyerId === 'undefined' || req.body.buyerId === '') ||
		(typeof req.body.productId === 'undefined' || req.body.productId === '') ||
		(typeof req.body.amount === 'undefined' || req.body.amount === '')) {
		res.send({ status: false, error: { message: 'Missing body.' } });
		return;
	}

	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.submitTransaction('BuyProduct', req.body.buyerId.toString(), req.body.productId.toString(), req.body.amount.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.endorsements[0].message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/product-history/:productId', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetProductHistory', req.params.productId.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/products', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetAllProducts');
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/gap-certificate/:number', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetGAPCertificateByNumber', req.params.number.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/green-certificate/:number', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetGreenCertificateByNumber', req.params.number.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/products/:productId', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetProductById', req.params.productId.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
		return;
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

// Upload 
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/images');
	},
	filename: (req, file, cb) => {
		console.log(file);
		var filetype = '';
		if (file.mimetype === 'image/gif') {
			filetype = 'gif';
		}
		if (file.mimetype === 'image/png') {
			filetype = 'png';
		}
		if (file.mimetype === 'image/jpeg') {
			filetype = 'jpg';
		}
		cb(null, 'image-' + Date.now() + '.' + filetype);
	}
});
var upload = multer({storage: storage});

app.post('/upload', upload.single('image'), async (req, res) => {
	if (!req.file) {
		res.json({status: false, error: 'Error 505, Upload failed'});
		return;
	}
	res.json({status: true, data: 'http://master:8081/images/' + req.file.filename});
});

app.get('/blockchain', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	let info = await networkObj.network.channel.queryInfo();
	const blockHeight = parseInt(info.height.low);

	var response = {
		blockHeight: blockHeight
	}

	var blocks = []
	for (var i=1 ; i<=12 ; i++) {
		if (blockHeight-1 <= 0) {
			break;
		}
		let block = await networkObj.network.channel.queryBlock(blockHeight-i);
		blocks.push(getBlockDetail(block));
	}

	response['blocks'] = blocks;
	res.json(response)
})


function getBlockDetail(block) {
	var response = {
		blockNumber: parseInt(block.header.number),
		blockHash: calculateBlockHash(block.header),
		previousHash: block.header.previous_hash,
		dataHash: block.header.data_hash,
		transactionCount: block.data.data.length
	}
	
	var transactions = []

    block.data.data.forEach(transaction => {
		transactions.push({
			transactionId: transaction.payload.header.channel_header.tx_id,
			creatorId: transaction.payload.header.signature_header.creator.Mspid
		})
		//Following lines if uncommented will dump too much info :)
		// console.log('Data: ');
		// console.log(JSON.stringify(transaction.payload.data));
	});
	
	response['transactions'] = transactions;
	return response;
}

function calculateBlockHash(header) {
    let headerAsn = asn.define('headerAsn', function () {
        this.seq().obj(
            this.key('Number').int(),
            this.key('PreviousHash').octstr(),
            this.key('DataHash').octstr()
        );
    });

    let output = headerAsn.encode({
        Number: parseInt(header.number),
        PreviousHash: Buffer.from(header.previous_hash, 'hex'),
        DataHash: Buffer.from(header.data_hash, 'hex')
    }, 'der');

    let hash = sha.sha256(output);
    return hash;
}

app.listen(process.env.PORT || 8081);
