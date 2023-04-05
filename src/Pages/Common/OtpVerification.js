import React, { useState, useEffect } from "react";
import { API_Path } from "../../const";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-2.png";
import OtpInput from "react-otp-input";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { PostApi } from "../../APIService";
import { useContext } from "react";
import Context from "../../contexts/context";

export default function OtpVerification() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const location = useLocation();
	const [otp, setotp] = useState(0);
	const [num, setnum] = useState(5);
	const [contact_no, setcontact_no] = useState("");
	const [id, setid] = useState("");

	useEffect(() => {
		setnum(location.state?.id);
		setid(location.state?.user_id);
	}, [location.state]);

	useEffect(() => {
		setcontact_no(context.contact_no);
	}, [context.contact_no]);

	const handleChange = (value) => {
		setotp(value);
		verifyOtp(value);
	};

	const verifyOtp = (value) => {
		if (value.length >= 4) {
			if (num === 1) {
				let data = { contact_no: contact_no, otp: value };
				const verifyOtpPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.otpVerification, data)));
				verifyOtpPromise.then((res) => {
					if (res.status === 200) {
						toast.success(res.data.message);
						Navigate("/reset-password");
					} else {
						toast.error(res.data.message);
					}
				});
			} else if (num === 0) {
				let data = { signupOtp: value, id: id };
				const verifyOtpPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.signupotpVerification, data)));
				verifyOtpPromise.then((res) => {
					if (res.status === 200) {
						toast.success(res.data.message);
						localStorage.setItem("user-token", "Bearer " + res.data.data.token);
						Navigate("/agreeing-to-comply", { state: { user_id: id } });
					} else {
						toast.error(res.data.message);
					}
				});
			}
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
										<div className="text-center pb-0">
											<h1>Phone Number Verification</h1>
											<p className="mt-2">Enter the code we just sent to the following number:</p>
										</div>
										<form className="row mb-0 frm-logo-top">
											<div className="col-12 mb-3">
												<label className="label-comn-text mb-2 d-block text-center">{contact_no}</label>
												<div className="row align-items-center justify-content-center">
													<div className="col-12">
														<div className="pt-4 text-center me-0" id="otp">
															<OtpInput value={otp} onChange={handleChange} numInputs={4} separator={<span style={{ width: "10px" }}></span>} isInputNum={true} shouldAutoFocus={true} inputStyle={{ border: "1px solid #605b6a4d", borderRadius: "8px", width: "54px", height: "54px", fontSize: "12px", color: "#000", fontWeight: "400", caretColor: "blue" }} containerStyle={{ justifyContent: "center" }} focusStyle={{ border: "1px solid #CFD3DB", outline: "none", boxShadow: "0 0 3px #1081e84d" }} />
														</div>
													</div>
												</div>
											</div>
											<div className="col-12 pt-4 text-center">
												<button type="button" className="btn-comn-class w-100">
													Validate OTP
												</button>
											</div>
										</form>
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
