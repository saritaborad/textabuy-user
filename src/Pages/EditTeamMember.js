import React, { useState, useEffect, useRef } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_Path, errorContainer, formAttr } from "../const";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { PostApi } from "../APIService";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import loader from "../images/loader.gif.gif";
import { NavItem } from "react-bootstrap";

export default function EditTeamMember() {
	const location = useLocation();

	const Navigate = useNavigate();
	const runforms = useRef();
	const phoneNumber = useRef();
	const [currentTeamMemberId, setcurrentTeamMemberId] = useState("");
	const [status, setstatus] = useState(false);
	const [teamMemberImage, setteamMemberImage] = useState("");
	const [statusEdit, setstatusEdit] = useState("");
	const [phoneno, setphoneno] = useState("");
	const [TeamMemberById, setTeamMemberById] = useState(false);
	const [teamMemberEditImage, setteamMemberEditImage] = useState("");
	const [isloader, setIsloader] = useState(false);
	const [isloader2, setIsloader2] = useState(false);

	useEffect(() => {
		setcurrentTeamMemberId(location?.state?.id);
		getTeamMemberById(location?.state?.id);
	}, [location?.state?.id]);

	const editTeamMember = (formData, resetForm) => {
		if (phoneNumber.current.state.formattedNumber.length > 9) {
			setIsloader(true);
			formData.number = phoneNumber.current.state.formattedNumber;
			let data = {
				_id: currentTeamMemberId,
				fname: formData.member_fname,
				lname: formData.member_lname,
				email: formData.email,
				age: formData.age,
				profile_img: teamMemberEditImage ? teamMemberEditImage[0] : teamMemberImage,
				contact_no: formData.number,
				address: formData.address,
				status: TeamMemberById ? status : statusEdit,
				DOB: formData.dob,
			};
			const editTeamMemberPromis = new Promise((resolve) => {
				resolve(PostApi(API_Path.editTeam, data));
			});
			editTeamMemberPromis.then((res) => {
				if (res.status === 200) {
					setIsloader(false);
					resetForm();
					Navigate("/team-members");
					toast.success(res.data.message);
				} else {
					toast.error(res.data.message);
				}
			});
		} else {
			document.getElementById("phonenumber").style.display = "block";
		}
	};

	//=================================================================================================================

	const getTeamMemberById = (id) => {
		const getTeamMemberByIdPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTeamById, { id: id }));
		});
		getTeamMemberByIdPromise.then((res) => {
			if (res.status === 200) {
				setTeamMemberById(true);
				setteamMemberImage(res.data.data.profile_img);
				setstatus(res.data.data.status);
				setphoneno(res.data.data.contact_no);
				runforms.current.setFieldValue("member_fname", res.data.data.fname);
				runforms.current.setFieldValue("member_lname", res.data.data.lname);
				runforms.current.setFieldValue("email", res.data.data.email);
				runforms.current.setFieldValue("age", res.data.data.age);
				runforms.current.setFieldValue("dob", moment(res.data.data?.DOB).format("YYYY-MM-DD"));
				document.getElementById("BirthDate").value = moment(res.data.data?.DOB).format("YYYY-MM-DD");
				runforms.current.setFieldValue("address", res.data.data.address);
				if (status) {
					document.getElementById("Active1").checked = status;
				}
			}
		});
	};

	const setvalue = (e) => {
		if (e) {
			document.getElementById("phonenumber").style.display = "none";
			setphoneno(e);
		}
	};

	//=================================================================================================================

	const handleDOB = (e) => {
		runforms.current.setFieldValue("dob", moment(e.target.value).format("YYYY-MM-DD"));
		const today = new Date();
		const birthDate = new Date(e.target.value);
		let Age = today.getFullYear() - birthDate.getFullYear();
		if (Age > 18) {
			Age--;
			runforms.current.setFieldValue("age", Age);
		} else {
			runforms.current.setFieldValue("age", "");
			toast.error("Enter Valid Birth Date");
		}
	};

	const handleChangeImage = (e) => {
		setIsloader2(true);
		let formData = new FormData();
		formData.append("images", e.target.files[0]);

		const addFilePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.addFile, formData));
		});
		addFilePromise.then((res) => {
			if (res.status === 200) {
				setteamMemberEditImage(res.data.data.img);
				setIsloader2(false);
			}
		});
	};

	const handlestatus = (e) => {
		setTeamMemberById(false);
		setstatusEdit(e.target.checked);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Edit Team Member</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<Formik
									innerRef={runforms}
									enableReinitialize
									initialValues={{
										member_fname: "",
										member_lname: "",
										email: "",
										age: "",
										dob: "",
										address: "",
									}}
									validationSchema={Yup.object({
										member_fname: Yup.string().required("This field is required."),
										member_lname: Yup.string().required("This field is required."),
										email: Yup.string().email("enter valid email address.").required("Email is required."),
										age: Yup.number().required("This field is required."),
										dob: Yup.string().required("This field is required."),
										address: Yup.string().required("This field is required."),
									})}
									onSubmit={(formData, { resetForm }) => {
										editTeamMember(formData, resetForm);
									}}
								>
									{(runform) => (
										<form className="row" onSubmit={runform.handleSubmit}>
											<div className="col-lg-2 mb-4">
												{isloader2 ? (
													<button type="button" className="position-relative img-prev-section loader-btn-div">
														<img className="" src={loader} alt="Loader" />
													</button>
												) : (
													<div className="position-relative img-prev-section">
														<span id="member-photo">
															<img src={teamMemberEditImage ? teamMemberEditImage : teamMemberImage} className="member-image " alt="smith" />
														</span>
														<div className="position-absolute bottom-0 end-0">
															<label htmlFor="profile-upload" className="upload-image-div">
																<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" className="bi bi-camera" viewBox="0 0 16 16">
																	<path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
																	<path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
																</svg>
															</label>
															<input id="profile-upload" accept="image/*" name="upload_cont_img" type="file" onChange={handleChangeImage} hidden />
														</div>
													</div>
												)}
											</div>
											<div className="col-lg-10 my-4">
												<div className="row">
													<div className="col-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Member Name</label>
														<input type="text" className="form-control comn-input-style" placeholder="Smith Mavvy" name="member_fname" {...formAttr(runform, "member_fname")} />
														{errorContainer(runform, "member_fname")}
													</div>
													<div className="col-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Member Name</label>
														<input type="text" className="form-control comn-input-style" placeholder="Smith Mavvy" name="member_lname" {...formAttr(runform, "member_lname")} />
														{errorContainer(runform, "member_lname")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Email Address</label>
														<input type="email" className="form-control comn-input-style" placeholder="smithmavvy@gmail.com" name="email" {...formAttr(runform, "email")} />
														{errorContainer(runform, "email")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Address</label>
														<input className="form-control comn-input-style" name="address" placeholder="Please Enter Your Address" {...formAttr(runform, "address")} type="text" />
														{errorContainer(runform, "address")}
													</div>
													<div className="col-12 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Mobile number</label>
														<PhoneInput className="form-control-PhoneInput" disableAreaCodes country={"us"} placeholder="Enter your phone number" ref={phoneNumber} value={phoneno} onChange={(e) => setvalue(e)} />
														<span id="phonenumber" style={{ display: "none", color: "red" }}>
															Phone Number is required.
														</span>
													</div>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Date of Birth</label>
														<input type="date" id="BirthDate" className="form-control comn-input-style" onChange={(e) => handleDOB(e)} name="dob" />
														{errorContainer(runform, "dob")}
													</div>
													<div className="col-md-6 mb-3">
														<label className="label-comn-text-1 mb-2 d-block">Age</label>
														<input className="form-control comn-input-style" name="age" readOnly {...formAttr(runform, "age")} placeholder="Please Enter your age" type="number" />
														{errorContainer(runform, "age")}
													</div>

													<div className="mb-12 col-6">
														<label className="label-comn-text-1 mb-2 d-block">Status</label>
														<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
															<input className="form-check-input" type="checkbox" id="Active1" onChange={handlestatus} />
															<label className="form-check-label ms-2 active-class" htmlFor="Active1">
																Active
															</label>
															<label className="form-check-label ms-2 inactive-class" htmlFor="Active1">
																Deactivate
															</label>
														</div>
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
															Update
														</button>
													)}
												</div>
												<div className="col-md-3 col-6">
													<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={() => NavItem("/team-members")}>
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
