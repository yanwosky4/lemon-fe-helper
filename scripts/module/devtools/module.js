/**
 * Created by onlyfu on 2019/03/05.
 */

App.module.extend('devtools', function() {
    let self = this;
    //
    this.init = function() {
        chrome.devtools.panels.elements.createSidebarPane(
            "元素尺寸",
            function(sidebar) {
                sidebar.setPage('../../../devtools-content.html');
            });
    };
});
