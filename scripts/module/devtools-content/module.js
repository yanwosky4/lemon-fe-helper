/**
 * @author yanwosky4@gmail.com
 */

App.module.extend('devtools', function() {
    let self = this;
    //
    this.init = function() {
    };
    this.sendMessage = function (msgData) { // content-script主动发消息给后台
        chrome.runtime.sendMessage(msgData, function(response) {
            console.log('收到来自后台的回复：' + response);
        });
    }
});
