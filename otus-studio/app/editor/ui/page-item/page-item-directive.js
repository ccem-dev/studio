(function() {
    'use strict';

    angular
        .module('editor.ui')
        .directive('otusPageItem', otusPageItem);

    otusPageItem.$inject = [
        'PageItemWidgetFactory',
        'SheetContentService'
    ];

    function otusPageItem(PageItemWidgetFactory, SheetContentService) {
        var ddo = {
            scope: {},
            templateUrl: 'app/editor/ui/page-item/page-item.html',
            retrict: 'E',
            link: function linkFunc(scope, element, attrs) {
                scope.widget = PageItemWidgetFactory.create(SheetContentService.lastLoadedQuestion, element);
            }
        };

        return ddo;
    }

}());
