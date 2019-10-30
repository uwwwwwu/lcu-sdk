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
			var certificateNumber = certificates[i].certificate_number;
			var certificateAgency = certificates[i].certificate_agency;
			var classificationName = certificates[i].classification_name;
			var producerOrganization = certificates[i].producer_organization;
			var validFrom = certificates[i].valid_from;
			var validUntil = certificates[i].valid_until;
			var certifiedProductName = certificates[i].certified_product_name;
			var address = certificates[i].address;
			var farmerRegistrationNumber = certificates[i].farmer_registration_number;
			var parcelRegistrationNumber = certificates[i].parcel_registration_number;
			var cultivatedArea = certificates[i].cultivated_area;
			var productionPlan = certificates[i].production_plan;
			var createdDate = certificates[i].created_date;
			try {
				var response = await networkObj.contract.submitTransaction('BuyProduct', certificateNumber, certificateAgency, classificationName, producerOrganization, validFrom, validUntil, certifiedProductName, address, farmerRegistrationNumber, parcelRegistrationNumber, cultivatedArea, productionPlan, createdDate);
				console.log(certificateNumber + ' ==> ' + response)
			} catch (e) {
				console.log(e)
			}
		}
		await networkObj.gateway.disconnect();

	})
}

importCertificate();
