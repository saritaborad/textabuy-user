import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../../images/logo-main.svg";
import RightImage from "../../images/right-image-1.png";
import { useNavigate } from "react-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { API_Path, errorContainer, formAttr } from "../../const";
import { PostApi } from "../../APIService";
import eyeCLose from "../../../src/images/eye-close.svg";
import eyeOpen from "../../../src/images/eye-show.svg";
import { toast } from "react-toastify";
import sign from "jwt-encode";
import Context from "../../contexts/context";
const REMEMBER_SECRET = "sd0adasd3JM4bsavd5savdg6hkdjs1JD2fvcs7d8gcyuguy9g";

export default function Login(props) {
	const context = useContext(Context);
	const runforms = useRef();
	const Navigate = useNavigate();
	const [remember, setremember] = useState(false);
	const [password_type, setpassword_type] = useState("password");

	useEffect(() => {
		if (localStorage.getItem("user-token")) {
			Navigate("/dashboard");
		}
		if (localStorage.getItem("remember_token")) {
			setremember(true);
			var decoded = parseJwt(localStorage.getItem("remember_token"));
			runforms.current.setFieldValue("email", decoded.email);
			runforms.current.setFieldValue("password", decoded.password);
			document.getElementById("remember").checked = true;
		}
	}, []);

	const parseJwt = (token) => {
		var base64Url = token.split(".")[1];
		var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
		var jsonPayload = decodeURIComponent(
			window
				.atob(base64)
				.split("")
				.map(function (c) {
					return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
				})
				.join("")
		);

		return JSON.parse(jsonPayload);
	};

	const login = (formData) => {
		const LoginPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.login, formData)));
		LoginPromise.then((response) => {
			if (response.status === 200) {
				toast.success("Login Successful");
				localStorage.setItem("user-token", "Bearer " + response.data.data.token);
				context.set_landing_page_id(response.data.data.landingpageid);
				context.set_login_user_id(response.data.data.user_id);
				encode_token_jwt(formData, REMEMBER_SECRET);
				Navigate("/dashboard");
			} else {
				toast.error("Invalid username or password");
			}
		});
	};

	const encode_token_jwt = (formData, REMEMBER_SECRET) => {
		var date = new Date();
		var time = date.getTime();
		const data = { exp: time + 3600, email: formData.email, password: formData.password, iat: time };
		const jwt = sign(data, REMEMBER_SECRET);
		if (remember) {
			localStorage.setItem("remember_token", jwt);
		} else {
			localStorage.removeItem("remember_token");
		}
	};

	const handleRememberCheckbox = (e) => {
		if (e.target.checked) {
			setremember(true);
		} else {
			setremember(false);
			localStorage.removeItem("remember_token");
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
											<h1>Sign In to Account</h1>
										</div>
										<Formik
											innerRef={runforms}
											enableReinitialize
											initialValues={{
												email: "",
												password: "",
											}}
											validationSchema={Yup.object({
												email: Yup.string().email().required("Email is required."),
												password: Yup.string().required("Password is required."),
											})}
											onSubmit={(formData, { resetForm }) => login(formData, resetForm)}
										>
											{(runform) => (
												<form className="row mb-0 frm-logo-top" onSubmit={runform.handleSubmit}>
													<div className="col-12 mb-3">
														<label className="label-comn-text mb-2 d-block">Email Address</label>
														<input type="email" name="email" {...formAttr(runform, "email")} className="form-control comn-input-style" placeholder="you@example.com" />
														{errorContainer(runform, "email")}
													</div>
													<div className="col-12 mb-3" id="passtoggler">
														<label className="label-comn-text mb-2 d-block">Password</label>
														<bdi className="d-block position-relative password-class">
															<input type={password_type} name="password" placeholder="********" className="form-control comn-input-style" {...formAttr(runform, "password")} />
															{errorContainer(runform, "password")}
															<label onClick={() => setpassword_type(password_type === "password" ? "text" : "password")} className="eye-pwd bg-transparent">
																{password_type === "text" ? <img src={eyeOpen} className="pass-show-image" alt="" /> : <img src={eyeCLose} className="pass-close-image" alt="" />}
															</label>
														</bdi>
													</div>
													<div className="mb-3 col-6">
														<div className="cust-checkbox-new">
															<label className="cust-chk-bx">
																<input type="checkbox" id="remember" name="remember" value={remember} onChange={handleRememberCheckbox} />
																<span className="cust-chkmark"></span>Remember me
															</label>
														</div>
													</div>
													<div className="form-group mb-3 col-6 text-end">
														<a onClick={() => Navigate("/forgot-password")} className="d-inline-block frt-link cursor-pointer">
															Forgot your password?
														</a>
													</div>
													<div className="col-12 pt-4 text-center">
														<button type="submit" className="btn-comn-class w-100">
															LOGIN
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
									Don’t have an account? <a onClick={() => Navigate("/signup")}>Sign Up</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
