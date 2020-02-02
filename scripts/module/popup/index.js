/**
 * h5ProjectConfig: lemon-fe-helper-h5-project-config
 *  appName: 项目名称
 *  branchName: 分支名称
 *  userName: 用户名称
 *  icafeId: 当前分支最后提交的icafeid
 */

const extraConfig = {
    'lemon-smart-prg': {
        reposBaseUrl: 'http://icode.baidu.com/repos/baidu/ebiz',
        agileBaseUrl: 'http://agile.baidu.com/#/builds/baidu/ebiz',
        preonlinePipelineName: 'preonlinePipeline',
        onlinePipelineName: 'onlinePipeline',
        jarvisUrl: 'http://jarvis.baidu-int.com/#/App/BaseInfo/10000/56/11831/5'
    }
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
        getCurrentExtraConfig() {
            return extraConfig[this.h5AppName];
        },
        h5AppNameHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.reposBaseUrl}/${this.h5AppName}/tree/${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        },
        syncCodeHandler() { // 同步主干代码
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.reposBaseUrl}/${this.h5AppName}/merge/${this.h5BranchName || 'master'}...master`;
            chrome.tabs.create({ url: newURL });
        },
        intoCodeHandler() { // 合入主干代码
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.reposBaseUrl}/${this.h5AppName}/merge/master...${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        },
        preonlineAgileHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.agileBaseUrl}/${this.h5AppName}@${currentExtraConfig.preonlinePipelineName}@${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        },
        onlineAgileHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.agileBaseUrl}/${this.h5AppName}@${currentExtraConfig.onlinePipelineName}@${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        },
        jarvisPublishHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.jarvisUrl}`;
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
            return 'lemon-smart-prg_2020-01-14_BRANCH'
        },
        h5UserName() { // h5分支名称
            // return (h5ProjectConfig && h5ProjectConfig.userName) || '';
            return 'sunyihong';
        },
        h5IcafeId() {
            return 'cpd-alpha-1455';
        }
    }
})