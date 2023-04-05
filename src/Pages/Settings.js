import React, { useState, useEffect, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Nav, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { API_Path } from "../const";
import { PostApi } from "../APIService";
import Context from "../contexts/context";
import NotificationsTab from "../Components/TabModal/NotificationsTab";
import ChangePasswordTab from "../Components/TabModal/ChangePasswordTab";
import IntegrationTab from "../Components/TabModal/IntegrationTab";
import SubscriptionTab from "../Components/TabModal/SubscriptionTab";

export default function Settings() {
	const context = useContext(Context);

	const [activeTab, setActiveTab] = useState("subscription");
	const [id, setid] = useState();
	const [getAllPlan, setgetAllPlan] = useState("");
	const [currentPlant, setcurrentPlant] = useState("");
	const [Subscription_show, setSubscription_show] = useState(false);
	const [userData, setuserData] = useState("");

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) {
			getSubscriptionPlan(id);
			getUserById(id);
		}
	}, [id]);

	const getUserById = (Id) => {
		const getuserDataPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getUserById, { id: Id })));
		getuserDataPromise.then((res) => {
			if (res.status === 200) {
				setuserData(res.data.data);
			}
		});
	};

	const getSubscriptionPlan = (Id) => {
		let data = { type: "active", userid: Id };
		const getPlanPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getPlan, data)));
		getPlanPromise.then((res) => {
			if (res.status === 200) {
				setgetAllPlan(res.data.data);
				setcurrentPlant(res.data.data.currentPlan ? res.data.currentPlan : "");
			}
		});
	};

	const subscription_show = () => {
		setSubscription_show(true);
		getSubscriptionPlan(id);
	};

	const Subscription_close = () => {
		setSubscription_show(false);
	};

	const handleCancelSubscription = () => {
		const AddBillingInfoPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.cancelSubscriptionPlan, { userid: id })));
		AddBillingInfoPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				Subscription_close();
				getSubscriptionPlan(id);
			} else {
				toast.error(res.data.message);
				Subscription_close();
			}
		});
	};

	const handleSelect = (selectedTab) => {
		setActiveTab(selectedTab);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center justify-content-center mt-3">
						{userData?.planExpireMonthly === 1 && (
							<div className="col-12 pb-2">
								<div className="d-md-flex align-items-center wrg-info-billing text-md-start text-center">
									<div className="fw-bold pe-4 white-space text-md-star text-center">
										<i className="bi bi-info-circle-fill pe-2"></i>Payment Failed
									</div>
									<span className="py-md-0 py-2 d-block">Our last attempted charge was unsuccessful. Please update your payment source as soon as possible.</span>
									<div className="ms-auto white-space ps-2 text-md-end text-center">
										<button type="button">Update Payment</button>
										<div className="d-inline-block ps-3">
											<button type="button" name="btn_close" className="border-0 p-0 bg-transparent">
												<i className="bi bi-x-lg fw-bold"></i>
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
						<div className="col-sm-6 col-3">
							<div className="comn-title-main">
								<h1 className="mb-0">Settings</h1>
							</div>
						</div>
						{currentPlant !== "" && activeTab === "subscription" && (
							<div className="col-sm-6 col-9">
								<button className="w-auto d-block btn-comn-class ms-auto" onClick={subscription_show}>
									Cancel Subscription
								</button>
							</div>
						)}
						<div className="col-12 settings-main-part mt-3">
							<Tab.Container defaultActiveKey={activeTab} onSelect={handleSelect} className="my-3">
								<div className="row">
									<div className="col-lg-3">
										<div className="d-sm-flex align-items-center justify-content-center">
											<div className="comn-tab-sec w-100  position-relative">
												<Nav variant="pills" className="flex-lg-column mb-lg-0 mb-3 nav-tabs-custom-class">
													<Nav.Item>
														<Nav.Link eventKey="subscription">Subscription</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="intigration">Integration</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="change_password">Change Password</Nav.Link>
													</Nav.Item>
													<Nav.Item>
														<Nav.Link eventKey="notifications">Notifications</Nav.Link>
													</Nav.Item>
												</Nav>
											</div>
										</div>
									</div>
									<div className="col-lg-9">
										<Tab.Content className="">
											{activeTab === "subscription" && (
												<Tab.Pane eventKey="subscription" title="subscription">
													<SubscriptionTab getAllPlan={getAllPlan} />
												</Tab.Pane>
											)}
											{activeTab === "intigration" && (
												<Tab.Pane eventKey="intigration" title="integration">
													<IntegrationTab />
												</Tab.Pane>
											)}
											{activeTab === "change_password" && (
												<Tab.Pane eventKey="change_password" title="Change Password">
													<ChangePasswordTab />
												</Tab.Pane>
											)}
											{activeTab === "notifications" && (
												<Tab.Pane eventKey="notifications" title="notifications">
													<NotificationsTab />
												</Tab.Pane>
											)}
										</Tab.Content>
									</div>
								</div>
							</Tab.Container>
						</div>
					</div>

					{Subscription_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={Subscription_show} onHide={Subscription_close}>
							<Modal.Header closeButton className="border-0"></Modal.Header>
							<Modal.Body>
								<div className="text-center dltd-text-info">
									<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
									</svg>
									<span className="modal-title d-block">Are you sure?</span>
									<p>You really want to cancel subscription?</p>
									<div className="row">
										<div className="col-6">
											<button type="button" className="btn-comn-class w-100" onClick={() => handleCancelSubscription()}>
												Yes
											</button>
										</div>
										<div className="col-6">
											<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={Subscription_close}>
												No
											</button>
										</div>
									</div>
								</div>
							</Modal.Body>
						</Modal>
					)}
				</div>
			</div>
		</UserLayout>
	);
}
