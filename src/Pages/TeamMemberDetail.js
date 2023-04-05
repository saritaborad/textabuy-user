import moment from "moment";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { toast } from 'react-toastify';
import { PostApi } from "../APIService";
import UserLayout from "../Components/User/UserLayout";
import { API_Path } from "../const";

export default function TeamMemberDetail() {
    const location = useLocation();
    const Navigate = useNavigate();
    const [teamMember_id, setteamMember_id] = useState('');
    const [teamMember_details, setteamMember_details] = useState('');
    const [delete_modal_show, setdelete_modal_show] = useState(false);

    useEffect(() => {
        setteamMember_id(location?.state?.id)
        get_teamMember_details(location?.state?.id);
    }, [location?.state?.id]);

    const get_teamMember_details = (id) => {
        const getteamMemberDetailDataPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.getTeamById, { id: id }));
        });
        getteamMemberDetailDataPromise.then((res) => {
            if (res.data.success) {
                setteamMember_details(res.data.data)
            } else {
                toast.error(res.message);
            }
        });
    };

    const delete_handleShow = () => {
        setdelete_modal_show(true)
    };

    const delete_handleClose = () => {
        setdelete_modal_show(false)
    };

    const onDeleteSelect = () => {
        delete_handleShow(teamMember_id);
    };

    const deleteTeamMember = (id) => {
        const deleteTeamMemberPromise = new Promise((resolve, reject) => {
            resolve(PostApi(API_Path.deleteTeam, { id: id }));
        });
        deleteTeamMemberPromise.then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message);
                delete_handleClose();
                Navigate('/team-members')
            } else {
                toast.error(res.data.message)
                delete_handleClose();
            }
        });
    };

    return (
        <UserLayout>
            <div className="content-wrapper-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="comn-title-main">
                                <h1 className="mb-0">Team Member Details</h1>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="detail-box-class">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex">
                                            <div className="sub-admin-photo">
                                                <span id="sub-admin-id">
                                                    <img src={teamMember_details.profile_img} alt="Profile" className="img-fluid" />
                                                </span>
                                            </div>
                                            <div className="ms-3 sub-admin-detail">
                                                <h3>{teamMember_details.name}</h3>
                                                <div className="form-check form-switch d-inline-flex align-items-center justify-content-center">
                                                    <input className="form-check-input" type="checkbox" id="Active1" defaultChecked={teamMember_details.status} />
                                                    <label className="form-check-label ms-2 active-class" htmlFor="Active1">
                                                        Active
                                                    </label>
                                                    <label className="form-check-label ms-2 inactive-class" htmlFor="Active1">
                                                        Deactivate
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-3">
                                        <div className="personal-detail-section">
                                            <h5>Personal Detail</h5>
                                            <div className="mb-3 mt-4 row">
                                                <bdi className="col-xxl-2 col-sm-4">Email Address :</bdi>
                                                <span id="SA-email" className="col-xxl-10 col-sm-8">{teamMember_details.email}</span>
                                            </div>
                                            <div className="mb-3 row">
                                                <bdi className="col-xxl-2 col-sm-4">Mobile Number :</bdi>
                                                <span className="col-xxl-10 col-sm-8" id="SA-phoneno">{teamMember_details.contact_no}</span>
                                            </div>
                                            <div className="mb-3 row">
                                                <bdi className="col-xxl-2 col-sm-4">Date Of Birth :</bdi>
                                                <span className="col-xxl-10 col-sm-8" id="SA-dob">{moment(teamMember_details.DOB).format('DD, MMM YYYY')}</span>
                                            </div>
                                            <div className="mb-3 row">
                                                <bdi className="col-xxl-2 col-sm-4">Age :</bdi>
                                                <span className="col-xxl-10 col-sm-8" id="SA-age">{teamMember_details.age}</span>
                                            </div>
                                            <div className="mb-3 row">
                                                <bdi className="col-xxl-2 col-sm-4">Address :</bdi>
                                                <span className="col-xxl-10 col-sm-8" id="SA-address">{teamMember_details.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="row mt-4">
                                            <div className="col-lg-2 col-md-3 col-6">
                                                <button type="button" className="btn-comn-class form-control w-100" onClick={() => Navigate("/edit-team-member/", { state: { id: teamMember_id } })}>
                                                    Edit
                                                </button>
                                            </div>
                                            <div className="col-lg-2 col-md-3 col-6">
                                                <button type="button" className="btn-comn-class form-control btn-red-bg w-100" onClick={() => onDeleteSelect()}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {delete_modal_show && <Modal
                        dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn delted-modal"
                        show={delete_modal_show}
                        onHide={delete_handleClose}
                    >
                        <Modal.Header closeButton className="border-0"></Modal.Header>
                        <Modal.Body>
                            <div className="text-center dltd-text-info">
                                <svg
                                    width="62"
                                    height="78"
                                    viewBox="0 0 62 78"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M40.186 32.37L30.9993 41.5567L21.7694 32.37L15.6593 38.48L24.8894 47.6667L15.7027 56.8533L21.8127 62.9633L30.9993 53.7767L40.186 62.9633L46.296 56.8533L37.1093 47.6667L46.296 38.48L40.186 32.37ZM46.166 4.33333L41.8327 0H20.166L15.8327 4.33333H0.666016V13H61.3327V4.33333H46.166ZM4.99935 69.3333C4.99935 74.1 8.89935 78 13.666 78H48.3327C53.0993 78 56.9994 74.1 56.9994 69.3333V17.3333H4.99935V69.3333ZM13.666 26H48.3327V69.3333H13.666V26Z"
                                        fill="#EB5757"
                                    />
                                </svg>
                                <span className="modal-title d-block">Are You Sure?</span>
                                <p>Do you really want to delete this List?</p>
                                <div className="row">
                                    <div className="col-6">
                                        <button
                                            type="button"
                                            className="btn-comn-class w-100"
                                            onClick={() => deleteTeamMember(teamMember_id)}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            type="button"
                                            className="btn-comn-class btn-red-bg w-100"
                                            onClick={delete_handleClose}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>}
                </div>
            </div>
        </UserLayout>
    )
}