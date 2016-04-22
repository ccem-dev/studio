(function() {
    'use strict';

    angular
        .module('editor.ui')
        .factory('CalendarQuestionWidgetFactory', CalendarQuestionWidgetFactory);

    function CalendarQuestionWidgetFactory() {
        var self = this;

        /* Public interface */
        self.create = create;

        function create(widget) {
            return new CalendarQuestionWidget(widget);
        }

        return self;
    }

    function CalendarQuestionWidget(widget) {
        var self = this;

        self.widget = widget;
        self.widget.template = '<calendar-question></calendar-question>';
        self.widget.metadata = '<metadata-question></metadata-question>';
    }

}());