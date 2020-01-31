/**
 * Created by onlyfu on 2019/03/05.
 */

App.module.extend('devtools', function() {
    let self = this;
    this.init = function() {
        chrome.devtools.panels.elements.createSidebarPane(
            "设计稿尺寸(3x)",
            function(sidebar) {
                sidebar.setPage('../../../devtools-content.html');
            });
    };
});
