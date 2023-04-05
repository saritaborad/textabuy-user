import React, { useContext, useState, useEffect, useRef } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import moment from "moment";
import { API_Path, errorContainer, formAttr } from "../const";
import { useNavigate } from "react-router-dom";
import { PostApi } from "../APIService";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";

export default function Inquiry() {
	const Navigate = useNavigate();
	const runforms = useRef();
	const context = useContext(Context);
	const [status, setstatus] = useState("all");
	const [id, setid] = useState("");
	const [inquiry_modal_show, setinquiry_modal_show] = useState(false);
	const [AllInquiryData, setAllInquiryData] = useState([]);
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [DataInCSV, setDataInCSV] = useState('');
	const [filteredInquiryData, setfilteredInquiryData] = useState("");
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "DSC" });

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) {
			getAllInquiry(option, status, id);
		}
	}, [id]);

	const handleStatusWise = (e) => {
		setstatus(e.target.value);
		getAllInquiry(option, e.target.value, id);
	};

	const getAllInquiry = (option, status, id) => {
		let data = { status: status ? status : "all", option: option, userid: id };
		const getAllInquiryPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getInquiry, data)));
		getAllInquiryPromise.then((res) => {
			if (res.status === 200) {
				setAllInquiryData(res.data.data.support);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.exportUserSupport, { status: status }));
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
		getAllInquiry(option, status, id);
	};

	const deleteInquiry = () => {
		const deleteInquiryPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.deleteInquiry, { id: id })));
		deleteInquiryPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				delete_handleClose();
				getAllInquiry(option, status, id);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const addInquiry = (formData, resetForm) => {
		let data = { subject: formData.subject, description: formData.description };
		const addInquiryPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.createInquiry, data)));
		addInquiryPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				getAllInquiry(option, status, id);
				resetForm(formData);
				add_inquiryClose();
				Navigate("/inquiry-message/", { state: { id: res.data.data._id } });
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const editInquiry = (id) => {
		let filterData = AllInquiryData.filter((l) => l._id === id);
		setfilteredInquiryData(filterData);
		setid(id);
	};

	//============================================================================================

	const onDeleteSelect = (value) => {
		setid(value);
		delete_handleShow();
	};

	const onEditSelect = (value) => {
		add_inquiryShow();
		editInquiry(value);
	};

	const handleeditinquiry = (formData, resetForm) => {
		let data = { _id: id, subject: formData.subject, description: formData.description };
		const editInquiryPromis = new Promise((resolve, reject) => resolve(PostApi(API_Path.editInquiry, data)));
		editInquiryPromis.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				setfilteredInquiryData("");
				getAllInquiry(option, status, id);
				add_inquiryClose();
				resetForm(formData);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const add_inquiryShow = () => {
		setinquiry_modal_show(true);
	};

	const add_inquiryClose = () => {
		setinquiry_modal_show(false);
	};

	const delete_handleShow = () => {
		setdelete_modal_show(true);
	};

	const delete_handleClose = () => {
		setdelete_modal_show(false);
	};

	const columns = [
		{
			label: "Subject",
			value: "subject",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-message", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].subject ? data[i].subject : "-"}</div>;
				},
			},
		},
		{
			label: "Description",
			value: "description",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-message", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].description ? data[i].description : "-"}</div>;
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: false,
				sort: false,
				empty: true,
				customBodyRender: (data, i) => {
					return (
						<div className={`text-capitalize status-col status-` + data[i].status} onClick={() => Navigate("/inquiry-message", { state: { id: data[i]._id, status: data[i].status } })}>
							{data[i].status === "inprogress" ? "In progress" : data[i].status === "close" ? "closed" : data[i].status}
						</div>
					);
				},
			},
		},
		{
			label: "Last Activity",
			value: "lastactivity",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <div onClick={() => Navigate("/inquiry-message", { state: { id: data[i]._id, status: data[i].status } })}>{data[i].lastactivity ? moment(data[i].lastactivity).format("MM/DD/YYYY") : "-"}</div>;
				},
			},
		},
		{
			label: "Action",
			value: "_id",
			options: {
				filter: false,
				sort: false,
				setCellProps: () => ({ className: "text-center" }),
				setCellHeaderProps: () => ({ className: "text-center" }),
				customBodyRender: (data, i) => {
					return (
						<div className="table-ed-drop">
							<Dropdown drop="left" name="editinquiry">
								<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
										<path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
									</svg>
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item>
										<bdi className="d-flex align-items-center" onClick={() => onEditSelect(data[i]._id)}>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
												<path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
											</svg>
											<span id="edit-inquiry" className="ms-2">
												Edit
											</span>
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
						<div className="col-md-5">
							<div className="comn-title-main">
								<h1 className="mb-0">Support</h1>
							</div>
						</div>
						<div className="col-md-7 text-camp-rgt">
							<div className="text-campaign-select ms-auto my-2">
								<select className="form-select comn-input-style" name="statusWise" onChange={(e) => handleStatusWise(e)}>
									<option value={"all"}>All</option>
									<option value={"open"}>Open</option>
									<option value={"close"}>Closed</option>
									<option value={"inprogress"}>In progress</option>
								</select>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2">
								<button type="button" className="btn-comn-class w-100" onClick={() => add_inquiryShow("add")}>
									New Inquiry
								</button>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllInquiryData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="InquiryList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllInquiryData} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
					{inquiry_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={inquiry_modal_show} onHide={add_inquiryClose}>
							<Modal.Header closeButton className="border-0">
								<Modal.Title className="text-center w-100">{filteredInquiryData ? <span className="modal-title">Edit Inquiry</span> : <span className="modal-title">New Inquiry</span>}</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<Formik
									innerRef={runforms}
									enableReinitialize={true}
									initialValues={{
										subject: filteredInquiryData ? filteredInquiryData[0].subject : "",
										description: filteredInquiryData ? filteredInquiryData[0].description : "",
									}}
									validationSchema={Yup.object({
										subject: Yup.string().required("Subject is required."),
										description: Yup.string().required("Description is required."),
									})}
									onSubmit={(formData, { resetForm }) => {
										if (filteredInquiryData) {
											handleeditinquiry(formData, resetForm);
										} else {
											addInquiry(formData, resetForm);
										}
									}}
								>
									{(runform) => (
										<form onSubmit={runform.handleSubmit} className="row">
											<div className="mb-3 col-12">
												<label className="label-comn-text mb-2 d-block">Subject</label>
												<input type="text" name="subject" {...formAttr(runform, "subject")} className="form-control comn-input-style" placeholder="Enter Your subject" />
												{errorContainer(runform, "subject")}
											</div>
											<div className="mb-3 col-12">
												<label className="label-comn-text mb-2">Description</label>
												<textarea rows="5" name="description" {...formAttr(runform, "description")} className="form-control h-auto comn-input-style" placeholder="Enter Your Message"></textarea>
												{errorContainer(runform, "description")}
											</div>
											<div className="col-12 pt-4 text-center">
												<button type="submit" id="btn-newinquiry" className="btn-comn-class w-100">
													Submit
												</button>
											</div>
										</form>
									)}
								</Formik>
							</Modal.Body>
						</Modal>
					)}

					{delete_modal_show && (
						<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal" show={delete_modal_show} onHide={delete_handleClose}>
							<Modal.Header closeButton className="border-0"></Modal.Header>
							<Modal.Body>
								<div className="text-center dltd-text-info">
									<svg width="62" height="78" viewBox="0 0 62 78" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z" fill="#EB5757" />
									</svg>
									<span className="modal-title d-block">Create Customer List</span>
									<p>Do you really want to delete this List?</p>
									<div className="row">
										<div className="col-6">
											<button type="button" className="btn-comn-class w-100" onClick={() => deleteInquiry()}>
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
