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
        const connections = {};
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
        {
            // console.log('>>> 后台接受到消息: ', request, sender, sendResponse);
            sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
            if (request.id === 'WebRTC_IPs_postMsg') { // ip相关的信息
                self.webRTCData = request;
            } else if (request.id === 'inspectDomStyle') { // 被审查元素相关信息
                // 接收内容脚本的消息，并发送到devtool的消息
                if (sender.tab) {
                    const tabId = sender.tab.id;
                    if (tabId in connections) {
                        connections[tabId].postMessage(request);
                    } else {
                        console.error("Tab not found in connection list.");
                    }
                } else {
                    console.error("sender.tab not defined.");
                }
                return true;
            }
        });

        // 与 devtools 保持长连接
        chrome.runtime.onConnect.addListener(function (port) {
            const extensionListener = function (message, sender, sendResponse) {
                if (message.name == 'devtools') {
                    connections[message.tabId] = port;
                }
            };
            port.onMessage.addListener(extensionListener);

            port.onDisconnect.addListener(function(port) {
                port.onMessage.removeListener(extensionListener);
                const tabs = Object.keys(connections);
                for (let i = 0, len = tabs.length; i < len; i++) {
                    if (connections[tabs[i]] == port) {
                        delete connections[tabs[i]];
                        break;
                    }
                }
            });
        });

    };
    this.getIPv4Address = function () {
        if (!this.webRTCData) {
            return '';
        }
        return this.webRTCData.ipv4 || '';
    }
});
