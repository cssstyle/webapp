"use strict";

angular.module("app").value("dict", {}).run(["dict", "$http", function(dict, $http){
    $http.get("/data/city.json").success(function(response){
        dict.city = response;
    });
    $http.get("/data/salary.json").success(function(response){
        dict.salary = response;
    });
    $http.get("/data/scale.json").success(function(response){
        dict.scale = response;
    });
}])