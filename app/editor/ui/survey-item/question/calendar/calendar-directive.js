(function() {
    'use strict';

    angular
        .module('editor.ui')
        .directive('calendarQuestion', directive);

    function directive() {
        var ddo = {
            scope: {},
            templateUrl: 'app/editor/ui/survey-item/question/calendar/calendar-question.html',
            retrict: 'E'
        };

        return ddo;
    }

}());
