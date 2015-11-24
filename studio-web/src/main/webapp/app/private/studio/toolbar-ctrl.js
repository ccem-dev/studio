angular
    .module('StudioApp')
    .controller('ToolbarCtrl', ['$scope', '$location',
        function($scope, $location) {

            var USER_MANAGEMENT_STATE = 'userManagement';

            $scope.openAdministrationUsers = function() {
                $location.url(USER_MANAGEMENT_STATE);
            }

        }
    ]);