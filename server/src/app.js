'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

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

app.post('/setup-sample-users', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	let response = await network.invoke(networkObj, false, 'SetupSampleUsers', '');
	console.log(response)
	res.send({ message: "Success?" })
});

app.post('/add-product', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.submitTransaction('AddProduct', 'kp', '002', 'Orange', 'Farm House B', '1100', 'CBNU Food Safe', '50');
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(e);
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.post('/buy-product', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);

	if ((typeof req.body.buyerId === 'undefined' || req.body.buyerId === '') ||
		(typeof req.body.productId === 'undefined' || req.body.productId === '') ||
		(typeof req.body.amount === 'undefined' || req.body.amount === '')) {
		res.send({ status: false, error: { message: 'Missing body.' } });
		return;
	}

	var response;
	try {
		response = await networkObj.contract.submitTransaction('BuyProduct', req.body.buyerId.toString(), req.body.productId.toString(), req.body.amount.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.endorsements[0].message));
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
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});

app.get('/products/:productId', async (req, res) => {
	let networkObj = await network.connectToNetwork(appAdmin);
	var response;
	try {
		response = await networkObj.contract.evaluateTransaction('GetProductById', req.param.productId.toString());
	} catch (e) {
		await networkObj.gateway.disconnect();
		res.send(JSON.parse(e.message));
	}
	await networkObj.gateway.disconnect();

	res.send(JSON.parse(response.toString()));
});


app.listen(process.env.PORT || 8081);
