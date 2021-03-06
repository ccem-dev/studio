(function () {
  'use strict';

  angular.module('editor.ui')
    .component('surveyItemGroup', {
      templateUrl: 'app/editor/ui/survey-item-editor/survey-item-group/survey-item-group-template.html',
      controller: 'SurveyItemGroupCtrl as $ctrl',
      bindings: {
        item: "<",
      }
    })
    .controller('SurveyItemGroupCtrl', Controller);

  Controller.$inject = [
    'SurveyItemGroupService',
    'SurveyItemGroupValue'
  ];

  function Controller(SurveyItemGroupService, StateValues) {
    var self = this;
    self.stateItemGroup = StateValues.CREATE_ITEM_GROUP_STATE;
    self.itemCandidateCheckbox = false;
    self.stateColor = StateValues.STATE_COLOR;
    self.StateValues = StateValues;

    self.$onInit = onInit;
    self.editorSurveyItemGroup = editorSurveyItemGroup;
    self.setSurveyGroup = setSurveyGroup;
    self.monitoringCheckboxState = monitoringCheckboxState;

    function onInit() {
      SurveyItemGroupService.surveyItemsRegistry(self, _stateControl);
      _flagStatusGroupItems();
    }

    //internal callBack register in onInit
    function _stateControl() {
      let vm = this;
      self.stateItemGroup = vm.status;
    }

    function _flagStatusGroupItems(){
      let itemEndGroup = _checkEndItemGroup();
      itemEndGroup ? SurveyItemGroupService.identifiesGroupItemStatus(itemEndGroup.id): 0;
    }

    function _checkEndItemGroup(){
      return SurveyItemGroupService.verifyEndItemGroup(self.item.templateID) ? {id: self.item.templateID} : 0;
    }

    function editorSurveyItemGroup() {
      SurveyItemGroupService.preparesValidCandidatesForGroupEditing(self.item.templateID);
    }

    function setSurveyGroup(){
      SurveyItemGroupService.setSurveyGroup(self.item.templateID)
    }

    function monitoringCheckboxState(id){
      SurveyItemGroupService.monitoringCheckboxState(id);
    }
  }
}());
