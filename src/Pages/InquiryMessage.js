import React, { useState, useEffect, useContext } from "react";
import UserLayout from "../Components/User/UserLayout";
import Bluetick from "../images/blue-tick.svg";
import Send from "../images/Send Icon.svg";
import { ApiBaseUrl, API_Path, LandingPageURL } from "../const";
import { PostApi } from "../APIService";
import { io } from "socket.io-client";
import moment from "moment";
import { useLocation } from "react-router";
import Context from "../contexts/context";

let msgItems = [];

export default function InquiryMessage() {
	const context = useContext(Context);
	const location = useLocation();
	const [id, setid] = useState("");
	const [status, setstatus] = useState();
	const [supportData, setsupportData] = useState("");
	const [message, setmessage] = useState("");
	const [MessageArr, setMessageArr] = useState([]);
	const [senderid, setsenderid] = useState("");

	useEffect(() => {
		if (location?.state?.id !== undefined) {
			setid(location.state.id);
			setstatus(location.state.status);
		} else {
			window.location.href = `${LandingPageURL}/dashboard`;
		}
		setsenderid(context.login_user_id);
	}, [location?.state?.id, context.login_user_id]);

	useEffect(() => {
		getChatById(id);
		getSupportById(id);
	}, [id]);

	useEffect(() => {
		msgItems = [];
		let socket = io(ApiBaseUrl);
		setMessageArr([]);
		if (socket !== "") {
			context.socketConnection(socket);
			socket.emit("connect_user", { senderid: senderid, role: 0 });
			socket.on("getdata", (data) => {
				let recievedData = { msg: data.msg, direction: "admin", time: new Date() };
				msgItems.push(recievedData);
				loadMessages(msgItems);
			});
		}
	}, []);

	const loadMessages = (msgItems) => {
		setMessageArr(msgItems);
	};

	const getChatById = (id) => {
		const getSupportByIdPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getChatById, { inquiryid: id })));
		getSupportByIdPromise.then((res) => {
			if (res.status === 200) {
				res.data.data.map((item) => {
					let sendData = { msg: item.msg, direction: item.direction, time: item.time };
					return msgItems.push(sendData);
				});
				loadMessages(msgItems);
			}
		});
	};

	const getSupportById = (id) => {
		const getSupportPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getSupportById, { id: id })));
		getSupportPromise.then((res) => {
			if (res.status === 200) {
				setsupportData(res.data.data);
			}
		});
	};

	const handleMessageChange = (e) => [setmessage(e.target.value)];

	const handleSendMessage = () => {
		if (message !== "") {
			let sendData = { msg: message, direction: "user", time: new Date() };
			msgItems.push(sendData);
			setMessageArr(msgItems);
			setmessage("");
			context.socket && context.socket.emit("get_msg", { senderid: senderid, msg: message, direction: "user", role: 0, inquiryid: id, time: new Date() });
		}
	};

	const handleEnterSendMessages = (e) => {
		if (e.keyCode === 13) {
			handleSendMessage();
		}
	};
	return (
		<UserLayout>
			<div className="content-wrapper-section">
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="comn-title-main">
								<h1 className="mb-0">Inquiry Details</h1>
							</div>
						</div>
						<div className="col-12">
							<div className="set-chpwd-box p-0">
								<div className="message-top-part">
									<div className="d-md-flex d-block">
										<div className="msg-top-head">
											<h5>{supportData?.subject}</h5>
											<span>{moment(supportData?.date).format("MM/DD/YYYY hh:mm A")}</span>
											<div className="my-3">
												<p>{supportData?.description}</p>
											</div>
										</div>
									</div>
								</div>
								<div className="chat-main-part p-3">
									{MessageArr &&
										MessageArr.map((item, i) => {
											return (
												<>
													{item.direction === "user" && (
														<div className="chat-main-area py-3" key={i}>
															<div className="chat-box outbox-msg">
																<div className="chat-section">
																	<div className="message-part">
																		<p>{item.msg}</p>
																	</div>
																	<span>
																		<img src={Bluetick} className="me-2" alt="seen" />
																		{moment(item.time).format("hh:mm A")}
																	</span>
																</div>
															</div>
														</div>
													)}
													{item.direction === "admin" && (
														<div className="chat-main-area py-3" key={i}>
															<div className="chat-box inbox-msg">
																<div className="chat-section">
																	<div className="message-part">
																		<p>{item.msg}</p>
																	</div>
																	<span>{moment(item.time).format("hh:mm A")}</span>
																</div>
															</div>
														</div>
													)}
												</>
											);
										})}
								</div>
								{status !== "close" && (
									<div className="p-3">
										<div className="chat-section-right-msg-box">
											<div className="input-group">
												<input type="text" className="form-control border-0" placeholder="Send a message..." onChange={handleMessageChange} onKeyDown={(e) => handleEnterSendMessages(e)} value={message} name="message" />
												<span className="input-group-text p-0 border-0">
													<button type="button" className="send-btn border-0" onClick={handleSendMessage}>
														<span className="pe-2">send</span>
														<img src={Send} alt=">>" />
													</button>
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</UserLayout>
	);
}
