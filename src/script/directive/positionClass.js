"use strict";

angular.module("app").directive("appPositionClass", [function(){
    return {
        restrict: "A",
        replace: true,
        scope: {
            company: "="
        },
        templateUrl: "view/template/positionClass.html",
        link: function($scope){
            $scope.showPositionList = function(index){
                $scope.positionList = $scope.company.positionClass[index].positionList;
                $scope.isActive = index;
            }
            $scope.$watch("company", function(newValue, oldValue, scope){
                if (newValue) {
                    $scope.showPositionList(0);
                }
            })
        }
    };
}]);