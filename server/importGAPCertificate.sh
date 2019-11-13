#!/bin/bash

FILE_NAME=clean_data.json
CHAINCODE_NAME=lcu_cc
CHANNEL_NAME=mychannel
CA_PATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

LENGTH=$(cat $FILE_NAME |jq length)
LENGTH=$((LENGTH-1))

START=$(date)

for i in $(seq 0 $LENGTH); do
	cert=$(cat $FILE_NAME |jq .[$i])
	ARG1=$(echo $cert |jq .certificate_number)
	ARG2=$(echo $cert |jq .certificate_agency)
	ARG3=$(echo $cert |jq .classification_name)
	ARG4=$(echo $cert |jq .producer_organization)
	ARG5=$(echo $cert |jq .valid_from)
	ARG6=$(echo $cert |jq .valid_until)
	ARG7=$(echo $cert |jq .certified_product_name)
	ARG8=$(echo $cert |jq .address)
	ARG9=$(echo $cert |jq .farmer_registration_number)
	ARG10=$(echo $cert |jq .parcel_registration_number)
	ARG11=$(echo $cert |jq .cultivated_area)
	ARG12=$(echo $cert |jq .production_plan)
	ARG13=$(echo $cert |jq .created_date)
	
	ARGS="{\"Args\":[\"ImportGAPCertificate\",$ARG1,$ARG2,$ARG3,$ARG4,$ARG5,$ARG6,$ARG7,$ARG8,$ARG9,$ARG10,$ARG11,$ARG12,$ARG13]}"
	#echo $ARGS
	docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile $CA_PATH -C $CHANNEL_NAME -n $CHAINCODE_NAME -c "${ARGS}"
	#sleep 5
done

FINISH=$(date)

echo "Start at : ${START}"
echo "Finish at: ${FINISH}"
