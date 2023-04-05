import React, { useEffect, useState } from "react";
import Shopify from "../../images/shopify.png";
import Stripe from "../../images/stripe.png";
import Connect from "../../images/connected.svg";
import { toast } from "react-toastify";
import { PostApi } from "../../APIService";
import { API_Path } from "../../const";
import ShopifyModal from "../AllModal/ShopifyModal";
import StripeModal from "../AllModal/StripeModal";

export default function IntegrationTab(props) {
	const [shopifymodal, setshopifymodal] = useState(false);
	const [stripemodal, setstripemodal] = useState(false);
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
				res.data.data.shopify.length > 0 ? setShopifyconnected(true) : setShopifyconnected(false);
				res.data.data.stripe.length > 0 ? setsripeconnected(true) : setsripeconnected(false);
				setshopifydata(res.data.data.shopify);
				setstripedata(res.data.data.stripe);
			}
		});
	};

	const handleShopifyConnect = (formdata, resetForm) => {
		let url = new URL(formdata.storeUrl);
		if (typeof url !== "undefined") {
			let data = { shopify: [{ storeUrl: url.host, adminAccessToken: formdata.storefrontToken }] };
			const connectShopifyPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.connectShopify, data)));
			connectShopifyPromise.then((res) => {
				if (res.status === 200) {
					setshopifymodal(false);
					setshopifydata(res.data.data.flag);
					toast.success("you connect on shopify successfully.");
				} else {
					setshopifymodal(false);
					toast.error(res.data.message);
				}
			});
		} else {
			toast.warn("Please add valid Store Url");
		}
	};

	const handleStripeConnect = (formdata, resetForm) => {
		let data1 = { stripe: [{ access_token: formdata.access_token, secret_key: formdata.secretkey }] };
		const connectStripePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.connectStripe, data1)));
		connectStripePromise.then((res) => {
			if (res.status === 200) {
				setstripemodal(false);
				setstripedata(res.data.data.flag);
			} else {
				toast.error(res.data.message);
				setstripemodal(false);
			}
		});
	};

	return (
		<>
			<div className="login-side-main-inner-white set-chpwd-box">
				<div className="text-center pb-4">
					<h1>Integration</h1>
				</div>
				<h5>Connect Your Account</h5>
				<div className="row align-items-center">
					<div className="col-12">
						<div className="row">
							<div className="col-xxl-5 col-md-8 my-3">
								{shopifyconnected ? (
									<div className="intigration-box connect-class" onClick={() => setshopifymodal(true)}>
										<div className="d-flex align-items-center">
											<div className="connect-detail">
												<img src={Shopify} alt="Shopify" />
												<div className="intig-text mt-3">
													<span id="connect-id-3">Succesfully Connected</span>
												</div>
											</div>
											<div className="ms-auto connection-btn-class">
												<span id="connection-block">
													<img src={Connect} alt="Connected" />
												</span>
											</div>
										</div>
									</div>
								) : (
									<div className="intigration-box notconnect-class">
										<div className="d-flex align-items-center">
											<div className="connect-detail">
												<img src={Shopify} alt="Shopify" />
												<div className="intig-text mt-3">
													<span id="connect-id-3">Not Connected</span>
												</div>
											</div>
											<div className="ms-auto connection-btn-class">
												<span id="connection-block">
													<button type="button" onClick={() => setshopifymodal(true)} className="btn-comn-class py-2">
														Connect Now
													</button>
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="row">
							<div className="col-xxl-5 col-md-8 my-3">
								{sripeconnected ? (
									<div className="intigration-box connect-class" onClick={() => setstripemodal(true)}>
										<div className="d-flex align-items-center">
											<div className="connect-detail">
												<img src={Stripe} alt="Stripe" />
												<div className="intig-text mt-3">
													<span id="connect-id-3">Succesfully Connected</span>
												</div>
											</div>
											<div className="ms-auto connection-btn-class">
												<span id="connection-block">
													<img src={Connect} alt="Connected" />
												</span>
											</div>
										</div>
									</div>
								) : (
									<div className="intigration-box notconnect-class">
										<div className="d-flex align-items-center">
											<div className="connect-detail">
												<img src={Stripe} alt="Stripe" />
												<div className="intig-text mt-3">
													<span id="connect-id-3">Not Connected</span>
												</div>
											</div>
											<div className="ms-auto connection-btn-class">
												<span id="connection-block">
													<button type="button" onClick={() => setstripemodal(true)} className="btn-comn-class py-2">
														Connect Now
													</button>
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
					{shopifydata && stripedata ? "" : <p>Note: A campaign can't run without all three of these connected, so please everyone is connect properly.</p>}
				</div>
			</div>
			{/* ==========connect modal 1=========== */}
			{shopifymodal && <ShopifyModal shopifymodal={shopifymodal} setshopifymodal={setshopifymodal} handleShopifyConnect={handleShopifyConnect} shopifydata={shopifydata[0]} />}

			{/* ==========connect modal 2=========== */}

			{stripemodal && <StripeModal stripemodal={stripemodal} setstripemodal={setstripemodal} handleStripeConnect={handleStripeConnect} stripedata={stripedata[0]} />}
		</>
	);
}
