"use strict";

angular.module("app").controller("favoriteCtrl", ["$http", "$scope", function($http, $scope){
    $http.get("/data/myFavorite.json").success(function(response){
        $scope.favoriteList = response;
    }).error(function(error){
        console.log(error);
    })
}])