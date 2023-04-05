import React, { useRef } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { API_Path, errorContainer, phoneRegExp } from "../../const";
import { PostApi } from "../../APIService";
import Context from "../../contexts/context";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useContext } from "react";

export default function ForgotPassword() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const runforms = useRef();

	const forgotPassword = (formData, resetForm) => {
		const LoginPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.forgotpassword, formData)));
		LoginPromise.then((response) => {
			if (response.status === 200) {
				context.onContactChange(formData.contact_no);
				resetForm(formData);
				toast.success(response.data.message);
				Navigate("/otp-verification/", { state: { id: 1 } });
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
											<h1>Forget Password</h1>
											<p className="mt-2">Enter your phone number and we’ll send a link to reset your password.</p>
										</div>
										<Formik
											innerRef={runforms}
											initialValues={{ contact_no: "" }}
											validationSchema={Yup.object({
												contact_no: Yup.string().matches(phoneRegExp, "Phone Number is not valid").required("Phone Number is required."),
											})}
											onSubmit={(formData, { resetForm }) => forgotPassword(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Phone Number</label>
														<PhoneInput inputExtraProps={{ inputClass: "form-control style-input-class", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" onChange={PhonehandleOnChange} />
														{errorContainer(runform, "contact_no")}
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															SEND OTP
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
									Remember password? <a onClick={() => Navigate("/login")}>Sign In</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
