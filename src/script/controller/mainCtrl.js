"use strict";

angular.module("app").controller("mainCtrl", ["$http", "$scope", function($http, $scope){
    $http.get("/data/positionList.json").success(function(response){
        $scope.list = response;
    }).error(function(error){
        console.log(error);
    })
}])