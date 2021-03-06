(function() {
  'use strict';

  angular
    .module('editor.ui')
    .factory('otusjs.studio.editor.ui.validation.QuantityValidatorWidgetFactory', Factory);

  function Factory() {
    var self = this;

    /* Public interface */
    self.create = create;

    function create(scope, element) {
      return new QuantityValidator(scope, element);
    }

    return self;
  }

  function QuantityValidator(scope, element) {
    var self = this;
    var whoAmI = 'quantity';

    /* Public Methods */
    self.data = null;
    self.updateData = updateData;
    self.deleteValidator = deleteValidator;

    var question = scope.$parent.widget.getItem();

    _init();

    function _init() {
      self.data = question.fillingRules.options[whoAmI].data.reference;
      self.canBeIgnored = question.fillingRules.options[whoAmI].data.canBeIgnored;
    }

    function updateData() {
      getRuleType().data.reference = self.data;
      scope.$parent.widget.updateFillingRules();
    }

    function getRuleType() {
      return question.fillingRules.options[whoAmI];
    }

    function deleteValidator() {
      scope.$parent.widget.deleteValidator(whoAmI);
      element.remove();
      scope.$destroy();
    }

  }

}());
