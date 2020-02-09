/**
 * @author yanwosky4@gmail.com
 */

/**
 * h5ProjectConfig: lemon-fe-helper-h5-project-config
 *  logoUrl
 *  appName: 项目名称
 *  branchName: 分支名称
 *  userName: 用户名称
 *  commitId: 当前分支最后提交的commit id
 *  commitInfo: 提交信息
 *
 *  hasSwan
 *  reposBaseUrl
 *  agileBaseUrl
 *  preonlinePipelineName
 *  onlinePipelineName
 *  swanPipelineName
 *  jarvisUrl
 */

new Vue({
    el: '#app',
    data: {
        qrcodeValue: '',
        bg: null,
        ipAddress: '加载中...',
        h5ProjectConfig: null,
        extraConfig: null,
        userNameData: ''
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
            });
            this.getStoragePromise({userNameData: ''}).then(({userNameData = ''}) => {
                if (!this.userNameData) {
                    this.userNameData = userNameData;
                }
            })
        },
        initEvent() {
            setTimeout(() => {
                this.sendMessageToContentScript({id: 'REQUEST_CURRENT_PAGE_EXTENSION_CONFIG'}, data => {
                    console.log('>>> data', data);
                });
            }, 0);
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                console.log('popup 收到来自content-script的消息：');
                console.log(request, sender, sendResponse);
                if (request.id === 'RESPONSE_CURRENT_PAGE_EXTENSION_CONFIG') {
                    this.extraConfig = request.config;

                    const userNameData = this.extraConfig && this.extraConfig.userName;
                    if (userNameData) {
                        this.userNameData = userNameData;
                        this.setStoragePromise({userNameData})
                    }
                }
            });
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
            const newURL = this.logoUrl;
            if (!newURL) {
                return;
            }
            chrome.tabs.create({ url: newURL });
        },
        getCurrentExtraConfig() {
            return this.extraConfig;
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
        copyCommitIdHandler() { // 复制commitId
            this.copyText(this.h5commitId);
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
        swanAgileHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.agileBaseUrl}/${this.h5AppName}@${currentExtraConfig.swanPipelineName}@${this.h5BranchName || 'master'}`;
            chrome.tabs.create({ url: newURL });
        },
        jarvisPublishHandler() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return;
            }
            const newURL = `${currentExtraConfig.jarvisUrl}`;
            chrome.tabs.create({ url: newURL });
        },
        sendMessageToContentScript(message, callback) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
            {
                chrome.tabs.sendMessage(tabs[0].id, message, function(response)
                {
                    if(callback) callback(response);
                });
            });
        },
        setStoragePromise(obj) {
            return new Promise(resolve => {
                chrome.storage.sync.set(obj, function() {
                    resolve('保存成功！');
                });
            });
        },
        getStoragePromise(obj) {
            return new Promise(resolve => {
                chrome.storage.sync.get(obj, function(items) {
                    resolve(items);
                });
            });
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
        isShowConfigView() {
            return !!this.h5AppName;
        },
        logoUrl() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return '';
            }
            return currentExtraConfig.logoUrl;
        },
        h5AppName() { // h5项目的名称
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return '';
            }
            return currentExtraConfig.appName;
        },
        h5BranchName() { // h5分支名称
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return '';
            }
            return currentExtraConfig.branchName;
        },
        h5UserName() { // h5用户名
            return this.userNameData || '';
        },
        h5commitId() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return '';
            }
            return currentExtraConfig.commitId;
        },
        h5commitInfo() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return '';
            }
            return currentExtraConfig.commitTitle;
        },
        hasSwan() {
            const currentExtraConfig = this.getCurrentExtraConfig();
            if (!currentExtraConfig) {
                return false;
            }
            return !!currentExtraConfig.hasSwan;
        }
    }
})