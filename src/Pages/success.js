import React from 'react';
import UserLayout from '../Components/User/UserLayout';
import PaidSuccess from '../images/Paid-Success.png';

export default function success() {
  return (
    <UserLayout>
      <div className="content-wrapper-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-5 col-sm-6">
              <div className="comn-title-main">
                <h1 className="mb-0">Order #0000ID Details</h1>
              </div>
            </div>
            <div className="col-md-7 col-sm-6 text-camp-rgt">
              <div className="crt-campaign-btn crt-in-btn ms-auto  my-2">
                <button className="btn-comn-class w-100">
                  Download Invoice
                </button>
              </div>
            </div>
            <div className="col-12">
              <div className="detail-box-class">
                <div className="thanks-txt-class d-flex align-items-center mb-3">
                  <div>
                    <h5>Thank You For Purchasing With Text A Buy</h5>
                    <span>Your Order is on the way.</span>
                    {/* ========= Paymnet Failed Text ============  */}

                    {/* <span className="paymnt-faild-txt">Payment Failed</span> */}
                  </div>
                  <div className="ms-auto paid-success-img">
                    <img src={PaidSuccess} alt="" />
                  </div>

                  {/* ======== Faild Img Icon ========= */}

                  {/* <div className="ms-auto paid-success-img">
                      <img src={PaidFailed} alt="" />
                    </div> */}
                </div>
                <div className="order-bill-info-sec p-3 position-relative">
                  <div className="paid-class">
                    <span>Paid</span>
                  </div>
                  <div className="row">
                    <div className="col-md-5 mb-3">
                      <div className="order-bill-inner-div">
                        <h5>Order Details</h5>
                        <div className="row">
                          <bdi className="col-xxl-4 col-xl-5 col-sm-4">
                            Vendor Name:
                          </bdi>
                          <span
                            id="SA-email"
                            className="col-xxl-8 col-xl-7 col-sm-8"
                          >
                            John Doe
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-4 col-xl-5 col-sm-4">
                            Order ID:
                          </bdi>
                          <span
                            id="SA-email"
                            className="col-xxl-8 col-xl-7 col-sm-8"
                          >
                            #0000ID
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-4 col-xl-5 col-sm-4">
                            Payment ID:
                          </bdi>
                          <span
                            id="SA-email"
                            className="col-xxl-8 col-xl-7 col-sm-8"
                          >
                            #72546789
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-4 col-xl-5 col-sm-4">
                            Plan Purchase Date:
                          </bdi>
                          <span
                            id="SA-email"
                            className="col-xxl-8 col-xl-7 col-sm-8"
                          >
                            July 20, 2022 @ 05:00 PM
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-4 col-xl-5 col-sm-4">
                            Paymant Mathod:
                          </bdi>
                          <span
                            id="SA-email"
                            className="col-xxl-8 col-xl-7 col-sm-8"
                          >
                            Credit Card (7983)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5 mb-3">
                      <div className="order-bill-inner-div">
                        <h5>Biling Information</h5>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">Name:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            John Doe
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">Address:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            4863 Clean Street
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">Email:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            johndoe12@gmail.com
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">City:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            Sutton
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">State:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            Greater London
                          </span>
                        </div>
                        <div className="row">
                          <bdi className="col-xxl-3 col-sm-4">Country:</bdi>
                          <span id="SA-email" className="col-xxl-9 col-sm-8">
                            United kingdom
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="thanks-txt-class mt-3">
                  <div>
                    <h5>Plan Information</h5>
                  </div>
                  <div className="plan-info-tabledetail p-3">
                    <div className="order-table table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <td>
                              <div>
                                <span>Plan Detail</span>
                                <bdi>Basic,$32 per month</bdi>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span>Plan #ID</span>
                                <bdi>#72546789</bdi>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span>Cost</span>
                                <bdi>$34.00</bdi>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span>Qty</span>
                                <bdi>x 1</bdi>
                              </div>
                            </td>
                            <td>
                              <div>
                                <span>Total</span>
                                <bdi>$37.00</bdi>
                              </div>
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td colSpan="3"></td>
                            <td>
                              <div className="order-label">
                                <span>Sub Total:</span>
                                <span>Pending:</span>
                                <span>Discount:</span>
                              </div>
                            </td>
                            <td>
                              <div className="order-amount">
                                <span>$37.00</span>
                                <span>-$11.00</span>
                                <span>-$0.00</span>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan="3"></td>
                            <td>
                              <div className="order-label order-comn-black">
                                <span>Order Total:</span>
                              </div>
                            </td>
                            <td>
                              <div className="order-amount">
                                <span className="total">$26.00</span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
