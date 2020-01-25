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
        const bg = chrome.extension.getBackgroundPage();
        this.bg = bg;

        this.setQRCodeHandler();
        this.showAddressView();
    };
    this.setQRCodeHandler = function () {
        this.getCurrentUrlPromise().then(url => {
            self.showQRCodeView(url);
        });
        $('#qrcode-text-container').change(event => {
            const url = event.target.value;
            self.showQRCodeView(url);
        })
    };
    this.showQRCodeView = function (url) {
        $('#qrcode-img-container').html('');
        $('#qrcode-img-container').qrcode({
            render: "canvas", //table方式
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
    };
    // 点击json解析的处理事件
    this.openJsonParseTabHandler = function () {
        var newURL = "http://www.bejson.com/webinterface.html";
        chrome.tabs.create({ url: newURL });
    };
    this.showAddressView = function () {
        let ipv4 = self.bg.App.module.background.getIPv4Address();
        if (ipv4) {
            $('#ip-address-txt').html(ipv4);
        } else {
            $('#ip-address-txt').html('加载中...');
            setTimeout(() => {
                ipv4 = self.bg.App.module.background.getIPv4Address();
                if (ipv4) {
                    $('#ip-address-txt').html(ipv4);
                } else {
                    $('#ip-address-txt').html('获取ip失败，请刷新页面重试');
                }
            }, 3000);
        }
    };
    this.copyText = function (content) {
        $("#copy-textarea").val(content);
        const txt=document.getElementById("copy-textarea");
        txt.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
    };
});
