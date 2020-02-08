/**
 * @author yanwosky4@gmail.com
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
