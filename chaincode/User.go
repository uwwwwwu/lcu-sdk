package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// GetUsers : get user and filter by user role
func (lcu *LifeCooperationUnionChaincode) GetUsers(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) > 0 {
		if args[0] == "user" {
			return shim.Success([]byte("Query user filter => user"))
		} else if args[0] == "supplier" {
			return shim.Success([]byte("Query user filter => supplier"))
		} else {
			return shim.Error("{\"status\":false,\"error\":\"Invalid argument name. Do you mean user or supplier?\"}")
		}
	} else {
		return shim.Success([]byte("Query all"))
	}
}

// GetUserById : Query user by id (KEY: user_ID)
func (lcu *LifeCooperationUnionChaincode) GetUserById(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) < 1 {
		return shim.Error("{\"error\":\"1 argument required: User ID.\"}")
	}
	bytes, err := stub.GetState("user_" + args[0])
	if err != nil {
		return shim.Error("{\"status\":false,\"error\":\"" + err.Error() + "\"}")
	}
	if bytes == nil {
		return shim.Error("{\"status\":false,\"error\":\"Invalid user ID.\"}")
	}
	res := "{\"status\":true,\"message\":\"Success\",\"data\":" + string(bytes) + "}"
	return shim.Success([]byte(res))
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
	return shim.Success([]byte("{\"status\":true,\"message\":\"Successfully added 5 users to ledger.\"}"))
}
