import React, { useState, useContext, useEffect } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { GetApi, PostApi } from "../APIService";
import { API_Path } from "../const";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";

export default function Inventory() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [id, setid] = useState("");
	const [AllInventoryData, setAllInventoryData] = useState([]);
	const [DataInCSV, setDataInCSV] = useState('');
	const [delete_modal_show, setdelete_modal_show] = useState(false);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) getAllInventory(id);
	}, [id]);

	const getAllInventory = (id) => {
		let data = { userid: id, option: option };
		const getAllInventoryPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getInventory, data)));
		getAllInventoryPromise.then((res) => {
			if (res.status === 200) {
				setAllInventoryData(res.data.data.vendorproduct);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const getstatuswiseData = () => {
		const getstatuswiseDataPromise = new Promise((resolve, reject) => {
			resolve(GetApi(API_Path.exportUserProduct));
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
		getAllInventory(id);
	};

	const delete_handleShow = () => {
		setdelete_modal_show(true);
	};

	const delete_handleClose = () => {
		setdelete_modal_show(false);
	};

	const onDeleteSelect = (value) => {
		delete_handleShow(value);
	};

	const deleteInventory = (id) => {
		const deleteInventoryPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.deleteInventory, { id: id }));
		});
		deleteInventoryPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				delete_handleClose();
				getAllInventory(id);
			} else {
				toast.error(res.data.message);
				delete_handleClose();
			}
		});
	};

	const handleProductShopify = () => {
		const getAllCustomersListPromise = new Promise((resolve, reject) => {
			resolve(GetApi(API_Path.syncProductShopify));
		});
		getAllCustomersListPromise.then((res) => {
			if (res.status === 200) {
				getAllInventory(id);
				toast.info(res.data.message, { autoClose: 4000 });
			} else {
				toast.error(res.data.message);
			}
		});
	};
	const columns = [
		{
			value: "productImage",
			label: "Photo",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (data, i) => {
					return <div className="member-pro-img">{data[i]?.images[0]?.src ? <img src={data[i]?.images[0]?.src} alt="Profile" className="img-fluid" /> : <img className="img-fluid" alt="" />}</div>;
				},
			},
		},
		{
			value: "productTitle",
			label: "Name",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].productTitle ? data[i].productTitle : "-"}</span>;
				},
			},
		},
		{
			label: "ID",
			value: "productId",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].id ? data[i].id : "-"}</span>;
				},
			},
		},
		{
			label: "Quantity",
			value: "quantity",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].quantity ? data[i].quantity : "-"}</span>;
				},
			},
		},
		{
			label: "Status",
			value: "quantity",
			options: {
				filter: true,
				empty: true,
				customBodyRender: (data, i) => {
					let statusClass = data[i].quantity === 0 ? "rejected" : "pending";
					let statusDisplay = data[i].quantity === 0 ? "Out of stock" : "in stock";
					return <div className={`status-col status-` + statusClass}>{statusDisplay ? statusDisplay : "-"}</div>;
				},
			},
		},
		{
			label: "Price",
			value: "price",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return (
						<>
							<div>{data[i].variants[0].price ? data[i].variants[0].price : "-"}</div>
						</>
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
				setCellHeaderProps: () => ({ className: "text-center" }),
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
									<Dropdown.Item onClick={() => Navigate("/inventory-detail/", { state: { id: data[i].id } })}>
										<bdi className="d-flex align-items-center">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
												<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
												<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
											</svg>
											<span className="ms-2">View Details</span>
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
					<div className="row align-items-center">
						<div className="col-md-5 col-sm-4">
							<div className="comn-title-main">
								<h1 className="mb-0">Products</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt">
							<div className="text-campaign-select my-2"></div>
							<div className="crt-campaign-btn crt-in-btn ms-auto my-2">
								<button type="button" className="btn-comn-class w-100" onClick={handleProductShopify}>
									Sync with shopify
								</button>
							</div>
							<div className="crt-campaign-btn crt-in-btn  my-2" onClick={() => getstatuswiseData()}>
								<a className="btn-comn-class w-100" id="csv" href={AllInventoryData !== undefined && `data:text/csv;charset=utf-8,${escape(DataInCSV)}`} download="InventoryList.csv">Export</a>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={AllInventoryData} tableCallBack={tableCallBack} />
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
									<span className="modal-title d-block">Are you sure?</span>
									<p>Do you really want to delete this List?</p>
									<div className="row">
										<div className="col-6">
											<button type="button" className="btn-comn-class w-100" onClick={deleteInventory}>
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
