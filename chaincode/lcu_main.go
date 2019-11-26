package main

import (
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type LifeCooperationUnionChaincode struct {
}

// Init : chaincode init method
func (lcu *LifeCooperationUnionChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("Init called")
	return shim.Success([]byte("{\"status\":true,\"message\":\"Init called\"}"))
}

// Invoke : chaincode invoke method
func (lcu *LifeCooperationUnionChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()
	switch {
	case function == "SetupSampleUsers":
		return lcu.SetupSampleUsers(stub)
	case function == "GetUsers":
		return lcu.GetUsers(stub, args)
	case function == "GetUserById":
		return lcu.GetUserById(stub, args)
	case function == "GetAllProducts":
		return lcu.GetAllProducts(stub)
	case function == "GetProductById":
		return lcu.GetProductById(stub, args)
	case function == "AddProduct":
		return lcu.AddProduct(stub, args)
	case function == "BuyProduct":
		return lcu.BuyProduct(stub, args)
	case function == "GetProductHistory":
		return lcu.GetProductHistory(stub, args)
	case function == "ImportGAPCertificate":
		return lcu.ImportGAPCertificate(stub, args)
	case function == "GetGAPCertificateByNumber":
		return lcu.GetGAPCertificateByNumber(stub, args)
	case function == "ImportGreenCertificate":
		return lcu.ImportGreenCertificate(stub, args)
	case function == "GetGreenCertificateByNumber":
		return lcu.GetGreenCertificateByNumber(stub, args)



	}

	return shim.Error("{\"status\":false,\"error\":\"Invalid function name\"}")
}

// Chaincode registers with the Shim on startup
func main() {
	fmt.Println("Life Cooperation Union Chaincode started")
	err := shim.Start(new(LifeCooperationUnionChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
