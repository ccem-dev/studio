describe('MaxLengthValidatorWidgetFactory', function() {
    var Mock = {};
    var factory;
    var whoAmI;

    beforeEach(function() {
        angular.mock.module('studio');

        mockElement();

        inject(function(_$injector_) {
            mockWidgetScope(_$injector_);
            factory = _$injector_.get('MaxLengthValidatorWidgetFactory');
        });

        widget = factory.create(Mock.scope, Mock.element);
    });

    describe('Start a maxLength Factory Object', function() {
        it('should return a maxLength Validator Object', function() {
            pending();
        });

        it('should start the data field as false', function() {            
            expect(widget.data).toEqual(null);
        });
    });

    describe('updates on data', function() {
        it('should model data value be equal to self value', function() {
            expect(Mock.question.fillingRules.options.maxLength.data.reference).toEqual(widget.data);
        });

        it('should call updateFillingRules from parente widget', function() {
            spyOn(Mock.parentWidget, 'updateFillingRules');

            widget.updateData();

            expect(Mock.parentWidget.updateFillingRules).toHaveBeenCalled();
        });

    });

    describe('exclusion of a validator', function() {
        it('should exlude a validator from the question', function() {
            spyOn(Mock.parentWidget, 'deleteValidator');

            widget.deleteValidator();

            expect(Mock.parentWidget.deleteValidator).toHaveBeenCalled();
        });

    });

    function mockElement() {
        Mock.element = {
            remove: function() {}
        };
    }

    function mockWidgetScope($injector) {
        Mock.scope = {
            class: '',
            $parent: {
                widget: mockParentWidget($injector)
            },
            $destroy: function() {}
        };
        return Mock.scope;
    }

    function mockParentWidget($injector) {
        mockQuestion($injector);

        Mock.parentWidget = {
            getItem: function() {
                return Mock.question;
            },
            updateFillingRules: function() {},
            deleteValidator: function() {}
        };

        return Mock.parentWidget;
    }

    function mockQuestion($injector) {
        Mock.question = $injector.get('SurveyItemFactory').create('IntegerQuestion', 'Q1');
        Mock.question.fillingRules.options.maxLength = $injector.get('RulesFactory').create('maxLength');
        return Mock.question;
    }

    function mockAdd($injector) {
        Mock.add = $injector.get('FillingRulesEditorWidgetFactory').create();

    }

});
