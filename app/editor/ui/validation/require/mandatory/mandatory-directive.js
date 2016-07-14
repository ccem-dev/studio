(function() {
    'use strict';

    angular
        .module('editor.ui')
        .directive('otusMandatoryValidator', otusMandatoryValidator);

    otusMandatoryValidator.$inject = [
        'MandatoryValidatorFactory'
    ];

    function otusMandatoryValidator(MandatoryValidatorFactory) {
        var ddo = {
            scope: {},
            restrict: 'E',
            templateUrl: 'app/editor/ui/validation/require/mandatory/mandatory-validator.html',
            link: function linkFunc(scope, element) {
                scope.widget = MandatoryValidatorFactory.create();
                scope.widget.element = element;
                scope.widget.directiveScope = scope;
            }

        };

        return ddo;
    }

}());