import React from "react";
import "../../Components/footer2.scss";
import { IFREM_URL } from "../../const";
import logo from "../../images/logo-main.svg";

export default function Footer2() {
	return (
		<footer className="mt-auto row pt-0">
			<div className="ftr-main-part">
				<div className="container">
					<div className="row">
						<div className="col-lg col-12 mb-md-4 mb-lg-0 pe-0">
							<div className="ftr-logo-part">
								<a href="/#home">
									<img src={logo} className="img-fluid" alt="Text A Buy" />
								</a>
							</div>
							<div className="py-3">
								<p>We help you create, promote and program seemless SMS marketing messages to your target audiences. We create a simple plug and play set up, in a set up that takes less than 15 minutes.</p>
							</div>
						</div>
						<div className="col-lg col-sm-4 col-6 mb-md-4 mb-lg-0 mb-3 pe-0 ps-lg-5">
							<div className="ftr-btm-menu">
								<span className="d-block">Quick Links</span>
								<ul>
									<li>
										<a target="_blank" href={`${IFREM_URL}/`} rel="noreferrer">
											Home
										</a>
									</li>
									<li>
										<a target="_blank" href={`${IFREM_URL}/#about-us`} rel="noreferrer">
											About Us
										</a>
									</li>
									<li>
										<a target="_blank" href={`${IFREM_URL}/#how-it-works`} rel="noreferrer">
											How It`s Work
										</a>
									</li>
									<li>
										<a target="_blank" href={`${IFREM_URL}/#contact-us`} rel="noreferrer">
											Contact Us
										</a>
									</li>
								</ul>
							</div>
						</div>
						<div className="col-lg col-sm-4 col-6 mb-md-4 mb-lg-0 mb-3 pe-0">
							<div className="ftr-btm-menu">
								<span className="d-block">Help</span>
								<ul>
									<li>
										<a target="_blank" href={`${IFREM_URL}/#privacy-policy`} rel="noreferrer">
											Privacy Policy
										</a>
									</li>
									<li>
										<a target="_blank" href={`${IFREM_URL}/#terms-of-use`} rel="noreferrer">
											Terms of Service
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="ftr-sub-part">
				<div className="container">
					<div className="d-md-flex d-block align-items-center text-center">
						<div className="mx-auto">
							<p className="mb-0">Copyright © 2022 - Created by Gowski Productions LLC.</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
