(function () {
    'use strict';
    angular
      .module('editor.ui')
      .service('SurveyItemGroupService', Service);

    Service.$inject = [
      'WorkspaceService',
      'AddSurveyItemGroupEventFactory',
      '$mdDialog',
      'DialogService'
    ]

    function Service(WorkspaceService, AddSurveyItemGroupEventFactory, $mdDialog, DialogService) {
      const CREATE_ITEM_GROUP_STATE = "createGroup";
      const EDITOR_GROUP_STATE = "editorGroup";
      const VALID_ITEM_GROUP_STATE = "validateGroup";
      const INVALID_ITEM_GROUP_STATE = "invalidateGroup";
      const SAVED_ITEM_GROUP_EDITOR_STATE = "savedGroupEditor";
      const SAVED_ITEM_GROUP_STATE = "savedGroupItem";
      const LAST_SAVED_ITEM_GROUP_STATE = "lastSavedGroupItem";


      var self = this;

      self.questionItemReference = {};
      self.surveyItemsRegistry = surveyItemsRegistry;
      self.verifyEndItemGroup = verifyEndItemGroup;
      self.identifiesGroupItemStatus = identifiesGroupItemStatus;
      self.getValidItemsByTemplateID = getValidItemsByTemplateID;
      self.setUpQuestionGroup = setUpQuestionGroup;
      self.editModeInUse = false;

      function _getSurveyItemGroupManager() {
        return WorkspaceService.getSurvey().SurveyItemGroupManager;
      }

      function surveyItemsRegistry(ctrl, fun) {
        self.questionItemReference[ctrl.item.templateID] = {};
        self.questionItemReference[ctrl.item.templateID].stateControl = fun;
        self.questionItemReference[ctrl.item.templateID].ctrl = ctrl;
      }

      function verifyEndItemGroup(id) {
        var surveyItemGroup = _getSurveyItemGroupManager().getGroupByMember(id);
        if (surveyItemGroup) return surveyItemGroup.end === id;
      }

      function identifiesGroupItemStatus(id) {
        let surveyItemGroup = _getSurveyItemGroupManager().getGroupByMember(id);
        _setItemGroupState(surveyItemGroup.start, SAVED_ITEM_GROUP_EDITOR_STATE);
        _setItemGroupState(surveyItemGroup.end, LAST_SAVED_ITEM_GROUP_STATE);
        surveyItemGroup.members.forEach(member => {
            if (member.position === "middle") _setItemGroupState(member.id, SAVED_ITEM_GROUP_STATE)
          }
        );
      }

      function _setItemGroupState(id, state) {
        self.questionItemReference[id].ctrl.stateItemGroup = state;
      }

      function getValidItemsByTemplateID(id) {
        if (self.editModeInUse) return false;

        let stateComponent = {};
        let validCandidates = _getCandidates(id);

        if (validCandidates.length === 1) {
          stateComponent.status = INVALID_ITEM_GROUP_STATE;
          _setStateComponent(id, stateComponent);
        } else {
          validCandidates.forEach(function (id, index) {
            if (index < 1) stateComponent.status = EDITOR_GROUP_STATE;
            else stateComponent.status = VALID_ITEM_GROUP_STATE;
            _setStateComponent(id, stateComponent);
          });
          _setEditMode(true);
        }
      }

      function _getCandidates(id) {
        return _getSurveyItemGroupManager().getGroupCandidates(id);
      }

      function _setStateComponent(id, stateComponent) {
        self.questionItemReference[id].stateControl.call(stateComponent);
      }

      function setUpQuestionGroup(id) {
        let scaledItemGroup = _selectedForSurveyGroup(id);
        _groupCreationValidation(id, scaledItemGroup) ? _callGroupEditDialog(scaledItemGroup) : 0;
      }

      function _groupCreationValidation(id, scaledItemGroup) {
        let validation = true;
        if (scaledItemGroup.length === 1) {
          _setEditMode(false);
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Criação de Grupo negada')
              .textContent('Verificamos que somente a questão inicial está habilitada')
              .ok('OK')
          );
          self.questionItemReference[id].ctrl.stateItemGroup = CREATE_ITEM_GROUP_STATE;
          identifiesGroupItemStatus(scaledItemGroup[0]);
          validation = false;
        }
        return validation;
      }

      function _callGroupEditDialog(scaledItemGroup){
          var data = {
            url: 'app/editor/ui/survey-item-editor/survey-item-group/item-group-dialog/survey-item-group-dialog-template.html',
            ctrl: 'SurveyItemGroupDialogController',
            item: scaledItemGroup,
            cancelGroupEdit: _cancelGroupEdit,
            deleteGroup: _deleteGroup,
            buttons: [
              {message: "CANCELAR", class: "md-primary md-layoutTheme-theme", action: _cancelGroupEdit},
              {message: "Salvar", class: "md-primary md-raised md-layoutTheme-theme", action: _saveSurveyGroup}
            ]
          };
          DialogService.show(data);
      }


      function _deleteGroup(items) {
        items.forEach(item => {
          self.questionItemReference[item].ctrl.stateItemGroup = CREATE_ITEM_GROUP_STATE;
          self.questionItemReference[item].ctrl.itemCandidateCheckbox = false;
        });
        _getSurveyItemGroupManager().deleteGroup(items[0]);
        AddSurveyItemGroupEventFactory.create().execute();
        _setEditMode(false);
        $mdDialog.cancel();
      }

      function _selectedForSurveyGroup(id) {
        let selectedCandidates = [];
        _getCandidates(id).forEach(candidate => {
          if (self.questionItemReference[candidate].ctrl.stateItemGroup === EDITOR_GROUP_STATE) {
            selectedCandidates.push(self.questionItemReference[candidate].ctrl.item.templateID);
          }
          if (self.questionItemReference[candidate].ctrl.itemCandidateCheckbox) {
            selectedCandidates.push(self.questionItemReference[candidate].ctrl.item.templateID);
          } else if (self.questionItemReference[candidate].ctrl.stateItemGroup === VALID_ITEM_GROUP_STATE &&
            !self.questionItemReference[candidate].ctrl.itemCandidateCheckbox) {
            _setItemGroupState(candidate, CREATE_ITEM_GROUP_STATE);
          }
        });
        return selectedCandidates;
      }

      function _saveSurveyGroup() {
        var items = angular.copy(DialogService.data.item);
        _getSurveyItemGroupManager().createGroup(DialogService.data.item);
        identifiesGroupItemStatus(items[0]);
        AddSurveyItemGroupEventFactory.create().execute();
        _setEditMode(false);
        $mdDialog.cancel();
      }

      function _cancelGroupEdit() {
        DialogService.data.item.forEach(item => {
          self.questionItemReference[item].ctrl.itemCandidateCheckbox = false;
          self.questionItemReference[item].ctrl.stateItemGroup = CREATE_ITEM_GROUP_STATE;
        });
        DialogService.data.item = [];
        _setEditMode(false);
        $mdDialog.cancel();
      }

      function _setEditMode(state) {
        self.editModeInUse = state;
      }

      return self;
    }
  }

  ()
);
