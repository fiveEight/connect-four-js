// Enter player's information and start the game.
function showModal() {
	$('#modalOne').modal('show');
}

// Ask whether to play again or start a new game.
function showModalTwo() {
	$('#modalTwo').modal('show');
}

// Get and set players information.
function getPlayersInfo() {
	playerOne = $('#player-one-name').val();
	playerTwo = $('#player-two-name').val();
	playerFlg = 1;
	playerTurnText();
}

// Change text depending on the player's turn.
function playerTurnText() {
	currentPlayerTurn = playerTwo;
	let textClassColor = "playerTwoText";
	if (playerFlg > 0) {
		currentPlayerTurn = playerOne
		$('#playerTurn').removeClass();
		textClassColor = "playerOneText";
	}
	$('#playerTurn').addClass(textClassColor);
	$('#playerTurn').text("Current Turn: " + currentPlayerTurn);
}

// Show where the chip will be dropped.
function showMove(col, chipColor) {
	let row = checkRow(col);
	let currentColor = getColor(row, col);
	if (checkColor(currentColor)) {
		changeColor(row, col, chipColor);
	}
}

// Change the color of the chip.
function changeColor (row, col,chipColor) {
	table.eq(row).find('td').eq(col).find('button').css("background-color", chipColor);
}

// Set the color of the next chip.
function setNextColor() {
	let chipColor = "rgb(255, 82, 82)";
	if (playerFlg > 0) {
		chipColor = "rgb(255, 245, 135)";
	}
	return chipColor;
}

// Get the color of the chip.
function getColor (row, col) {
	return table.eq(row).find('td').eq(col).find('button').css("background-color");
}

// If the color of the chip is white or gray, return true. Otherwise, return false.
function checkColor(color) {
	if (color === "rgb(247, 254, 255)" ||
		color === "rgb(205, 205, 205)") {
		return true;
	}
	return false;
}

// Check next available row.
function checkRow (col) {
	var color;
	for(var row = 5;row > -1;row--) {
		color = getColor(row, col);
		if (checkColor(color)) {
			return row;
		}
	}
	return null;
}

// Check the passed chip color combination.
function checkMatch (colorOne, colorTwo, colorThree, colorFour) {
	return (colorOne === colorTwo && colorTwo === colorThree && colorThree === colorFour && colorOne !== 'rgb(247, 254, 255)' && colorOne !== undefined);
}

// Check chip combination horizontally.
function checkHorizontalMatch (row) {
	for (var col = 0;col < 4;col++) {
		if (checkMatch(getColor(row,col),getColor(row,col+1),getColor(row,col+2),getColor(row,col+3))) {
			return true;
		}
	}
	return false;
}

// Check chip combination vertically.
function checkVerticalMatch (col) {
	for (var row = 5;row > 2;row--) {
		if (checkMatch(getColor(row,col),getColor(row-1,col),getColor(row-2,col),getColor(row-3,col))) {
			return true;
		}
	}
	return false;
}

// Check chip combination diagonally.
function checkDiagonalMatch () {
	for (var row = 0; row < 6;row++) {
		for (var col = 0;col < 7; col++) {
			if (checkMatch(getColor(row,col),getColor(row-1,col+1),getColor(row-2,col+2),getColor(row-3,col+3)) ||
				checkMatch(getColor(row,col),getColor(row+1,col+1),getColor(row+2,col+2),getColor(row+3,col+3))) {
				return true;
			}
		}
	}
	return false;
}

// Reset chips on the board to white.
function resetChips() {
	$(".board button, input[type='button']").css("background-color", "rgb(247, 254, 255)");
}

let playerOne;
let playerTwo;
let currentPlayerTurn;
let playerFlg;
let table = $('.board tr');

// Show modal every time the window is loaded.
$(window).on('load', function(){
	showModal();
})

// Get and set players information.
$("#startGameButton").click(function(){
	getPlayersInfo();
})


$('.board button')
	// When the button on the board is clicked, drop the corresponding chip.
	.click(function(){
		let col = $(this).closest("td").index();
		let row = checkRow(col);
		let color = getColor(row, col);
		let nextColor = setNextColor;
		if (checkColor(color)) {
			changeColor(row, col, nextColor);
			// Check chip combination.
			if (checkHorizontalMatch(row) || checkVerticalMatch(col) || checkDiagonalMatch()) {
				$('#modalTwoLabel').text(currentPlayerTurn + " wins!");
				showModalTwo();	
			}
			playerFlg *=  -1;
			playerTurnText();
		}
	})
	// Show guide where the chip will be dropped.
	.mouseenter(
		function(){
			let col = $(this).closest("td").index();
			let chipColor = "rgb(205, 205, 205)";
			showMove(col, chipColor);
	})
	// Remove chip guide,
	.mouseleave(
		function(){
			let col = $(this).closest("td").index();
			let chipColor = "rgb(247, 254, 255)";
			showMove(col, chipColor);
});

// When 'Play again' button is clicked, reset chips and continue playing.
$('#playAgainButton').click(function(){
	resetChips();
});

// When 'New game' button is clicked, start new game.
$('#newGameButton').click(function(){
	showModal();
	getPlayersInfo();
	resetChips();
});