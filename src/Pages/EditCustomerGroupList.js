import React, { useState, useEffect, useRef, useContext } from "react";
import { PostApi } from "../APIService";
import UserLayout from "../Components/User/UserLayout";
import { API_Path, LandingPageURL, errorContainer, formAttr } from "../const";
import { Formik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css";
import Context from "../contexts/context";
import UpgradePlanModal from "../Components/AllModal/UpgradePlanModal";

export default function EditCustomerGroupList() {
	const context = useContext(Context);
	const location = useLocation();
	const formikRef = useRef();
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [active_status, setactive_status] = useState(false);
	const [allCustomerGroup, setAllCustomerGroup] = useState([]);
	const [selected_options, setselected_options] = useState([]);
	const [options_val, setoptions_val] = useState([]);
	const [ungroup_options_val, setungroup_options_val] = useState([]);
	const [selected_ungroup_options, setselected_ungroup_options] = useState([]);
	const [show, setshow] = useState(false);

	useEffect(() => {
		if (location?.state?.id !== undefined) {
			setid(location.state.id);
		} else {
			window.location.href = `${LandingPageURL}/dashboard`;
		}
	}, [location?.state?.id]);

	useEffect(() => {
		if (id) {
			getCustomerGroupById(id);
		}
	}, [id]);

	useEffect(() => {
		getUngroupCustomerList();
		getGroupCustomerList();
	}, []);

	const getCustomerGroupById = (id) => {
		let data = { id: id, status: "active" };
		const getCustomerGroupByIdPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getCustomersGroupById, data)));
		getCustomerGroupByIdPromise.then((res) => {
			if (res.status === 200) {
				setAllCustomerGroup(res.data.data);
				setactive_status(res.data.data.status);
			}
		});
	};

	const getUngroupCustomerList = () => {
		const getungroupCustomersListPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getungroupCustomer)));
		getungroupCustomersListPromise.then((res) => {
			if (res.status === 200) {
				const customerArr = res.data.data.map((item) => ({ id: item._id, label: `${item.firstName} ${item.lastName} ( ${item.email} )` }));
				setungroup_options_val(customerArr);
			}
		});
	};

	const getGroupCustomerList = () => {
		const getungroupCustomersListPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getungroupCustomer)));
		getungroupCustomersListPromise.then((res) => {
			if (res.status === 200) {
				const customerArr = res.data.data.map((item) => ({ id: item._id, label: `${item.firstName} ${item.lastName} ( ${item.email} )` }));
				setoptions_val(customerArr);
			}
		});
	};

	const handleMultiChange = (options) => {
		setselected_ungroup_options([]);
		if (options.length > 0) {
			const all_ids = options.map((option) => option.id);
			formikRef.current.setFieldValue("customer", all_ids);
		} else {
			formikRef.current.setFieldValue("customer", "");
		}
	};

	const ungroup_handleMultiChange = (options) => {
		setselected_options([]);
		if (options.length > 0) {
			const all_ids = options.map((option) => option.id);
			formikRef.current.setFieldValue("customer", all_ids);
		} else {
			formikRef.current.setFieldValue("customer", "");
		}
	};

	const handleEditCustomerGroup = (formData, resetForm) => {
		const editGroupPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.editCustomersGroup, formData)));
		editGroupPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				resetForm(formData);
				Navigate("/customer-group-list");
			} else if (res.status === 402) {
				setshow(true);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const changeStatus = (e) => {
		setactive_status(e.target.checked);
		formikRef.current.setFieldValue("status", e.target.checked);
	};

	return (
		<UserLayout>
			{show && <UpgradePlanModal />}
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Edit Group</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class p-0">
								<div className="detail-box-head">Add User Group</div>
								<Formik
									innerRef={formikRef}
									enableReinitialize={true}
									initialValues={{
										_id: id,
										customer: allCustomerGroup.customer ? allCustomerGroup.customer : "",
										groupName: allCustomerGroup.groupName ? allCustomerGroup.groupName : "",
										description: allCustomerGroup.description ? allCustomerGroup.description : "",
										status: allCustomerGroup.status ? allCustomerGroup.status : "",
									}}
									validationSchema={Yup.object({
										groupName: Yup.string().required("This field is required."),
										description: Yup.string().required("This field is required."),
										customer: Yup.array().required("customer is required."),
									})}
									onSubmit={(formData, { resetForm }) => handleEditCustomerGroup(formData, resetForm)}
								>
									{(runform) => (
										<form className="row detail-box-form" onSubmit={runform.handleSubmit}>
											<div className="col-12 mb-3">
												<label className="label-comn-text mb-2 d-block">Name</label>
												<input type="text" className="form-control comn-input-style" placeholder="Enter the group name" name="groupName" {...formAttr(runform, "groupName")} />
												{errorContainer(runform, "groupName")}
											</div>
											<div className="col-12 mt-3">
												<div className="row">
													<div className="col-md-6 mb-3">
														<div className="detail-box-head">Ungroup Customer List</div>
														<div className="detail-box-class p-0">
															<MultiSelect items={ungroup_options_val} selectedItems={selected_ungroup_options} onChange={ungroup_handleMultiChange} searchValue="1" />
														</div>
													</div>
													<div className="col-md-6 mb-3">
														<div className="detail-box-head">All Customer List</div>
														<div className="detail-box-class p-0">
															<MultiSelect items={options_val} selectedItems={selected_options} onChange={handleMultiChange} searchValue="1" />
														</div>
													</div>
												</div>
												{errorContainer(runform, "customer")}
											</div>
											<div className="col-12 mt-3">
												<label className="label-comn-text mb-2 d-block">Description</label>
												<input type="text" name="description" className="form-control comn-input-style" placeholder="description" {...formAttr(runform, "description")} />
												{errorContainer(runform, "description")}
											</div>
											<div className="col-12 mt-3">
												<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
													<input className="form-check-input" type="checkbox" name="status" id="Active1" checked={active_status} onChange={(e) => changeStatus(e)} />
													<label className="form-check-label ms-2 active-class" htmlFor="Active1">
														Active
													</label>
													<label className="form-check-label ms-2 inactive-class" htmlFor="Active1">
														Deactivate
													</label>
												</div>
											</div>
											<div className="col-12 mt-3">
												<div className="row">
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="submit" className="btn-comn-class w-100">
															Save
														</button>
													</div>
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={() => Navigate("/customer-group-list")}>
															<span>cancel</span>
														</button>
													</div>
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
