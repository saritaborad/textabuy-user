import React, { useState, useEffect } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-1.png";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { API_Path } from "../../const";
import { PostApi } from "../../APIService";
import { useRef } from "react";

let arr1 = [];
let arr2 = [];
let arr3 = [];
let arr4 = [];
let arr5 = [];

export default function AgreeingToComply() {
	const Navigate = useNavigate();
	const location = useLocation();
	const runforms = useRef();
	const [id, setid] = useState("");

	useEffect(() => {
		setid(location.state?.user_id);
	}, [location?.state?.user_id]);

	const addAgreeing = () => {
		if (arr1.length === 6 && arr2.length === 4 && arr3.length === 3 && arr4.length === 2 && arr5.length === 5) {
			let data = { id: id, fillup_page: [{ financial_service: arr1, Debt_collection: arr2, unlegal_substances: arr3, gambling: arr4, SHAFT_cases: arr5 }] };
			const addAgreeingPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.addAgreeing, data)));
			addAgreeingPromise
				.then((res) => {
					if (res.status === 200) {
						Navigate("/connect-your-store");
					} else {
						toast.error(res.data.message);
					}
				})
				.catch((e) => console.log(e));
		} else {
			toast.error("To continue, Please Agree to all compliances");
		}
	};

	const handleChange = (name, e) => {
		if (name === "financial_service") {
			if (e.target.checked) {
				arr1.push(e.target.name);
			} else {
				document.getElementById("selectAll").checked = false;
				let Newarr = arr1.filter((ele) => {
					return ele !== e.target.name;
				});
				arr1 = Newarr;
			}
		}
		if (name === "Debt_collection") {
			if (e.target.checked) {
				arr2.push(e.target.name);
			} else {
				document.getElementById("selectAll").checked = false;
				let Newarr = arr2.filter((ele) => {
					return ele !== e.target.name;
				});
				arr2 = Newarr;
			}
		}
		if (name === "unlegal_substances") {
			if (e.target.checked) {
				arr3.push(e.target.name);
			} else {
				document.getElementById("selectAll").checked = false;
				let Newarr = arr3.filter((ele) => {
					return ele !== e.target.name;
				});
				arr3 = Newarr;
			}
		}
		if (name === "gambling") {
			if (e.target.checked) {
				arr4.push(e.target.name);
			} else {
				document.getElementById("selectAll").checked = false;
				let Newarr = arr4.filter((ele) => {
					return ele !== e.target.name;
				});
				arr4 = Newarr;
			}
		}
		if (name === "SHAFT_cases") {
			if (e.target.checked) {
				arr5.push(e.target.name);
			} else {
				document.getElementById("selectAll").checked = false;
				let Newarr = arr5.filter((ele) => {
					return ele !== e.target.name;
				});
				arr5 = Newarr;
			}
		}
		if (name === "selectAll") {
			let selectAll = ["Payday_loans", "high_loans", "auto_loans", "mortgage_loans", "student_loans", "Cryptocurrency", "debt_third", "debt_cons", "Debt_reduction", "credit_repair", "Cannabis_US", "CBD_US", "drugs", "casino_apps", "gambling_web", "sex", "hate", "alcohol", "Firearms", "Tobaccorrency"];
			if (e.target.checked) {
				for (let i = 0; i < selectAll.length; i++) {
					const element = selectAll[i];
					document.getElementById(element).checked = true;
				}
				arr1 = ["Payday_loans", "high_loans", "auto_loans", "mortgage_loans", "student_loans", "Cryptocurrency"];
				arr2 = ["debt_third", "debt_cons", "Debt_reduction", "credit_repair"];
				arr3 = ["Cannabis_US", "CBD_US", "drugs"];
				arr4 = ["casino_apps", "gambling_web"];
				arr5 = ["sex", "hate", "alcohol", "Firearms", "Tobaccorrency"];
			} else {
				for (let i = 0; i < selectAll.length; i++) {
					const element = selectAll[i];
					document.getElementById(element).checked = false;
				}
				arr1 = [];
				arr2 = [];
				arr3 = [];
				arr4 = [];
				arr5 = [];
			}
		}
		if (name !== "selectAll" && arr1.length === 6 && arr2.length === 4 && arr3.length === 3 && arr4.length === 2 && arr5.length === 5) {
			document.getElementById("selectAll").checked = true;
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
				<div className="col-lg-7 p-0 log-rgt-part">
					<div className="login-side-box">
						<div className="login-side-main-scroll">
							<div className="login-side-main-inner mx-auto">
								<div className="login-side-fix-width">
									<div className="login-side-main-logo text-center pb-5">
										<img src={Logo} className="img-fluid" alt="Text A Buy" />
									</div>
									<div className="login-side-main-inner-white">
										<div className="text-center pb-4">
											<p className="text-black">By using text a buy, you are agreeing to comply with our services and not advertise the following content</p>
										</div>
										<Formik
											innerRef={runforms}
											enableReinitialize={true}
											initialValues={{
												Payday_loans: "",
												high_loans: "",
												auto_loans: "",
												mortgage_loans: "",
												student_loans: "",
												Cryptocurrency: "",

												debt_third: "",
												debt_cons: "",
												Debt_reduction: "",
												credit_repair: "",

												Cannabis_US: "",
												CBD_US: "",
												drugs: "",

												casino_apps: "",
												gambling_web: "",

												sex: "",
												hate: "",
												alcohol: "",
												Firearms: "",
												Tobaccorrency: "",
											}}
											onSubmit={(formData, { resetForm }) => addAgreeing(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 agreement-top-class" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<div className="head-agree-ttl">High-risk Financial Services</div>
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Payday_loans" onChange={(e) => handleChange("financial_service", e)} name="Payday_loans" />
																		<span className="cust-chkmark"></span>Payday loans
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="high_loans" onChange={(e) => handleChange("financial_service", e)} name="high_loans" />
																		<span className="cust-chkmark"></span> Short term high-interest loans
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="auto_loans" onChange={(e) => handleChange("financial_service", e)} name="auto_loans" />
																		<span className="cust-chkmark"></span>Third-party auto loans
																	</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="mortgage_loans" onChange={(e) => handleChange("financial_service", e)} name="mortgage_loans" />
																		<span className="cust-chkmark"></span>Third-party mortgage loans
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="student_loans" onChange={(e) => handleChange("financial_service", e)} name="student_loans" />
																		<span className="cust-chkmark"></span> Student loans
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Cryptocurrency" onChange={(e) => handleChange("financial_service", e)} name="Cryptocurrency" />
																		<span className="cust-chkmark"></span> Cryptocurrency
																	</label>
																</div>
															</div>
														</div>
													</div>
													<div className="col-12 mb-3">
														<div className="head-agree-ttl">Debt collection or forgiveness</div>
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="debt_third" onChange={(e) => handleChange("Debt_collection", e)} name="debt_third" />
																		<span className="cust-chkmark"></span>Third-party debt collection
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="debt_cons" onChange={(e) => handleChange("Debt_collection", e)} name="debt_cons" />
																		<span className="cust-chkmark"></span> Debt consolidation
																	</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Debt_reduction" onChange={(e) => handleChange("Debt_collection", e)} name="Debt_reduction" />
																		<span className="cust-chkmark"></span>Debt reduction
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="credit_repair" onChange={(e) => handleChange("Debt_collection", e)} name="credit_repair" />
																		<span className="cust-chkmark"></span> Credit repair programs
																	</label>
																</div>
															</div>
														</div>
													</div>
													<div className="col-12 mb-3">
														<div className="head-agree-ttl">Illegal substances</div>
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Cannabis_US" onChange={(e) => handleChange("unlegal_substances", e)} name="Cannabis_US" />
																		<span className="cust-chkmark"></span>Cannabis (United States)
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="CBD_US" onChange={(e) => handleChange("unlegal_substances", e)} name="CBD_US" />
																		<span className="cust-chkmark"></span> CBD (United States)
																	</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="drugs" onChange={(e) => handleChange("unlegal_substances", e)} name="drugs" />
																		<span className="cust-chkmark"></span>Prescription drugs
																	</label>
																</div>
															</div>
														</div>
													</div>
													<div className="col-12 mb-3">
														<div className="head-agree-ttl">Gambling</div>
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="casino_apps" onChange={(e) => handleChange("gambling", e)} name="casino_apps" />
																		<span className="cust-chkmark"></span>Casino apps
																	</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="gambling_web" onChange={(e) => handleChange("gambling", e)} name="gambling_web" />
																		<span className="cust-chkmark"></span>Gambling websites
																	</label>
																</div>
															</div>
														</div>
													</div>
													<div className="col-12 mb-3">
														<div className="head-agree-ttl">"S.H.A.F.T." use cases </div>
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="sex" onChange={(e) => handleChange("SHAFT_cases", e)} name="sex" />
																		<span className="cust-chkmark"></span>Sex
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="hate" onChange={(e) => handleChange("SHAFT_cases", e)} name="hate" />
																		<span className="cust-chkmark"></span> Hate
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="alcohol" onChange={(e) => handleChange("SHAFT_cases", e)} name="alcohol" />
																		<span className="cust-chkmark"></span>Alcohol
																	</label>
																</div>
															</div>
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Firearms" onChange={(e) => handleChange("SHAFT_cases", e)} name="Firearms" />
																		<span className="cust-chkmark"></span>Firearms
																	</label>
																</div>
																<div className="cust-checkbox-new mt-2">
																	<label className="cust-chk-bx">
																		<input type="checkbox" id="Tobaccorrency" onChange={(e) => handleChange("SHAFT_cases", e)} name="Tobaccorrency" />
																		<span className="cust-chkmark"></span>Tobaccorrency
																	</label>
																</div>
															</div>
														</div>
													</div>

													<div className="col-12 mb-3">
														<div className="row">
															<div className="col-md-6">
																<div className="cust-checkbox-new mt-2">
																	<div className="head-agree-ttl"> Select All </div>
																	<div className="row">
																		<div className="col-md-6">
																			<div className="cust-checkbox-new mt-2">
																				<label className="cust-chk-bx">
																					<input type="checkbox" id="selectAll" onChange={(e) => handleChange("selectAll", e)} name="selectAll" />
																					<span className="cust-chkmark"></span>Select All
																				</label>
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															Continue
														</button>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
