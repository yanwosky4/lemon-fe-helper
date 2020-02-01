const app = new Vue({
    el: '#app',
    data: {
        inspectDomStyle: null, // 当前审查的元素的style
        updateElementTimer: null
    },
    methods: {
        initData() {
            this.inspectDomStyle = null;
        },
        initEvent() {
            // 监听审查的元素
            chrome.devtools.panels.elements.onSelectionChanged.addListener(this.updateElementProperties);

            // 与后台页面消息通信-长连接
            const port = chrome.runtime.connect({name: 'devtools'});
            port.postMessage({
                name: 'devtools',
                tabId: chrome.devtools.inspectedWindow.tabId
            });
            // 监听后台页面消息
            port.onMessage.addListener((message) => {
                const inspectStyleStr = message.content;
                this.inspectDomStyle = JSON.parse(inspectStyleStr);
                // document.body.innerText = '哈哈哈: ' + JSON.stringify(inspectDomStyle);
                // this.message = '哈哈哈: ' + JSON.stringify(this.inspectDomStyle);
            });
        },
        updateElementProperties() {
            chrome.devtools.inspectedWindow.eval('window.postMessage({id: "inspectDomStyle", content: JSON.stringify(window.getComputedStyle($0))}, "*");');
            if (this.updateElementTimer) {
                clearTimeout(this.updateElementTimer);
            }
            this.updateElementTimer = setTimeout(() => {
                this.updateElementProperties();
            }, 500);
        },
        numberRound(number, precision = 2) {
            const scaleNum = 10 ** precision;
            return Math.round(number * scaleNum) / scaleNum;
        },
        getContentSize(inspectStyle, propName) {
            const propValue = inspectStyle[propName].replace('px', '');
            const boxSizingValue = inspectStyle.boxSizing;
            if (boxSizingValue !== 'border-box') {
                return propValue;
            }
            if (Number.isNaN(+propValue)) { // 非数字
                return propValue;
            }
            if (propName === 'width') {
                const borderLeftWidth = +inspectStyle['borderLeftWidth'].replace('px', '');
                const borderRightWidth = +inspectStyle['borderRightWidth'].replace('px', '');

                const paddingLeft = +inspectStyle['paddingLeft'].replace('px', '');
                const paddingRight = +inspectStyle['paddingRight'].replace('px', '');

                return +propValue - (borderLeftWidth + borderRightWidth + paddingLeft + paddingRight);
            } else if (propName === 'height') {
                const borderTopWidth = +inspectStyle['borderTopWidth'].replace('px', '');
                const borderBottomWidth = +inspectStyle['borderBottomWidth'].replace('px', '');

                const paddingTop = +inspectStyle['paddingTop'].replace('px', '');
                const paddingBottom = +inspectStyle['paddingBottom'].replace('px', '');

                return +propValue - (borderTopWidth + borderBottomWidth + paddingTop + paddingBottom);
            }
            return propValue;
        },
        getStyleProps(inspectStyle, propName, scale = 3) {
            if (!inspectStyle) {
                return '-';
            }
            if (!inspectStyle[propName]) {
                return '-';
            }
            const propValue = (() => {
                if (['width', 'height'].includes(propName)) {
                    return this.getContentSize(inspectStyle, propName);
                }
                return inspectStyle[propName].replace('px', '')
            })();
            if (+propValue === 0 && !['width', 'height'].includes(propName)) {
                return '-';
            }
            if (Number.isNaN(+propValue)) { // 非数字
                return propValue;
            }
            return this.numberRound(propValue * scale);
        }
    },
    mounted() {
        this.initData();
        this.initEvent();
        this.updateElementProperties();
    },
    destroyed() {
        if (this.updateElementTimer) {
            clearTimeout(this.updateElementTimer);
        }
    },
    computed: {
        width() {
            return this.getStyleProps(this.inspectDomStyle, 'width');
        },
        height() {
            return this.getStyleProps(this.inspectDomStyle, 'height');
        },
        paddingLeft() {
            return this.getStyleProps(this.inspectDomStyle, 'paddingLeft');
        },
        paddingRight() {
            return this.getStyleProps(this.inspectDomStyle, 'paddingRight');
        },
        paddingTop() {
            return this.getStyleProps(this.inspectDomStyle, 'paddingTop');
        },
        paddingBottom() {
            return this.getStyleProps(this.inspectDomStyle, 'paddingBottom');
        },
        borderLeft() {
            return this.getStyleProps(this.inspectDomStyle, 'borderLeftWidth');
        },
        borderRight() {
            return this.getStyleProps(this.inspectDomStyle, 'borderRightWidth');
        },
        borderTop() {
            return this.getStyleProps(this.inspectDomStyle, 'borderTopWidth');
        },
        borderBottom() {
            return this.getStyleProps(this.inspectDomStyle, 'borderBottomWidth');
        },
        marginLeft() {
            return this.getStyleProps(this.inspectDomStyle, 'marginLeft');
        },
        marginRight() {
            return this.getStyleProps(this.inspectDomStyle, 'marginRight');
        },
        marginTop() {
            return this.getStyleProps(this.inspectDomStyle, 'marginTop');
        },
        marginBottom() {
            return this.getStyleProps(this.inspectDomStyle, 'marginBottom');
        }
    }
})