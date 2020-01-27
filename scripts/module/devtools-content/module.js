/**
 * Created by onlyfu on 2019/03/05.
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
