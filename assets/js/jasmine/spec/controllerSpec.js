describe('app', function() {
	var scope, socket, location, controller;
	beforeEach(function() {
		module('app');
	});

	describe('mainController', function() {
		beforeEach(inject(function($controller) {
			controller = $controller('mainController', {
				'$scope': scope,
				'socket': socket,
				'$location': location
			});
		}));

		describe('mainController', function() {
			it("Teste do controller", function() {
				expect(controller.scope.books);
			});
		});
	});
});