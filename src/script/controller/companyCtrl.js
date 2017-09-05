"use strict";

angular.module("app").controller("companyCtrl", ["$http", "$state", "$scope", function($http, $state, $scope){
    $http.get("/data/company.json?id="+$state.params.id).success(function(response){
        $scope.company = response;
    }).error(function(error){
        console.log(error);
    });
}])