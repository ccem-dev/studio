(function() {

    angular
        .module('editor.engine.core')
        .service('DivEditableParser', DivEditableParser);

    function DivEditableParser() {
        var self = this;

        /* Public interface */
        self.parse = parse;

        function parse(domComponent) {
            var jqElement = angular.element(domComponent);
            return new ParseResult(jqElement);
        }
    }

    function ParseResult(domComponent) {
        var self = this;

        self.id = domComponent.attr('id');
        self.name = domComponent.attr('name');
        self.textContent = domComponent.text();
        self.innerHTML = domComponent.html();
    }

}());