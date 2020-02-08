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

window.addEventListener('message', function(e) {
    if (e.data && e.data.id === 'REQUEST_CURRENT_PAGE_EXTENSION_CONFIG') {
        window.postMessage({id: 'RESPONSE_CURRENT_PAGE_EXTENSION_CONFIG', config: this['lemon-fe-helper-prefix-key-config']}, '*');
    }
}, false);
