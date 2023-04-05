import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import logo from "../../images/pricing-plans.png"

export default function UpgradePlanModal() {
    const navigate = useNavigate()
    const [show, setshow] = useState(true);
    return (
        <>
            {show && <Modal dialogClassName="modal-dialog modal-dialog-centered modal-cust-main-cmn modal-md" show={show} onHide={() => setshow(false)}>
                <Modal.Header closeButton className="border-0 pb-0">
                    
                </Modal.Header>
                <Modal.Body className='pt-0'>
                    <div className="text-center connect-to-store p-2">
                        <div className='mb-4'>
                            <img src={logo} alt="logo" />
                        </div>
                        <h5 className='mb-2'>Please Choose Your Plan</h5>
                        <p className='mb-4'>To continue sending Text/Email campaigns, Kindly choose your plan</p>
                        <div className="row">
                            <div className="col-6">
                                <button type="button" className="light-gray w-100" onClick={() => setshow(false)}>
                                    Not now
                                </button>
                            </div>
                            <div className="col-6">
                                <button type="button" className="btn-comn-class w-100" onClick={() => navigate("/settings")}>
                                    View plans
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            }
        </>
    )
}