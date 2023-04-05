import React from "react";
import UserLayout from "../Components/User/UserLayout";
import Dash1 from "../images/dash-icon-1.svg";
import Dash2 from "../images/dash-icon-2.svg";
import Dash4 from "../images/dash-icon-4.svg";
import Dash5 from "../images/dash-icon-5.svg";
import Chart from "react-apexcharts";
import moment from "moment";
import { API_Path } from "../const";
import { PostApi } from "../APIService";
import Context from "../contexts/context";
import RtdDatatable from "../Components/DataTable/RtdDatatable";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";

var totalcampaignX = [];
var totalcampaignY = [];
var totalcustomerX = [];
var totalcustomerY = [];

export default function Dashboard() {
	const context = useContext(Context);
	const [id, setid] = useState("");
	const [AllOrderRequestData, setAllOrderRequestData] = useState([]);
	const [dashboardData, setdashboardData] = useState("");
	const [totalCustomerX, settotalCustomerX] = useState([]);
	const [totalCustomerY, settotalCustomerY] = useState([]);
	const [totalCampaignX, settotalCampaignX] = useState([]);
	const [totalCampaignY, settotalCampaignY] = useState([]);
	const [option, setoption] = useState({ sizePerPage: 10, search: "", totalRecord: 10, page: 0, sort: "_id", order: "ASC" });

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		if (id) {
			getDashboard(id);
			getAllOrderRequest(id);
		}
	}, [id]);

	const getDashboard = (id) => {
		const getDashboardDataPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.dashboard, { userid: id })));
		getDashboardDataPromise.then((res) => {
			setdashboardData(res.data.data);
			totalcustomerX = [];
			totalcustomerY = [];
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = res.data.data?.weeklycustomer && res.data.data?.weeklycustomer.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			if (sortedArr1.length > 0) {
				for (var i = 0; i < sortedArr1.length; i = i + count1) {
					count1 = 1;
					for (var j = i + 1; j < sortedArr1.length; j++) {
						if (sortedArr1[i] === sortedArr1[j]) count1++;
					}
					totalcustomerX.push(sortedArr1[i]);
					totalcustomerY.push(count1);
					settotalCustomerX(totalcustomerX);
					settotalCustomerY(totalcustomerY);
				}
			}
			totalcampaignX = [];
			totalcampaignY = [];
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = res.data.data.weeklycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var k = 0; k < sortedArr2.length; k = k + count2) {
				count2 = 1;
				for (var l = k + 1; l < sortedArr2.length; l++) {
					if (sortedArr2[k] === sortedArr2[l]) count2++;
				}
				totalcampaignX.push(sortedArr2[k]);
				totalcampaignY.push(count2);
				settotalCampaignX(totalcampaignX);
				settotalCampaignY(totalcampaignY);
			}
		});
	};

	const tableCallBack = (option) => {
		setoption(option);
		getAllOrderRequest(id);
	};

	const getAllOrderRequest = (id) => {
		const data = { id: id, option: option };
		const getAllOrderRequestPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getOrder, data)));
		getAllOrderRequestPromise.then((res) => {
			if (res.status === 200) {
				setAllOrderRequestData(res.data.data.orders);
				setoption({ ...option, totalRecord: res.data.data.totalRecord });
			}
		});
	};

	const handleCustomerChangeData = (e) => {
		totalcustomerX = [];
		totalcustomerY = [];
		if (e.target.value === "0") {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = dashboardData.weeklycustomer.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr1.length; i = i + count1) {
				count1 = 1;
				for (var j = i + 1; j < sortedArr1.length; j++) {
					if (sortedArr1[i] === sortedArr1[j]) count1++;
				}
				totalcustomerX.push(sortedArr1[i]);
				totalcustomerY.push(count1);
				settotalCustomerX(totalcustomerX);
				settotalCustomerY(totalcustomerY);
			}
		} else if (e.target.value === "1") {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = dashboardData.monthlycustomer.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var k = 0; k < sortedArr1.length; k = k + count1) {
				count1 = 1;
				for (var l = k + 1; l < sortedArr1.length; l++) {
					if (sortedArr1[k] === sortedArr1[l]) count1++;
				}
				totalcustomerX.push(sortedArr1[k]);
				totalcustomerY.push(count1);
				settotalCustomerX(totalcustomerX);
				settotalCustomerY(totalcustomerY);
			}
		} else {
			let sortedArr1 = [];
			let count1 = 1;
			sortedArr1 = dashboardData.yearlycustomer.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var m = 0; m < sortedArr1.length; m = m + count1) {
				count1 = 1;
				for (var n = m + 1; n < sortedArr1.length; n++) {
					if (sortedArr1[m] === sortedArr1[n]) count1++;
				}
				totalcustomerX.push(sortedArr1[m]);
				totalcustomerY.push(count1);
				settotalCustomerX(totalcustomerX);
				settotalCustomerY(totalcustomerY);
			}
		}
	};

	const handleCampaignChangeData = (e) => {
		totalcampaignX = [];
		totalcampaignY = [];
		if (e.target.value === "0") {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = dashboardData.weeklycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var i = 0; i < sortedArr2.length; i = i + count2) {
				count2 = 1;
				for (var j = i + 1; j < sortedArr2.length; j++) {
					if (sortedArr2[i] === sortedArr2[j]) count2++;
				}
				totalcampaignX.push(sortedArr2[i]);
				totalcampaignY.push(count2);
				settotalCampaignX(totalcampaignX);
				settotalCampaignY(totalcampaignY);
			}
		} else if (e.target.value === "1") {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = dashboardData.monthlycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var o = 0; o < sortedArr2.length; o = o + count2) {
				count2 = 1;
				for (var p = o + 1; p < sortedArr2.length; p++) {
					if (sortedArr2[o] === sortedArr2[p]) count2++;
				}
				totalcampaignX.push(sortedArr2[o]);
				totalcampaignY.push(count2);
				settotalCampaignX(totalcampaignX);
				settotalCampaignY(totalcampaignY);
			}
		} else {
			let sortedArr2 = [];
			let count2 = 1;
			sortedArr2 = dashboardData.yearlycampaign.map((item) => moment(item).format("DD-MM-YYYY")).sort();
			for (var b = 0; b < sortedArr2.length; b = b + count2) {
				count2 = 1;
				for (var c = b + 1; c < sortedArr2.length; c++) {
					if (sortedArr2[i] === sortedArr2[c]) count2++;
				}
				totalcampaignX.push(sortedArr2[b]);
				totalcampaignY.push(count2);
				settotalCampaignX(totalcampaignX);
				settotalCampaignY(totalcampaignY);
			}
		}
	};

	const chart1series = [{ name: "Customer", data: totalCustomerY }];
	const chart1options = {
		fill: { opacity: 1 },
		chart: {
			height: 300,
			type: "line",
			fontFamily: "Poppins,sans-serif",
			zoom: { enabled: true },
			toolbar: { show: false },
		},
		dataLabels: { enabled: false },
		colors: ["#1C1C1C"],
		stroke: { show: true, curve: "smooth", lineCap: "butt", width: 2, dashArray: 0 },
		xaxis: { categories: totalCustomerX },
	};

	const chart2series = [{ name: "Campaign", data: totalCampaignY }];
	const chart2options = {
		fill: { opacity: 1 },
		chart: {
			height: 300,
			type: "area",
			fontFamily: "Poppins,sans-serif",
			zoom: { enabled: true },
			toolbar: { show: false },
		},
		dataLabels: { enabled: false },
		colors: ["#489824"],
		stroke: { show: true, curve: "smooth", lineCap: "butt", width: 2, dashArray: 0 },
		xaxis: { categories: totalCampaignX },
	};

	const columns = [
		{
			label: "Order No.",
			value: "order_no",
			options: {
				filter: true,
			},
		},
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
			label: "Date",
			value: "date",
			options: {
				filter: true,
				customBodyRender: (data, i) => {
					return moment(data[i].date).format("MM/DD/YYYY");
				},
			},
		},
		{
			label: "Status",
			value: "status",
			options: {
				filter: true,
				sort: false,
				empty: true,
				customBodyRender: (data, i) => {
					return <span className={`staus-span-tag-new status-${data[i].status === "pending" ? "pending" : data[i].status === "fail" ? "rejected" : "active"}`}>{data[i].status}</span>;
				},
			},
		},
	];
	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Dashboard</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="row me-0 justify-content-center">
								<div className="col-xxl col-md-3 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-1">
											<img src={Dash1} alt="1" />
										</span>
										<p>{dashboardData?.totalemailcampaign}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Email Campaigns</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-md-3 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-2">
											<img src={Dash2} alt="2" />
										</span>
										<p>{dashboardData?.totalteam}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Team Members</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-md-3 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-4">
											<img src={Dash4} alt="4" />
										</span>
										<p>{dashboardData?.totaltextcampaign}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Text Campaigns</bdi>
										</div>
									</div>
								</div>
								<div className="col-xxl col-md-3 col-6 pe-0 mb-3">
									<div className="dash-top-box">
										<span className="dash-span-5">
											<img src={Dash5} alt="5" />
										</span>
										<p>{dashboardData?.totalcustomer}</p>
										<div className="dash-top-box-info d-flex align-items-center">
											<bdi>Total customers</bdi>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12 height-col-main">
							<div className="row me-0">
								<div className="col-md-6 mb-3 pe-0">
									<div className="row">
										<div className="col-12">
											<div className="dash-hdr-body-box">
												<div className="dash-hdr-body-box-hdr d-flex align-items-center p-0">
													<span>Total Customers</span>
													<select className="form-select ms-auto" onChange={handleCustomerChangeData}>
														<option defaultValue="0">Weekly</option>
														<option value="1">Monthly</option>
														<option value="2">Yearly</option>
													</select>
												</div>
												<div className="dash-hdr-body-box-body">
													<div className="chart-section-main">
														<Chart options={chart1options} series={chart1series} height={300} type="line" />
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6 pe-0 mb-3">
									<div className="dash-hdr-body-box">
										<div className="dash-hdr-body-box-hdr d-flex align-items-center p-0">
											<span>Campaign Sent</span>
											<select className="form-select ms-auto" onChange={handleCampaignChangeData}>
												<option defaultValue="0">Weekly</option>
												<option value="1">Monthly</option>
												<option value="2">Yearly</option>
											</select>
										</div>
										<div className="dash-hdr-body-box-body">
											<div className="chart-section-main">
												<Chart options={chart2options} series={chart2series} height={300} type="area" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main p-0 white-tbl-box">
								<div className="dash-hdr-body-box-hdr border-bottom">
									<span>New Orders</span>
								</div>
								<div className="dash-hdr-body-box-body p-3">
									<RtdDatatable option={option} columns={columns} data={AllOrderRequestData} tableCallBack={tableCallBack} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
