// =======================================================
// PORTAS
// =======================================================
var PORTA = 1000;

// =======================================================
// GLOBAIS
// =======================================================
var io = require('socket.io').listen(PORTA);

var CLIENTES = {};

var id = 9;
var Books = [{
	"title": "Fahrenheit 451",
	"author": "R. Bradbury",
	"_id": "1",
	"isbn": "0345342968",
	"publisher": "Del Rey"
}, {
	"title": "The Silmarillion",
	"author": "J.R.R. Tolkien",
	"_id": "2",
	"isbn": "0048231398",
	"publisher": "G. Allen & Unwin"
}, {
	"title": "1984",
	"author": "G. Orwell",
	"_id": "3",
	"isbn": "0451524934",
	"publisher": "Signet"
}, {
	"title": "Frankenstein",
	"author": "M. Shelley",
	"_id": "4",
	"isbn": "031219126X",
	"publisher": "Bedford"
}, {
	"title": "The Moon Is a Harsh Mistress",
	"author": "R. A. Heinlein",
	"_id": "5",
	"isbn": "0312863551",
	"publisher": "Orb"
}, {
	"title": "Budapeste",
	"author": "Chico Buarque",
	"_id": "6",
	"isbn": "8535904174",
	"publisher": "Companhia das Letras"
}, {
	"title": "The Catcher in the Rye",
	"author": "J. D. Salinger",
	"_id": "7",
	"isbn": "0316769533",
	"publisher": "Little Brown & Co"
}, {
	"title": "O Velho e O Mar",
	"author": "Ernest Hemingway",
	"_id": "8",
	"isbn": "8528607593",
	"publisher": "Bertrand Brasil"
}, {
	"title": "O Natal de Poirot",
	"author": "Agatha Christie",
	"_id": "9",
	"isbn": "9788525420",
	"publisher": "L&PM"
}];


// =======================================================
// PROCEDIMENTOS
// =======================================================
var clientes = function() {

	var getClientesWeb = function() {
		return CLIENTES;
	};

	return {
		getClientesWeb: getClientesWeb
	}
}


// =======================================================
// START
// =======================================================
var web = io.on('connection', function(socket) {
	CLIENTES[socket.id] = socket;

	/* Serviço Lista de Books */
	socket.on("BOOKS", function() {
		var data = [];

		for (var i = 0; i < Books.length; i++) {
			data.push({
				"title": Books[i].title,
				"author": Books[i].author,
				"_id": Books[i]._id
			});
		}

		socket.emit("BOOKS_LIST", data);
	});

	socket.on("BOOK", function(data) {
		for (var i = 0; i < Books.length; i++) {
			var obj = Books[i];
			if (obj._id == data.id) {
				socket.emit("BOOK", obj);
				break;
			}
		}
	});

	socket.on("ADDBOOK", function(data) {
		if (data) {
			if (!data.title || !data.author || !data.publisher || !data.isbn) {
				socket.emit("ADDBOOK", {
					error: true,
					msg: "Não foi preenchidas todas informações!"
				});
				return;
			}

			id++;
			data._id = id;
			Books.push(data);
			socket.emit("BOOKS_LIST", Books);
			socket.emit("ADDBOOK", {
				error: false,
				msg: "Inserido com sucesso",
				id: id,
				books: Books
			});
		} else {
			socket.emit("ADDBOOK", {
				error: true,
				msg: "Não foi preenchidas todas informações!"
			});
		}
	});

});