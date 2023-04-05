import moment from "moment";
import React, { useEffect, useState } from "react";
import Drag from "../images/drag-img.svg";
import UserLayout from "../Components/User/UserLayout";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { API_Path, errorContainer, formAttr } from "../const";
import { PostApi } from "../APIService";
import Context from "../contexts/context";
import { useRef } from "react";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router";
import loader from "../images/loader.gif.gif";
import UpgradePlanModal from "../Components/AllModal/UpgradePlanModal";

export default function EditTextCampaign() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const location = useLocation();
	const formikRef = useRef();
	const [id, setid] = useState("");
	const [AllCustomersListGroupData, setAllCustomersListGroupData] = useState();
	const [product_image, setproduct_image] = useState([]);
	const [schedule, setschedule] = useState("");
	const [date, setdate] = useState("");
	const [time, settime] = useState("");
	const [productColor, setproductColor] = useState([]);
	const [productSize, setproductSize] = useState([]);
	const [productVariants, setproductVariants] = useState([]);
	const [productid, setproductid] = useState("");
	const [productdetaildata, setproductdetaildata] = useState("");
	const [ProductName, setProductName] = useState("");
	const [imgarray, setimgarray] = useState([]);
	const [oldimgarray, setoldimgarray] = useState([]);
	const [imgremove, setimgremove] = useState([]);
	const [productdata, setproductdata] = useState([]);
	const [objarrimg, setobjarrimg] = useState([]);
	const [Edit_image, setEdit_image] = useState([]);
	const [productsfinal, setproductsfinal] = useState([]);
	const [currentTextCampaignId, setcurrentTextCampaignId] = useState("");
	const [isloader, setIsloader] = useState(false);
	const [state_id, setstate_id] = useState();
	const [show, setshow] = useState(false);

	useEffect(() => {
		setid(context.login_user_id);
		setstate_id(location.state.id);
	}, [context.login_user_id, location?.state?.id]);

	useEffect(() => {
		if (id) {
			getCustomerGroupList(id);
		}
		if (state_id) {
			setcurrentTextCampaignId(state_id);
		}
		if (id && state_id) {
			getTextCampaignById(state_id, id);
		}
	}, [id, state_id]);

	const getCustomerGroupList = (id) => {
		const getAllCustomersListGroupPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getCustomerGroupName, { userid: id }));
		});
		getAllCustomersListGroupPromise.then((res) => {
			if (res.status === 200) {
				setAllCustomersListGroupData(res.data.data.customerGroup);
			}
		});
	};

	const editTextCampaign = (formData) => {
		setIsloader(true);

		let sizeid = "";
		for (let i = 0; i < productVariants.length; i++) {
			if (productColor?.length > 0 && productSize?.length > 0) {
				if (productVariants[i].color === formData.color && productVariants[i].size === formData.size) {
					sizeid = productVariants[i].variant_id;
				}
			} else {
				if (productVariants[i].color === formData.color || productVariants[i].size === formData.size) {
					sizeid = productVariants[i].variant_id;
				}
			}
		}

		let imgData = new FormData();
		for (let i = 0; i < objarrimg.length; i++) {
			imgData.append("images", objarrimg[i]);
		}
		product_image &&
			product_image.map((item) => {
				return productsfinal.push(item.src);
			});
		const addImagePromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.addFile, imgData));
		});

		addImagePromise.then((res) => {
			if (res.status >= 200 && res.status <= 400) {
				setEdit_image(res.data.data.img ? res.data.data.img : []);
				if (oldimgarray.length !== 0) {
					if (oldimgarray.length === 1 && oldimgarray[0] === "") {
					} else {
						for (let i = 0; i < oldimgarray.length; i++) {
							Edit_image.push(oldimgarray[i]);
						}
					}
				} else {
					if (Edit_image.length === 0) {
						setEdit_image([""]);
					}
				}
				let data;
				if (schedule) {
					if (date !== "" && time !== "") {
						if (document.getElementById("date")) {
							document.getElementById("date").style.display = "none";
						}
						if (document.getElementById("time")) {
							document.getElementById("time").style.display = "none";
						}
						data = {
							_id: currentTextCampaignId,
							campaignName: formData.campaign_name,
							description: formData.description,
							groupid: formData.customer_list,
							productImage: productsfinal,
							product_variant: [
								{
									color: formData.color,
									size: formData.size,
								},
							],
							schedule: schedule,
							selectProduct: formData.select_product,
							textMsg: formData.message,
							uploadImg: Edit_image,
							date: moment(date).format("MM/DD/YYYY"),
							time: time,
							variantid: sizeid,
							productid: productid,
						};
					} else {
						if (document.getElementById("date")) {
							document.getElementById("date").style.display = "block";
						}
						if (document.getElementById("time")) {
							document.getElementById("time").style.display = "block";
						}
					}
				} else {
					data = {
						_id: currentTextCampaignId,
						campaignName: formData.campaign_name,
						description: formData.description,
						selectProduct: formData.select_product,
						productImage: productsfinal,
						textMsg: formData.message,
						schedule: schedule,
						uploadImg: Edit_image,
						groupid: formData.customer_list,
						variantid: sizeid,
						productid: productid,
						product_variant: [
							{
								color: formData.color,
								size: formData.size,
							},
						],
					};
				}

				if (data !== undefined) {
					if (document.getElementById("date")) {
						document.getElementById("date").style.display = "none";
					}
					if (document.getElementById("time")) {
						document.getElementById("time").style.display = "none";
					}
					const editTextCampaignPromis = new Promise((resolve) => {
						resolve(PostApi(API_Path.editTextcampaign, data));
					});
					editTextCampaignPromis.then((res) => {
						if (res.status === 200) {
							toast.success(res.data.message);
							Navigate("/text-campaign");
						} else {
							toast.error(res.data.message);
						}
					});
				} else {
					if (document.getElementById("date")) {
						document.getElementById("date").style.display = "block";
					}
					if (document.getElementById("time")) {
						document.getElementById("time").style.display = "block";
					}
				}
				setIsloader(false);
			} else if (res.status === 402) {
				setshow(true)
			} else {
				toast.error(res.data.message)
			}
		});
	};

	const changeAddImage = (e) => {
		for (var i = 0; i < e.target.files.length; i++) {
			imgarray.push(URL.createObjectURL(e.target.files[i]));
			objarrimg.push(e.target.files[i]);
		}
		setobjarrimg(objarrimg);
		setimgarray(imgarray);
		setimgremove(imgarray);
	};

	const handleScheduleChange = (e) => {
		setschedule(e.target.checked);
	};

	const handleTimeChange = (e) => {
		settime(e.target.value);
		if (schedule) {
			if (time === "") {
				if (document.getElementById("time")) {
					document.getElementById("time").style.display = "block";
				}
			} else {
				if (document.getElementById("time")) {
					document.getElementById("time").style.display = "none";
				}
			}
		}
	};

	const handleDateChange = (e) => {
		setdate(e.target.value);
		if (schedule) {
			if (date === "") {
				if (document.getElementById("date")) {
					document.getElementById("date").style.display = "block";
				}
			} else {
				if (document.getElementById("date")) {
					document.getElementById("date").style.display = "none";
				}
			}
		}
	};

	const getTextCampaignById = (id, userId) => {
		const getTextCampaignByIdPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getTextcampaignById, { id: id }));
		});

		getTextCampaignByIdPromise.then((res) => {
			if (res.status === 200) {
				if (userId !== undefined) {
					handleproductvalue(res.data.data.selectProduct, userId);
				}
				setschedule(res.data.data.schedule);
				setdate(moment(res.data.data.date).format("YYYY-MM-DD"));
				settime(res.data.data.time);
				setProductName(res.data.data.selectProduct);
				setoldimgarray(res.data.data.uploadImg);
				formikRef.current.setFieldValue("campaign_name", res.data.data.campaignName);
				formikRef.current.setFieldValue("description", res.data.data.description);
				formikRef.current.setFieldValue("customer_list", res.data.data.groupid);
				formikRef.current.setFieldValue("color", res.data.data.product_variant[0].color[0]);
				formikRef.current.setFieldValue("size", res.data.data.product_variant[0].size[0]);
				formikRef.current.setFieldValue("message", res.data.data.textMsg);
				formikRef.current.setFieldValue("quantity", res.data.data.quantity);
				formikRef.current.setFieldValue("time", res.data.data.time);
				formikRef.current.setFieldValue("ProductName", res.data.data.selectProduct);
				formikRef.current.setFieldValue("select_product", res.data.data.selectProduct);
				document.getElementById("schedule").checked = true;
				setProductName(res.data.data.selectProduct);
				if (ProductName !== "") {
					let data = {
						userid: id,
						productTitle: ProductName,
					};

					const getProductDetailPromise = new Promise((resolve) => {
						resolve(PostApi(API_Path.getProductDetails, data));
					});
					getProductDetailPromise.then((res) => {
						if (res.status === 200) {
							const addFilePromise = new Promise((resolve, reject) => {
								resolve(PostApi(API_Path.getProductImage, data));
							});
							addFilePromise.then((res) => {
								if (res.status === 200) {
									let productarr = [];
									setproduct_image([]);
									res.data.data.images &&
										res.data.data.images.map((item) => {
											if (!productarr.includes(item.productImage)) {
												productarr.push(item.productImage);
											}
										});
									setproduct_image(res.data.data.images);
								}
							});
						}
					});

					const getProductSizePromise = new Promise((resolve) => {
						resolve(PostApi(API_Path.getSizeByProductName, data));
					});
					getProductSizePromise.then((res) => {
						if (res.status === 200) {
							setproductdetaildata(res.data.data);
							setproductid(res.data.data[0].product_id);
							productdetaildata &&
								productdetaildata.map((item) => {
									if (res.data.data.product_variant[0].color[0] === item.color) {
										if (document.getElementById(item.color)) {
											document.getElementById(item.color).selected = true;
										}
									}
								});
							productdetaildata &&
								productdetaildata.map((item, i) => {
									if (res.data.data.product_variant[0].size[0] === item.size) {
										if (document.getElementById(item.size)) {
											document.getElementById(item.size).selected = true;
										}
									}
								});
						}
					});
				}
			}
		});
	};

	const handleSearchChange = (e) => {
		setProductName(e.target.value);
		document.getElementById("pro-list").classList.add("active");
		let data = { userid: id, productTitle: e.target.value };
		const getProductByNamePromise = new Promise((resolve) => resolve(PostApi(API_Path.getProductByName, data)));
		getProductByNamePromise.then((res) => {
			if (res.status === 200) {
				setproductdata(res.data.data.titles);
			}
		});
	};

	const handleSearchBlur = () => {
		setTimeout(() => {
			document.getElementById("pro-list").classList.remove("active");
		}, 500);
	};

	const handleproductvalue = (item, userId) => {
		setProductName(item);
		formikRef.current.setFieldValue("select_product", item);
		if (item !== "") {
			let data = {
				userid: userId !== "" ? userId : id,
				productTitle: item,
			};

			const getProductDetailPromise = new Promise((resolve) => {
				resolve(PostApi(API_Path.getProductDetails, data));
			});
			getProductDetailPromise.then((res) => {
				if (res.status === 200) {
					setproductid(res.data.data.product_id);
					if (res.data.data?.variant?.length > 0) {
						let colorArr = [];
						let sizeArr = [];
						for (let i = 0; i < res.data.data?.variant.length; i++) {
							if (res.data.data.variant[i].color !== undefined && !colorArr.includes(res.data.data.variant[i].color)) {
								colorArr.push(res.data.data.variant[i].color);
							}
							if (res.data.data.variant[i].size !== undefined && !sizeArr.includes(res.data.data.variant[i].size)) {
								sizeArr.push(res.data.data.variant[i].size);
							}
						}
						setproductVariants(res.data.data.variant);
						setproductColor(colorArr);
						setproductSize(sizeArr);
					}
				}
			});
			const addFilePromise = new Promise((resolve, reject) => {
				resolve(PostApi(API_Path.getProductImage, data));
			});
			addFilePromise.then((res) => {
				if (res.status === 200) {
					let productarr = [];
					setproduct_image([]);
					res.data.data.images &&
						res.data.data.images.map((item) => {
							if (!productarr.includes(item.productImage)) {
								productarr.push(item.productImage);
							}
						});
					setproduct_image(res.data.data.images);
				}
			});
		}
	};

	const handleCancelImage = (e) => {
		var y = objarrimg;
		var x = imgremove;
		y.splice(e, 1);
		x.splice(e, 1);
		setimgarray(x);
		setobjarrimg(y);
	};

	const handleCancelOldImage = (e) => {
		var x = oldimgarray;
		x.splice(e, 1);
		setoldimgarray(x);
	};

	const handleCancelProductImage = (id) => {
		var x = product_image?.filter((item) => item._id !== id);
		setproduct_image(x);
	};
	return (
		<UserLayout>
			{show && <UpgradePlanModal />}
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Edit Campaign</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class p-0">
								<div className="detail-box-head">Basic Details</div>
								<Formik
									innerRef={formikRef}
									enableReinitialize={true}
									initialValues={{
										campaign_name: "",
										description: "",
										select_product: "",
										color: "",
										size: "",
										customer_list: "",
										message: "",
										schedule: false,
										date: "",
										time: "",
									}}
									validationSchema={Yup.object({
										campaign_name: Yup.string().required("This field is required."),
										description: Yup.string().required("This field is required."),
										select_product: Yup.string().required("This field is required."),
										customer_list: Yup.string().required("This field is required."),
										message: Yup.string().required("This field is required."),
									})}
									onSubmit={(formData, { resetForm }) => {
										editTextCampaign(formData, resetForm);
									}}
								>
									{(runform) => (
										<form className="row detail-box-form" onSubmit={runform.handleSubmit}>
											<div className="col-12 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">
													Campaign Name <span>(Internal Use Only)</span>
												</label>
												<input type="text" className="form-control comn-input-style" placeholder="Vision for Victory" name="campaign_name" {...formAttr(runform, "campaign_name")} />
												{errorContainer(runform, "campaign_name")}
											</div>
											<div className="col-12 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">
													Description <span>(Internal Use Only)</span>
												</label>
												<input type="text" className="form-control comn-input-style" placeholder="description" name="description" {...formAttr(runform, "description")} />
												{errorContainer(runform, "description")}
											</div>
											<div className="col-12 mb-3 position-relative">
												<label className="label-comn-text-1 mb-2 d-block">Select products</label>
												<input type="text" name="select_product" className="form-control comn-input-style" autoComplete="off" value={ProductName} onChange={handleSearchChange} onBlur={handleSearchBlur} />
												<div className="opt-product-list" id="pro-list">
													<ul>
														{productdata &&
															productdata.map((item, i) => {
																return (
																	<li onClick={() => handleproductvalue(item, "")} key={i}>
																		{item}
																	</li>
																);
															})}
													</ul>
												</div>
												{errorContainer(runform, "select_product")}
											</div>
											<div className="col-12 mb-3">
												<label className="label-comn-text mb-2 d-block text-black">Select products variants</label>
												<div className="row align-items-center">
													{productColor?.length > 0 && (
														<div className="col-md-6 mb-md-0 mb-3">
															<label className="label-comn-text-1 mb-2 d-block">Color</label>
															<select className="form-select comn-input-style" {...formAttr(runform, "color")} name="color">
																<option value="">Select color</option>
																{productColor?.map((item, i) => {
																	return (
																		<option value={item} key={i}>
																			{item}
																		</option>
																	);
																})}
															</select>
														</div>
													)}
													{productSize?.length > 0 && (
														<div className="col-md-6 mb-md-0 mb-3">
															<label className="label-comn-text-1 mb-2 d-block">Size</label>
															<select className="form-select comn-input-style" {...formAttr(runform, "size")} name="size">
																<option value="">Select Size</option>
																{productSize?.map((item, i) => {
																	return (
																		<option value={item} key={i}>
																			{item}
																		</option>
																	);
																})}
															</select>
														</div>
													)}
												</div>
											</div>

											{/* ====================================== 111111111111 ================================= */}
											<div className="col-12">
												<label className="label-comn-text-1 mb-2 d-block">Choose products Image</label>
												<div className="row">
													{product_image &&
														product_image.map((item, i) => {
															return (
																<div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0" key={i}>
																	<div className="add-img-class">
																		<button className="close-img-btn" type="button" onClick={() => handleCancelProductImage(item._id)}>
																			<i className="bi bi-x"></i>
																		</button>
																		<img key={i} src={item.src} className="img-fluid position-relative" alt="add-pic" />
																	</div>
																</div>
															);
														})}
													{oldimgarray.length > 0 &&
														oldimgarray.map((item, i) => {
															return (
																<>
																	{item !== "" ? (
																		<div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0" key={i}>
																			<div className="add-img-class">
																				<button className="close-img-btn" type="button" onClick={() => handleCancelOldImage(i)}>
																					<i className="bi bi-x"></i>
																				</button>
																				<img src={item} className="img-fluid position-relative" alt="add-pic" />
																			</div>
																		</div>
																	) : (
																		""
																	)}
																</>
															);
														})}
													{imgarray.length > 0 &&
														imgarray.map((item, i) => {
															return (
																<>
																	<div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3 ms-0" key={i}>
																		<div className="add-img-class">
																			<button className="close-img-btn" type="button" onClick={() => handleCancelImage(i)}>
																				<i className="bi bi-x"></i>
																			</button>
																			<img src={item} className="img-fluid position-relative" alt="add-pic" />
																		</div>
																	</div>
																</>
															);
														})}

													<div className="col-xxl-1 col-xl-2  col-md-3 col-sm-4 col-6 mb-3">
														<div className="drag-img-main">
															<div className="drag-img-box">
																<label htmlFor="upload-file" className="text-center">
																	<img src={Drag} alt="drag-img" />
																	<p className="mb-0">Upload Image</p>
																</label>
																<input onChange={changeAddImage} type="file" accept="image/*" id="upload-file" name="upload_img" hidden multiple />
															</div>
														</div>
													</div>
												</div>
											</div>
											{/* ================================================================================== */}
											<div className="col-12 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Select Customers Group</label>
												<select className="form-select comn-input-style" name="customer_list" {...formAttr(runform, "customer_list")}>
													<option value="">Select customer group</option>
													{AllCustomersListGroupData &&
														AllCustomersListGroupData.map((item, i) => {
															return (
																<option value={item._id} key={i}>
																	{item.groupName}
																</option>
															);
														})}
												</select>
												{errorContainer(runform, "customer_list")}
											</div>
											<div className="col-12 mb-3">
												<label className="label-comn-text-1 mb-2 d-block">Text Message</label>
												<textarea rows="5" type="textarea" className="form-control comn-input-style h-auto" placeholder="message" name="message" {...formAttr(runform, "message")} />
												{errorContainer(runform, "message")}
											</div>
											{/* ====================================== 22222222222 ================================= */}

											{/* ============================================================================  */}
											<div className="col-12 mb-3">
												<div className="cust-checkbox-new">
													<label className="cust-chk-bx">
														<input
															type="checkbox"
															id="schedule"
															name="schedule"
															onChange={handleScheduleChange}
														// {...formAttr(runform, "schedule")}
														/>
														<span className="cust-chkmark"></span>Schedule
													</label>
												</div>
											</div>
											<div className="col-12">
												<div className="row">
													{schedule ? (
														<div className="col-12 mb-3">
															<div className="date-campaign-box">
																<div className="row">
																	<div className="col-xxl-2 col-md-3 col-6">
																		<input type="date" className="form-control comn-input-style" name="date" onChange={handleDateChange} value={date} />
																		<div className="text-danger " style={{ display: `none` }} id="date">
																			this field is required
																		</div>
																	</div>
																	<div className="col-xxl-2 col-md-3 col-6">
																		<input type="time" className="form-control comn-input-style" name="time" onChange={(e) => handleTimeChange(e)} value={time} />
																		<div className="text-danger " style={{ display: `none` }} id="time">
																			this field is required
																		</div>
																	</div>
																</div>
															</div>
														</div>
													) : (
														" "
													)}
													<div className="col-12 mb-3 text-center">
														<div className="row">
															<div className="col-xxl-2 col-md-3 col-6">
																{isloader ? (
																	<button type="button" className="btn-comn-class loader-btn-div">
																		<img className="" src={loader} alt="Loader" />
																	</button>
																) : (
																	<button type="submit" id="btn-text-campaign" className="btn-comn-class w-100">
																		Schedule
																	</button>
																)}
															</div>
															<div className="col-xxl-2 col-md-3 col-6">
																<button type="button" className="btn-comn-class btn-dif-bg w-100" onClick={() => Navigate("/text-campaign")}>
																	<span>cancel</span>
																</button>
															</div>
														</div>
													</div>
												</div>
											</div>
										</form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
