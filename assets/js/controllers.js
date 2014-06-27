var app = angular.module('app', ['ngRoute', 'ngResource']);

app.config(function($routeProvider, $locationProvider) {
	// remove o # da url
	$locationProvider.html5Mode(true);

	$routeProvider

	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'homeController',
	})

	.when('/info/:id', {
		templateUrl: 'views/list.html',
		controller: 'listController',
	})

	.when('/new', {
		templateUrl: 'views/form.html',
		controller: 'novoController',
	})

	.otherwise({
		redirectTo: '/'
	});

	$locationProvider.html5Mode(true);
});

app.factory('socket', function() {
	var socket = io.connect('http://localhost:1000');
	return socket;
})

app.controller('mainController', function($scope, socket, $location) {

	$scope.books = [];

	/* Redimencionamento */
	document.getElementById('lista').style.height = (document.body.scrollHeight) + 'px';

	socket.emit("BOOKS");
	socket.on("BOOKS_LIST", function(data) {
		$scope.books = data;
		$scope.$digest();
	});

	$scope.adicionar = function() {
		$location.url("new");
	}

	$scope.listar = function(obj, $index) {
		$scope.selectedIndex = $index;
		var id = obj.target.attributes.data.value
		$location.url("info/" + id);
	}
});

app.controller('homeController', function($scope, socket) {

});

app.controller('listController', function($scope, $routeParams, socket) {
	$scope.books = {};

	socket.emit('BOOK', $routeParams);
	socket.on('BOOK', function(data) {
		$scope.livro = data;
		$scope.$digest();
	})
});

app.controller('novoController', function($scope, socket) {
	$scope.adicionar = function(livro) {
		socket.emit("ADDBOOK", livro);
	}
	$scope.cancelar = function(obj, $index) {
		history.back();
	}

	socket.on("ADDBOOK", function(data) {
		alert(data.msg)
		console.log(data)
	});

});