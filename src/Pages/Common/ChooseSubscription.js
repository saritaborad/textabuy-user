import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { GetApi, PostApi } from "../../APIService";
import { API_Path } from "../../const";
import Logo from "../../images/logo-main.svg";
import { toast } from "react-toastify";
import Context from "../../contexts/context";
import { useContext } from "react";

export default function ChooseSubscription() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [getAllPlan, setgetAllPlan] = useState("");
	const [id, setid] = useState("");

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		getSubscriptionPlan();
	}, []);

	const handleSelectPlan = (id) => {
		Navigate("/billing-information", { state: { id: id } });
	};

	const getSubscriptionPlan = () => {
		const getPlanPromise = new Promise((resolve, reject) => resolve(GetApi(API_Path.allactiveplan)));
		getPlanPromise.then((res) => {
			if (res.status === 200) {
				setgetAllPlan(res.data.data);
			} else {
				toast.error(res.message);
			}
		});
	};

	return (
		<div className="comn-bg-section">
			<div className="container h-100">
				<div className="row align-items-center h-100">
					<div className="col-lg-12">
						<div className="login-side-box py-4 chose-box-info">
							<div className="login-side-main-logo text-center pb-5">
								<img src={Logo} className="img-fluid" alt="Text A Buy" />
							</div>
							<div className="login-side-main-inner-white p-0">
								<div className="pb-0 d-flex">
									<h1>Choose a plan</h1>
									<div className="pt-4 ms-auto">
										<button type="button" className="border-0 bg-transparent p-0 skip-btn-text text-capitalize" onClick={() => Navigate("/dashboard")}>
											Skip
										</button>
									</div>
								</div>
							</div>
							<div className="pt-lg-5 pt-3">
								<div className="row justify-content-center">
									{getAllPlan &&
										getAllPlan.map((item, i) => {
											return (
												<div key={i} className="col-lg-4 col-md-6 mb-5 mb-lg-0">
													<div className="plan-box-list position-relative">
														<span className="most-pplr-text position-absolute text-center d-flex align-items-center justify-content-center">Most Popular</span>
														<div className="plan-box-list-top">
															<span className="d-block">{item.planName}</span>
															<bdi className="d-block">${item.monthprice}</bdi>
															<p>Per month</p>
															<p>{item.description}</p>
														</div>
														<div className="plan-box-list-ctr">
															<ul>
																{item &&
																	item.features.map((l, i) => {
																		return (
																			<li key={i}>
																				<span className="d-flex">
																					<i className="bi bi-check-lg me-2"></i>
																					{l}
																				</span>
																			</li>
																		);
																	})}
															</ul>
														</div>
														<div className="plan-box-list-btn mt-auto pt-3" onClick={() => handleSelectPlan(item._id)}>
															<button type="button" className="w-100 d-block btn-comn-class" name={`${item.planName}-plan`}>
																Choose Plan
															</button>
														</div>
													</div>
												</div>
											);
										})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
