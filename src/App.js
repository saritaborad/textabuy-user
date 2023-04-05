import React, { Component } from "react";
import RoutesMain from "./RoutesMain";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../src/Components/style.scss";
import "../src/Components/style2.scss";
import { ToastContainer } from "react-toastify";
import { Rolecontext } from "./contexts/context";

class App extends Component {
	render() {
		return (
			<>
				<Rolecontext>
					<ToastContainer autoClose={1000} theme="dark" position="bottom-left" />
					<RoutesMain />
				</Rolecontext>
			</>
		);
	}
}

export default App;
