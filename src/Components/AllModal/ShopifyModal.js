import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import { errorContainer, formAttr } from "../../const";
import { Formik } from "formik";
import * as Yup from "yup";

export default function ShopifyModal(props) {
	const runforms = useRef();

	return (
		<>
			<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={props.shopifymodal} onHide={props.setshopifymodal}>
				<Modal.Header closeButton className="border-0">
					<h5>Shopify</h5>
				</Modal.Header>
				<Modal.Body>
					<div className="text-center connect-to-store p-2">
						<Formik
							innerRef={runforms}
							enableReinitialize
							initialValues={{
								storeUrl: props.shopifydata ? props.shopifydata.storeUrl : "",
								storefrontToken: props.shopifydata ? props.shopifydata.adminAccessToken : "",
							}}
							validationSchema={Yup.object({
								storeUrl: Yup.string().required("Store url is required"),
								storefrontToken: Yup.string().required("Storefront token is required"),
							})}
							onSubmit={async (formData, { resetForm }) => props.handleShopifyConnect(formData, resetForm)}
						>
							{(runform) => (
								<form className="row text-start" onSubmit={runform.handleSubmit}>
									<div className="col-12">
										<bdi className="position-relative">
											<input className="form-control comn-input-style pe-5" type="url" placeholder="Store url" name="storeUrl" {...formAttr(runform, "storeUrl")} />
										</bdi>
									</div>
									<div className="ms-3">{errorContainer(runform, "storeUrl")}</div>
									<div className="col-12 mt-3">
										<bdi className="position-relative">
											<input className="form-control comn-input-style pe-5" type="text" name="storefrontToken" placeholder="Admin API access token" {...formAttr(runform, "storefrontToken")} />
										</bdi>
									</div>
									<div className="ms-3">{errorContainer(runform, "storefrontToken")}</div>
									<div className="col-12 mt-3">
										<div className="text-center">
											<p className="mb-0 btm-login-link">
												follow this{" "}
												<a target="_blank" href="/shopify-documentation">
													{" "}
													documentation{" "}
												</a>
												to see how to setup store
											</p>
										</div>
									</div>
									<div className="col-12 mt-3">
										<div className="text-center">
											<button className="btn-comn-class" type="submit">
												Verify
											</button>
										</div>
									</div>
								</form>
							)}
						</Formik>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
}
