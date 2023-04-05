import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../APIService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";

export default function TeamMembers() {
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [status, setstatus] = useState("all");
	const [AllTeamMemberData, setAllTeamMemberData] = useState([]);
	const [DataInCSV, setDataInCSV] = useState('');
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });

	useEffect(() => {
		getAllTeamMember(option, status);
	}, []);

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllTeamMember(option, e.target.value);
	};

	const getAllTeamMember = (option, status) => {
		let data = { status: status ? status : "all", option: option };
		const getAllTeamMemberPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getTeam, data)));
		getAllTeamMemberPromise.then((res) => {
			if (res.status === 200) {
				setAllTeamMemberData(res.data.data.team);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.export_team, { status: status === "inactive" ? 0 : status === "active" ? 1 : "all" }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getAllTeamMember(option, status);
	};

	const deleteTeamMember = (id) => {
		const deleteTeamMemberPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.deleteTeam, { id: id })));
		deleteTeamMemberPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				setdelete_modal_show(false);
				getAllTeamMember(option, status);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const onDeleteSelect = (id) => {
		setid(id);
		setdelete_modal_show(true);
	};

	const handleStatus = (value, i) => {
		value.status === true ? (document.getElementById(i).checked = false) : (document.getElementById(i).checked = true);
		let data = { _id: value._id, status: value.status === true ? false : true };
		const editTeamMemberPromis = new Promise((resolve) => resolve(PostApi(API_Path.editTeam, data)));
		editTeamMemberPromis.then((res) => {
			if (res.status === 200) {
				getAllTeamMember(option, status);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const columns = [
		{
			label: "Photo",
			value: "profile_img",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return (
						<div className="member-pro-img h-auto">
							<img src={data[i].profile_img} alt="Profile" className="img-fluid" />
						</div>
					);
				},
			},
		},
		{
			label: "Name",
			value: "fname",
			options: {
				filter: true,
			},
		},
		{
			label: "Email",
			value: "email",
			options: {
				filter: true,
			},
		},
		{
			label: "Phone",
			value: "contact_no",
			options: {
				filter: true,
			},
		},
		{
			label: "Joining Date",
			value: "joiningdate",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return moment(data[i].joiningdate).format("MM/DD/YYYY");
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				empty: "",
				customBodyRender: (data, i) => {
					return (
						<div className="form-check form-switch d-inline-flex align-items-center">
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
									<Dropdown.Item onClick={() => Navigate("/team-member-detail/", { state: { id: data[i]._id } })}>
										<bdi className="d-flex align-items-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
												<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
												<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
											</svg>
											<span className="ms-2">View Details</span>
										</bdi>
									</Dropdown.Item>
									<Dropdown.Item onClick={() => Navigate("/edit-team-member/", { state: { id: data[i]._id } })}>
										<bdi className="d-flex align-items-center">
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

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-4 ">
							<div className="comn-title-main">
								<h1 className="mb-0">Team Members</h1>
							</div>
						</div>
						<div className="col-md-8  text-camp-rgt">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="statusWise" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"active"}>Active</option>
									<option value={"inactive"}>Inactive</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2">
								<button type="button" className="btn-comn-class w-100" onClick={() => Navigate("/add-team-member")}>
									Add Member
								</button>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllTeamMemberData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="TeamMemberList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllTeamMemberData} tableCallBack={tableCallBack} />
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
											<button type="button" className="btn-comn-class w-100" onClick={() => deleteTeamMember(id)}>
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
				</div>
			</div>
		</UserLayout>
	);
}
