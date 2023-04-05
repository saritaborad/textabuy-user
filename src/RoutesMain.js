import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Logo from "./images/logo-main.svg";

const Login = lazy(() => import("./Pages/Common/Login"));
const Signup = lazy(() => import("./Pages/Common/Signup"));
const ForgotPassword = lazy(() => import("./Pages/Common/ForgotPassword"));
const OtpVerification = lazy(() => import("./Pages/Common/OtpVerification"));
const ResetPassword = lazy(() => import("./Pages/Common/ResetPassword"));
const ChooseSubscription = lazy(() => import("./Pages/Common/ChooseSubscription"));
const TextCampaign = lazy(() => import("./Pages/TextCampaign"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Billings = lazy(() => import("./Pages/Billings"));
const CustomerList = lazy(() => import("./Pages/CustomerList"));
const CreateTextCampaign = lazy(() => import("./Pages/CreateTextCampaign"));
const Inquiry = lazy(() => import("./Pages/Inquiry"));
const TextCampaignDetail = lazy(() => import("./Pages/TextCampaignDetail"));
const EmailCampaign = lazy(() => import("./Pages/EmailCampaign"));
const CreateEmailCampaign = lazy(() => import("./Pages/CreateEmailCampaign"));
const EmailCampaignDetail = lazy(() => import("./Pages/EmailCampaignDetail"));
const TeamMembers = lazy(() => import("./Pages/TeamMembers"));
const TeamMemberDetail = lazy(() => import("./Pages/TeamMemberDetail"));
const AddTeamMember = lazy(() => import("./Pages/AddTeamMember"));
const Settings = lazy(() => import("./Pages/Settings"));
const MyProfile = lazy(() => import("./Pages/MyProfile"));
const Notifications = lazy(() => import("./Pages/Notifications"));
const InquiryMessage = lazy(() => import("./Pages/InquiryMessage"));
const LandingPageBuilder = lazy(() => import("./Pages/LandingPageBuilder"));
const EditTextCampaign = lazy(() => import("./Pages/EditTextCampaign"));
const EditEmailCampaign = lazy(() => import("./Pages/EditEmailCampaign"));
const ConnectYourStore = lazy(() => import("./Pages/Common/ConnectYourStore"));
const EditTeamMember = lazy(() => import("./Pages/EditTeamMember"));
const Inventory = lazy(() => import("./Pages/Inventory"));
const InventoryDetail = lazy(() => import("./Pages/InventoryDetail"));
const AgreeingToComply = lazy(() => import("./Pages/Common/AgreeingToComply"));
const CreateGroup = lazy(() => import("./Pages/CreateGroup"));
const BillingInformation = lazy(() => import("./Pages/Common/BillingInformation"));
const CustomerGroupList = lazy(() => import("./Pages/CustomerGroupList"));
const EditCustomerGroupList = lazy(() => import("./Pages/EditCustomerGroupList"));
const Success = lazy(() => import("./Pages/success"));
const SampleTable = lazy(() => import("./Pages/sampletable"));
const Payment = lazy(() => import("./Pages/Payment"));
const ShopifyDocumentation = lazy(() => import("./Pages/Common/ShopifyDocumentation"));

function ProtectedRout() {
	let token = localStorage.getItem("user-token");
	return token ? <Outlet /> : <Navigate to={"/login"} />;
}

export default function RoutesMain() {
	return (
		<BrowserRouter>
			<Suspense
				fallback={
					<div>
						<div className="loading">
							<img src={Logo} className="img-fluid" alt="Text A Buy" />
						</div>
					</div>
				}
			>
				<Routes>
					<Route path="/" exact element={<Login />} />
					<Route path="/login" exact element={<Login />} />
					<Route path="/signup" exact element={<Signup />} />
					<Route path="/forgot-password" exact element={<ForgotPassword />} />
					<Route path="/reset-password" exact element={<ResetPassword />} />
					<Route path="/choose-subscription" exact element={<ChooseSubscription />} />
					<Route path="/otp-verification" exact element={<OtpVerification />} />
					<Route path="/agreeing-to-comply" exact element={<AgreeingToComply />} />

					<Route element={<ProtectedRout />}>
						<Route path="/dashboard" exact element={<Dashboard />} />
						<Route path="/text-campaign" exact element={<TextCampaign />} />
						<Route path="/billings" exact element={<Billings />} />
						<Route path="/customer-list" exact element={<CustomerList />} />
						<Route path="/customer-group-list" exact element={<CustomerGroupList />} />
						<Route path="/inquiry" exact element={<Inquiry />} />
						<Route path="/create-text-campaign" exact element={<CreateTextCampaign />} />
						<Route path="/email-campaign" exact element={<EmailCampaign />} />
						<Route path="/create-email-campaign" exact element={<CreateEmailCampaign />} />
						<Route path="/team-members" exact element={<TeamMembers />} />
						<Route path="/add-team-member" exact element={<AddTeamMember />} />
						<Route path="/settings" exact element={<Settings />} />
						<Route path="/myprofile" exact element={<MyProfile />} />
						<Route path="/notification" exact element={<Notifications />} />
						<Route path="/page-builder" exact element={<LandingPageBuilder />} />
						<Route path="/connect-your-store" exact element={<ConnectYourStore />} />
						<Route path="/inventory" exact element={<Inventory />} />
						<Route path="/create-group" exact element={<CreateGroup />} />
						<Route path="/success" exact element={<Success />} />
						<Route path="/sampletable" exact element={<SampleTable />} />
						<Route path="/shopify-documentation" exact element={<ShopifyDocumentation />} />
						<Route path="/edit-customer-group" exact element={<EditCustomerGroupList />} />
						<Route path="/edit-text-campaign" exact element={<EditTextCampaign />} />
						<Route path="/text-campaign-detail" exact element={<TextCampaignDetail />} />
						<Route path="/edit-email-campaign" exact element={<EditEmailCampaign />} />
						<Route path="/email-campaign-detail" exact element={<EmailCampaignDetail />} />
						<Route path="/team-member-detail" exact element={<TeamMemberDetail />} />
						<Route path="/edit-team-member" exact element={<EditTeamMember />} />
						<Route path="/inquiry-message" exact element={<InquiryMessage />} />
						<Route path="/inventory-detail" exact element={<InventoryDetail />} />
						<Route path="/billing-information" exact element={<BillingInformation />} />
						<Route path="/payment" exact element={<Payment />} />
					</Route>
					<Route path="*" element={<Navigate to={"/login"} />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}
