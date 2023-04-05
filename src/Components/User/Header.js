import React, { useContext, useEffect, useState } from "react";
import Logo from "../../images/logo-main.svg";
import Profile from "../../images/profile.png";
import { useNavigate } from "react-router-dom";
import Context from "../../contexts/context";

export default function Header() {
	const context = useContext(Context);
	const Navigate = useNavigate();
	const [userDetail, set_userDetail] = useState("");

	useEffect(() => {
		set_userDetail(context.userDetail);
	}, [context.userDetail]);

	useEffect(() => {
		document.getElementById("idarrow").onclick = function () {
			document.getElementById("root").classList.toggle("dash-main-class-add");
		};
	}, []);

	const openUserinfo = () => {
		document.getElementById("user-detail").classList.toggle("active-user-info");
	};

	return (
		<header className="header-fix-top-cust">
			<nav className="navbar fixed-top">
				<ul className="d-flex align-items-center mr-auto align-items-center hdr-top-box">
					<li>
						<div className="hdr-logo-top text-xl-center d-flex align-items-center">
							<div id="idarrow" className="arrw-left-icon me-2 d-xl-none d-flex align-items-center justify-content-center fw-bold  ">
								<i className="bi bi-chevron-left d-flex align-items-center justify-content-center fw-bold"></i>
							</div>
							<a href="/user-panel/dashboard">
								<img src={Logo} className="img-fluid" alt="Text A Buy" />
							</a>
						</div>
					</li>
				</ul>
				<ul className="d-flex align-items-center hdr-rgt-part" id="user-detail">
					<li>
						<div className="hdr-top-box-inr d-md-none mx-2 ">
							<div>
								<div className="hdr-top-box-inr-icon">
									<i className="bi bi-search"></i>
								</div>
								<input type="search" className="form-control" name="searchbar" placeholder="Search" />
							</div>
						</div>
					</li>
					<li>
						<div className="hdr-notify-box d-flex align-items-center justify-content-center" onClick={() => Navigate("/notification")}>
							<svg xmlns="http://www.w3.org/2000/svg" width="17" height="21" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
								<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
							</svg>
							{userDetail?.userisread < userDetail?.notification_total && <div className="notification-no"></div>}
						</div>
					</li>
					<li>
						<div className="hdr-rgt-line mx-3"></div>
					</li>
					<li>
						<div className="hdr-profile-box d-flex align-items-center justify-content-center" onClick={() => Navigate("/myprofile")}>
							<div className="profile-pic">
								<img src={userDetail?.profile_img ? userDetail?.profile_img : Profile} alt="profile" className="profile-pic" />
							</div>
							<div className="profil-detail-section ms-2">
								<span>{userDetail?.fname ? userDetail?.fname : ""}</span>
								<div>
									<bdi>{userDetail?.lname ? userDetail?.lname : ""}</bdi>
								</div>
							</div>
						</div>
					</li>
				</ul>
				<div className="d-md-none ms-auto">
					<button type="button" className="border-0 bg-transparent p-0" onClick={openUserinfo}>
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
							<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
						</svg>
					</button>
				</div>
			</nav>
		</header>
	);
}
