package main

import (
	"encoding/json"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// ImportGAPCertificate : Import GAP from file or JSON data...
func (lcu *LifeCooperationUnionChaincode) ImportGAPCertificate(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 13 {
		return shim.Error("{\"status\":false,\"error\":\"13 arguments required: certificate number, certificate agency, classification name, producer organization, valid from, valid until, certified product name, address, farmer registration number, pacel registration number, cultivated area, production plan and created date.\"}")
	}

	var err error

	certNumber := args[0]
	certAgency := args[1]
	classificationName := args[2]
	producerOrg := args[3]

	var validFrom, validUntil, createdDate time.Time
	layout := "2006-01-02"

	validFrom, err = time.Parse(layout, args[4])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	validUntil, err = time.Parse(layout, args[5])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	certifiedProductName := args[6]
	address := args[7]
	farmerRegistrationNumber := args[8]
	parcelRegistrationNumber := args[9]
	cultivatedArea := args[10]
	productionPlan := args[11]

	createdDate, err = time.Parse(layout, args[12])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	var cert = GAPCertificate{DocType: "gap_cert", CertificateNumber: certNumber, CertificateAgency: certAgency, ClassificationName: classificationName, ProducerOrganization: producerOrg, ValidFrom: validFrom, ValidUntil: validUntil, CertifiedProductName: certifiedProductName, Address: address, FarmerRegistrationNumber: farmerRegistrationNumber, ParcelRegistrationNumber: parcelRegistrationNumber, CultivatedArea: cultivatedArea, ProductionPlan: productionPlan, CreatedDate: createdDate}

	certJson, _ := json.Marshal(cert)

	stub.PutState("gap_"+cert.CertificateNumber, certJson)
	return shim.Success([]byte("{\"status\":true,\"message\":\"GAP Certificate: " + cert.CertificateNumber + " imported successfully.\"}"))
}

// GetGAPCertificateByNumber : Get GAP Cert and check if the cert is valid
func (lcu *LifeCooperationUnionChaincode) GetGAPCertificateByNumber(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("{\"status\":false,\"error\":\"1 argument required: certificate number.\"}")
	}

	bytes, err := stub.GetState("gap_" + args[0])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid certificate number.\"}")
	}
	var certificate GAPCertificate
	err = json.Unmarshal([]byte(string(bytes)), &certificate)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	// Check certificate valid => 유효기간 시작일 <= Current date <= 유효기간 종료일

	today := time.Now()
	isValidCertificate := today.Before(certificate.ValidUntil.AddDate(0, 0, 1)) && today.After(certificate.ValidFrom)

	res := "{\"status\":true,\"is_valid_certificate\":" + strconv.FormatBool(isValidCertificate) + ",\"message\":\"Success\",\"data\":" + string(bytes) + "}"
	return shim.Success([]byte(res))
}
