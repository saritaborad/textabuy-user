import React, { useRef, useState, useEffect, useContext } from "react";
import { PostApi } from "../APIService";
import UserLayout from "../Components/User/UserLayout";
import { API_Path, errorContainer, formAttr } from "../const";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Context from "../contexts/context";
import MultiSelect from "@kenshooui/react-multi-select";
import "@kenshooui/react-multi-select/dist/style.css";
import UpgradePlanModal from "../Components/AllModal/UpgradePlanModal";

export default function CreateGroup() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const formikRef = useRef();
	const [selected_options, setselected_options] = useState([]);
	const [options_val, setoptions_val] = useState([]);
	const [ungroup_options_val, setungroup_options_val] = useState([]);
	const [selected_ungroup_options, setselected_ungroup_options] = useState([]);
	const [show, setshow] = useState(false);


	useEffect(() => {
		formikRef.current.setFieldValue("userId", context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		getUngroupCustomerList();
		getGroupCustomerList();
	}, []);

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
		const getungroupCustomersListPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getAllCustomer)));
		getungroupCustomersListPromise.then((res) => {
			if (res.status === 200) {
				const customerArr = res.data.data.customers.map((item) => ({ id: item._id, label: `${item.firstName} ${item.lastName} ( ${item.email} )` }));
				setoptions_val(customerArr);
			}
		});
	};

	const handleCreateCustomerGroup = (formData, resetForm) => {
		const createGroupPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.createCustomersGroup, formData)));
		createGroupPromise.then((res) => {
			if (res.status === 200) {
				resetForm(formData);
				toast.success(res.data.message);
				Navigate("/customer-group-list");
			} else if (res.status === 402) {
				setshow(true)
			} else {
				toast.error(res.data.message)
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

	return (
		<UserLayout>
			{show && <UpgradePlanModal />}
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Create Group</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class p-0">
								<div className="detail-box-head">Add Customer Group</div>
								<Formik
									innerRef={formikRef}
									initialValues={{
										userId: "",
										groupName: "",
										description: "",
										customer: "",
									}}
									validationSchema={Yup.object({
										groupName: Yup.string().required("This field is required."),
										description: Yup.string().required("This field is required."),
										customer: Yup.array().required("Customer is required."),
									})}
									onSubmit={(formData, { resetForm }) => handleCreateCustomerGroup(formData, resetForm)}
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
												<div className="row">
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="submit" className="btn-comn-class w-100">
															Save
														</button>
													</div>
													<div className="col-xxl-2 col-md-3 col-6">
														<button type="button" onClick={() => Navigate("/customer-group-list")} className="btn-comn-class btn-dif-bg w-100">
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
