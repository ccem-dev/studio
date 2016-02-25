(function() {
    'use strict';

    angular
        .module('editor.engine.ui')
        .service('TriggerService', TriggerService);

    TriggerService.$inject = ['TriggerRegisterService', 'TriggerMap'];

    function TriggerService(TriggerRegisterService, TriggerMap) {
        var self = this;

        /* Public interface */
        self.loadTrigger = loadTrigger;

        function loadTrigger() {
            /*========== DEV LOG ===========*/
            // console.info('Registro de triggers:');
            /*==============================*/

            for (var submap in TriggerMap) {
                submap = TriggerMap[submap];

                for (var triggerService in submap) {
                    var selectedTriggerService = submap[triggerService];
                    TriggerRegisterService.registerTriggerService(selectedTriggerService);
                }
            }

            /*========== DEV LOG ===========*/
            // console.log('Trigger para ' + triggerService.getTrigger().source + ' registrada');
            /*==============================*/
        }
    }

}());