#!/bin/bash

govendor init
govendor add +external

govendor add github.com/hyperledger/fabric/core/chaincode/shim
govendor add github.com/hyperledger/fabric/protos/peer
govendor add github.com/hyperledger/fabric/protos/ledger/queryresult
