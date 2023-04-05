import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PostApi } from "../../APIService";
import { API_Path } from "../../const";

export default function NotificationsTab() {
	const [email_remainder, setemail_remainder] = useState(false);
	const [payment_decline, setpayment_decline] = useState(false);
	const [change_customerlist, setchange_customerlist] = useState(false);

	useEffect(() => {
		getNotification();
	}, []);

	const getNotification = () => {
		const getNotificationPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getactivitynotification)));
		getNotificationPromise.then((res) => {
			if (res.status === 200) {
				setemail_remainder(res.data.data.activity_notification[0].email_remainder);
				setpayment_decline(res.data.data.activity_notification[0].payment_decline);
				setchange_customerlist(res.data.data.activity_notification[0].change_customerlist);
			}
		});
	};

	const EmailHandleactivity = (value) => {
		setemail_remainder(value);
		handleactivity(value, payment_decline, change_customerlist);
	};

	const PaymentHandleactivity = (value) => {
		setpayment_decline(value);
		handleactivity(email_remainder, value, change_customerlist);
	};

	const customerHandleactivity = (value) => {
		setchange_customerlist(value);
		handleactivity(email_remainder, payment_decline, value);
	};

	const handleactivity = (email_remainder, payment_decline, change_customerlist) => {
		let data = { activity_notification: [{ email_remainder: email_remainder, payment_decline: payment_decline, change_customerlist: change_customerlist }] };
		const activitynotificationPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.updateactivitynotification, data)));
		activitynotificationPromise.then((res) => {
			if (res.status === 200) {
				toast.success(res.data.message);
			} else {
				toast.error(res.data.message);
			}
		});
	};

	return (
		<>
			<div className="login-side-main-inner-white set-chpwd-box p-0">
				<div className="text-center p-4">
					<h1>Notifications</h1>
				</div>
				<form>
					<div className="notify-status pb-4">
						<div className="set-noti-part p-4">
							<h5>Activity</h5>
							<div className="row">
								<div className="col-12 my-2">
									<div className="form-check form-switch row align-items-center">
										<input className="form-check-input col-1" name="set_not1" type="checkbox" checked={email_remainder} id="set_not1" onChange={(e) => EmailHandleactivity(e.target.checked)} />
										<label className="form-check-label ms-2 col-11" htmlFor="set_not1">
											Email reminders for subscription updates
										</label>
									</div>
								</div>
								<div className="col-12 my-2">
									<div className="form-check form-switch row align-items-center">
										<input className="form-check-input col-1" name="set_not2" type="checkbox" checked={payment_decline} id="set_not2" onChange={(e) => PaymentHandleactivity(e.target.checked)} />
										<label className="form-check-label ms-2 col-11" htmlFor="set_not2">
											When a payment is declined for the store owner and subscription
										</label>
									</div>
								</div>
								<div className="col-12 my-2">
									<div className="form-check form-switch row align-items-center">
										<input className="form-check-input col-1" name="set_not3" type="checkbox" checked={change_customerlist} id="set_not3" onChange={(e) => customerHandleactivity(e.target.checked)} />
										<label className="form-check-label ms-2 col-11" htmlFor="set_not3">
											When the customer list has changed
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}
