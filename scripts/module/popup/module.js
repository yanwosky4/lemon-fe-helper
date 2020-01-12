/**
 * Created by onlyfu on 2019/03/05.
 */
App.module.extend('popup', function() {
    //
    let self = this;

    this.init = function() {
        // chrome.extension.onMessage.addListener(function(request, _, response) {
        //     self.showQRCodeView();
        //     response('');
        // });
        this.setQRCodeHandler();
    };
    this.setQRCodeHandler = function () {
        this.getCurrentUrlPromise().then(url => {
            self.showQRCodeView(url);
        });
    };
    this.showQRCodeView = function (url) {
        $('#qrcode-img-container').qrcode({
            render: "table", //table方式
            width: 200, //宽度
            height:200, //高度
            text: url //任意内容
        });
        const inputVal = $('#qrcode-text-container').val();
        if (inputVal !== url) {
            $('#qrcode-text-container').val(url);
        }
    };
    this.getCurrentUrlPromise = function () {
        return new Promise(function(resolve, reject) {
            chrome.tabs.getSelected(null, function (tab) {
                resolve(tab.url)
            });
        })
    }
});
