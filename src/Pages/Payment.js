import React, { useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import Paccept from "../../src/images/payment-accept.svg";
import Pdelete from "../../src/images/Paid-Failed.png";
import { PostApi } from "../APIService";
import { API_Path } from "../const";
import moment from "moment";
import { useLocation } from "react-router";

export default function Payment() {
	const [paymentDetails, setpaymentDetails] = useState("");
	const location = useLocation();
	const [getSinglePlan, setgetSinglePlan] = useState("");

	useEffect(() => {
		if (location?.state?.id !== "") {
			const getAllInquiryPromise = new Promise((resolve, reject) => {
				resolve(PostApi(API_Path.getbill, { id: location?.state?.id }));
			});

			getAllInquiryPromise.then((res) => {
				if (res.status === 200) {
					setpaymentDetails(res.data.data);
				}
			});
		}
	}, [location?.state?.id]);

	const Createpdf = () => {
		let data = {
			fullname: paymentDetails.fullname,
			email: paymentDetails.email,
			address: paymentDetails.address,
			country: paymentDetails.country,
			state: paymentDetails.state,
			city: paymentDetails.city,
			planid: paymentDetails.planid,
			userid: paymentDetails.userid,
			Plan_Purchase_Date: paymentDetails.Plan_Purchase_Date,
			payment_mathod: paymentDetails.payment_mathod,
			plandetail: paymentDetails.plandetail,
			flag: paymentDetails.paymentstatus === "true" ? "Payment Successfull." : "Payment Failed.",
		};
		const getPlanByIdPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.createpdf, data));
		});
		getPlanByIdPromise.then((res) => {
			if (res.status === 200) {
				setgetSinglePlan(res.data.path);
				window.open(res.data.path, "_blank");
			}
		});
	};
	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-lg-6 col-sm-5 my-2">
							<div className="comn-title-main"></div>
						</div>
						<div className="col-lg-6 col-sm-7 text-camp-rgt my-2">
							<div className="crt-campaign-btn crt-in-btn ms-auto  my-2">
								<button className="btn-comn-class w-100" onClick={Createpdf} id="pdf">
									Download Invoice
								</button>
							</div>
						</div>
						<div className="col-12">
							<div className="bx-white-main">
								<div className="d-flex mb-4 align-items-center">
									<div className="d-flex flex-column top-payment-txt">
										{paymentDetails.paymentstatus === "true" ? "Thank You For Purchasing With Text A Buy" : paymentDetails.paymentstatus === "false" ? "Your Payment is failed" : ""}
										<p className="mb-0  d-none">Payment Failed</p>
									</div>
									<div className="ms-auto paid-fail-img-sec">{paymentDetails.paymentstatus === "false" ? <img src={Pdelete} alt="Text A Buy" /> : paymentDetails.paymentstatus === "true" ? <img src={Paccept} alt="Text A Buy" /> : ""}</div>
								</div>

								<div className="gray-bg-box mb-3">
									<div className="d-sm-flex">
										<div className="d-lg-flex">
											<div className=" invoice-details me-0 me-lg-5">
												<p>Order Details</p>
												<div className="d-flex">
													<span className="me-3">Vendor Name:</span>
													<bdi>{paymentDetails.fullname}</bdi>
												</div>
												<div className="d-flex succsess-font">
													<span className="me-3">Order ID:</span>
													<bdi>#{paymentDetails._id}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">Payment ID:</span>
													<bdi>#{paymentDetails.planid}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">Plan Purchase Date:</span>
													<bdi>{moment(paymentDetails.Plan_Purchase_Date).format("DD/MM/YYYY")}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">Paymant Mathod:</span>
													<bdi>{paymentDetails.payment_mathod}</bdi>
												</div>
											</div>
											<div className=" invoice-details invoice-billing-details ms-0 ms-lg-3">
												<p>Biling Information</p>
												<div className="d-flex succsess-font">
													<span className="me-3">Address:</span>
													<bdi>{paymentDetails.address}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">Email:</span>
													<bdi>{paymentDetails.email}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">City:</span>
													<bdi>{paymentDetails.city}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">State:</span>
													<bdi>{paymentDetails.state}</bdi>
												</div>
												<div className="d-flex">
													<span className="me-3">Country:</span>
													<bdi>{paymentDetails.country}</bdi>
												</div>
											</div>
										</div>

										<div className="ms-auto d-flex justify-content-end">{paymentDetails.paymentstatus === "true" ? <span className="paid-invoice">Paid</span> : <span className="fail-invoice">Fail</span>}</div>
									</div>
								</div>

								<div className="top-payment-txt mb-3">Plan Information</div>

								<div className="gray-bg-box mb-3">
									<div className="invoice-tbl table-responsive">
										<table className="table">
											<thead className="">
												<tr>
													<th scope="col">Plan Detail</th>
													<th scope="col">Plan #ID </th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>{paymentDetails.plandetail}</td>
													<td>{paymentDetails.planid}</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
