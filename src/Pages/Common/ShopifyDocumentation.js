import React from "react";
import Footer2 from "../../Components/User/Footer2";
import "../../Components/footer2.scss";
import Header from "../../Components/User/Header";

export default function ShopifyDocumentation() {
	return (
		<>
			<Header />
			<div className="docu-content-sec">
				<div className="container">
					<div className="row">
						<div className="col-12 document-div">
							<p>Hello there, This is a documentation to show you how can you generate Shopify Admin API key.</p>
							<p>
								Make sure you have to insert your{" "}
								<a href="http://myshopify.com" rel="noopener noreferrer" target="_blank">
									myshopify.com
								</a>{" "}
								domain.
							</p>
							<h2 className="mt-3">
								Where can I see{" "}
								<a href="http://myshopify.com" rel="noopener noreferrer" target="_blank">
									myshopify.com
								</a>{" "}
								store domain?
							</h2>
							<ul className="ps-3">
								<li>To see this domain just go to the admin login if your store.</li>
								<li>
									by using <code>&#123;store_url&#125;/admin</code> Once you go through this domain and just login to your Shopify admin panel.
								</li>
								<li>After successfully logged-in you will see shopify domain name in address bar of the browser.</li>
								<li>See Image attached 1.</li>
							</ul>
							<p className="text-center my-4">
								<img src="https://t7223638.p.clickup-attachments.com/t7223638/85dbddfb-8c63-4328-b7f6-f8e601dd499d/image.png" className="img-fluid" at="" />
							</p>
							<h2 className="mt-3">How can I generate Admin API access token from my shopify store?</h2>
							<ul className="mb-3">
								<li>Just login to the shopify admin dashboard. Make sure that you access to install/develop custom app.</li>
								<li>To generate Admin API Access token you have to install custom app from the shopify admin dashboard.</li>
								<li>Just go to the setting option which you will get from bottom left portion of shopify admin panel.</li>
								<li>
									By clicking on setting panel go to <strong>Apps and Sales Channel</strong> option of the menu of settings.
								</li>
								<li>Then click on Develop Apps.</li>
							</ul>
							<ul className="mb-3">
								<li>
									Once you Click on develop apps. You will see an option to <strong>Create an app</strong>.
								</li>
								<li>Go and enter the name of the app, and select developer, and proceed.</li>
								<li>Once you create an app. You will be redirected to that app screen configularion and scope. Where you can configure the app.</li>
								<li>we&#39;re going to create an api key for admin.</li>
								<li>
									so just select <strong>Configure Admin API Scope</strong>.
								</li>
							</ul>
							<ul className="mb-3">
								<li>
									Once you click on it you have to give the following scopes
									<ul className="read-property  mt-2">
										<li>
											<code>read_customers</code>
										</li>
										<li>
											<code>read_inventory</code>
										</li>
										<li>
											<code>read_product_listings</code>
										</li>
										<li>
											<code>read_products</code>
										</li>
										<li>
											<code>write_orders</code>
										</li>
										<li>
											<code>read_orders</code>
										</li>
									</ul>
								</li>
								<li>
									Select <strong>Webhook subscriptions</strong> And event version to 2023-01
								</li>
								<li>Save and Proceed</li>
								<li>
									Now got to the install App and reveal token and our token is <code>shpat_**************************</code>
								</li>
								<li>That&#39;s all</li>
							</ul>
							<p className="mt-3">Thanks.</p>
						</div>
					</div>
				</div>
			</div>
			<Footer2 />
		</>
	);
}
