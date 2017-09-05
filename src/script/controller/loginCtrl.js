"use strict";

angular.module("app").controller("loginCtrl", ["cache", "$http", "$scope", "$state", function(cache, $http, $scope, $state){
    $scope.submit = function(){
        $http.post("/data/login.json", $scope.user).success(function(response){
            cache.put("id", response.id);
            cache.put("name", response.name);
            cache.put("image", response.image);
            $state.go("main");
        })
    }
}])