(function() {

    angular
        .module('editor.engine.ui')
        .service('UIUtils', UIUtils);

    function UIUtils() {
        var self = this;

        /* Public interface */
        self.jq = jq;

        function jq(element) {
            return angular.element(element);
        }
    }

}());
