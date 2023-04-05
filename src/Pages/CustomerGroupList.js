import React, { useState, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../APIService";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";
import { useEffect } from "react";

export default function CustomerGroupList() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [AllCustomersListGroupData, setAllCustomersListGroupData] = useState([]);
	const [status, setstatus] = useState("all");
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [id, setid] = useState("");
	const [delete_group_id, setdelete_group_id] = useState("");
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });
	const columns = [
		{
			label: "Group Name",
			value: "groupName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].groupName ? data[i].groupName : "-"}</span>;
				},
			},
		},
		{
			label: "Description",
			value: "description",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].description ? data[i].description : "-"}</span>;
				},
			},
		},
		{
			label: "No. Of Customers",
			value: "no_of_customer",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].no_of_customer ? data[i].no_of_customer : "-"}</span>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (
						<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
							<input className="form-check-input" type="checkbox" id={i} defaultChecked={data[i].status} onChange={() => handleStatus(data[i], i)} />
							<label className="form-check-label ms-2 active-class" htmlFor="Active1">
								Active
							</label>
							<label className="form-check-label ms-2 inactive-class" htmlFor="Active1">
								Deactivate
							</label>
						</div>
					);
				},
			},
		},
		{
			label: "Action",
			value: "_id",
			options: {
				filter: false,
				sort: false,
				empty: true,
				setCellProps: () => ({ className: "text-center" }),
				customBodyRender: (data, i) => {
					return (
						<div className="table-ed-drop">
							<Dropdown drop="left">
								<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
										<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
									</svg>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item>
										<bdi className="d-flex align-items-center" onClick={() => Navigate("/edit-customer-group", { state: { id: data[i]._id } })}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
												<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
											</svg>
											<span className="ms-2">Edit</span>
										</bdi>
									</Dropdown.Item>
									<Dropdown.Item>
										<bdi className="d-flex align-items-center" onClick={() => onDeleteSelect(data[i]._id)}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
												<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
												<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
											</svg>
											<span className="ms-2">Delete</span>
										</bdi>
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					);
				},
			},
		},
	];

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) getCustomerGroupList(option, status, id);
	}, [id]);

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getCustomerGroupList(option, e.target.value, context.login_user_id);
	};

	const getCustomerGroupList = (option, status, id) => {
		let data = { status: status ? status : "all", id: id, option: option };
		const getAllCustomersListGroupPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getCustomersGroup, data)));
		getAllCustomersListGroupPromise.then((res) => {
			if (res.status === 200) {
				setAllCustomersListGroupData(res.data.data.customerGroup);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const handleStatus = (value, i) => {
		value.status === true ? (document.getElementById(i).checked = false) : (document.getElementById(i).checked = true);
		const editTeamMemberPromis = new Promise((resolve) => resolve(PostApi(API_Path.changeGroupStatus, { groupid: value._id })));
		editTeamMemberPromis.then((res) => {
			if (res.status === 200) {
				getCustomerGroupList(option, status, id);
				toast.success(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getCustomerGroupList(option, status, id);
	};

	const deleteCustomersGroup = (delete_group_id) => {
		const deleteCustomersListPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.deleteCustomersGroup, { id: delete_group_id })));
		deleteCustomersListPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				setdelete_modal_show(false);
				getCustomerGroupList(option, status, id);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const onDeleteSelect = (id) => {
		setdelete_group_id(id);
		setdelete_modal_show(true);
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-md-4">
							<div className="comn-title-main">
								<h1 className="mb-0">Group List</h1>
							</div>
						</div>
						<div className="col-md-8  text-camp-rgt">
							<div className="text-campaign-select ms-auto  my-2">
								<select className="form-select comn-input-style" name="statusWise" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"active"}>Active</option>
									<option value={"inactive"}>Inactive</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2">
								<button className=" bg-white-btn " onClick={() => Navigate("/create-group")}>
									<span>Create Group</span>
								</button>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllCustomersListGroupData} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
				</div>
			</div>

			{delete_modal_show && (
				<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={() => setdelete_modal_show(false)}>
					<Modal.Header closeButton className="border-0"></Modal.Header>
					<Modal.Body>
						<div className="text-center dltd-text-info">
							<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
							</svg>
							<span className="modal-title d-block">Are You Sure?</span>
							<p>Do you really want to delete this List?</p>
							<div className="row">
								<div className="col-6">
									<button type="button" className="btn-comn-class w-100" onClick={() => deleteCustomersGroup(delete_group_id)}>
										Yes
									</button>
								</div>
								<div className="col-6">
									<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={() => setdelete_modal_show(false)}>
										No
									</button>
								</div>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			)}
		</UserLayout>
	);
}
