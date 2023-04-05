import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../tablestyle.scss";

export default function RtdDatatable(props) {
	const [option, set_option] = useState(props.option);
	const [data, set_Data] = useState(props.data);
	const [columns, set_columns] = useState(props.columns);
	const [size_per_page, set_size_per_page] = useState([10, 25, 50, 100]);

	useEffect(() => {
		set_option(props.option);
		set_Data(props.data);
		set_columns(props.columns);
		set_size_per_page([10, 25, 50, 100]);
	}, [props.option, props.data, props.columns]);

	const tableCall = (e) => {
		let value = e.target.value;
		let name = e.target.name;
		let tmp_option = option;
		if (name === "search") {
			setTimeout(() => {
				tmp_option[name] = value;
				tmp_option["page"] = 0;
				set_option(tmp_option);
				props.tableCallBack(tmp_option);
			}, 1000);
		} else {
			if (value !== "") {
				tmp_option[name] = parseInt(value);
				tmp_option["page"] = 0;
				set_option(tmp_option);
				props.tableCallBack(tmp_option);
			}
		}
	};

	const sortHandler = (field) => {
		let tmp_option = option;
		if (field === tmp_option["sort"]) {
			tmp_option["order"] === "DESC" ? (tmp_option["order"] = "ASC") : (tmp_option["order"] = "DESC");
		} else {
			tmp_option["order"] = "ASC";
			tmp_option["sort"] = field;
		}
		set_option(tmp_option);
		props.tableCallBack(tmp_option);
	};

	const handlePageChange = (pageNumber) => {
		let tmp_option = option;
		tmp_option["page"] = pageNumber["selected"];
		set_option(tmp_option);
		props.tableCallBack(tmp_option);
	};

	return (
		option && (
			<div className="p-0 mb-3">
				<div className="table-responsive rtd-table-main-div mt-3">
					<table className="table mb-0">
						<thead>
							<tr>
								{columns?.map((column, i) => {
									return column.options["sort"] ? (
										<th key={i} onClick={() => sortHandler(column.value)}>
											{column.label}
											{column.value !== option["sort"] ? (
												<>
													<button type="button" className="border-0 bg-transparent p-0 sorting-top">
														<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M5 0.5L10 5.5H0L5 0.5Z" fill="#5E5873" />
														</svg>
													</button>
													<button type="button" className="border-0 bg-transparent p-0 sorting-bottom">
														<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
															<path d="M5 5.5L10 0.5H0L5 5.5Z" fill="#5E5873" />
														</svg>
													</button>
												</>
											) : column.value === option["sort"] && option["order"] === "ASC" ? (
												<button type="button" className="border-0 bg-transparent p-0 sorting-top">
													<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5 0.5L10 5.5H0L5 0.5Z" fill="#5E5873" />
													</svg>
												</button>
											) : (
												<button type="button" className="border-0 bg-transparent p-0 sorting-bottom">
													<svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
														<path d="M5 5.5L10 0.5H0L5 5.5Z" fill="#5E5873" />
													</svg>
												</button>
											)}
										</th>
									) : (
										<th key={i}>{column.label}</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{data?.length > 0 ? (
								data.map((val, i) => {
									return (
										<tr key={i}>
											{columns.map((col, index) => {
												return <td key={index}>{col.options.customBodyRender ? col.options.customBodyRender(data, i) : data[i][col.value]}</td>;
											})}
										</tr>
									);
								})
							) : (
								<tr className="p-md-5 p-3 m-md-5 text-center no-recode-row">
									<td colSpan={columns.length}>
										<p className="my-2">Sorry, no matching records found</p>
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
				<div className="row align-items-center custom-table-btm text-center">
					{data?.length > 0 && (
						<div className="col-sm-12 d-md-flex align-items-center">
							<div className="custom-table-page text-start">
								Showing {parseInt(option.page * option.sizePerPage + 1)} to {parseInt(option.page * option.sizePerPage + option.sizePerPage) > option.totalRecord ? option.totalRecord : parseInt(option.page * option.sizePerPage + option.sizePerPage)} of {option.totalRecord} entries
							</div>
							<div className="ms-auto d-sm-flex align-items-center mt-3 mt-md-0">
								<div className="me-3">
									<label className="d-flex align-items-center custom-select-label">
										Show
										<select name="sizePerPage" className="form-select mx-2" defaultValue={option.sizePerPage} onChange={tableCall}>
											{size_per_page.map((val, i) => {
												return (
													<option key={i} value={val}>
														{val}
													</option>
												);
											})}
										</select>
										entries
									</label>
								</div>
								<div className="pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center">
									<ReactPaginate
										className="pagination"
										pageClassName="page-item"
										activeClassName="active"
										breakLabel="..."
										breakLinkClassName="page-link"
										breakClassName="page-item"
										previousLabel={
											<span aria-hidden="true">
												<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left me-2">
													<polyline points="15 18 9 12 15 6"></polyline>
												</svg>
											</span>
										}
										previousClassName="page-item"
										nextLabel={
											<span aria-hidden="true">
												<svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-right ms-2">
													<polyline points="9 18 15 12 9 6"></polyline>
												</svg>
											</span>
										}
										nextClassName="page-item"
										pageLinkClassName="page-link"
										pageRangeDisplayed={2}
										onPageActive={option.page}
										pageCount={option.totalRecord / option.sizePerPage}
										renderOnZeroPageCount={null}
										onPageChange={handlePageChange.bind()}
										forcePage={option.page}
									/>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	);
}
