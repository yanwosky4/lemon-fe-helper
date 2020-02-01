/**
 * h5ProjectConfig: lemon-fe-helper-h5-project-config
 *  appName: 项目名称
 *  branchName: 分支名称
 *  userName: 用户名称
 */

const reposBaseUrlMap = { // 不同项目仓库的baseUrl
    'lemon-smart-prg' : 'http://icode.baidu.com/repos/baidu/ebiz'
}

new Vue({
    el: '#app',
    data: {
        qrcodeValue: '',
        bg: null,
        ipAddress: '加载中...',
        h5ProjectConfig: null
    },
    methods: {
        initData() {
            this.$Message.config({
                top: 10,
                duration: 1
            });
            const bg = chrome.extension.getBackgroundPage();
            this.bg = bg;
            this.getCurrentUrlPromise().then(url => {
                this.qrcodeValue = url;
            });
            this.ipAddress = '加载中...';
            this.getIpAddressPromise().then(ipv4 => {
                this.ipAddress = ipv4;
            }).catch(e => {
                this.ipAddress = '获取ip失败，请刷新页面重试';
            })
        },
        initEvent() {
        },
        getCurrentUrlPromise() {
            return new Promise(function(resolve, reject) {
                chrome.tabs.getSelected(null, function (tab) {
                    resolve(tab.url)
                });
            });
        },
        showQRCodeView(url) {
            $('#qrcode-img-container').html('');
            $('#qrcode-img-container').qrcode({
                render: "canvas", //默认: table方式
                width: 200, //宽度
                height:200, //高度
                text: url //任意内容
            });
        },
        openJsonParseTabHandler() { // 点击json解析的处理事件
            const newURL = "http://www.bejson.com/webinterface.html";
            chrome.tabs.create({ url: newURL });
        },
        copyIpHandler() {
            this.copyText(this.ipAddress);
        },
        getIpAddressPromise() {
            const self = this;
            return new Promise(function (resolve, reject) {
                let ipv4 = self.bg.App.module.background.getIPv4Address();
                if (ipv4) {
                    resolve(ipv4);
                } else {
                    setTimeout(() => {
                        ipv4 = self.bg.App.module.background.getIPv4Address();
                        if (ipv4) {
                            resolve(ipv4);
                        } else {
                            reject(new Error('获取ip失败'));
                        }
                    }, 3000);
                }
            });
        },
        copyText(content) {
            $("#copy-textarea").val(content);
            const txt=document.getElementById("copy-textarea");
            txt.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            this.$Message.success('已复制 ^_^');
        },
        extensionNameHandler() { // extension标题的点击事件
            const newURL = "http://wiki.baidu.com/display/lemon/LemonFE";
            chrome.tabs.create({ url: newURL });
        },
        h5AppNameHandler() {
            const newURL = `${reposBaseUrlMap[this.h5AppName]}/${this.h5AppName}/tree/${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        }
    },
    mounted() {
        this.initData();
        this.initEvent();
    },
    watch: {
        qrcodeValue(value) {
            this.showQRCodeView(value);
        }
    },
    computed: {
        h5AppName() { // h5项目的名称
            // return (h5ProjectConfig && h5ProjectConfig.appName) || '';
            return 'lemon-smart-prg';
        },
        h5BranchName() { // h5分支名称
            // return (h5ProjectConfig && h5ProjectConfig.branchName) || '';
            return 'master'
        },
        h5UserName() { // h5分支名称
            // return (h5ProjectConfig && h5ProjectConfig.userName) || '';
            return 'sunyihong';
        }
    }
})