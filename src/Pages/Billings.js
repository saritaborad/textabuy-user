import React, { useState, useEffect, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../APIService";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import Context from "../contexts/context";

export default function Billings() {
	const context = useContext(Context);
	const [billings, setbillings] = useState([]);
	const [login_id, setlogin_id] = useState();
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });
	const columns = [
		{
			label: "Name",
			value: "name",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].name ? data[i].name : "-"}</span>;
				},
			},
		},
		{
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].date ? moment(data[i].date).format("DD/MM/YYYY") : "-"}</span>;
				},
			},
		},
		{
			label: "Amount",
			value: "amount",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>{data[i].amount ? data[i].amount : "-"}</span>;
				},
			},
		},
		{
			label: "Card Number",
			value: "card",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return <span>**** **** **** {data[i].card ? data[i].card : "-"}</span>;
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
					let statusClass = data[i].status === true ? "active" : "pending";
					return <div className={`status-col status-` + statusClass}>{data[i].status ? data[i].status : "-"}</div>;
				},
			},
		},
	];

	useEffect(() => {
		setlogin_id(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (login_id) getUserDetail(login_id);
	}, [login_id]);

	const getUserDetail = (login_id) => {
		const getUserDetailPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getUserById, { id: login_id })));
		getUserDetailPromise.then((res) => {
			if (res.status === 200) {
				if (res.data.data.stripe.length === 0 && res.data.data.shopify.length === 0) {
					toast.warn("please connect with stripe and shopify");
				} else {
					getAllbillings(login_id);
				}
			}
		});
	};

	const getAllbillings = (id) => {
		let data = { userid: id, option: option };
		const getAllbillingsPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getBilling, data)));
		getAllbillingsPromise.then((res) => {
			if (res.status === 200) {
				setbillings(res.data.data.transection);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getAllbillings();
	};

	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-5 col-sm-4">
							<div className="comn-title-main">
								<h1 className="mb-0">Customers Billing</h1>
							</div>
						</div>
						<div className="col-md-7 col-sm-8 text-camp-rgt ">
							<div className="crt-campaign-btn crt-in-btn ms-auto  my-2">
								{billings && (
									<CSVLink data={billings} filename={"BillingsList.csv"}>
										<button className="btn-comn-class w-100">Export</button>
									</CSVLink>
								)}
							</div>
						</div>
						<div className="col-12 mt-3">
							<div className="bx-white-main">
								<RtdDatatable option={option} columns={columns} data={billings} tableCallBack={tableCallBack} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
