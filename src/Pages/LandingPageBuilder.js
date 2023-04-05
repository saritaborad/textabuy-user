import React, { useState, useEffect, useRef, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import { PostApi } from "../APIService";
import { API_Path, errorContainer, formAttr, IFREM_URL } from "../const";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { Nav, Tab } from "react-bootstrap";
import loader from "../../src/images/loader.gif.gif";
import IframeReload from "../Components/User/IframeReload";
import Context from "../contexts/context";
import UpgradePlanModal from "../Components/AllModal/UpgradePlanModal";

export default function LandingPageBuilder(props) {
	const runforms = useRef();
	const context = useContext(Context);
	const [newlogoImage, setnewlogoImage] = useState("");
	const [banner_image, setbanner_image] = useState("");
	const [get_data_by_id, setget_data_by_id] = useState("");
	const [get_data_color, setget_data_color] = useState("");
	const [iframeUrl, setiframeUrl] = useState("");
	const [random, setrandom] = useState(0);
	const [id, setid] = useState();
	const [isloader, setIsloader] = useState(false);
	const [isloader3, setIsloader3] = useState(false);
	const [isloader4, setIsloader4] = useState(false);
	const [show, setshow] = useState(false);

	useEffect(() => {
		setid(context.landing_page_id);
	}, [context.landing_page_id]);

	useEffect(() => {
		if (id !== undefined) {
			setid(id);
			setiframeUrl(`${IFREM_URL}/home/${id}`);
			getLandingPage(id);
		} else {
			setiframeUrl(`${IFREM_URL}/home/-`);
		}
	}, [id]);

	const getLandingPage = (id) => {
		setIsloader(true);
		const getLandingPagePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getLandingPage, { landingpageid: id })));
		getLandingPagePromise.then((res) => {
			setIsloader(false);
			if (res.status === 200) {
				setget_data_by_id(res.data.data);
				setget_data_color(res.data.data.color[0]);
				setnewlogoImage(res.data.data.logo !== "" ? res.data.data.logo : "");
				setbanner_image(res.data.data.bannerimg ? res.data.data.bannerimg : "");
			}
		});
	};

	const addBannerImage = (files) => {
		setIsloader4(true);
		var formData = new FormData();
		formData.append("images", files);
		const addFilePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.addFile, formData)));
		addFilePromise.then((res) => {
			setIsloader4(false);
			if (res.status === 200) {
				setbanner_image(res.data.data.img[0]);
				runforms.current.setFieldValue("bannerimg", res.data.data.img[0]);
				runforms.current.setFieldValue("bannermedia", "");
			}
		});
	};

	const addLogoImages = (files) => {
		setIsloader3(true);
		var formData = new FormData();
		formData.append("images", files);
		const addFilePromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.addFile, formData)));
		addFilePromise.then((res) => {
			setIsloader3(false);
			if (res.status === 200) {
				setnewlogoImage(res.data.data.img[0]);
				runforms.current.setFieldValue("logo", res.data.data.img[0]);
			}
		});
	};

	const updateLandingPageData = (formData, resetForm) => {
		setIsloader(true);
		let temp_iframe = `${IFREM_URL}/home/-`;
		var url = new URL(temp_iframe);
		formData.sitename && url.searchParams.set("sitename", formData.sitename);
		formData.siteNameColor && url.searchParams.set("siteName_Color", formData.siteNameColor);
		formData.slogan && url.searchParams.set("slogan", formData.slogan);
		formData.sloganColor && url.searchParams.set("slogan_Color", formData.sloganColor);
		formData.logo && url.searchParams.set("logo", formData.logo);
		formData.primarytextColor && url.searchParams.set("primarytext_Color", formData.primarytextColor);
		formData.inputfieldColor && url.searchParams.set("inputfield_Color", formData.inputfieldColor);
		formData.primarybuttonColor && url.searchParams.set("text_color", formData.primarybuttonColor);
		formData.backgroundcolor && url.searchParams.set("bg_color", formData.backgroundcolor);
		formData.actionTextColor && url.searchParams.set("paybox_color", formData.actionTextColor);
		formData.bannermedia && url.searchParams.set("media_url", formData.bannermedia);
		formData.bannerimg && url.searchParams.set("media_src", formData.bannerimg);
		let final_data = {
			landingpageid: id,
			sitename: formData.sitename,
			slogan: formData.slogan,
			logo: formData.logo,
			bannermedia: formData.bannermedia,
			bannerimg: formData.bannerimg,
			color: [{ siteNameColor: formData.siteNameColor, sloganColor: formData.sloganColor, primarytextColor: formData.primarytextColor, inputfieldColor: formData.inputfieldColor, actionTextColor: formData.actionTextColor, backgroundcolor: formData.backgroundcolor, primarybuttonColor: formData.primarybuttonColor }],
			iframe: url.href,
		};
		const updateLandingPagePromis = new Promise((resolve) => resolve(PostApi(API_Path.updateLandingPage, final_data)));
		updateLandingPagePromis.then((res) => {
			setIsloader(false);
			if (res.status === 200) {
				toast.success(res.data.message);
				setiframeUrl(res.data.data.iframe);
				getLandingPage(id);
				resetForm(formData);
				setnewlogoImage("");
				setbanner_image("");
			} else if (res.status === 402) {
				setshow(true);
				toast.warn(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	const handlePreview = (runform) => {
		if (runform.isValid) {
			let temp_iframe = `${IFREM_URL}/home/-`;
			var url = new URL(temp_iframe);
			runform.values.sitename && url.searchParams.set("sitename", runform.values.sitename);
			runform.values.siteNameColor && url.searchParams.set("siteName_Color", runform.values.siteNameColor);
			runform.values.slogan && url.searchParams.set("slogan", runform.values.slogan);
			runform.values.sloganColor && url.searchParams.set("slogan_Color", runform.values.sloganColor);
			runform.values.logo && url.searchParams.set("logo", runform.values.logo);
			runform.values.primarytextColor && url.searchParams.set("primarytext_Color", runform.values.primarytextColor);
			runform.values.inputfieldColor && url.searchParams.set("inputfield_Color", runform.values.inputfieldColor);
			runform.values.primarybuttonColor && url.searchParams.set("text_color", runform.values.primarybuttonColor);
			runform.values.backgroundcolor && url.searchParams.set("bg_color", runform.values.backgroundcolor);
			runform.values.actionTextColor && url.searchParams.set("paybox_color", runform.values.actionTextColor);
			runform.values.bannermedia && url.searchParams.set("media_url", runform.values.bannermedia);
			runform.values.bannerimg && url.searchParams.set("media_src", runform.values.bannerimg);
			iframeReload(url.href);
			setiframeUrl(url.href);
			document.getElementById("iframePreview").contentWindow.location.reload(true);
			setrandom(random + 1);
		} else {
			runform.handleSubmit();
		}
	};

	const iframeReload = (url) => setiframeUrl(url);

	const copyToClipboard = (text) => {
		navigator.clipboard.writeText(text);
		toast.success("copied");
	};

	const handleEmbededLink = (e) => {
		runforms.current.setFieldValue("bannermedia", e.target.value);
		runforms.current.setFieldValue("bannerimg", "");
	};

	return (
		<UserLayout>
			{show && <UpgradePlanModal />}
			<div className="content-wrapper-section landing-page">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Landing Page Builder</h1>
							</div>
						</div>
						<div className="col-xxl-6 mb-3">
							<div className="detail-box-class mb-3 p-0">
								<div className="detail-box-head">Landing Page Edits</div>
								<Formik
									innerRef={runforms}
									enableReinitialize={true}
									initialValues={{
										sitename: get_data_by_id.sitename ? get_data_by_id.sitename : "",
										siteNameColor: get_data_color.siteNameColor ? get_data_color.siteNameColor : "#3a8cd9",
										slogan: get_data_by_id.slogan ? get_data_by_id.slogan : "",
										sloganColor: get_data_color.sloganColor ? get_data_color.sloganColor : "#dbac48",
										logo: get_data_by_id.logo ? get_data_by_id.logo : "",
										primarytextColor: get_data_color.primarytextColor ? get_data_color.primarytextColor : "#433e3d",
										backgroundcolor: get_data_color.backgroundcolor ? get_data_color.backgroundcolor : "#d9eaf2",
										actionTextColor: get_data_color.actionTextColor ? get_data_color.actionTextColor : "#078a9f",
										inputfieldColor: get_data_color.inputfieldColor ? get_data_color.inputfieldColor : "#00a5a8",
										primarybuttonColor: get_data_color.primarybuttonColor ? get_data_color.primarybuttonColor : "#aed6bd",
										bannermedia: get_data_by_id.bannermedia ? get_data_by_id.bannermedia : "",
										bannerimg: get_data_by_id.bannerimg ? get_data_by_id.bannerimg : "",
										iframe: get_data_by_id.iframe ? get_data_by_id.iframe : "",
									}}
									validationSchema={Yup.object({
										sitename: Yup.string().required("Site Name is required."),
										slogan: Yup.string().required("slogan is required."),
										logo: Yup.string().required("Logo Image is required."),
									})}
									onSubmit={(formData, { resetForm }) => updateLandingPageData(formData, resetForm)}
								>
									{(runform) => (
										<div className="detail-box-form">
											<form className="row " onSubmit={runform.handleSubmit}>
												<div className="col-12 mb-3">
													<div className="detail-box-head border-0 pt-0 px-0">Appearance</div>
													<div className="d-flex align-items-center comn-color-input">
														<div>
															<label className="label-comn-text-1 d-block">Site Name</label>
														</div>
														<div className="d-flex flex-column w-100">
															<div className="input-group  comn-input-style-2">
																<input type="text" className="form-control comn-input-style ffs" name="sitename" {...formAttr(runform, "sitename")} />
																<div className="input-group-prepend">
																	<input type="color" name="siteNameColor" className="input-group-text " {...formAttr(runform, "siteNameColor")} />
																</div>
																<input type="text" className="form-control comn-input-style" readOnly disabled {...formAttr(runform, "siteNameColor")} />
															</div>
															<div className="py-2">{errorContainer(runform, "sitename")}</div>
														</div>
													</div>
													<div className="d-flex align-items-center comn-color-input mt-3">
														<div>
															<label className="label-comn-text-1 d-block">Slogan</label>
														</div>
														<div className="d-flex flex-column w-100">
															<div className="input-group  comn-input-style-2">
																<input type="text" className="form-control comn-input-style ffs" name="slogan" {...formAttr(runform, "slogan")} />
																<div className="input-group-prepend">
																	<input type="color" name="sloganColor" className="input-group-text " {...formAttr(runform, "sloganColor")} />
																</div>
																<input type="text" className="form-control comn-input-style" readOnly disabled {...formAttr(runform, "sloganColor")} />
															</div>
															<div className="py-2">{errorContainer(runform, "slogan")}</div>
														</div>
													</div>
												</div>
												<div className="col-sm-6 mb-3">
													<label className="label-comn-text-1 mb-2 d-block">Upload Logo</label>
													<div className="new-logo-class d-flex flex-column">
														{isloader3 ? (
															<button type="button" className="btn-comn-class loader-btn-div">
																<img className="" src={loader} alt="Loader" />
															</button>
														) : (
															<div className="chg-logo-box">{newlogoImage !== "" && <img src={newlogoImage} alt="" />}</div>
														)}
														<input className="d-none" onChange={(e) => addLogoImages(e.target.files[0])} type="file" accept="image/*" id="newlogo" name="logoImage" />
														<label htmlFor="newlogo" className=" m-auto">
															Change logo
														</label>
													</div>
												</div>
												<div className="col-sm-6 mb-5 p-5">{errorContainer(runform, "logo")}</div>
												<div className="col-md-12 mb-3">
													<div className="d-flex align-items-center mb-3">
														<label className="label-comn-text-1 d-block">Primary Button Color</label>
														<div className="input-group  comn-input-style-2">
															<div className="input-group-prepend">
																<input type="color" name="primarybuttonColor" className="input-group-text" {...formAttr(runform, "primarybuttonColor")} />
															</div>
															<input type="text" className="form-control comn-input-style" readOnly {...formAttr(runform, "primarybuttonColor")} />
														</div>
													</div>
													<div className="d-flex align-items-center mb-3">
														<label className="label-comn-text-1 d-block">Primary Text Color</label>
														<div className="input-group  comn-input-style-2">
															<div className="input-group-prepend">
																<input type="color" name="primarytextColor" className="input-group-text" {...formAttr(runform, "primarytextColor")} />
															</div>
															<input type="text" className="form-control comn-input-style" readOnly {...formAttr(runform, "primarytextColor")} />
														</div>
													</div>
													<div className="d-flex align-items-center mb-3">
														<label className="label-comn-text-1 d-block">Background Color</label>
														<div className="input-group  comn-input-style-2">
															<div className="input-group-prepend">
																<input type="color" className="input-group-text" name="backgroundcolor" {...formAttr(runform, "backgroundcolor")} />
															</div>
															<input type="text" {...formAttr(runform, "backgroundcolor")} readOnly className="form-control comn-input-style" />
														</div>
													</div>
													<div className="d-flex align-items-center mb-3">
														<label className="label-comn-text-1 d-block">Action Text Color</label>
														<div className="input-group  comn-input-style-2">
															<div className="input-group-prepend">
																<input type="color" className="input-group-text" name="actionTextColor" {...formAttr(runform, "actionTextColor")} />
															</div>
															<input type="text" {...formAttr(runform, "actionTextColor")} readOnly className="form-control comn-input-style" />
														</div>
													</div>
													<div className="d-flex align-items-center mb-3">
														<label className="label-comn-text-1 d-block">Input Field Color</label>
														<div className="input-group  comn-input-style-2">
															<div className="input-group-prepend">
																<input type="color" className="input-group-text" name="inputfieldColor" {...formAttr(runform, "inputfieldColor")} />
															</div>
															<input type="text" {...formAttr(runform, "inputfieldColor")} readOnly className="form-control comn-input-style" />
														</div>
													</div>
												</div>
												<div className="col-12 mb-3">
													<div className="border-top pt-3">
														<div className="img-emded-tabs">
															<Tab.Container id="left-tabs-example" defaultActiveKey="image">
																<Nav variant="pills">
																	<Nav.Item>
																		<Nav.Link eventKey="image">Image</Nav.Link>
																	</Nav.Item>
																	<Nav.Item>
																		<Nav.Link eventKey="video">Embeded Link (Video)</Nav.Link>
																	</Nav.Item>
																</Nav>
																<Tab.Content>
																	<Tab.Pane eventKey="image">
																		<div className="upload-file-dash-new position-relative mt-3">
																			<div className="file-selecter text-center position-relative">
																				{isloader4 ? (
																					<button type="button" className="position-relative bg-white border-0 loader-btn-div">
																						<img className="" src={loader} alt="Loader" />
																					</button>
																				) : (
																					<div className="file-area position-relative">
																						{banner_image !== "" && (
																							<div className="upload-img-class">
																								<img src={banner_image} alt="" />
																							</div>
																						)}
																						<input type="file" name="bannerimg" accept="image/jpg,image/jpeg,image/gif,image/png,image/*" onChange={(e) => addBannerImage(e.target.files[0])} />
																						<div className="file-dummy">
																							<div className="file-upload-content">
																								<svg width="40" height="28" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg">
																									<path d="M31.6672 27.3334H10.0005C4.79113 27.3365 0.451999 23.3398 0.0277823 18.1477C-0.396434 12.9556 3.23638 8.30759 8.37718 7.46503C10.7434 3.26984 15.184 0.672546 20.0005 0.666598C23.0039 0.655246 25.9212 1.66886 28.2705 3.54003C30.5773 5.36979 32.2174 7.90832 32.9372 10.7634C37.2437 11.4251 40.3135 15.2926 39.9805 19.6369C39.6476 23.9812 36.0242 27.3357 31.6672 27.3334ZM20.0005 4.00001C16.3867 4.00428 13.055 5.95353 11.2805 9.10169L10.5005 10.5L8.91884 10.7584C5.50265 11.3307 3.09386 14.4239 3.37587 17.8762C3.65787 21.3285 6.53672 23.9897 10.0005 24H31.6672C34.2815 24.0027 36.4565 21.991 36.6575 19.3845C36.8585 16.7779 35.0176 14.4565 32.4338 14.0584L30.2405 13.725L29.7038 11.5717C28.596 7.11637 24.5915 3.99162 20.0005 4.00001ZM22.4172 20.6667H17.5838V15.6667H13.3338L20.0005 9.00003L26.6672 15.6667H22.4172V20.6667Z" fill="#6A6E83" />
																								</svg>
																							</div>
																							<span>
																								Upload an image <br /> or drop an image to upload
																							</span>
																						</div>
																					</div>
																				)}
																			</div>
																		</div>
																	</Tab.Pane>
																	<Tab.Pane eventKey="video">
																		<p className="mt-3">Must be in this format. https://www.youtube.com/embed/VIDEOIDHERE</p>
																		<div className="mt-3">
																			<textarea className="form-control h-auto comn-input-style" placeholder="Embed Link" rows="3" {...formAttr(runform, "bannermedia")} name="bannermedia" onChangeCapture={(e) => handleEmbededLink(e)} />
																		</div>
																	</Tab.Pane>
																</Tab.Content>
															</Tab.Container>
														</div>
													</div>
												</div>
												<div className="col-12 my-3 text-center">
													<div className="row">
														<div className="col-xxl-4 col-md-5 col-6">
															{isloader ? (
																<button type="button" className="btn-comn-class w-100 loader-btn-div">
																	<img className="" src={loader} alt="Loader" />
																</button>
															) : (
																<button type="submit" className="btn-comn-class w-100">
																	Update
																</button>
															)}
														</div>
														<div className="col-xxl-4 col-md-5 col-6">
															<button type="button" className="btn-comn-class w-100" onClick={() => handlePreview(runform)}>
																Preview
															</button>
														</div>
													</div>
												</div>
											</form>
										</div>
									)}
								</Formik>
							</div>
							<div className="detail-box-class p-0">
								<div className="detail-box-head">Embed Iframe in your site</div>
								<div className="detail-box-form">
									<form className="row">
										<div className="col-12 mb-3">
											<textarea className="form-control h-auto comn-input-style" value={`<iframe src="${IFREM_URL}/home/${id}" width="100vw" height="1900vh"></iframe>`} rows="3" />
										</div>
										<div className="col-xxl-4 col-md-5 col-6 my-3 text-center">
											<button type="button" className="btn-comn-class w-100" onClick={() => copyToClipboard(`<iframe src="${IFREM_URL}/home/${id}" width="100vw" height="1900vh"></iframe>`)}>
												Copy
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
						<div className="col-xxl-6">
							<div className="detail-box-class p-0">
								<div className="detail-box-head">Page Preview</div>
								<div className="land-preview-section">
									<IframeReload key={random} src={iframeUrl} id="iframePreview" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
