import React, { useState, useEffect } from "react";

export default function IframeReload(props) {
	const [iframeUrl, set_iframeUrl] = useState("");

	useEffect(() => {
		set_iframeUrl(props.src);
	}, [props]);

	return (
		<>
			<iframe key={props.random} src={iframeUrl} id={props.id} className="w-100 preview-sec" title="lading page" />
		</>
	);
}
