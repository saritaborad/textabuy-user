import React, { Component } from "react";
import UserLayout from "../Components/User/UserLayout";
import { Dropdown } from "react-bootstrap";
// import moment from 'moment';
import RtdDatatable from "../Components/DataTable/RtdDatatable";

export class SampleTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			AllSubAdminData: [],
			fname: "",
			lname: "",
			email: "",
			phone: "",
			password: "",
			status: false,
			statusEdit: false,
			editSubAdmin: "",
			newSubAdmindata: {},

			page: 1,
			show: true,
			sizePerPage: 10,
			totalSize: 10,

			pages: 1,
			myNumberOfRows: 10,

			id: "",
			filteredSubadminData: "",
			profileImage: "",
			profileEditImage: "",

			totalsubadmin: 1,
			option: {
				sizePerPage: 10,
				search: "",
				totalRecord: 0,
				page: 0,
				sort: "id",
				order: "ASC",
			},
			columns: [
				{
					value: "photo",
					label: "Photo",
					options: {
						filter: false,
						sort: false,
						customBodyRender: (data, i) => {
							//   return (
							//     <img
							//       src={data[i].photo}
							//       className="table-profile-image rounded"
							//       alt=""
							//       width="60px"
							//       height="60px"
							//     />
							//   );
						},
					},
				},
				{
					value: "firstname",
					label: "First Name",
					options: {
						filter: false,
						sort: false,
					},
				},
				{
					value: "email",
					label: "Email",
					options: {
						filter: false,
						sort: false,
					},
				},
				{
					value: "phone",
					label: "Phone",
					options: {
						filter: false,
						sort: false,
					},
				},
				{
					value: "joiningdate",
					label: "Joining Date",
					options: {
						filter: false,
						sort: false,
						customBodyRender: (data, i) => {
							//   return moment(data[i].joiningdate).format('DD/MM/YYYY');
						},
					},
				},
				{
					value: "status",
					label: "Status",
					options: {
						filter: false,
						sort: false,
						customBodyRender: (data, i) => {
							return (
								<div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
									<input
										className="form-check-input"
										type="checkbox"
										id="ActiveStatus"
										checked={data[i].status}
										// onChange={() => this.SubadminStatus(data[i]._id)}
									/>
								</div>
							);
						},
					},
				},
				{
					label: "Action",
					name: "_id",
					options: {
						filter: false,
						sort: false,
						empty: true,
						setCellHeaderProps: () => ({ className: "text-center" }),
						setCellProps: () => ({ className: "text-center" }),
						customBodyRender: (data, i) => {
							return (
								<div className="table-ed-drop">
									<Dropdown drop="left">
										<Dropdown.Toggle className="table-dropdown-btn" id="dropdown-basic">
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
												<path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
											</svg>
										</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={() => this.goto("/sub-admin-detail/" + data[i]._id)}>
												<bdi className="d-flex align-items-center">
													<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
														<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
														<path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
													</svg>
													<span className="ms-2">View Details</span>
												</bdi>
											</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</div>
							);
						},
					},
				},
			],
		};
		this.runforms = React.createRef();
	}

	tableCallBack = (option) => {
		this.setState({ option: option }, () => {
			this.getAllSubAdmin();
		});
	};
	render() {
		return (
			<UserLayout>
				<div className="content-wrapper-section">
					<div className="container-fluid">
						<div className="row">
							<div className="col-12">
								<div className="comn-table-black-bg">
									<div className="mt-3">
										<RtdDatatable option={this.state.option} columns={this.state.columns} data={this.state.data} tableCallBack={this.tableCallBack} />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</UserLayout>
		);
	}
}

export default SampleTable;
