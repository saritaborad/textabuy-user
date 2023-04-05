import React, { useState, useRef } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_Path, errorContainer, formAttr, phoneRegExp } from "../const";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../APIService";
import eyeCLose from "../../src/images/eye-close.svg";
import eyeOpen from "../../src/images/eye-show.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import loader from "../images/loader.gif.gif";

export default function AddTeamMember() {
	const runforms = useRef();

	const Navigate = useNavigate();
	const [teamMemberImage, setteamMemberImage] = useState("");
	const [password_type, setpassword_type] = useState("password");
	const [isloader, setIsloader] = useState(false);
	const [isloader2, setIsloader2] = useState(false);

	const addTeamMemberData = (formData, resetForm) => {
		setIsloader(true);
		const createTeamMemberPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.createTeam, formData)));
		createTeamMemberPromise.then((res) => {
			setIsloader(false);
			if (res.status === 200) {
				toast.success(res.data.message);
				resetForm(formData);
				Navigate("/team-members");
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const handleUploadImage = (e) => {
		setIsloader2(true);
		let formData = new FormData();
		formData.append("images", e.target.files[0]);
		const addFilePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.addFile, formData)));
		addFilePromise.then((res) => {
			setIsloader2(false);
			if (res.status === 200) {
				setteamMemberImage(res.data.data.img);
				toast.success(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const handleDOB = (e) => {
		const ageDifMs = new Date() - new Date(e.target.value);
		const ageDate = new Date(ageDifMs);
		let Age = Math.abs(ageDate.getUTCFullYear() - 1970);
		runforms.current.setFieldValue("age", Age);
	};

	const PhonehandleOnChange = (value) => {
		let temp = "+" + value;
		runforms.current.setFieldValue("contact_no", temp);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Add Team Member</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<Formik
									innerRef={runforms}
									enableReinitialize={true}
									initialValues={{
										profile_img: teamMemberImage[0],
										status: true,
										fname: "",
										lname: "",
										email: "",
										DOB: "",
										age: "",
										address: "",
										password: "",
										contact_no: "",
									}}
									validationSchema={Yup.object({
										fname: Yup.string().required("This field is required."),
										lname: Yup.string().required("This field is required."),
										email: Yup.string().email("enter valid email address.").required("Email is required."),
										age: Yup.number().required("This field is required."),
										DOB: Yup.string().required("This field is required."),
										address: Yup.string().required("This field is required."),
										password: Yup.string().required("password is required."),
										contact_no: Yup.string().matches(phoneRegExp, "Mobile Number is not valid").required("Mobile Number is required."),
									})}
									onSubmit={(formData, { resetForm }) => addTeamMemberData(formData, resetForm)}
								>
									{(runform) => (
										<form className="row" onSubmit={runform.handleSubmit}>
											<div className="col-lg-2 mb-4">
												{isloader2 ? (
													<button type="button" className="position-relative img-prev-section loader-btn-div">
														<img className="" src={loader} alt="Loader" />
													</button>
												) : (
													<div className="position-relative img-prev-section text-center">
														{teamMemberImage ? (
															<span id="member-photo">
																{teamMemberImage &&
																	teamMemberImage.map((item, i) => {
																		return <img key={i} src={item} className="member-image img-fluid w-auto" alt="smith" />;
																	})}
															</span>
														) : (
															<span>
																<i className="bi bi-cloud-upload-fill fs-1 text-secondary d-block pt-4"></i>
																<bdi>Upload</bdi>
															</span>
														)}
														<div className="position-absolute bottom-0 end-0">
															<label htmlFor="profile-upload" className="upload-image-div">
																<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
																	<path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
																	<path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
																</svg>
															</label>
															<input id="profile-upload" accept="image/*" name="upload_cont_img" type="file" onChange={handleUploadImage} hidden />
														</div>
													</div>
												)}
											</div>
											<div className="col-lg-10 my-4">
												<div className="row">
													<div className="col-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Member First Name</label>
														<input type="text" className="form-control comn-input-style" placeholder="Please enter your first name" name="fname" {...formAttr(runform, "fname")} />
														{errorContainer(runform, "fname")}
													</div>
													<div className="col-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Member Last Name</label>
														<input type="text" className="form-control comn-input-style" placeholder="Please enter your last name" name="lname" {...formAttr(runform, "lname")} />
														{errorContainer(runform, "lname")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Email Address</label>
														<input type="email" className="form-control comn-input-style" placeholder="Please enter your email address" name="email" {...formAttr(runform, "email")} />
														{errorContainer(runform, "email")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Address</label>
														<input className="form-control comn-input-style" name="address" placeholder="Please Enter Your Address" {...formAttr(runform, "address")} type="text" />
														{errorContainer(runform, "address")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Mobile number</label>
														<PhoneInput inputExtraProps={{ inputClass: "form-control style-input-class", name: "contact_no", required: true, autoFocus: true }} disableAreaCodes country={"us"} placeholder="Enter your phone number" onChange={PhonehandleOnChange} />
														{errorContainer(runform, "contact_no")}
													</div>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Date of Birth</label>
														<input type="date" {...formAttr(runform, "DOB")} max={new Date().toISOString().split("T")[0]} className="form-control comn-input-style" onChangeCapture={(e) => handleDOB(e)} name="DOB" />
														{errorContainer(runform, "DOB")}
													</div>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Age</label>
														<input className="form-control comn-input-style" name="age" readOnly {...formAttr(runform, "age")} placeholder="Please Enter your age" type="number" />
														{errorContainer(runform, "age")}
													</div>
													<div className="col-md-12  mb-3" id="passtoggler">
														<label className="label-comn-text-1 mb-2 d-block">Password</label>
														<bdi className="d-block position-relative password-class">
															<input type={password_type} id="password" placeholder="********" className="form-control comn-input-style" {...formAttr(runform, "password")} name="password" />
															<label onClick={() => setpassword_type(password_type === "text" ? "password" : "text")} className="eye-pwd bg-transparent">
																{password_type === "text" ? <img src={eyeOpen} className="pass-show-image" alt="" /> : <img src={eyeCLose} className="pass-close-image" alt="" />}
															</label>
														</bdi>
														{errorContainer(runform, "password")}
													</div>
												</div>
											</div>
											<div className="row mt-4">
												<div className="col-md-3 col-6">
													{isloader ? (
														<button type="button" className="btn-comn-class w-100 loader-btn-div">
															<img className="" src={loader} alt="Loader" />
														</button>
													) : (
														<button type="submit" id="btn-teammember" className="btn-comn-class w-100">
															ADD
														</button>
													)}
												</div>
												<div className="col-md-3 col-6">
													<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={() => Navigate("/team-members")}>
														CANCEL
													</button>
												</div>
											</div>
										</form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
