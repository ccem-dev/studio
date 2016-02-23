(function() {
    'use strict';

    angular
        .module('editor.domain')
        .factory('SurveyProjectFactory', SurveyProjectFactory);

    function SurveyProjectFactory() {
        var self = this;

        /* Public interface */
        self.create = create;

        function create(survey, author) {
            return new SurveyProject(survey, author);
        }

        return self;
    }

    function SurveyProject(survey, author) {
        var self = this;

        self.configuration = {};

        Object.defineProperty(this, 'survey', {
            value: survey,
            writable: false
        });

        Object.defineProperty(this, 'creationDateTime', {
            value: Date.now(),
            writable: false
        });

        Object.defineProperty(this, 'author', {
            value: author,
            writable: false
        });

        var contributors = [];

        /* Public interface */
        self.addContributor = addContributor;
        self.removeContributor = removeContributor;
        self.listContributors = listContributors;
        self.close = close;

        function addContributor(contributor) {
            contributors.push(contributor);
        }

        function removeContributor(contributor) {
            var indexToRemove = contributors.indexOf(contributor);
            contributors = contributors.slice(indexToRemove, 1);
        }

        function listContributors() {
            return contributors;
        }

        function close(lastSaveDateTime) {
            Object.defineProperty(self, 'lastSaveDateTime', {
                value: lastSaveDateTime,
                writable: false
            });
        }
    }

}());