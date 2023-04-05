import React, { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PostApi } from "../../APIService";
import { API_Path, errorContainer, formAttr, LandingPageURL } from "../../const";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import { toast } from "react-toastify";

export default function BillingInformation() {
	const location = useLocation();
	const Navigate = useNavigate();
	const runforms = useRef();
	const [id, setid] = useState("");
	const [iscard, setiscard] = useState(false);
	const [isaddcard, setisaddcard] = useState(false);
	const [selectedCountry, setselectedCountry] = useState("");
	const [selectedCity, setselectedCity] = useState("");
	const [selectedState, setselectedState] = useState("");
	const [t_country, sett_country] = useState("");
	const [t_state, sett_state] = useState("");
	const [country, setcountry] = useState([]);
	const [state, setstate] = useState([]);
	const [city, setcity] = useState([]);
	const [getSinglePlan, setgetSinglePlan] = useState("");

	useEffect(() => {
		if (location?.state?.id !== undefined) {
			setid(location.state.id);
			runforms.current.setFieldValue("planid", location.state.id);
		} else {
			window.location.href = `${LandingPageURL}/dashboard`;
		}
	}, [location?.state?.id]);

	useEffect(() => {
		getPlanById(location.state.id);
		if (document.getElementById("card").checked === true) {
			setiscard(true);
		} else {
			setiscard(false);
		}
		Getcountries();
	}, [id]);

	const getPlanById = (id) => {
		const getPlanByIdPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getPlanById, { planid: id })));
		getPlanByIdPromise.then((res) => {
			if (res.status === 200) {
				setgetSinglePlan(res.data.data);
			}
		});
	};

	const handleCardChange = () => {
		if (document.getElementById("addcard").checked === true) {
			setisaddcard(true);
		} else {
			setisaddcard(false);
		}
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
				Getstates(selectedCountry);
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
				Getcities(selectedState);
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

	const handleCountry = (e) => {
		let id = e.target.value?.split("+")[0];
		setselectedCountry(id);
		sett_country(e.target.value);
		runforms.current.setFieldValue("country", e.target.value);
		Getstates(id);
	};

	const handleState = (e) => {
		let id = e.target.value?.split("+")[0];
		setselectedState(id);
		sett_state(e.target.value);
		runforms.current.setFieldValue("state", e.target.value);
		Getcities(id);
	};

	const handleCity = (e) => {
		setselectedCity(e.target.value);
		runforms.current.setFieldValue("city", e.target.value);
	};

	const addBillingData = (formData, resetForm) => {
		const AddBillingInfoPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.AddBillingInfo, formData)));
		AddBillingInfoPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				resetForm(formData);
				Navigate("/payment/", { state: { id: res.data.data._id } });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const addSubScriptionData = () => {
		if (document.getElementById("submitForm")) {
			document.getElementById("submitForm").click();
		}
	};

	const handleCardCVV = (e) => {
		runforms.current.setFieldValue("cvc", e.target.value);
	};

	const handleCardDate = (e) => {
		runforms.current.setFieldValue("cardexpiredate", e.target.value);
	};

	const handleCardNumber = (e) => {
		runforms.current.setFieldValue("cardnumber", e.target.value);
	};

	const HandleCardHolderName = (e) => {
		runforms.current.setFieldValue("cardholderName", e.target.value);
	};

	return (
		<div className="comn-bg-section-2   py-5">
			<div className="container h-100">
				<div className="row h-100">
					<div className="col-lg-8">
						<div className="detail-box-class">
							<Formik
								innerRef={runforms}
								enableReinitialize={false}
								initialValues={{
									country: "",
									state: "",
									city: "",
									fullname: "",
									email: "",
									address: "",
									postalCode: "",
									cardholderName: "",
									cardnumber: "",
									cardexpiredate: "",
									cvc: "",
								}}
								validationSchema={Yup.object({
									fullname: Yup.string().required("This field is required."),
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
											<input className="form-control comn-input-style" type="text" placeholder="Enter Your Full Name" name="fullname" {...formAttr(runform, "fullname")} />
											{errorContainer(runform, "fullname")}
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
															<option key={i} value={`${item.isoCode}+${item.name}`}>
																{item.name}
															</option>
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
															<option key={i} value={`${data.isoCode}+${data.name}`}>
																{data.name}
															</option>
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
															<option value={data.name} key={i} id={data.name}>
																{data.name}
															</option>
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
					<div className="col-lg-4">
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
										<Link to="/choose-subscription">change</Link>
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
										<tr>
											<td>VAT/GST/Sales taxes (18%)</td>
											<td>${getSinglePlan && (getSinglePlan.monthprice * 18) / 100}</td>
										</tr>
									</tbody>
									<tfoot>
										<tr>
											<td>Total Pay</td>
											<td>${getSinglePlan && getSinglePlan.monthprice + (getSinglePlan.monthprice * 18) / 100}</td>
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
											<input type="radio" id="card" defaultChecked name="payment" />
											<label htmlFor="card">
												<div className="d-flex flex-column">
													<span>card</span>
													<p>All payments will be processed securely</p>
												</div>
											</label>
										</div>
									</div>
									{iscard ? (
										<div className="custom-card-part mt-2">
											<div className="comn-radio-box position-relative" onChange={handleCardChange}>
												<input type="radio" id="addcard" name="cardsoption" />
												<label className="comn-radio-lbl mb-2" htmlFor="addcard">
													<div className="d-flex align-items-center justify-content-center">
														<i className="bi bi-plus-square me-2"></i>
														<div>
															<span className="d-block">Add New Card</span>
														</div>
													</div>
												</label>
											</div>
											{isaddcard ? (
												<div className="row">
													<div className="col-12 mb-3">
														<span>Add new card</span>
													</div>
													<div className="col-12 mb-3">
														<bdi className="position-relative ">
															<i className="bi bi-credit-card eye-pwd"></i>
															<InputMask type="text" className="form-control comn-input-style" mask="9999 9999 9999 9999" placeholder="**** **** **** ****" name="cardNumber" onChange={handleCardNumber} />
														</bdi>
													</div>
													<div className="col-6 mb-3">
														<InputMask type="text" placeholder="MM/YYYY" mask="99/9999" className="form-control comn-input-style" name="date" onChange={handleCardDate} />
													</div>
													<div className="col-6 mb-3">
														<div className="position-relative">
															<InputMask type="password" name="cvv" id="myInput" maxLength={4} className="form-control comn-input-style" placeholder="***" onChange={handleCardCVV} />
														</div>
													</div>
													<div className="col-12 mb-3">
														<input type="text" placeholder="Enter Card Holder Name" name="cardHolderName" className="form-control comn-input-style" onChange={HandleCardHolderName} />
													</div>
												</div>
											) : (
												""
											)}
											<button type="button" className="btn-comn-class w-100" onClick={addSubScriptionData}>
												Pay Using credit card
											</button>
										</div>
									) : (
										""
									)}
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
