import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import { errorContainer, formAttr } from "../../const";
import { Formik } from "formik";
import * as Yup from "yup";

export default function StripeModal(props) {
	const runforms = useRef();
	return (
		<>
			<Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={props.stripemodal} onHide={props.setstripemodal}>
				<Modal.Header closeButton className="border-0">
					<h5>Stripe</h5>
				</Modal.Header>
				<Modal.Body>
					<div className="text-center connect-to-store p-2">
						<Formik
							innerRef={runforms}
							enableReinitialize
							initialValues={{
								access_token: props.stripedata ? props.stripedata.access_token : "",
								secretkey: props.stripedata ? props.stripedata.secret_key : "",
							}}
							validationSchema={Yup.object({
								access_token: Yup.string().required("Key is required"),
								secretkey: Yup.string().required("Key is required"),
							})}
							onSubmit={async (formData, { resetForm }) => props.handleStripeConnect(formData, resetForm)}
						>
							{(runform) => (
								<form className="row text-start" onSubmit={runform.handleSubmit}>
									<div className="col-12">
										<bdi className="position-relative">
											<input className="form-control comn-input-style pe-5" type="text" placeholder="Publishable Key" name="access_token" {...formAttr(runform, "access_token")} />
										</bdi>
									</div>
									<div className="ms-3">{errorContainer(runform, "access_token")}</div>
									<div className="col-12 mt-3">
										<bdi className="position-relative">
											<input className="form-control comn-input-style pe-5" type="text" placeholder="Secret Key" name="secretkey" {...formAttr(runform, "secretkey")} />
										</bdi>
									</div>
									<div className="ms-3">{errorContainer(runform, "secretkey")}</div>
									<div className="col-12 my-3">
										<div className="text-center">
											<p className="mb-0 btm-login-link">
												follow this{" "}
												<a target="_blank" href="https://stripe.com/docs/keys" rel="noreferrer">
													{" "}
													documentation{" "}
												</a>
												to see how to setup store
											</p>
										</div>
									</div>
									<div className="col-12">
										<div className="text-center">
											<button className="btn-comn-class" type="submit">
												Continue
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
