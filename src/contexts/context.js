import React, { createContext, useEffect, useState } from "react";
import { PostApi } from "../APIService";
import { API_Path } from "../const";
const Context = createContext("");

export const Rolecontext = ({ children }) => {
	const [socket, setsocket] = useState("");
	const [contact_no, setcontact_no] = useState("");
	const [landing_page_id, set_landing_page_id] = useState("");
	const [userDetail, setlogin_user_details] = useState("");
	const [login_user_id, set_login_user_id] = useState("");

	const onContactChange = (contact_no) => {
		setcontact_no(contact_no);
	};

	const socketConnection = (socket) => {
		setsocket(socket);
	};

	useEffect(() => {
		let token = localStorage.getItem("user-token");
		if (token !== null) {
			const objectLength = Object.keys(userDetail).length;
			if (objectLength === 0) {
				getProfileData();
			}
		}
	}, [userDetail]);

	const getProfileData = () => {
		const getProfileDataPromise = new Promise((resolve, reject) => resolve(PostApi(API_Path.getProfile)));
		getProfileDataPromise.then((res) => {
			if (res.status === 200) {
				setlogin_user_details(res.data.data.user);
			}
		});
	};

	useEffect(() => {
		if (landing_page_id === "" || login_user_id === "") {
			lading_page_id_change();
		}
	}, [landing_page_id, login_user_id]);

	const lading_page_id_change = async () => {
		let token = localStorage.getItem("user-token");
		if (token !== null) {
			let user_landing_page_id = await parseJwt(token);
			set_landing_page_id(user_landing_page_id.landingpageid);
			set_login_user_id(user_landing_page_id.id);
		}
	};

	const parseJwt = (token) => {
		return new Promise((resolve, reject) => {
			var base64Url = token?.split(".")[1];
			var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
			var jsonPayload = decodeURIComponent(
				window
					.atob(base64)
					.split("")
					.map(function (c) {
						return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join("")
			);
			resolve(JSON.parse(jsonPayload));
		});
	};

	return (
		<Context.Provider
			value={{
				...{
					socket,
					userDetail,
					contact_no,
					landing_page_id,
					login_user_id,
				},
				onContactChange,
				socketConnection,
				parseJwt,
				set_landing_page_id,
				setlogin_user_details,
				set_login_user_id,
			}}
		>
			{children}
		</Context.Provider>
	);
};

export default Context;
