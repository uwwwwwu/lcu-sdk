package main

import (
	"time"
)

type User struct {
	DocType string `json:"doc_type"`
	Id      string `json:"id"`
	Name    string `json:"name"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
	Role    string `json:"role"`
}

type Product struct {
	DocType                              string    `json:"doc_type"`
	ProductId                            string    `json:"product_id"`
	ProductName                          string    `json:"product_name"`
	FarmHouse                            string    `json:"farmhouse"`
	Price                                int       `json:"price"`
	GAPCertificateNumber                 string    `json:"gap_certificate_number"`
	Amount                               int       `json:"amount"`
	Unit                                 int       `json:"unit"`
	ImportedBy                           User      `json:"imported_by"`
	Remark                               string    `json:"remark"`
	Image                                string    `json:"image"`
	ModifiedDate                         time.Time `json:"modified_date"`
	CreatedDate                          time.Time `json:"created_date"`
}

type PurchaseHistory struct {
	DocType     string    `json:"doc_type"`
	UserId      string    `json:"user_id"`
	ProductId   string    `json:"product_id"`
	ProductName string    `json:"product_name"`
	Price       int       `json:"price"`
	Amount      int       `json:"amount"`
	CreatedDate time.Time `json:"created_date"`
}

type GAPCertificate struct {
	DocType                  string    `json:"doc_type"`
	CertificateNumber        string    `json:"certificate_number"`         // 인증번호         ==> 1000003
	CertificateAgency        string    `json:"certificate_agency"`         // 인증기관         ==> 농업회사법인(주)친환경농업연구원
	ClassificationName       string    `json:"classification_name"`        // 개인/단체 구분명 ==> 개인
	ProducerOrganization     string    `json:"producer_organization"`      // 생산자단체명     ==> 김광일
	ValidFrom                time.Time `json:"valid_from"`                 // 유효기간 시작일  ==> 18/09/06
	ValidUntil               time.Time `json:"valid_until"`                // 유효기간 종료일  ==> 21/09/05
	CertifiedProductName     string    `json:"certified_product_name"`     // 인증품목명       ==> 인삼류(기타)
	Address                  string    `json:"address"`                    // 주소            ==> 충청남도 아산시 신창면 행목로124-7
	FarmerRegistrationNumber string    `json:"farmer_registration_number"` // 등록 농가수      ==> 1
	ParcelRegistrationNumber string    `json:"parcel_registration_number"` // 등록 필지수      ==> 22
	CultivatedArea           string    `json:"cultivated_area"`            // 재배면적         ==> 70657
	ProductionPlan           string    `json:"production_plan"`            // 생산계획량       ==> 40.76
	CreatedDate              time.Time `json:"created_date"`               // 지정일자         ==> 18/09/06
}


/*

==================== 친환경인증품목Eco-friendly certification items =======================

친환경인증번호
인증종류명
인증농가
인증품목명
재배(작업장)면적(사육두수)
생산(수입)계획량
유효기간 시작일
유효기간 종료일
원재료인증구분

Eco-friendly certification number
Type of certification
Certified Farm
Certification Item
Cultivation (workplace) area (head raising)
Production (import) planned quantity
Validity start date
Validity end date
Raw material certification
*/
