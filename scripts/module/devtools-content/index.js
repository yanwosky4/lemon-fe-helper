window.onload = function () {
    // 当前审查的元素的style
    let inspectDomStyle = null;
    // 获取当前审查的元素
    const updateElementProperties = function() {
        chrome.devtools.inspectedWindow.eval('window.postMessage({id: "inspectDomStyle", content: JSON.stringify(window.getComputedStyle($0))}, "*");');
    }
    updateElementProperties();
    // 监听审查的元素
    chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);

    // 与后台页面消息通信-长连接
    const port = chrome.runtime.connect({name: 'devtools'});
    port.postMessage({
        name: 'devtools',
        tabId: chrome.devtools.inspectedWindow.tabId
    });
    // 监听后台页面消息
    port.onMessage.addListener((message) => {
        inspectDomStyle = message;
        document.body.innerText = '哈哈哈: ' + JSON.stringify(inspectDomStyle);
    });
}