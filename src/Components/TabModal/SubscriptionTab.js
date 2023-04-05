import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import InputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PostApi } from "../../APIService";
import { API_Path, errorContainer, formAttr } from "../../const";

export default function SubscriptionTab(props) {
	const runforms = useRef();
	const Navigate = useNavigate();

	const [id, setid] = useState();
	const [isChoosePlan, setisChoosePlan] = useState(false);
	const [cardNumber, setcardNumber] = useState("");
	const [country, setcountry] = useState([]);
	const [state, setstate] = useState([]);
	const [city, setcity] = useState([]);
	const [date, setdate] = useState("");
	const [cardHolderName, setcardHolderName] = useState("");
	const [Planid, setPlanid] = useState("");
	const [getSinglePlan, setgetSinglePlan] = useState("");
	const [cvv, setcvv] = useState("");
	const [selectedCountry, setselectedCountry] = useState("");
	const [selectedCity, setselectedCity] = useState("");
	const [t_country, sett_country] = useState("");
	const [s_country, sets_country] = useState("");
	const [s_state, sets_state] = useState("");
	const [t_state, sett_state] = useState("");
	const [shopifydata, setshopifydata] = useState();

	useEffect(() => {
		if (isChoosePlan) Getcountries();
	}, [isChoosePlan]);

	useEffect(() => {
		getUserById();
	}, []);

	const getUserById = () => {
		const getuserDataPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.storeconnectcheck)));
		getuserDataPromise.then((res) => {
			if (res.status === 200) {
				setshopifydata(res.data.data.shopify);
			}
		});
	};

	const Getcountries = () => {
		const countriesPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getAllcountries)));
		countriesPromise.then((response) => {
			if (response.status === 200) {
				let tempArr = [];
				tempArr = response.data.data.map((element) => {
					return element;
				});
				setcountry(tempArr);
			}
		});
	};

	const Getstates = (isoCode) => {
		const statesPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getStates, { isoCode: isoCode })));
		statesPromise.then((response) => {
			if (response.status === 200) {
				let tempArr2 = [];
				tempArr2 = response.data.data.map((element) => {
					return element;
				});
				setstate(tempArr2);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	const Getcities = (id) => {
		const citiesPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getCities, { isoCode: id, countryCode: selectedCountry })));
		citiesPromise.then((response) => {
			if (response.status === 200) {
				let tempArr3 = [];
				tempArr3 = response.data.data.map((element) => {
					return element;
				});
				setcity(tempArr3);
			} else {
				toast.error(response.data.message);
			}
		});
	};

	const handleSelectPlan = (id) => {
		if (props.getAllPlan?.currentPlan === "") {
			Navigate("/billing-information", { state: { id: id } });
		} else {
			setisChoosePlan(true);
			setPlanid(id);
			getPlanById(id);
		}
	};

	const getPlanById = (id) => {
		const getPlanByIdPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getPlanById, { planid: id })));
		getPlanByIdPromise.then((res) => {
			if (res.status === 200) {
				setgetSinglePlan(res.data.data);
			}
		});
	};

	const handleCountry = (e) => {
		let id = e.target.value?.split("+")[0];
		setselectedCountry(id);
		sets_country(e.target.value?.split("+")[1]);
		sett_country(e.target.value);
		runforms.current.setFieldValue("country", e.target.value);
		Getstates(id);
	};

	const handleState = (e) => {
		let id = e.target.value?.split("+")[0];
		sets_state(e.target.value?.split("+")[1]);
		sett_state(e.target.value);
		runforms.current.setFieldValue("state", e.target.value);
		Getcities(id);
	};

	const handleCity = (e) => {
		setselectedCity(e.target.value);
		runforms.current.setFieldValue("city", e.target.value);
	};

	const addBillingData = (formData) => {
		let data = { fullname: formData.name, email: formData.email, address: formData.address, country: s_country, state: s_state, city: selectedCity, postal_code: formData.postalCode, cardholderName: cardHolderName, cardnumber: cardNumber, cardexpiredate: date, cvc: cvv, planid: Planid, userid: id };
		const AddBillingInfoPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.UpdateBillingInfo, data)));
		AddBillingInfoPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				Navigate("/payment/", { state: { id: res.data.data._id } });
			} else {
				toast.error(res.data.message);
				Navigate("/payment/", { state: { id: res.data.data._id } });
			}
		});
	};

	const addSubScriptionData = () => {
		if (document.getElementById("submitForm")) {
			document.getElementById("submitForm").click();
		}
	};

	return (
		<>
			{isChoosePlan ? (
				<div className="comn-bg-section-2">
					<div className="container h-100">
						<div className="row h-100">
							<div className="col-lg-7">
								<div className="detail-box-class">
									<Formik
										innerRef={runforms}
										enableReinitialize={false}
										initialValues={{
											name: "",
											email: "",
											address: "",
											postalCode: "",
											country: t_country ? t_country : null,
											state: t_state ? t_state : null,
											city: selectedCity ? selectedCity : null,
										}}
										validationSchema={Yup.object({
											name: Yup.string().required("This field is required."),
											email: Yup.string().email("enter valid email address.").required("This field is required."),
											address: Yup.string().required("This field is required."),
											postalCode: Yup.string().required("This field is required."),
											country: Yup.string().nullable().required("This field is required."),
											state: Yup.string().nullable().required("This field is required."),
											city: Yup.string().nullable().required("This field is required."),
										})}
										onSubmit={(formData, { resetForm }) => addBillingData(formData, resetForm)}
									>
										{(runform) => (
											<form className="row" onSubmit={runform.handleSubmit}>
												<div className="col-12">
													<div className="comn-title-main pt-0">
														<h1 className="mb-0">Billing information</h1>
													</div>
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">Customers Full Name</label>
													<input className="form-control comn-input-style" type="text" placeholder="Enter Your Full Name" name="name" {...formAttr(runform, "name")} />
													{errorContainer(runform, "name")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">Email Address</label>
													<input className="form-control comn-input-style" type="email" placeholder="Enter Your Email Address" name="email" {...formAttr(runform, "email")} />
													{errorContainer(runform, "email")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">Address</label>
													<input className="form-control comn-input-style" type="text" placeholder="Enter Your Address" name="address" {...formAttr(runform, "address")} />
													{errorContainer(runform, "address")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">Country</label>
													<select className="form-control comn-input-style" name="country" onChange={handleCountry} value={t_country}>
														<option value="">Select Country</option>
														{country.length > 0 &&
															country.map((item, i) => {
																return (
																	<>
																		<option key={i} value={`${item.isoCode}+${item.name}`}>
																			{item.name}
																		</option>
																	</>
																);
															})}
													</select>
													{errorContainer(runform, "country")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">State</label>
													<select className="form-control comn-input-style" name="state" onChange={handleState} value={t_state}>
														<option value="">Select State</option>
														{state.length > 0 &&
															state.map((data, i) => {
																return (
																	<>
																		<option key={i} value={`${data.isoCode}+${data.name}`}>
																			{data.name}
																		</option>
																	</>
																);
															})}
													</select>
													{errorContainer(runform, "state")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">City</label>
													<select className="form-control comn-input-style" name="city" onChange={handleCity} value={selectedCity}>
														<option value="">Select City</option>
														{city.length > 0 &&
															city.map((data, i) => {
																return (
																	<>
																		<option value={data.name} key={i} id={data.name}>
																			{data.name}
																		</option>
																	</>
																);
															})}
													</select>
													{errorContainer(runform, "city")}
												</div>
												<div className="col-12 mb-3">
													<label className="label-comn-text mb-2 d-block">Postal Code</label>
													<input className="form-control comn-input-style" type="text" placeholder="Enter Postal Code" name="postalCode" {...formAttr(runform, "postalCode")} />
													{errorContainer(runform, "postalCode")}
												</div>
												<div className="col-12 text-center">
													<div className="row">
														<div className="col-xxl-3 col-md-4 col-6">
															<button type="submit" id="submitForm" className="btn-comn-class w-100 d-none">
																Click
															</button>
														</div>
													</div>
												</div>
											</form>
										)}
									</Formik>
								</div>
							</div>
							<div className="col-lg-5">
								<div className="detail-box-class mb-3">
									<div className="current-plan-box mb-3">
										<div className="d-flex ">
											<div className="w-100">
												<span>{getSinglePlan && getSinglePlan.planName}</span>
												<p>{getSinglePlan && getSinglePlan.description}</p>
											</div>
											<div className="ms-auto text-end">
												<p>
													<bdi>${getSinglePlan && getSinglePlan.monthprice}</bdi>/Per month
												</p>
												<Link to="#">
													<span onClick={() => setisChoosePlan(false)}>change</span>
												</Link>
											</div>
										</div>
									</div>
									<div className="sub-table-section">
										<table className="table mb-0">
											<tbody>
												<tr>
													<td>Price</td>
													<td>${getSinglePlan && getSinglePlan.monthprice}</td>
												</tr>
											</tbody>
											<tfoot>
												<tr>
													<td>Total Pay</td>
													<td>${getSinglePlan && getSinglePlan.monthprice}</td>
												</tr>
											</tfoot>
										</table>
									</div>
								</div>
								<div className="detail-box-class">
									<form className="row">
										<div className="col-12">
											<div className="comn-title-main pt-0">
												<h1 className="mb-0">Payment Method</h1>
											</div>
										</div>
										<div className="col-12">
											<div className="d-flex">
												<div className="cust-radio-btn ">
													<input type="radio" id="card1" defaultChecked name="payment" />
													<label htmlFor="card">
														<div className="d-flex flex-column">
															<span>card</span>
															<p>All payments will be processed securely</p>
														</div>
													</label>
												</div>
											</div>
											<div className="row">
												<div className="col-12 mb-3">
													<span>Add new card</span>
												</div>
												<div className="col-12 mb-3">
													<bdi className="position-relative ">
														<i className="bi bi-credit-card eye-pwd"></i>
														<InputMask type="text" className="form-control comn-input-style" mask="9999 9999 9999 9999" placeholder="**** **** **** ****" name="cardNumber" onChange={(e) => setcardNumber(e.target.value)} />
													</bdi>
												</div>
												<div className="col-6 mb-3">
													<InputMask type="text" placeholder="MM/YYYY" mask="99/9999" className="form-control comn-input-style" name="date" onChange={(e) => setdate(e.target.value)} />
												</div>
												<div className="col-6 mb-3">
													<div className="position-relative">
														<InputMask type="password" name="cvv" id="myInput" maxLength={4} className="form-control comn-input-style" placeholder="***" onChange={(e) => setcvv(e.target.value)} />
													</div>
												</div>
												<div className="col-12 mb-3">
													<input type="text" placeholder="Enter Card Holder Name" name="cardHolderName" className="form-control comn-input-style" onChange={(e) => setcardHolderName(e.target.value)} />
												</div>
												<div className="col-12 mb-3">
													<div className="cust-checkbox-new">
														<label className="cust-chk-bx">
															<input type="checkbox" id="newcardadd" name="newcardadd" />
															<span className="cust-chkmark"></span>Securely save this card
														</label>
													</div>
												</div>
											</div>
											<button type="button" className="btn-comn-class w-100" onClick={addSubScriptionData}>
												Pay Using credit card
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="detail-box-class p-md-4">
					<div className="login-side-main-inner-white border-0 bg-transparent shadow-none p-0">
						<div className="text-center pb-0">
							<h1>Choose a plan</h1>
							{!shopifydata && <span className="text-warning">Note: You can't choose plan without both of integration connected, so please everyone is connect properly.</span>}
						</div>
					</div>
					<div className="pt-lg-5 pt-3">
						<div className="row justify-content-center">
							{props.getAllPlan &&
								props.getAllPlan?.newplan.map((item, i) => {
									return (
										<div className="col-lg-4 col-md-6 mb-5 mb-lg-0" key={i}>
											<div className={item.mostpopular === true ? "popular plan-box-list position-relative" : "plan-box-list position-relative"}>
												{item.mostpopular === true && <span className="most-pplr-text position-absolute text-center d-flex align-items-center justify-content-center">Most Popular</span>}
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
												{shopifydata && (
													<div className="plan-box-list-btn mt-auto pt-3 text-center " onClick={() => props.getAllPlan?.currentPlan !== item._id && handleSelectPlan(item._id)}>
														<span className={` ${props.getAllPlan?.currentPlan === item._id ? "text-primary fw-bold mb-3 w-100 bg-transparent border-0" : "bg-primary text-light w-100 d-block btn-comn-class"}`} name={`${item.planName}-plan`}>
															{props.getAllPlan?.currentPlan === item._id ? "Current Plan" : "Choose Plan"}
														</span>
													</div>
												)}
											</div>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
