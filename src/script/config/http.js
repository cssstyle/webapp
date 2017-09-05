"use strict";

angular.module("app").config(["$provide", function($provide){
    $provide.decorator("$http", ["$delegate", "$q", function($delegate, $q){
        var get = $delegate.get;
        $delegate.post = function(url, data, config){
            var def = $q.defer()
            get(url).success(function(response){
                def.resolve(response);
            }).error(function(error){
                def.reject(error)
            });
            return {
                success: function(callback){
                    def.promise.then(callback)
                },
                error: function(callback){
                    def.promise.then(null, callback)
                }
            }
        }
        return $delegate;
    }])
}])