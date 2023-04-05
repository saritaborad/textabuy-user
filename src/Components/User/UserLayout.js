import React from "react";
import Header from "./Header";
import NavSidebar from "./NavSidebar";
import Footer from "./Footer";

export default function UserLayout(props) {
	const removeLayer = () => {
		document.getElementById("root").classList.remove("dash-main-class-add");
	};
	return (
		<>
			<div id="dash-wrapper" className="dash-wrapper admn-cust-style-new">
				<main>
					<Header />
					<NavSidebar />
					{props.children}
					<Footer />
					<div className="overlay toggle-icon-main" onClick={removeLayer}></div>
				</main>
			</div>
		</>
	);
}
