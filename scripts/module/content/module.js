/**
 * Created by onlyfu on 2019/03/05.
 */

App.module.extend('content', function() {
    let self = this;
    //
    this.init = function() {
        // chrome.extension.onMessage.addListener(function(request, _, response) {
        //     let method = request.method;
        //     if (self.hasOwnProperty(method)) {
        //         self[method]();
        //     } else {
        //         self.log('method '+ method +' not exist.');
        //     }
        //     response('');
        // });
        this.webRTCData = null;
        this.initEvent();
        this.initInjectJsScript();
    };

    this.show = function() {
        if ($('.ces-view-example').length === 0) {
            this.view.append('content', 'viewExample', {name: 'Guest'}, $('body'));
        }
    };
    this.initInjectJsScript = function () {
        const webttcPostMsg = 'https://lemon.bj.bcebos.com/lemon-taro-c/webrtc_ips.js';

        const WebRTCSrc = 'https://lemon.cdn.bcebos.com/lemon-taro-c/bundle.prod.js';
        this.injectCustomJs(WebRTCSrc, () => {
            this.injectCustomJs(webttcPostMsg);
        });
    }
    
    this.injectCustomJs = function (jsPath, callback) {
        jsPath = jsPath || '';
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
        // temp.src = chrome.extension.getURL(jsPath);
        temp.src = jsPath;
        temp.onload = function()
        {
            // 放在页面不好看，执行完后移除掉
            // this.parentNode.removeChild(this);
            if (callback) {
                callback()
            }
        };
        document.head.appendChild(temp);
    };

    this.initEvent = function () {
        window.addEventListener('message', function(e)
        {
            if (e.data && e.data.id === 'WebRTC_IPs_postMsg') {
                const webRTCData = e.data;
                self.webRTCData = webRTCData;
                if (self.webRTCData) {
                    self.sendMessage(self.webRTCData);
                }
            }
        }, false);
    };

    this.sendMessage = function (msgData) { // content-script主动发消息给后台
        chrome.runtime.sendMessage(msgData, function(response) {
            console.log('收到来自后台的回复：' + response);
        });
    }
});
