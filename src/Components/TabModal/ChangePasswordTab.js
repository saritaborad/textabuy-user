import React, { useRef } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { API_Path, errorContainer, formAttr } from "../../const";
import { PostApi } from "../../APIService";

export default function ChangePasswordTab() {
	const runforms = useRef();

	const submitPasswordData = (formData, resetForm) => {
		const changePasswordPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.changePassword, formData)));
		changePasswordPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				resetForm(formData);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	return (
		<>
			<div className="login-side-main-inner-white set-chpwd-box">
				<div className="text-center pb-4">
					<h1>Change Password</h1>
				</div>
				<Formik
					innerRef={runforms}
					enableReinitialize={true}
					initialValues={{
						oldPassword: "",
						newPassword: "",
						retypepassword: "",
					}}
					validationSchema={Yup.object({
						oldPassword: Yup.string().required("Password is required."),
						newPassword: Yup.string()
							.when("oldPassword", {
								is: (val) => (val && val.length > 0 ? true : false),
								then: Yup.string().notOneOf([Yup.ref("oldPassword")], "Password must be different from old password."),
							})
							.required("Password is required."),
						retypepassword: Yup.string()
							.when("newPassword", {
								is: (val) => (val && val.length > 0 ? true : false),
								then: Yup.string().oneOf([Yup.ref("newPassword")], "Password must match."),
							})
							.required("Confirmation of Password is required."),
					})}
					onSubmit={(formData, { resetForm }) => submitPasswordData(formData, resetForm)}
				>
					{(runform) => (
						<form className="row frm-logo-top" onSubmit={runform.handleSubmit}>
							<div className="col-12 form-group mb-3" id="passtoggler">
								<label className="label-comn-text mb-2">Old Password</label>
								<bdi className="d-block position-relative password-class">
									<input type="password" placeholder="********" className="form-control comn-input-style" {...formAttr(runform, "oldPassword")} name="oldPassword" />
									{errorContainer(runform, "oldPassword")}
								</bdi>
							</div>
							<div className="col-12 form-group mb-3" id="passtoggler2">
								<label className="label-comn-text mb-2">New Password</label>
								<bdi className="d-block position-relative password-class">
									<input type="password" placeholder="********" className="form-control comn-input-style" {...formAttr(runform, "newPassword")} name="newPassword" />
									{errorContainer(runform, "newPassword")}
								</bdi>
							</div>
							<div className="col-12 form-group mb-3" id="passtoggler3">
								<label className="label-comn-text mb-2">Confirm Password</label>
								<bdi className="d-block position-relative password-class">
									<input type="password" placeholder="********" className="form-control comn-input-style" {...formAttr(runform, "retypepassword")} name="retypepassword" />
									{errorContainer(runform, "retypepassword")}
								</bdi>
							</div>
							<div className="col-12 form-group text-center">
								<div className="row align-items-center justify-content-center">
									<div className="col-xl-5 col-6">
										<button type="submit" className="btn-comn-class w-100">
											<span className="position-relative">SUBMIT</span>
										</button>
									</div>
									<div className="col-xl-5 col-6">
										<button type="button" className="btn-comn-class btn-dif-bg w-100">
											CANCEL
										</button>
									</div>
								</div>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</>
	);
}
