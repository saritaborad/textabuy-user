import React, { useContext, useEffect, useState } from "react";
import UserLayout from "../Components/User/UserLayout";
import Email from "../images/email-notification.png";
import { Dropdown } from "react-bootstrap";
import { API_Path } from "../const";
import { PostApi } from "../APIService";
import Context from "../contexts/context";
import moment from "moment";

export default function Notifications() {
	const context = useContext(Context);
	const [notificationData, setnotificationData] = useState([]);
	const [id, setid] = useState("");

	useEffect(() => {
		setid(context.login_user_id);
	}, [context.login_user_id]);

	useEffect(() => {
		getNotification(context.login_user_id);
	}, [id]);

	const getNotification = (id) => {
		let data = { type: "user", userid: id };
		const getNotificationPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getNotification, data)));
		getNotificationPromise.then((res) => {
			if (res.status === 200) {
				setnotificationData(res.data.data.notification);
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
								<h1 className="mb-0">Notifications</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="set-chpwd-box">
								{notificationData &&
									notificationData.map((item, i) => {
										return (
											<div key={i} className="notification-comn-box mb-3">
												<div className="position-relative p-md-3 p-0 unseen-notification">
													<img src={Email} alt="Email notification" />
												</div>
												<div className="py-3">
													<h5>{item.subject}</h5>
													<span>{item.email}</span>
													<p>{item.description}</p>
												</div>
												<div className="ms-auto notify-rgt-side">
													<div className="p-2">
														<Dropdown drop="left">
															<Dropdown.Toggle className="table-dropdown-btn">
																<i className="bi bi-three-dots-vertical"></i>
															</Dropdown.Toggle>
															<Dropdown.Menu>
																<Dropdown.Item>
																	<bdi className="d-flex align-items-center">Delete</bdi>
																</Dropdown.Item>
															</Dropdown.Menu>
														</Dropdown>
													</div>
													<div className="notify-date px-2">
														<span>{moment(item.date).format("DD/MM")}</span>
													</div>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
