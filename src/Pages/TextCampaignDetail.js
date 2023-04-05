import moment from "moment";
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { PostApi } from "../APIService";
import UserLayout from "../Components/User/UserLayout";
import { API_Path } from "../const";

export default function TextCampaignDetail() {
	const Navigate = useNavigate();
	const location = useLocation();
	const [id, setid] = useState("");
	const [textCampaign_id, settextCampaign_id] = useState("");
	const [textCampaign_details, settextCampaign_details] = useState("");
	const [delete_modal_show, setdelete_modal_show] = useState(false);

	useEffect(() => {
		settextCampaign_id(location?.state?.id);
	}, [location?.state?.id]);

	useEffect(() => {
		if (textCampaign_id) {
			get_textCampaign_details(textCampaign_id);
		}
	}, [textCampaign_id]);

	const get_textCampaign_details = (id) => {
		const gettextCampaignDetailDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTextcampaignById, { id: id }));
		});
		gettextCampaignDetailDataPromise.then((res) => {
			if (res.data.success) {
				settextCampaign_details(res.data.data);
			} else {
				toast.error(res.message);
			}
		});
	};

	const delete_handleClose = () => {
		setdelete_modal_show(false);
	};

	const onDeleteSelect = () => {
		setid(textCampaign_id);
		setdelete_modal_show(true);
	};

	const deleteTextCampaign = () => {
		const deleteTextCampaignPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.deleteTextcampaign, { id: id })));
		deleteTextCampaignPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
				delete_handleClose();
				Navigate("/text-campaign");
			} else {
				toast.error(res.data.message);
				delete_handleClose();
			}
		});
	};
	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Campaign Details</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<div className="row">
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Campaign Name</div>
										<div className="form-detail-text">
											<span id="camp-name">{textCampaign_details.campaignName}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Description</div>
										<div className="form-detail-text">
											<span id="description">{textCampaign_details.description}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Select products</div>
										<div className="form-detail-text">
											<span id="description">{textCampaign_details.selectProduct}</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<label className="label-comn-text">Products Variants</label>
										<div className="d-sm-flex align-items-center">
											{textCampaign_details &&
												textCampaign_details.product_variant.map((item, i) => {
													return (
														<>
															{item.color[0] !== "" && (
																<div key={i} className="d-flex me-3">
																	<div className="label-comn-text-1 me-1">Color:</div>
																	<div className="form-detail-text">
																		<span className="me-2">{item.color}</span>
																	</div>
																</div>
															)}
														</>
													);
												})}
											{/* <div className="d-flex me-3">
                                                        <div className="label-comn-text-1 me-1">Quantity:</div>
                                                        <div className="form-detail-text">
                                                            {textCampaign_details && textCampaign_details.product_variant.map((item,i) => {
                                                                return (
                                                                    <span key={i} className="me-2">{item.quantity}</span>
                                                                )
                                                            })}
                                                        </div>
                                                    </div> */}
											<div className="d-flex">
												<div className="label-comn-text-1 me-1">Size:</div>
												<div className="form-detail-text">
													{textCampaign_details &&
														textCampaign_details.product_variant.map((item, i) => {
															return (
																<>
																	{item.size &&
																		item.size.map((s, i) => {
																			return (
																				<span key={i} className="me-2">
																					{item.size.length - 1 === i ? s : s + ", "}
																				</span>
																			);
																		})}
																</>
															);
														})}
												</div>
											</div>
										</div>
									</div>
									{/* <div className="col-12 mb-3">
                                                <div className="label-comn-text-1">products Name</div>
                                                <div className="form-detail-text">
                                                    <span id="description">{textCampaign_details.productName}</span>
                                                </div>
                                            </div> */}
									<div className="col-12">
										<div className="label-comn-text-1 mb-2">Upload products Image</div>
										<div className="form-detail-text">
											<span id="Add-img">
												<div className="row">
													{textCampaign_details.uploadImg &&
														textCampaign_details.uploadImg.map((item, i) => {
															return (
																<>
																	{item !== "" && (
																		<div key={i} className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0">
																			<div className="add-img-class">
																				<img src={item} key={i} className="img-fluid position-relative" alt="add-pic" />
																			</div>
																		</div>
																	)}
																</>
															);
														})}
													{textCampaign_details.productImage &&
														textCampaign_details.productImage.map((item, i) => {
															return (
																<div key={i} className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0">
																	<div className="add-img-class">
																		<img src={item} key={i} className="img-fluid position-relative" alt="add-pic" />
																	</div>
																</div>
															);
														})}
												</div>
											</span>
										</div>
									</div>
									<div className="col-12 mb-3">
										<div className="label-comn-text-1">Select Customers List</div>
										<div className="form-detail-text">
											<span id="customer-list">{textCampaign_details.groupname}</span>
										</div>
									</div>
									<div className="col-md-8 mb-3">
										<div className="label-comn-text-1">Text Message</div>
										<div className="form-detail-text">
											<span id="message">{textCampaign_details.textMsg}</span>
										</div>
									</div>
									{/* <div className="col-12">
                                                <div className="label-comn-text-1 mb-2">Add Images</div>
                                                <div className="form-detail-text">
                                                    <span id="Add-img">
                                                        <div className="row">
                                                            <div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0">
                                                                <div className="add-img-class">
                                                                    <img src={textCampaign_details.uploadImg} className="img-fluid position-relative" alt="add-pic" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div> */}
									<div className="col-12 mb-md-5 mb-3">
										<div className="label-comn-text-1">Scheduled</div>
										<div className="form-detail-text">
											<div className="scheduled-data">
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar4 me-2" viewBox="0 0 16 16">
													<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z" />
												</svg>
												<span className="form-detail-text me-4" id="sch-date">
													{moment(textCampaign_details.date).format("DD, MMM YYYY")}
												</span>
												<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock me-2" viewBox="0 0 16 16">
													<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
													<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
												</svg>
												<span className="form-detail-text" id="sch-time">
													{textCampaign_details.time}
												</span>
											</div>
										</div>
									</div>
									<div className="col-12">
										<div className="row">
											<div className="col-xxl-2 col-md-3 col-6">
												<button type="button" className="btn-comn-class w-100" onClick={() => Navigate("/edit-text-campaign/", { state: { id: textCampaign_id } })}>
													Edit
												</button>
											</div>
											<div className="col-xxl-2 col-md-3 col-6">
												<button type="button" className="btn-comn-class btn-red-bg w-100" onClick={() => onDeleteSelect()}>
													Delete
												</button>
											</div>
										</div>
									</div>
								</div>
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
