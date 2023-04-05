let LIVE = Number(process.env.REACT_APP_LIVE);
let api_base_url, ladning_url;
if (LIVE === 1) {
	api_base_url = process.env.REACT_APP_LIVE_API_URL;
	ladning_url = process.env.REACT_APP_LIVE_DOMAIN;
} else {
	api_base_url = process.env.REACT_APP_LOCAL_API_URL;
	ladning_url = process.env.REACT_APP_LOCAL_DOMAIN;
}
export const ApiBaseUrl = api_base_url;
export const LandingPageURL = ladning_url;
export const IFREM_URL = process.env.REACT_APP_FRONT_URL;

export const API_Path = {
	signup: ApiBaseUrl + "/api/signup",
	login: ApiBaseUrl + "/api/userlogin",
	forgotpassword: ApiBaseUrl + "/api/forgotpassword",
	otpVerification: ApiBaseUrl + "/api/forgotpassword",
	signupotpVerification: ApiBaseUrl + "/api/signupotp",
	resetPassword: ApiBaseUrl + "/api/forgotpassword",
	addAgreeing: ApiBaseUrl + "/api/fillup_page",

	createInventory: ApiBaseUrl + "/inventory",
	getInventory: ApiBaseUrl + "/product/getShopifyProducts",
	getInventoryById: ApiBaseUrl + "/product/inventorydetails",
	deleteInventory: ApiBaseUrl + "/inventory/delete",
	editInventory: ApiBaseUrl + "/inventory/updateInventory",

	getProductByName: ApiBaseUrl + "/product/searchproductName",
	getProductDetails: ApiBaseUrl + "/product/details",

	createTeam: ApiBaseUrl + "/team",
	getTeam: ApiBaseUrl + "/team/vendorwise",
	getTeamById: ApiBaseUrl + "/team/getTeam",
	deleteTeam: ApiBaseUrl + "/team/delete",
	editTeam: ApiBaseUrl + "/team/updateTeam",

	createCard: ApiBaseUrl + "/newcard",
	getCard: ApiBaseUrl + "/newcard/vendorwiseCard",
	getCardById: ApiBaseUrl + "/newcard/getNewcard",
	deleteCard: ApiBaseUrl + "/newcard/delete",
	editCard: ApiBaseUrl + "/newcard/updateNewcard",

	getBilling: ApiBaseUrl + "/api/transection-details",

	createEmailcampaign: ApiBaseUrl + "/emailcampaign",
	getEmailcampaign: ApiBaseUrl + "/emailcampaign/vendorwise",
	getEmailcampaignById: ApiBaseUrl + "/emailcampaign/getEmailcampign",
	deleteEmailcampaign: ApiBaseUrl + "/emailcampaign/delete",
	editEmailcampaign: ApiBaseUrl + "/emailcampaign/updateEmailcampign",
	getSizeByProductName: ApiBaseUrl + "/product/searchproductSize",
	changeEmailcampaignStatus: ApiBaseUrl + "/emailcampaign/emailcampStatus",

	getCustomerGroupName: ApiBaseUrl + "/customer/getGroupname",
	createTextcampaign: ApiBaseUrl + "/textcampaign",
	getTextcampaign: ApiBaseUrl + "/textcampaign/vendorwise",
	getTextcampaignById: ApiBaseUrl + "/textcampaign/getTextcampign",
	deleteTextcampaign: ApiBaseUrl + "/textcampaign/delete",
	editTextcampaign: ApiBaseUrl + "/textcampaign/updateTextcampign",
	changeTextcampaignStatus: ApiBaseUrl + "/textcampaign/textcampStatus",

	createInquiry: ApiBaseUrl + "/support",
	getInquiry: ApiBaseUrl + "/support/vendorwise",
	getInquiryById: ApiBaseUrl + "/support/getSupport",
	deleteInquiry: ApiBaseUrl + "/support/delete",
	editInquiry: ApiBaseUrl + "/support/updateSupport",
	getChatById: ApiBaseUrl + "/support/socketmsg",

	addFile: ApiBaseUrl + "/img/addimg",
	getProductImage: ApiBaseUrl + "/product/searchproductimg",

	getPlan: ApiBaseUrl + "/newplan/getplan",
	allactiveplan: ApiBaseUrl + "/newplan/getPublicPlan",
	getPlanById: ApiBaseUrl + "/newplan/singleplan",

	changePassword: ApiBaseUrl + "/api/changepassword",

	activitynotification: ApiBaseUrl + "/api/activity_notification",
	updateactivitynotification: ApiBaseUrl + "/api/activity_update",
	getactivitynotification: ApiBaseUrl + "/api/get_notification",

	createLandingPage: ApiBaseUrl + "/landingpage/createLandingPage",
	updateLandingPage: ApiBaseUrl + "/landingpage/updateLandingpage",

	connectShopify: ApiBaseUrl + "/api/connectShopify",
	connectStripe: ApiBaseUrl + "/api/connectStripe",

	getAllCustomer: ApiBaseUrl + "/customer/getallcustomer",
	getungroupCustomer: ApiBaseUrl + "/customer/getungroupCustomer",
	importCSV: ApiBaseUrl + "/customer/importcsv",
	searchCustomerList: ApiBaseUrl + "/customer/searchCustomer",
	createCustomersGroup: ApiBaseUrl + "/customer/createGroup",
	getCustomersGroup: ApiBaseUrl + "/customer/vendorCustomerGroup",
	deleteCustomersGroup: ApiBaseUrl + "/customer/deletegroup",
	getCustomersGroupById: ApiBaseUrl + "/customer/getsingleGroup",
	editCustomersGroup: ApiBaseUrl + "/customer/updateGroup",
	deleteAllCustomer: ApiBaseUrl + "/customer/delete-all-customer",

	getProfile: ApiBaseUrl + "/api/profile",
	updateProfile: ApiBaseUrl + "/api/updateprofile",
	getNotification: ApiBaseUrl + "/api/all_notification",

	getSupportById: ApiBaseUrl + "/support/getSupport",

	getLandingPage: ApiBaseUrl + "/landingpage/getpage",

	getUserById: ApiBaseUrl + "/api/singlevendor",
	AddBillingInfo: ApiBaseUrl + "/billing/createbill",
	UpdateBillingInfo: ApiBaseUrl + "/billing/updateplan",
	cancelSubscriptionPlan: ApiBaseUrl + "/billing/cancelsubscription",
	getbill: ApiBaseUrl + "/billing/getbill",

	dashboard: ApiBaseUrl + "/api/userdashboard",
	storeconnectcheck: ApiBaseUrl + "/api/connection_verify",
	getOrder: ApiBaseUrl + "/textcampaign/getorder",

	getAllcountries: ApiBaseUrl + "/api/countries",
	getStates: ApiBaseUrl + "/api/states",
	getCities: ApiBaseUrl + "/api/cities",
	createpdf: ApiBaseUrl + "/billing/createpdf",

	addShopifyCustomer: ApiBaseUrl + "/api/addShopifyCustomer",
	changeGroupStatus: ApiBaseUrl + "/customer/changeGroupStatus",

	syncProductShopify: ApiBaseUrl + "/api/addShopifyProduct",

	export_textcampaign: ApiBaseUrl + "/textcampaign/exportUserTextcampaign",
	export_emailcampaign: ApiBaseUrl + "/emailcampaign/exportUserEmailcampaign",
	export_team: ApiBaseUrl + "/team/export_team",
	exportUserCustomer: ApiBaseUrl + "/customer/exportUserCustomer",
	exportUserSupport: ApiBaseUrl + "/support/exportUserSupport",
	exportUserProduct: ApiBaseUrl + "/product/exportUserProduct",
};

export const phoneRegExp = /^[+]?[(]?[ 0-9]{3}[)]?[- s. ]?[0-9]{3}[-s. ]?[0-9]{4,6}$/;

export const errorContainer = (form, field) => {
	return form.touched[field] && form.errors[field] ? <span className="error-txt text-danger">{form.errors[field]}</span> : null;
};

export const formAttr = (form, field) => ({ onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field] });
