"use strict";

angular.module("app", ["ui.router", "ngCookies", "validation", "ngAnimate"]);
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
"use strict";

angular.module("app").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    $stateProvider.state("main", {
        url: "/main",
        templateUrl: "view/main.html",
        controller: "mainCtrl"
    }).state("position", {
        url: "/position/:id",
        templateUrl: "view/position.html",
        controller: "positionCtrl"
    }).state("company", {
        url: "/company/:id",
        templateUrl: "view/company.html",
        controller: "companyCtrl"
    }).state("search", {
        url: "/search",
        templateUrl: "view/search.html",
        controller: "searchCtrl"
    }).state("login", {
        url: "/login",
        templateUrl: "view/login.html",
        controller: "loginCtrl"
    }).state("register", {
        url: "/register",
        templateUrl: "view/register.html",
        controller: "registerCtrl"
    }).state("my", {
        url: "/my",
        templateUrl: "view/my.html",
        controller: "myCtrl"
    }).state("post", {
        url: "/post",
        templateUrl: "view/post.html",
        controller: "postCtrl"
    }).state("favorite", {
        url: "/favorite",
        templateUrl: "view/favorite.html",
        controller: "favoriteCtrl"
    });
    $urlRouterProvider.otherwise("main");
}])
"use strict";

angular.module("app").config(["$validationProvider", function($validationProvider){
    var expression = {
        phone: /^1[\d]{10}$/,
        password: function(value){
            var string = value + "";
            return string.length > 5;
        },
        required: function(value){
            return !!value
        }
    };
    var defaultMsg = {
        phone: {
            success: "",
            error: "必须是11位手机号"
        },
        password: {
            success: "",
            error: "长度至少6位"
        },
        required: {
            success: "",
            error: "不能为空"
        }
    }
    $validationProvider.setExpression(expression).setDefaultMsg(defaultMsg)
}])
"use strict";

angular.module("app").controller("companyCtrl", ["$http", "$state", "$scope", function($http, $state, $scope){
    $http.get("/data/company.json?id="+$state.params.id).success(function(response){
        $scope.company = response;
    }).error(function(error){
        console.log(error);
    });
}])
"use strict";

angular.module("app").controller("favoriteCtrl", ["$http", "$scope", function($http, $scope){
    $http.get("/data/myFavorite.json").success(function(response){
        $scope.favoriteList = response;
    }).error(function(error){
        console.log(error);
    })
}])
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
"use strict";

angular.module("app").controller("mainCtrl", ["$http", "$scope", function($http, $scope){
    $http.get("/data/positionList.json").success(function(response){
        $scope.list = response;
    }).error(function(error){
        console.log(error);
    })
}])
"use strict";

angular.module("app").controller("myCtrl", ["$http", "$scope", "cache", "$state", function($http, $scope, cache, $state){
    if (cache.get("name")) {
        $scope.name = cache.get("name");
        $scope.image = cache.get("image")
    }
    $scope.logout = function(){
        cache.remove("id");
        cache.remove("name");
        cache.remove("image");
        $state.go("main");
    }
}])
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
"use strict";

angular.module("app").controller("postCtrl", ["$http", "$scope", function($http, $scope){
    $scope.tabList = [{
        id: "all",
        name: "全部"
    }, {
        id: "pass",
        name: "邀请面试"
    }, {
        id: "fail",
        name: "不合适"
    }];
    $http.get("/data/myPost.json").success(function(response){
        $scope.postList = response;
    }).error(function(error){
        console.log(error);
    });
    $scope.filterObj = {};
    $scope.tClick = function(id, name){
        switch (id) {
            case "all": 
                delete $scope.filterObj.state;
                break;
            case "pass":
                $scope.filterObj.state = "1"; 
                break;
            case "fail":
                $scope.filterObj.state = "-1";     
                break;
            default: break;
        }
    }
}])
"use strict";

angular.module("app").controller("registerCtrl", ["$interval", "$http", "$scope", "$state", function($interval, $http, $scope, $state){
    $scope.submit = function(){
        $http.post("/data/regist.json", $scope.user).success(function(response){
            $state.go("login");
        })
    };
    $scope.send = function(){
        $http.get("/data/code.json").success(function(response){
            if (1 === response.state) {
                var count = 60;
                $scope.time = count + "s";
                var interval = $interval(function(){
                    if (count <= 0) {
                        $interval.cancel(interval);
                        $scope.time = "";
                    } else {
                        count--;
                        $scope.time = count + "s";
                    }
                }, 1000)
            }
        }).error(function(error){
            console.log(error);
        })
    }
}])
"use strict";

angular.module("app").controller("searchCtrl", ["dict", "$http", "$scope", function(dict, $http, $scope){
    $scope.name = "";
    $scope.search = function(){
        $http.get("/data/positionList.json?name=" + $scope.name).success(function(response){
            $scope.positionList = response;
        }).error(function(error){
            console.log(error);
        });
    };
    $scope.search();
    $scope.sheet = {};
    $scope.tabList = [{
        id: "city",
        name: "城市"
    }, {
        id: "salary",
        name: "薪水"
    }, {
        id: "scale",
        name: "公司规模"
    }];
    var tabId = "";
    $scope.filterObj = {};
    $scope.tClick = function(id, name){
        tabId = id;
        $scope.sheet.list = dict[id];
        $scope.sheet.visible = true;
    };
    $scope.sClick = function(id, name){
        if (id) {
            angular.forEach($scope.tabList, function(item){
                if (item.id === tabId) {
                    item.name = name;
                }
            });
            $scope.filterObj[tabId+'Id'] = id;
        } else {
            delete $scope.filterObj[tabId + "Id"];
            angular.forEach($scope.tabList, function(item){
                if (item.id === tabId) {
                    switch (item.id) {
                        case "city": 
                            item.name = "城市";
                            break;
                        case "salary": 
                            item.name = "薪水";
                            break;
                        case "scale":
                            item.name = "公司规模";
                            break;
                        default: break;
                    }
                }
            })
        }
    }
}])
"use strict";

angular.module("app").directive("appCompany", [function(){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/company.html",
        scope: {
            company: "="
        },
    }
}])
"use strict";

angular.module("app").directive("appFoot", [function(){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/foot.html"
    }
}])
"use strict";

angular.module("app").directive("appHead", ["cache", function(cache){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/head.html",
        link: function(scope){
            scope.name = cache.get("name") || "";
        } 
    };
}])
"use strict";

angular.module("app").directive("appHeadBar", [function(){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/headBar.html",
        scope: {
            text: "@"
        },
        link: function(scope, elements, attr){
            scope.back = function(){
                window.history.back();
            }
        }
    };
}])
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
"use strict";

angular.module("app").directive("appPositionList", ["$http", function($http){
    return {
        restrict: "A",
        replace: true,
        templateUrl: "view/template/positionList.html",
        scope: {
            data: "=",
            filterObj: "=",
            isFavorite: "="
        },
        link: function(scope){
            scope.select = function(item){
                $http.post("/data/favorite.json",{
                    id: item.id,
                    select: !item.select
                }).success(function(response){
                    item.select = !item.select;
                }).error(function(error){
                    console.log(error);
                })
            }
        }
    }
}])
"use strict";

angular.module("app").directive("appSheet", [function(){
    return {
        restrict: "A",
        replace: true,
        scope: {
            list: "=",
            visible: "=",
            select: "&"
        },
        templateUrl: "view/template/sheet.html",
    };
}])
"use strict";

angular.module("app").directive("appTab", [function(){
    return {
        restrict: "A",
        replace: true,
        scope: {
            list: "=",
            tabClick: "&"
        },
        templateUrl: "view/template/tab.html",
        link: function(scope){
            scope.click = function(tab){
                scope.selectId = tab.id;
                scope.tabClick(tab);
            }
        }
    };
}])
"use strict";

angular.module("app").filter("filterByObj", [function(){
    return function(list, obj){
        var result = [];
        angular.forEach(list, function(item){
            var isEqual = true;
            for (var e in obj) {
                if (item[e] !== obj[e]) {
                    isEqual = false;
                }
            }
            if (isEqual) {
                result.push(item);
            }
        })
        return result;
    }
}])
"use strict";

angular.module("app").service("cache", ["$cookies", function($cookies){
    this.put = function(key, value){
        $cookies.put(key, value);
    };
    this.get = function(key){
        return $cookies.get(key);
    };
    this.remove = function(key){
        $cookies.remove(key);
    }
}])

// 和上面类似 但是可以在内部定义一些私有的属性
// .factory("cache", ["$cookies", function($cookies){
//     return {
//         put: function(key, value){
//             $cookies.put(key, value);
//         },
//         get: function(key){
//             return $cookies.get(key);
//         },
//         remove: function(key){
//             $cookies.remove(key);
//         }
//     }
// }])