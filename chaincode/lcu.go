package main

import (
	"fmt"

	"encoding/json"

	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/ledger/queryresult"
	"github.com/hyperledger/fabric/protos/peer"
)

type LifeCooperationUnionChaincode struct {
}

type User struct {
	DocType string `json:"doc_type"`
	Id      string `json:"id"`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	Role    string `json:"role"`
}

type Product struct {
	DocType      string `json:"doc_type"`
	ProductId    string `json:"product_id"`
	ProductName  string `json:"product_name"`
	FarmHouse    string `json:"farmhouse"`
	Price        int    `json:"price"`
	VerifiedBy   string `json:"verified_by"`
	Amount       int    `json:"amount"`
	ImportedBy   User   `json:"imported_by"`
	Remark       string `json:"remark"`
	ModifiedDate string `json:"modified_date"`
	CreatedDate  string `json:"created_date"`
}

type PurchaseHistory struct {
	DocType     string `json:"doc_type"`
	UserId      string `json:"user_id"`
	ProductId   string `json:"product_id"`
	ProductName string `json:"product_name"`
	Price       int    `json:"price"`
	Amount      int    `json:"amount"`
	CreatedDate string `json:"created_date"`
}

// Init : chaincode init method
func (lcu *LifeCooperationUnionChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("Init called")
	return shim.Success([]byte("{\"message\":\"Init called\"}"))
}

// Invoke : chaincode invoke method
func (lcu *LifeCooperationUnionChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()
	switch {
	case function == "SetupSampleUsers":
		return lcu.SetupSampleUsers(stub)
	case function == "GetUsers":
		return lcu.GetUsers(stub, args)
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
	}

	return shim.Error("{\"error\":\"Invalid function name\"}")
}

// GetAllProducts : query all products
func (lcu *LifeCooperationUnionChaincode) GetAllProducts(stub shim.ChaincodeStubInterface) peer.Response {
	qry := "{\"selector\":{\"doc_type\":\"product\"}}"

	QryIterator, err := stub.GetQueryResult(qry)

	if err != nil {
		return shim.Error("{\"error\":" + err.Error() + "}")
	}

	counter := 0
	resultJson := "{\"message\":\"Success\",\"data\":["
	for QryIterator.HasNext() {
		var resultKV *queryresult.KV
		var err error

		resultKV, err = QryIterator.Next()

		if err != nil {
			return shim.Error("{\"error\":" + err.Error() + "}")
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
		return shim.Error("{\"error\":\"A arguments are required (ProductID)\"}")
	}
	bytes, err := stub.GetState("product_" + args[0])
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"error\":\"Product not found\"}")
	}
	var product Product
	err = json.Unmarshal([]byte(string(bytes)), &product)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	res := "{\"message\":\"Success\",\"data\":" + string(bytes) + "}"
	return shim.Success([]byte(res))
}

// AddProduct : add product to ledger
func (lcu *LifeCooperationUnionChaincode) AddProduct(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 7 {
		return shim.Error("{\"error\":\"7 arguments are required (SupplierID, ProductID, ProductName, FarmHouse, Price, VerifyedBy, Amount)\"}")
	}

	supplierId := args[0]

	// Validate Supplier
	userBytes, err := stub.GetState("user_" + supplierId)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if userBytes == nil {
		return shim.Error("{\"error\":\"Invalid supplier ID\"}")
	}
	var supplier User
	err = json.Unmarshal([]byte(string(userBytes)), &supplier)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if supplier.Role != "supplier" {
		return shim.Error("{\"error\":\"Invalid supplier ID\"}")
	}

	productId := args[1]
	productName := args[2]
	farmHouse := args[3]
	verifiedBy := args[5]

	// Validate price & amount
	var price, amount int
	price, err = strconv.Atoi(args[4])
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	amount, err = strconv.Atoi(args[6])
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}

	createdDate := time.Now().Format("2006-01-02 15:04:05")

	var product = Product{DocType: "product", ProductId: productId, ProductName: productName, FarmHouse: farmHouse, Price: price, VerifiedBy: verifiedBy, Amount: amount, ImportedBy: supplier, Remark: "Supplier added a product.", ModifiedDate: createdDate, CreatedDate: createdDate}

	productJson, _ := json.Marshal(product)

	stub.PutState("product_"+product.ProductId, productJson)
	return shim.Success([]byte("{\"message\":\"Product added successfully.\"}"))
}

// GetProductHistory : get history of product history
func (luc *LifeCooperationUnionChaincode) GetProductHistory(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("{\"error\":\"A arguments are required (ProductID)\"}")
	}

	// Validate product
	bytes, getStateErr := stub.GetState("product_" + args[0])
	if getStateErr != nil {
		return shim.Error("{\"error\":\"" + getStateErr.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"error\":\"Invalid product ID\"}")
	}

	historyQueryIterator, err := stub.GetHistoryForKey("product_" + args[0])
	if err != nil {
		return shim.Error("{\"error\":\"" + getStateErr.Error() + "\"}")
	}

	var resultModification *queryresult.KeyModification
	counter := 0
	resultJson := "{\"message\":\"Success\",\"data\":["
	for historyQueryIterator.HasNext() {
		resultModification, err = historyQueryIterator.Next()
		if err != nil {
			return shim.Error("{\"error\":\"Error reading product history. " + getStateErr.Error() + "\"}")
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
		return shim.Error("{\"error\":\"3 arguments are required (BuyerId, ProductID, Amount)\"}")
	}

	buyerId := args[0]
	productId := args[1]

	// Validate buyer
	bytes, err := stub.GetState("user_" + buyerId)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"error\":\"Invalid buyer ID\"}")
	}
	var buyer User
	err = json.Unmarshal([]byte(string(bytes)), &buyer)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}

	// Validate product
	bytes, err = stub.GetState("product_" + productId)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"error\":\"Invalid product ID\"}")
	}
	var product Product
	err = json.Unmarshal([]byte(string(bytes)), &product)
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}

	// Validate amount
	var amount int
	amount, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("{\"error\":\"" + err.Error() + "\"}")
	}
	if amount > product.Amount {
		return shim.Error("{\"error\":\"Only " + strconv.Itoa(product.Amount) + " of product(s) available in stock.\"}")
	}

	today := time.Now()
	createdDate := today.Format("2006-01-02 15:04:05")
	var purchaseHistory = PurchaseHistory{DocType: "purchase_history", UserId: buyer.Id, ProductId: product.ProductId, ProductName: product.ProductName, Price: product.Price, Amount: amount, CreatedDate: createdDate}
	purchaseHistoryJson, _ := json.Marshal(purchaseHistory)

	// Add purchase history to ledger
	stub.PutState("purchase_"+buyer.Id+"_"+today.Format("20060102150405"), purchaseHistoryJson)

	// Update stock amount
	product.Amount -= amount
	product.ModifiedDate = today.Format("2006-01-02 15:04:05")
	product.Remark = buyer.Name + " bought " + strconv.Itoa(amount) + " " + product.ProductName
	productJson, _ := json.Marshal(product)
	stub.PutState("product_"+product.ProductId, productJson)

	return shim.Success([]byte("{\"message\":\"User buy success\"}"))
}

// GetUsers : get user and filter by user role
func (lcu *LifeCooperationUnionChaincode) GetUsers(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) > 0 {
		if args[0] == "user" {
			return shim.Success([]byte("Query user filter => user"))
		} else if args[0] == "supplier" {
			return shim.Success([]byte("Query user filter => supplier"))
		} else {
			return shim.Error("{\"error\":\"Invalid argument name. Do you mean user or supplier?\"}")
		}
	} else {
		return shim.Success([]byte("Query all"))
	}
}

// SetupSampleUsers : setup sample data for testing
func (lcu *LifeCooperationUnionChaincode) SetupSampleUsers(stub shim.ChaincodeStubInterface) peer.Response {
	var user1 = User{DocType: "user", Id: "cl", Name: "Peng Chhaileng", Phone: "010-3679-9090", Address: "Cheongju-si", Role: "supplier"}
	var user2 = User{DocType: "user", Id: "kp", Name: "Yin Kokpheng", Phone: "010-6514-9090", Address: "Cheongju-si", Role: "supplier"}
	var user3 = User{DocType: "user", Id: "tc", Name: "Aing Teckchun", Phone: "010-6515-9090", Address: "Cheongju-si", Role: "user"}
	var user4 = User{DocType: "user", Id: "nv", Name: "Ren Sothearin", Phone: "020-9236-9090", Address: "Cheongju-si", Role: "user"}
	var user5 = User{DocType: "user", Id: "e.wha", Name: "오은화", Phone: "010-9394-9090", Address: "Cheongju-si", Role: "user"}
	jsonUser1, _ := json.Marshal(user1)
	jsonUser2, _ := json.Marshal(user2)
	jsonUser3, _ := json.Marshal(user3)
	jsonUser4, _ := json.Marshal(user4)
	jsonUser5, _ := json.Marshal(user5)
	stub.PutState("user_"+user1.Id, jsonUser1)
	stub.PutState("user_"+user2.Id, jsonUser2)
	stub.PutState("user_"+user3.Id, jsonUser3)
	stub.PutState("user_"+user4.Id, jsonUser4)
	stub.PutState("user_"+user5.Id, jsonUser5)
	return shim.Success([]byte("{\"message\":\"Successfully add 5 users to ledger\"}"))
}

// Chaincode registers with the Shim on startup
func main() {
	fmt.Println("Life Cooperation Union Chaincode started")
	err := shim.Start(new(LifeCooperationUnionChaincode))
	if err != nil {
		fmt.Printf("Error starting chaincode: %s", err)
	}
}
