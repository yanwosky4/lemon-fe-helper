/**
 * @author yanwosky4@gmail.com
 */

const dictumList = [
    'Beautiful is better than ugly.(优美胜于丑陋)',
    'Explicit is better than implicit.(明了胜于晦涩)',
    'Simple is better than complex.(简洁胜于复杂)',
    'Complex is better than complicated.(复杂胜于凌乱-如果复杂不可避免)',
    'Flat is better than nested.(扁平胜于嵌套)',
    'Sparse is better than dense.(间隔胜于紧凑)',
    'Readability counts.(可读性很重要)',
    `Special cases aren't special enough to break the rules.Although practicality beats purity(即便假借 特例 的实用性之名，也不可违背这些规则-这些规则至高无上)`,
    'Errors should never pass silently(不要包容所有错误)',
    'Now is better than never.Although never is often better than right now.(做也许好过不做，但不假思索就动手还不如不做)',
    `If the implementation is hard to explain, it's a bad idea.(做也许好过不做，但不假思索就动手还不如不做)`,
    `Namespaces are one honking great idea.(命名空间是一种绝妙的理念)`,
    `There is only one heroism in the world: to see the world as it is and to love it.(世界上只有一种真正的英雄主义，那就是在认清生活的本质后，依然热爱生活)`,
    `There is only one heroism in the world: to see the world as it is and goodness.(世界上只有一种真正的英雄主义，那就是在认清生活的本质后，依然善良如初-me)`
];

App.module.extend('content', function() {
    let self = this;
    //
    this.init = function() {
        const dictItem = this.getRandomDictItem();
        console.log('\n', dictItem.toString());
        this.webRTCData = null;
        this.initEvent();
        this.initInjectJsScript();
    };

    this.getRandomDictItem = function() {
        const dictLength = dictumList.length;
        let dictIndex = Math.floor(Math.random() * dictumList.length) % dictLength;
        return dictumList[dictIndex];
    }

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
            } else if (e.data && e.data.id === 'inspectDomStyle') {
                if (e.data) {
                    self.sendMessage(e.data);
                }
            } else if (e.data && e.data.id === 'RESPONSE_CURRENT_PAGE_EXTENSION_CONFIG') {
                if (e.data) {
                    self.sendMessage(e.data);
                }
            }
        }, false);
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
        {
            if(request.id == 'REQUEST_CURRENT_PAGE_EXTENSION_CONFIG') {
                window.postMessage({id: request.id}, '*');
            }
            sendResponse('成功接受消息');
        });
    };

    this.sendMessage = function (msgData) { // content-script主动发消息给后台
        chrome.runtime.sendMessage(msgData, function(response) {
            // console.log('收到来自后台的回复：' + response);
        });
    }
});
