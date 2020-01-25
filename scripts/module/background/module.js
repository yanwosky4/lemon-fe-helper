/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('background', function() {
    let self = this;

    this.init = function() {
        this.webRTCData = null;
        this.initEvent();
    };
    this.initEvent = function () { // // 监听来自content-script的消息
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
        {
            console.log(request, sender, sendResponse);
            sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
            if (request.id === 'WebRTC_IPs_postMsg') {
                self.webRTCData = request;
            }
        });
    };
    this.getIPv4Address = function () {
        if (!this.webRTCData) {
            return '';
        }
        return this.webRTCData.ipv4 || '';
    }
});
