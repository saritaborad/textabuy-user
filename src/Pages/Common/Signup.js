import React, { useContext, useRef, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_Path, errorContainer, formAttr, phoneRegExp } from "../../const";
import { PostApi } from "../../APIService";
import eyeCLose from "../../../src/images/eye-close.svg";
import eyeOpen from "../../../src/images/eye-show.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Context from "../../contexts/context";

export default function Signup() {
	const context = useContext(Context);
	const runforms = useRef();
	const Navigate = useNavigate();
	const [password_type, setpassword_type] = useState("password");

	const Sing_Up = (formData, resetForm) => {
		const SignupPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.signup, formData)));
		SignupPromise.then((response) => {
			if (response.status === 200) {
				context.onContactChange(formData.contact_no);
				Navigate("/otp-verification", { state: { id: 0, user_id: response.data.data?.user?.id } });
				resetForm(formData);
				toast.success("Sign Up Successfully");
			} else {
				toast.error(response.data.message);
			}
		});
	};

	const PhonehandleOnChange = (value) => {
		let temp = "+" + value;
		runforms.current.setFieldValue("contact_no", temp);
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
											<h1>Register Account</h1>
										</div>
										<Formik
											innerRef={runforms}
											initialValues={{
												fname: "",
												lname: "",
												store_name: "",
												email: "",
												password: "",
												contact_no: "",
											}}
											validationSchema={Yup.object({
												fname: Yup.string().required("First name is required."),
												lname: Yup.string().required("Last name is required."),
												store_name: Yup.string().required("Store name is required."),
												email: Yup.string().email().required("Email is required."),
												password: Yup.string().required("Password is required."),
												contact_no: Yup.string().matches(phoneRegExp, "Phone Number is not valid").required("Phone Number is required."),
											})}
											onSubmit={(formData, { resetForm }) => Sing_Up(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text mb-2 d-block">First Name</label>
														<input type="text" name="fname" {...formAttr(runform, "fname")} className="form-control comn-input-style" placeholder="Enter your first name" />
														{errorContainer(runform, "fname")}
													</div>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text mb-2 d-block">Last Name</label>
														<input type="text" name="lname" {...formAttr(runform, "lname")} className="form-control comn-input-style" placeholder="Enter your last name" />
														{errorContainer(runform, "lname")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Store Name</label>
														<input type="text" name="store_name" {...formAttr(runform, "store_name")} className="form-control comn-input-style" placeholder="Enter your Store name" />
														{errorContainer(runform, "store_name")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Email Address</label>
														<input type="email" name="email" {...formAttr(runform, "email")} className="form-control comn-input-style" placeholder="you@example.com" />
														{errorContainer(runform, "email")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Phone Number</label>
														<PhoneInput inputExtraProps={{ inputClass: "form-control style-input-class", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" onChange={PhonehandleOnChange} />
														{errorContainer(runform, "contact_no")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Password</label>
														<bdi className="d-block position-relative password-class">
															<input type={password_type} className="form-control comn-input-style" {...formAttr(runform, "password")} name="password" />
															{errorContainer(runform, "password")}
															<label onClick={() => setpassword_type(password_type === "password" ? "text" : "password")} className="eye-pwd bg-transparent">
																{password_type === "text" ? <img src={eyeOpen} className="pass-show-image" alt="" /> : <img src={eyeCLose} className="pass-close-image" alt="" />}
															</label>
														</bdi>
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															SIGN UP
														</button>
													</div>
												</form>
											)}
										</Formik>
									</div>
								</div>
							</div>
							<div className="text-center pt-3">
								<p className="mb-0 btm-login-link">
									Already have an account? <a onClick={() => Navigate("/login")}>Sign In</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
