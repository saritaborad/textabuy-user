import React, { useState, useContext, useEffect } from "react";
import UserLayout from "../Components/User/UserLayout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLocation } from "react-router-dom";
import { API_Path } from "../const";
import { PostApi } from "../APIService";
import { toast } from "react-toastify";
import Context from "../contexts/context";
import { useRef } from "react";

let slider1, slider2;

export default function InventoryDetail() {
	const location = useLocation();
	const context = useContext(Context);
	const [nav1, setnav1] = useState(null);
	const [nav2, setnav2] = useState(null);
	const [inventory_id, setinventory_id] = useState("");
	const [Inventory_details, setInventory_details] = useState([]);
	const [selected_qty, setselected_qty] = useState("");

	useEffect(() => {
		setinventory_id(location?.state?.id);
		setnav1(slider1);
		setnav2(slider2);
		if (location?.state?.id && context.login_user_id) get_Inventory_details(location?.state?.id, context.login_user_id);
	}, [location?.state?.id, context.login_user_id]);

	const sliderbig = {
		slidesToShow: 1,
		swipeToSlide: true,
		focusOnSelect: true,
		dots: false,
		autoplay: true,
	};

	const get_Inventory_details = (id, userId) => {
		let data = {
			userid: userId,
			productId: id,
		};

		const getInventoryDetailDataPromise = new Promise((resolve, reject) => {
			resolve(PostApi(API_Path.getInventoryById, data));
		});
		getInventoryDetailDataPromise.then((res) => {
			if (res.status === 200) {
				setInventory_details(res.data.data);
			} else {
				toast.error(res.message);
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
								<h1 className="mb-0">Inventory Preview</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="detail-box-class">
								<div className="row">
									<div className="col-lg-5">
										<Slider {...sliderbig}>
											{Inventory_details.data2 &&
												Inventory_details.data2?.map((item, i) => {
													return (
														<div key={i}>
															<img src={item.image} className="img-fluid w-100" alt="Product View" />
														</div>
													);
												})}
										</Slider>
									</div>
									<div className="col-lg-7 mt-5 mt-lg-0">
										<div className="product-detail-head">
											<div className="product-head-info py-3">
												<span className="d-block mb-2">{Inventory_details && Inventory_details.productTitle}</span>
												<span>${Inventory_details.data1 && Inventory_details.data1[0].price}</span>
											</div>
										</div>
										{Inventory_details?.colors?.length > 0 && (
											<div className="product-color mb-3">
												<span className="d-block pro-info-ttl">Select Color:</span>
												<ul className="size-btn d-flex ">
													{Inventory_details?.colors?.map((l, i) => {
														return (
															<li key={i} value={l} className="me-2 pro-size-radio ">
																<input type="radio" className="btn-check " name="btnradio1" id={"color-" + i} autoComplete="off" value={l} />
																<label className="btn btn-outline-primary" style={{ backgroundColor: l }} htmlFor={"color-" + i}></label>
															</li>
														);
													})}
												</ul>
											</div>
										)}

										{Inventory_details?.sizes?.length > 0 && (
											<div className="my-3">
												<div className="iner-pro-title d-flex align-items-center">
													<span className="pro-info-ttl">Select Size</span>
												</div>
												<div className="btn-group" role="group" aria-label="Basic radio toggle button group">
													<ul className="size-btn d-flex ">
														{Inventory_details?.sizes?.map((l, i) => {
															return (
																<li key={i} value={l} className="me-2 pro-size-radio ">
																	<input type="radio" className="btn-check " name="btnradio2" id={"size-" + i} autoComplete="off" value={l} />
																	<label className="btn btn-outline-primary" htmlFor={"size-" + i}>
																		{l}
																	</label>
																</li>
															);
														})}
													</ul>
												</div>
											</div>
										)}
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
