package main

import (
	"encoding/json"

	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/ledger/queryresult"
	"github.com/hyperledger/fabric/protos/peer"
)

// GetAllProducts : query all products
func (lcu *LifeCooperationUnionChaincode) GetAllProducts(stub shim.ChaincodeStubInterface) peer.Response {
	qry := "{\"selector\":{\"doc_type\":\"product\"}}"

	QryIterator, err := stub.GetQueryResult(qry)

	if err != nil {
		return shim.Error("{\"status\":false,\"error\":" + err.Error() + "}")
	}

	counter := 0
	resultJson := "{\"status\":true,\"message\":\"Success\",\"data\":["
	for QryIterator.HasNext() {
		var resultKV *queryresult.KV
		var err error

		resultKV, err = QryIterator.Next()

		if err != nil {
			return shim.Error("{\"status\":false,\"error\":" + err.Error() + "}")
		}

		// key := resultKV.GetKey()
		value := string(resultKV.GetValue())

		data := value

		if counter > 0 {
			data = "," + data
		}
		resultJson += data
		counter++
	}
	QryIterator.Close()

	resultJson += "],\"counter\":" + strconv.Itoa(counter) + "}"
	return shim.Success([]byte(resultJson))
}

// GetProductById : get product by id (KEY: "product_" + id)
func (lcu *LifeCooperationUnionChaincode) GetProductById(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("{\"error\":\"1 argument required: ProductID.\"}")
	}
	bytes, err := stub.GetState("product_" + args[0])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Product not found\"}")
	}
	var product Product
	err = json.Unmarshal([]byte(string(bytes)), &product)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	res := "{\"status\":true,\"message\":\"Success\",\"data\":" + string(bytes) + "}"
	return shim.Success([]byte(res))
}

// AddProduct : add product to ledger
func (lcu *LifeCooperationUnionChaincode) AddProduct(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 9 {
		return shim.Error("{\"status\":false,\"error\":\"9 arguments required: SupplierID, ProductID, ProductName, FarmHouse, Price, GAPCertNumber, EnvFriendlyCertNumber, Amount and Image.\"}")
	}

	supplierId := args[0]

	// Validate Supplier
	bytes, err := stub.GetState("user_" + supplierId)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid supplier ID\"}")
	}
	var supplier User
	err = json.Unmarshal([]byte(string(bytes)), &supplier)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if supplier.Role != "supplier" {
		return shim.Error("{\"status\":false,\"error\":\"Invalid supplier ID\"}")
	}

	productId := args[1]
	bytes, err = stub.GetState("product_" + productId)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes != nil {
		return shim.Error("{\"status\":false,\"error\":\"Product ID already exist\"}")
	}

	productName := args[2]
	farmHouse := args[3]

	gapCertNumber := args[5]
	bytes, err = stub.GetState("gap_" + gapCertNumber)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid GAP Certificate number\"}")
	}

	// Mark: If needed, check the valid status of certificate here

	envFriendlyCertNumber := args[6]

	// Validate price & amount
	var price, amount int
	price, err = strconv.Atoi(args[4])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	amount, err = strconv.Atoi(args[7])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	createdDate := time.Now()

	image := args[8]

	var product = Product{DocType: "product", ProductId: productId, ProductName: productName, FarmHouse: farmHouse, Price: price, GAPCertificateNumber: gapCertNumber, EnvironmentFriendlyCertificateNumber: envFriendlyCertNumber, Amount: amount, ImportedBy: supplier, Remark: "Supplier added a product", Image: image, ModifiedDate: createdDate, CreatedDate: createdDate}

	productJson, _ := json.Marshal(product)

	stub.PutState("product_"+product.ProductId, productJson)
	return shim.Success([]byte("{\"status\":true,\"message\":\"Product added successfully.\"}"))
}

// GetProductHistory : get history of product history
func (luc *LifeCooperationUnionChaincode) GetProductHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("{\"status\":false,\"error\":\"1 argument required: ProductID.\"}")
	}

	// Validate product
	bytes, getStateErr := stub.GetState("product_" + args[0])
	if getStateErr != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + getStateErr.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid product ID\"}")
	}

	historyQueryIterator, err := stub.GetHistoryForKey("product_" + args[0])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + getStateErr.Error() + "\"}")
	}

	var resultModification *queryresult.KeyModification
	counter := 0
	resultJson := "{\"status\":true,\"message\":\"Success\",\"data\":["
	for historyQueryIterator.HasNext() {
		resultModification, err = historyQueryIterator.Next()
		if err != nil {
			return shim.Error("{\"status\":false,\"error\":\"Error reading product history. " + getStateErr.Error() + "\"}")
		}
		data := "{\"txn\":\"" + resultModification.GetTxId() + "\""
		data += ",\"value\":" + string(resultModification.GetValue()) + "}"
		if counter > 0 {
			data = "," + data
		}
		resultJson += data
		counter++
	}
	historyQueryIterator.Close()
	resultJson += "],\"counter\":" + strconv.Itoa(counter) + "}"
	return shim.Success([]byte(resultJson))
}

// BuyProduct : user buy product in some amount
func (lcu *LifeCooperationUnionChaincode) BuyProduct(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 3 {
		return shim.Error("{\"status\":false,\"error\":\"3 arguments required: BuyerId, ProductID and Amount.\"}")
	}

	buyerId := args[0]
	productId := args[1]

	// Validate buyer
	bytes, err := stub.GetState("user_" + buyerId)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid buyer ID\"}")
	}
	var buyer User
	err = json.Unmarshal([]byte(string(bytes)), &buyer)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	// Validate product
	bytes, err = stub.GetState("product_" + productId)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid product ID\"}")
	}
	var product Product
	err = json.Unmarshal([]byte(string(bytes)), &product)
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}

	// Validate amount
	var amount int
	amount, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if amount > product.Amount {
		return shim.Error("{\"status\":false,\"error\":\"Only " + strconv.Itoa(product.Amount) + " of product(s) available in stock.\"}")
	}

	today := time.Now()
	var purchaseHistory = PurchaseHistory{DocType: "purchase_history", UserId: buyer.Id, ProductId: product.ProductId, ProductName: product.ProductName, Price: product.Price, Amount: amount, CreatedDate: today}
	purchaseHistoryJson, _ := json.Marshal(purchaseHistory)

	// Add purchase history to ledger
	stub.PutState("purchase_"+buyer.Id+"_"+today.Format("20060102150405"), purchaseHistoryJson)

	// Update stock amount
	product.Amount -= amount
	product.ModifiedDate = today
	product.Remark = buyer.Name + " bought " + strconv.Itoa(amount) + " " + product.ProductName
	productJson, _ := json.Marshal(product)
	stub.PutState("product_"+product.ProductId, productJson)

	return shim.Success([]byte("{\"status\":true,\"message\":\"User bought success\"}"))
}
