import React, { useEffect, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import Shopify from "../../images/shopify.png";
import Stripe from "../../images/stripe.png";
import Connect from "../../images/connect.svg";
import NotConnect from "../../images/noconnect.svg";
import { Modal } from "react-bootstrap";
import Success from "../../images/success.png";
import { useNavigate } from "react-router-dom";
import { API_Path } from "../../const";
import { PostApi } from "../../APIService";
import { toast } from "react-toastify";
import ShopifyModal from "../../Components/AllModal/ShopifyModal";
import StripeModal from "../../Components/AllModal/StripeModal";

export default function ConnectYourStore() {
	const Navigate = useNavigate();
	const [shopifymodal, setshopifymodal] = useState(false);
	const [stripemodal, setstripemodal] = useState(false);
	const [success_modal_show, setsuccess_modal_show] = useState(false);
	const [shopifydata, setshopifydata] = useState();
	const [stripedata, setstripedata] = useState();
	const [shopifyconnected, setShopifyconnected] = useState(false);
	const [sripeconnected, setsripeconnected] = useState(false);

	useEffect(() => {
		getUserById();
	}, []);

	const getUserById = () => {
		const getuserDataPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.storeconnectcheck)));
		getuserDataPromise.then((res) => {
			if (res.status === 200) {
				res.data.data.shopify.length > 0 && setShopifyconnected(true);
				res.data.data.stripe.length > 0 && setsripeconnected(true);
				setshopifydata(res.data.data.shopify);
				setstripedata(res.data.data.stripe);
			}
		});
	};

	const success_Close = () => {
		setsuccess_modal_show(false);
	};

	const handleStripeConnect = (formdata) => {
		let data1 = { stripe: [{ access_token: formdata.access_token, secret_key: formdata.secretkey }] };
		const connectStripePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.connectStripe, data1)));
		connectStripePromise.then((res) => {
			if (res.status === 200) {
				setstripemodal(false);
				getUserById();
				if (res.data.data.both) {
					setsuccess_modal_show(true);
					setTimeout(() => {
						setsuccess_modal_show(false);
						Navigate("/choose-subscription");
					}, 2000);
				}
			} else {
				toast.error(res.data.message);
				setstripemodal(true);
			}
		});
	};

	const handleShopifyConnect = (formdata) => {
		let url = new URL(formdata.storeUrl);
		if (typeof url !== "undefined") {
			let data = { shopify: [{ storeUrl: url.host, adminAccessToken: formdata.storefrontToken }] };
			const connectShopifyPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.connectShopify, data)));
			connectShopifyPromise.then((res) => {
				if (res.status === 200) {
					setshopifymodal(false);
					getUserById();
					if (res.data.data.both) {
						setsuccess_modal_show(true);
						setTimeout(() => {
							setsuccess_modal_show(false);
							Navigate("/choose-subscription");
						}, 2000);
					}
					toast.success("you connect on shopify successfully.");
				} else {
					setshopifymodal(true);
					toast.error(res.data.message);
				}
			});
		} else {
			toast.warn("Please add valid Store Url");
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-lg p-0 d-lg-block d-none">
					<div className="right-sid-img-info">
						<img src={RightImage} className="w-100" alt="Text A Buy" />
					</div>
				</div>
				<div className="col-lg-7 log-rgt-part p-0">
					<div className="login-side-box">
						<div className="login-side-main-scroll">
							<div className="login-side-main-inner mx-auto">
								<div className="login-side-fix-width">
									<div className="login-side-main-logo text-center pb-5">
										<img src={Logo} className="img-fluid" alt="Text A Buy" />
									</div>
									<div className="login-side-main-inner-white">
										<div className="text-center pb-4">
											<h1>Connect your account</h1>
											<p className="mt-2">Please connect your twillio account for sms send</p>
										</div>
										<form className="row mb-0 frm-logo-top">
											<div className="col-12 text-center">
												<div className={`connect-comn-box ${shopifyconnected && "connection"} mb-4 cursor-pointer`} onClick={() => setshopifymodal(true)}>
													<div className="connect-detail d-flex align-items-center">
														<img src={Shopify} alt="Shopify" />
														<div className="connect-text ms-2">
															<span id="connect-id-1">{shopifyconnected ? "Connected" : "Not Connected"}</span>
														</div>
													</div>
													<div className="ms-auto">
														<span id="connection-block">
															<button type="button" className="border-0 bg-transparent p-0">
																<img src={shopifyconnected ? Connect : NotConnect} alt="connected" className="img-fluid" />
															</button>
														</span>
													</div>
												</div>
												<div className={`connect-comn-box mb-4 ${sripeconnected && "connection"} cursor-pointer`} onClick={() => setstripemodal(true)}>
													<div className="connect-detail d-flex align-items-center">
														<img src={Stripe} alt="Stripe" />
														<div className="connect-text ms-2">
															<span id="connect-id-3">{sripeconnected ? "Connected" : "Not Connected"}</span>
														</div>
													</div>
													<div className="ms-auto">
														<span id="connection-block">
															<button type="button" className="border-0 bg-transparent p-0">
																<img src={sripeconnected ? Connect : NotConnect} alt="connect" className="img-fluid" />
															</button>
														</span>
													</div>
												</div>
												<div className={shopifyconnected && sripeconnected ? "pt-4 d-flex" : "pt-4"}>
													<button type="button" className="border-0 bg-transparent p-0 skip-btn-text text-capitalize" onClick={() => Navigate("/dashboard")}>
														Skip
													</button>
													{shopifyconnected && sripeconnected && (
														<button type="button" className="border-0 bg-transparent p-0 skip-btn-text text-capitalize ms-auto" onClick={() => Navigate("/choose-subscription")}>
															Next
														</button>
													)}
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ==========connect modal 1=========== */}

			{shopifymodal && <ShopifyModal shopifymodal={shopifymodal} setshopifymodal={setshopifymodal} handleShopifyConnect={handleShopifyConnect} shopifydata={shopifydata[0]} />}

			{/* ==========connect modal 2=========== */}

			{stripemodal && <StripeModal stripemodal={stripemodal} setstripemodal={setstripemodal} handleStripeConnect={handleStripeConnect} stripedata={stripedata[0]} />}

			{/* ==========success modal============== */}

			{success_modal_show && (
				<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={success_modal_show} onHide={success_Close}>
					<Modal.Header closeButton className="border-0"></Modal.Header>
					<Modal.Body>
						<div className="text-center success-class p-2">
							<div className="p-3">
								<img className="img-fluid" src={Success} alt="Successful" />
							</div>
							<h2>Successfully Connected!</h2>
							<p>Your Account has been successfully Connected.</p>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</div>
	);
}
