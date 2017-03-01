(function() {
  'use strict';

  angular
    .module('editor.ui')
    .factory('MinDateValidatorWidgetFactory', MinDateValidatorWidgetFactory);

  MinDateValidatorWidgetFactory.$inject = [
          'otusjs.utils.ImmutableDate'
      ];

  function MinDateValidatorWidgetFactory(ImmutableDate) {
    var self = this;

    /* Public interface */
    self.create = create;

    function create(scope, element) {
      return new MinDateValidator(scope, element, ImmutableDate);
    }

    return self;
  }

  function MinDateValidator(scope, element, ImmutableDate) {
    var self = this;
    var whoAmI = 'minDate';

    /* Public Methods */
    self.data = '';
    self.updateData = updateData;
    self.deleteValidator = deleteValidator;


    var question = scope.$parent.widget.getItem();

    _init();

    function _init() {
      var avaiableRules = question.fillingRules.options;
      self.data = new ImmutableDate(avaiableRules[whoAmI].data.reference.value);
      self.canBeIgnored = question.fillingRules.options[whoAmI].data.canBeIgnored;
      self.updateData();
    }

    function updateData() {
      getRuleType().data.reference = self.data.toJSON(); //TODO remover quando refatorar load de transição edição -> preview do studio. Atualmente preview é carregado com objecto em memória e não fromJSON e gera erro com o ImmutableDate. (presente em validadores de tempo e data.)
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
