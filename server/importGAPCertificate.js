'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const util = require('util');
const path = require('path');
const fs = require('fs');

let network = require('./src/fabric/network.js');

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const configPath = path.join(process.cwd(), './config.json');
const configJSON = fs.readFileSync(configPath, 'utf8');
const config = JSON.parse(configJSON);

//use this identity to query
const appAdmin = config.appAdmin;

async function importCertificate() {
	let networkObj = await network.connectToNetwork(appAdmin);
	var certificates;
	fs.readFile('clean_data.json', 'utf8', async function (err, data) {
		if (err) throw err;
		certificates = JSON.parse(data);

		for(var i=0; i<certificates.length; i++) {
			try {
				var response = await networkObj.contract.evaluateTransaction('GetUsers');
				console.log(certificates[i].certificate_number + " ==> " + response)
			} catch (e) {
				await networkObj.gateway.disconnect();
				console.log(e)
			}
			await networkObj.gateway.disconnect();
		}

	})
}

importCertificate();
