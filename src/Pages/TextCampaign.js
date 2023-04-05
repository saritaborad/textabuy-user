import React, { useState, useContext, useEffect } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../APIService";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";
import UpgradePlanModal from "../Components/AllModal/UpgradePlanModal";

export default function TextCampaign() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [status, setstatus] = useState("all");
	const [DataInCSV, setDataInCSV] = useState('');
	const [AllTextCampaignData, setAllTextCampaignData] = useState([]);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) getAllTextCampaign(option, status, id);
	}, [id]);

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllTextCampaign(option, e.target.value, id);
	};

	const getAllTextCampaign = (option, status, Id) => {
		let data = { option: option, status: status ? status : "all", id: Id };
		const getAllTextCampaignPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTextcampaign, data));
		});
		getAllTextCampaignPromise.then((res) => {
			if (res.status === 200) {
				// if (res.data?.data.length > 0) {
				setAllTextCampaignData(res.data?.data?.textcampign);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
				// } else {
				// 	setAllTextCampaignData([]);
				// 	toast.error(res.data.message);
				// }
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.export_textcampaign, { status: status }));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	}

	const tableCallBack = (option) => {
		setoption(option);
		getAllTextCampaign(option, status, id);
	};

	const delete_handleClose = () => {
		setdelete_modal_show(false);
	};

	const delete_handleShow = () => {
		setdelete_modal_show(true);
	};

	const onDeleteSelect = (value) => {
		setid(value);
		delete_handleShow();
	};

	const deleteTextCampaign = () => {
		const deleteTextCampaignPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.deleteTextcampaign, { id: id }));
		});
		deleteTextCampaignPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				delete_handleClose();
				getAllTextCampaign(option, status, id);
			} else {
				toast.error(res.data.message);
				delete_handleClose();
			}
		});
	};

	const handleChangeStatus = (id1, nstatus) => {
		let data = {
			campaign_id: id1,
			status: nstatus,
		};
		const changeStatusTextCampaignPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.changeTextcampaignStatus, data));
		});
		changeStatusTextCampaignPromise.then((res) => {
			if (res.status === 200) {
				getAllTextCampaign(option, status, context.login_user_id);
				toast.success("Status updated successfully.");
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const columns = [
		{
			label: "Campaign Name",
			value: "campaignName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].campaignName ? data[i].campaignName : "-"}</span>;
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
			label: "Customer Group Name",
			value: "groupname",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].groupname ? data[i].groupname : "-"}</span>;
				},
			},
		},
		{
			label: "No. Of Customers",
			value: "customergroup",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return data[i].customergroup !== undefined ? <div>{data[i]?.customergroup[0] ? data[i]?.customergroup[0]?.no_of_customer : "-"}</div> : <div></div>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				customBodyRender: (data, i) => {
					return <div className={`status-col status-${data[i].status === "sent" ? "active" : data[i].status === "scheduled" ? "pending" : "rejected"}`}>{data[i].status ? data[i].status : "-"}</div>;
				},
			},
		},
		{
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].date ? data[i].date : "-"}</span>;
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
									<Dropdown.Item onClick={() => Navigate("/text-campaign-detail", { state: { id: data[i]._id } })}>
										<bdi className="d-flex align-items-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
												<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
												<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
											</svg>
											<span className="ms-2">View Details</span>
										</bdi>
									</Dropdown.Item>
									{data[i].status !== "sent" && (
										<Dropdown.Item onClick={() => Navigate("/edit-text-campaign", { state: { id: data[i]._id } })}>
											<bdi className="d-flex align-items-center">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
													<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
												</svg>
												<span className="ms-2">Edit</span>
											</bdi>
										</Dropdown.Item>
									)}
									{data[i].status !== "sent" && (
										<Dropdown.Item onClick={() => handleChangeStatus(data[i]._id, data[i].status === "scheduled" ? "draft" : "scheduled")}>
											<bdi className="d-flex align-items-center">
												{data[i].status === "scheduled" ? (
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope-paper" viewBox="0 0 16 16">
														{" "}
														<path d="M4 0a2 2 0 0 0-2 2v1.133l-.941.502A2 2 0 0 0 0 5.4V14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V5.4a2 2 0 0 0-1.059-1.765L14 3.133V2a2 2 0 0 0-2-2H4Zm10 4.267.47.25A1 1 0 0 1 15 5.4v.817l-1 .6v-2.55Zm-1 3.15-3.75 2.25L8 8.917l-1.25.75L3 7.417V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v5.417Zm-11-.6-1-.6V5.4a1 1 0 0 1 .53-.882L2 4.267v2.55Zm13 .566v5.734l-4.778-2.867L15 7.383Zm-.035 6.88A1 1 0 0 1 14 15H2a1 1 0 0 1-.965-.738L8 10.083l6.965 4.18ZM1 13.116V7.383l4.778 2.867L1 13.117Z" />
													</svg>
												) : (
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-check" viewBox="0 0 16 16">
														{" "}
														<path d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" /> <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
													</svg>
												)}
												<span className="ms-2">{data[i].status === "scheduled" ? "Save Draft" : "Save Scheduled"}</span>
											</bdi>
										</Dropdown.Item>
									)}
									{data[i].status !== "sent" && (
										<Dropdown.Item>
											<bdi className="d-flex align-items-center" onClick={() => onDeleteSelect(data[i]._id)}>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
													<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
													<path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
												</svg>
												<span className="ms-2">Delete</span>
											</bdi>
										</Dropdown.Item>
									)}
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
					<div className="row align-items-center">
						<div className="col-md-4 ">
							<div className="comn-title-main">
								<h1 className="mb-0">Text Campaigns</h1>
							</div>
						</div>
						<div className="col-md-8  text-camp-rgt">
							<div className="text-campaign-select my-2">
								<select className="form-select comn-input-style" name="statusWise" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"sent"}>Sent</option>
									<option value={"draft"}>Draft</option>
									<option value={"scheduled"}>Schedule</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2">
								<button className="btn-comn-class" onClick={() => Navigate("/create-text-campaign")}>
									<span>Create A Campaign</span>
								</button>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllTextCampaignData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="TextCampaignList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllTextCampaignData} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
					{delete_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={delete_handleClose}>
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
											<button type="button" className="btn-comn-class w-100" onClick={deleteTextCampaign}>
												Yes
											</button>
										</div>
										<div className="col-6">
											<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={delete_handleClose}>
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
