(function() {
  'use strict';

  angular
    .module('otusjs.studio.navigationBuilder.routeBuilder')
    .component('otusRuleEditor', {
      templateUrl: 'app/navigation-builder/route/editor/rule-editor-template.html',
      controller: component,
      bindings: {
        ruleData: '<',
        ruleItemIndex: '<',
        onUpdate: '&'
      },
      require: {
        otusRouteEditor: '^otusRouteEditor'
      }
    });

  component.$inject = [
    'otusjs.studio.navigationBuilder.routeBuilder.RouteBuilderService',
    'otusjs.studio.navigationBuilder.routeBuilder.RuleAnswerBuilderService'
  ];

  function component(RouteBuilderService, RuleAnswerBuilderService) {
    var self = this;
    var _customAnswer;

    /* Public methods */
    self.$onInit = onInit;
    self.answers = answers;
    self.answerChange = answerChange;
    self.answerInputChange = answerInputChange;
    self.operatorChange = operatorChange;
    self.whens = whens;
    self.whenChange = whenChange;
    self.updateRule = updateRule;
    self.deleteRule = deleteRule;

    function onInit() {
      self.ruleData.index = self.ruleItemIndex;
      self.isDisable = false;
      self.isAnswerDisable = false;
      self.showDeleteRuleButton = true;

      _initializeWhenList();
      _applyRuleDataWhen();
      _applyRuleDataOperator();
      _applyRuleDataAnswer();

      self.otusRouteEditor.childRules.push(self);
    }

    function _applyRuleDataWhen() {
      var customID = self.ruleData.when.customID || self.ruleData.when;
      self.whenList.some(function(when) {
        if (when.customID === customID) {
          self.selectedWhen = when;
          return true;
        }
      });
    }

    function _applyRuleDataOperator() {
      self.operatorList = RouteBuilderService.getOperatorListForRule(self.selectedWhen.type);
      var type = self.ruleData.operator.type || self.ruleData.operator;
      self.operatorList.some(function(operator) {
        if (operator.type === type) {
          self.selectedOperator = operator;
          return true;
        }
      });
    }

    function answers(filterValue) {
      if (!filterValue) {
        return self.answerList.filter(_filter);
      } else {
        var filterResult = self.answerList.filter(function(answer) {
          return answer.option.label.ptBR.plainText.search(filterValue) != -1 || self.selectedWhen.customID.search(filterValue) != -1;
        });
        return filterResult.filter(_filter);
      }
    }

    function _filter(element, index) {
      if (self.selectedWhen.type == 'SingleSelectionQuestion' || self.selectedWhen.type == 'CheckboxQuestion') {
        return true;
      } else {
        return index > 0;
      }
    }

    function _applyRuleDataAnswer() {
      self.answerList = RouteBuilderService.getAnswerListForRule(self.selectedWhen.item);
      if (self.ruleData.isCustom) {
        self.selectedAnswer = RuleAnswerBuilderService.buildCustomAnswer(self.ruleData.answer);
      } else {
        self.selectedAnswer = self.answerList.filter(function(answer) {
          return (answer.option.value === self.ruleData.answer) && (answer.isMetadata === self.ruleData.isMetadata);
        })[0];
      }
    }

    function answerInputChange() {
      if (self.answerSearchText) {
        if (self.selectedWhen.type == 'SingleSelectionQuestion' || self.selectedWhen.type == 'CheckboxQuestion') {
          _customAnswer = false;
          self.readyToSave = false;
        } else {
          _customAnswer = true;
          self.selectedAnswer = self.answerSearchText;
          updateRule();
          self.readyToSave = _readyToSave();
        }
      }
    }

    function answerChange(answer) {
      if (!_customAnswer) {
        _customAnswer = false;
        self.selectedAnswer = answer;
        updateRule();
      }
      self.readyToSave = _readyToSave();
    }

    function whens(filterValue) {
      if (!filterValue) {
        return self.whenList;
      } else {
        var filterResult = self.whenList.filter(function(when) {
          return when.label.ptBR.plainText.search(filterValue) != -1 || when.customID.search(filterValue) != -1;
        });
        return filterResult;
      }
    }

    function operatorChange(operator) {
      self.selectedOperator = operator;
      self.readyToSave = _readyToSave();
      updateRule();
    }

    function whenChange(when) {
      self.selectedWhen = when;

      self.operatorList = [];
      self.answerList = [];

      if (self.selectedWhen) {
        self.operatorList = _returnFilteredOperatorList(self.selectedWhen.type);
        self.answerList = RouteBuilderService.getAnswerListForRule(self.selectedWhen.item);
        self.isDisable = false;
      } else {
        self.isDisable = true;
      }

      self.readyToSave = _readyToSave();
      updateRule();
    }

    //TODO: Quando implementado recurso dos operadores retirados, esse método deve ser removido!
    function _returnFilteredOperatorList(when) {
      var list = RouteBuilderService.getOperatorListForRule(when).filter(function(element, index) {
        if (element.label.ptBR.plainText !== 'Intervalo de valores' && element.label.ptBR.plainText !== 'Está dentro do intervalo' && element.label.ptBR.plainText !== 'Está entre os valores') {
          return true;
        }
      });
      return list;
    }

    function updateRule() {
      if (self.ruleData && self.selectedAnswer) {
        RouteBuilderService.updateRule(self.ruleData.index, self.selectedWhen, self.selectedOperator, self.selectedAnswer, self.selectedAnswer.isMetadata, _customAnswer);
        self.onUpdate();
      }
      _customAnswer = false;
    }

    function deleteRule() {
      self.onUpdate({ 'rule': self.ruleData });
    }

    function _initializeWhenList() {
      self.whenList = [];
      self.whenList = RouteBuilderService.getWhenListForRule();
    }

    function _readyToSave() {
      if (_resolveRuleWhen() && _resolveRuleOperator() && _resolveRuleAnswer()) {
        return true;
      } else {
        return false;
      }
    }

    function _resolveRuleWhen() {
      if (!self.selectedWhen) {
        return false;
      } else {
        return true;
      }
    }

    function _resolveRuleOperator() {
      if (!self.selectedOperator) {
        return false;
      } else {
        return true;
      }
    }

    function _resolveRuleAnswer() {
      if (_customAnswer || self.selectedAnswer) {
        return true;
      } else {
        return false;
      }
    }
  }
})();
