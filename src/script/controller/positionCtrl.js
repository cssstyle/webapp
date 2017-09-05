"use strict";

angular.module("app").controller("positionCtrl", ["$log", "$q", "$http", "$state", "$scope", "cache", function($log, $q, $http, $state, $scope, cache){
    $scope.isLogin = !!cache.get("name");
    $scope.message = $scope.isLogin?'投个简历':'去登录';
    function getPosition(){
        var def =  $q.defer();
        $http.get("data/position.json", {
            params: {
                id: $state.params.id
            }
        }).success(function(response){
            $scope.position = response;
            if (response.posted) {
                $scope.message = '已投递';
            }
            def.resolve(response);
        }).error(function(error){
            def.reject(error);
        })
        return def.promise;
    }
    function getCompany(id){
        $http.get("data/company.json?id="+id).success(function(response){
            $scope.company = response;
        }).error(function(error){
            console.log(error);
        })
    }
    getPosition().then(function(data){
        getCompany(data.id);
    }, function(error){
        console.log(error);
    });
    $scope.go = function(){
        if ($scope.message !== '已投递') {
            if ($scope.isLogin) {
                $http.post("/data/handle.json", {
                    id: $scope.position.id
                }).success(function(response){
                    $log.info(response);
                    $scope.message = '已投递';
                })
            } else {
                $state.go("login")
            }
        }
    }
}])