import React, { useContext, useState, useEffect } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { GetApi, PostApi } from "../APIService";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";

export default function CustomerList() {
	const context = useContext(Context);
	const [id, setid] = useState("");
	const [customer_import_modal, setcustomer_import_modal] = useState(false);
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [AllCustomersListData, setAllCustomersListData] = useState([]);
	const [CSVFile, setCSVFile] = useState("");
	const [DataInCSV, setDataInCSV] = useState('');
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 0, page: 0, sort: "_id", order: "ASC" });

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) getCustomerList(option);
	}, [id]);

	const getCustomerList = (option) => {
		let data = { option: option };
		const getAllCustomersListPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getAllCustomer, data)));
		getAllCustomersListPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				setAllCustomersListData(res.data.data.customers);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(GetApi(API_Path.exportUserCustomer));
		});
		getstatuswiseDataPromise.then((res) => {
			if (res.status === 200) {
				setDataInCSV(`${res.data}`)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	const ImportCSVFile = (e) => {
		setCSVFile(e.target.files[0]);
	};

	const handleImportCSV = () => {
		var excelfile = new FormData();
		excelfile.append("excelfile", CSVFile);
		const addCSVPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.importCSV, excelfile)));
		addCSVPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				getCustomerList(option);
				customer_import_modal(false);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getCustomerList(option);
	};

	const handleSyncNumber = () => {
		toast.info("Shopify customer synchronization started ...");
		const getAllCustomersListPromise = new Promise((resolve, reject) => resolve(GetApi(API_Path.addShopifyCustomer)));
		getAllCustomersListPromise.then((res) => {
			if (res.status === 200) {
				getCustomerList(option);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const final_delet_customer = () => {
		const deleteAllCustomerPromise = new Promise((resolve, reject) => resolve(GetApi(API_Path.deleteAllCustomer)));
		deleteAllCustomerPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				getCustomerList(option);
				setdelete_modal_show(false);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const delete_all_customer = () => {
		setdelete_modal_show(true);
	};

	const columns = [
		{
			label: "Name",
			value: "firstName",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].firstName ? data[i].firstName : "-"}</span>;
				},
			},
		},
		{
			label: "Email",
			value: "email",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].email ? data[i].email : "-"}</span>;
				},
			},
		},
		{
			label: "Phone Number",
			value: "phone",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].phone ? data[i].phone : "-"}</span>;
				},
			},
		},
		{
			label: "Date",
			value: "createdAt",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{moment(data[i].createdAt).format("DD/MM/YYYY") ? moment(data[i].createdAt).format("DD/MM/YYYY") : "-"}</span>;
				},
			},
		},
	];

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row align-items-center">
						<div className="col-md-4">
							<div className="comn-title-main">
								<h1 className="mb-0">Customers</h1>
							</div>
						</div>
						<div className="col-md-8  text-camp-rgt">
							<div className="crt-campaign-btn crt-in-btn ms-auto my-2">
								<button type="button" className="btn-comn-class w-100" onClick={() => handleSyncNumber()}>
									Sync with shopify
								</button>
							</div>
							{AllCustomersListData && <div className="crt-campaign-btn crt-in-btn my-2">
								<button type="button" className="btn-comn-class w-100" onClick={() => delete_all_customer()}>
									Delete All Customer
								</button>
							</div>}
							<div className="crt-campaign-btn crt-in-btn  my-2">
								<button type="button" className="btn-comn-class w-100" onClick={() => setcustomer_import_modal(true)}>
									Import
								</button>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllCustomersListData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="TextCampaignList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllCustomersListData && AllCustomersListData} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
				</div>
			</div>
			{customer_import_modal && (
				<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={customer_import_modal} onHide={() => setcustomer_import_modal(false)}>
					<Modal.Header closeButton className="border-0">
						<Modal.Title className="text-center">
							<span className="modal-title">Upload File</span>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form className="row">
							<div className="col-12 mb-3">
								<label className="label-comn-text mb-2 d-block">Import CSV</label>
								<div className="input-group">
									<input type="text" className="form-control comn-input-style" value={CSVFile.name} readOnly />
									<div className="input-group-append">
										<label className="btn-comn-class w-100" htmlFor="choose-file">
											Choose File
											<input className="hide-input" type="file" id="choose-file" accept=".csv, text/csv" onChange={() => ImportCSVFile} />
										</label>
									</div>
								</div>
							</div>
							<div className="col-md-6  text-center">
								<button type="button" className="btn-comn-class w-100" onClick={() => handleImportCSV}>
									UPLOAD
								</button>
							</div>
							<div className="col-md-6 mt-md-0 mt-2 text-center">
								<button type="reset" className="btn-comn-class w-100" onClick={() => setcustomer_import_modal(false)}>
									CANCEL
								</button>
							</div>
						</form>
					</Modal.Body>
				</Modal>
			)}
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
									<button type="button" onClick={() => final_delet_customer()} className="btn-comn-class w-100">
										Yes
									</button>
								</div>
								<div className="col-6">
									<button type="reset" className="btn-comn-class btn-red-bg w-100" onClick={() => setdelete_modal_show(false)}>
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
