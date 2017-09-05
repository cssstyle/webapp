"use strict";

angular.module("app").directive("appPositionInfo", ["$http", function($http){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/positionInfo.html",
        scope: {
            isActive: "=",
            isLogin: "=",
            position: "="
        },
        link: function($scope, element, attr){
            $scope.$watch("position", function(newValue, oldValue){
                if (newValue) {
                    $scope.position.select = $scope.position.select || false;
                    $scope.imagePath = $scope.position.select ? "image/star-active.png" : "image/star.png";
                }
            })
            $scope.favorite = function(){
                $http.post("/data/favorite.json", {
                    id: $scope.position.id,
                    select: !$scope.position.select
                }).success(function(response){
                    $scope.position.select = !$scope.position.select;
                    $scope.imagePath = $scope.position.select ? "image/star-active.png" : "image/star.png";
                });
            }
        }
    }
}])