/**
 * test for pokemon-gallery.js
 */
'use strict';
describe('Pokemon Gallery-', function(){
    var pokemonUrl = 'http://pokeapi.co/api/v2/pokemon?limit=151';
    var $rootScope, $scope, $httpBackend, $controller;

    beforeEach(angular.mock.module('app'));
    beforeEach(inject(function($injector) {
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $scope =  $rootScope.$new();
        $httpBackend.expectGET(pokemonUrl).respond(200, pokemonResponse);
        $controller = $injector.get('$controller')('pokemonGalleryController', {$scope: $scope});

    }));

    it('Should get 151 pokemon names', function(){
        $httpBackend.expectGET(pokemonUrl).respond(200, pokemonResponse);
        $scope.getPokemonNames();
        $httpBackend.flush();
        expect($scope.pokemons.length).toBe(151);
    });

    it('Should filter pokemons by keywords', function() {
        $scope.pokemons = pokemonResponse.results;
        $scope.keywords = 'RAT';
        $scope.filterPokemonsByKeywords();
        expect($scope.allMatchedPokemons.length).toBe(4);
        expect($scope.totalPage).toBe(1);

        $scope.keywords = 'rat';
        $scope.filterPokemonsByKeywords();
        expect($scope.allMatchedPokemons.length).toBe(4);
        expect($scope.totalPage).toBe(1);

        $scope.keywords = 'rat po';
        $scope.filterPokemonsByKeywords();
        expect($scope.allMatchedPokemons.length).toBe(1);
        expect($scope.totalPage).toBe(1);

        $scope.keywords = '';
        $scope.filterPokemonsByKeywords();
        expect($scope.allMatchedPokemons.length).toBe(151);
        expect($scope.totalPage).toBe(8);
    });

    it('Should load first page', function() {
        $httpBackend.expectGET(pokemonUrl).respond(200, pokemonResponse);
        $scope.keywords = 'a';
        $scope.loadFirstPage();
        $httpBackend.flush();
        expect($scope.keywordsInMessage).toBe($scope.keywordsInMessage);
        expect($scope.allMatchedPokemons.length).toBe(85);
        expect($scope.machedPokemonsInCurrentPage.length).toBe(20);
        expect($scope.end).toBe(20);

        $scope.keywords = 'RAT';
        $scope.loadFirstPage();
        expect($scope.allMatchedPokemons.length).toBe(4);
        expect($scope.machedPokemonsInCurrentPage.length).toBe(4);
        expect($scope.end).toBe(4);
    });

    it('Should page up and page down', function() {
        $httpBackend.expectGET(pokemonUrl).respond(200, pokemonResponse);
        $scope.keywords = 'a';
        $scope.loadFirstPage();
        $httpBackend.flush();
        expect($scope.keywordsInMessage).toBe($scope.keywordsInMessage);
        expect($scope.allMatchedPokemons.length).toBe(85);
        expect($scope.end).toBe(20);

        $scope.pageUp();
        expect($scope.currentPage).toBe(0);
        $scope.pageDown();
        expect($scope.currentPage).toBe(1);
        $scope.pageDown();
        expect($scope.currentPage).toBe(2);
        $scope.pageDown();
        expect($scope.currentPage).toBe(3);
        $scope.pageDown();
        expect($scope.currentPage).toBe(4);
        $scope.pageDown();
        expect($scope.currentPage).toBe(4);
        $scope.pageUp();
        expect($scope.currentPage).toBe(3);
    });
});