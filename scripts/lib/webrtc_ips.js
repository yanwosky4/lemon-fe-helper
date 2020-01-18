if (WebRTC_IPs) {
	const postMsg = {
		id: 'WebRTC_IPs_postMsg'
	}
	const ipv4Promise = WebRTC_IPs.getIPv4();
	ipv4Promise.then(value => {
		postMsg.ipv4 = value;
		window.postMessage(postMsg, '*');
	});
};
