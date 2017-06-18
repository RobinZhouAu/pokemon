var app = angular.module('app',[]);

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.controller('pokemonGalleryController', function($scope, $http) {
    $scope.keywords = "";
    $scope.currentPage = 0;
    $scope.totalPage = 0;
    $scope.start = 0;
    $scope.end = 20;
    $scope.pageSize = 20;
    $scope.allMatchedPokemons = [];
    $scope.machedPokemonsInCurrentPage = [];
    $scope.loading = false;
    $scope.loadError = false;

    $scope.getPokemonNames = function(callback) {
        $scope.loading = true;
        $scope.loadError = false;
        $http({
            method: 'GET',
            url: "http://pokeapi.co/api/v2/pokemon?limit=151"
        }).then(function successCallback(response) {
            $scope.pokemons = response.data.results;
            if (callback)
                callback();
            $scope.loading = false;
        }, function errorCallback(response) {
            $scope.loadError = true;
            $scope.loading = false;
        });
    };

    $scope.filterPokemonsByKeywords = function() {
        var keywordList = [];
        $scope.keywords = $scope.keywords.trim();
        if ($scope.keywords != '') {
            keywordList = $scope.keywords.split(" ");
            for (var i = 0; i < keywordList.length; i++) {
                keywordList[i] = keywordList[i].trim().toLowerCase();
            }
        }

        $scope.allMatchedPokemons = [];
        for (var j = 0; j < $scope.pokemons.length; j ++) {
            var pokemon = $scope.pokemons[j];
            var match = true;
            var name = pokemon.name.toLowerCase();
            for (var i = 0; i < keywordList.length; i ++) {
                if (name.indexOf(keywordList[i]) == -1) {
                    match = false;
                    break;
                }
            }
            if (match) {
                $scope.allMatchedPokemons.push({
                    number: j + 1,
                    name: pokemon.name,
                    img: j + 1 + ".png"
                });
            }
        }
        $scope.noResults = $scope.allMatchedPokemons.length == 0;
        $scope.totalPage = Math.floor($scope.allMatchedPokemons.length / $scope.pageSize);
        if ($scope.allMatchedPokemons.length % $scope.pageSize != 0)
            $scope.totalPage ++;
    };


    $scope.loadFirstPage = function() {
        //We need another value keywordsInMessage which won't be changed when the "keywords" input is being changed
        $scope.keywordsInMessage = $scope.keywords;

        if ($scope.pokemons) {
            //Load pokemon data from memory
            $scope.filterPokemonsByKeywords();
            $scope.currentPage = 0;
            $scope.changeRange();
        } else {
            //First time pokemon data will be loaded from REST,then it will be stored in memory
            $scope.getPokemonNames(function() {
                $scope.filterPokemonsByKeywords();
                $scope.currentPage = 0;
                $scope.changeRange();
            });
        }
    };

    $scope.pageUp = function() {
        //First page ?
        if ($scope.currentPage > 0)
            $scope.currentPage --;
        $scope.changeRange();
    };

    $scope.pageDown = function() {
        //Last page ?
        if ($scope.currentPage < $scope.totalPage - 1)
            $scope.currentPage ++;
        $scope.changeRange();
    };

    $scope.changeRange = function() {
        $scope.start = $scope.currentPage * $scope.pageSize;
        $scope.end = Math.min(($scope.currentPage + 1) * $scope.pageSize, $scope.allMatchedPokemons.length);
        $scope.machedPokemonsInCurrentPage = $scope.allMatchedPokemons.slice($scope.start, $scope.end);
    };

    $scope.loadFirstPage();
});
