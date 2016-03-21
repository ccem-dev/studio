(function() {
    'use strict';

    angular
        .module('editor.database')
        .service('CrossSessionDatabaseService', CrossSessionDatabaseService);

    CrossSessionDatabaseService.$inject = [
        '$indexedDB'
    ];

    function CrossSessionDatabaseService($indexedDB) {
        var self = this;

        /* Public interface */
        self.saveSurveyTemplateRevision = saveSurveyTemplateRevision;

        function saveSurveyTemplateRevision(template, session) {
            $indexedDB.openStore('survey_template', function(store) {
                var entry = {
                    'template_oid': template.oid,
                    'contributor': session.owner,
                    template: template
                };

                store.upsert(entry).then(function(e) {
                    console.log('Survey armazenada localmente.');
                });
            });
        }
    }

}());