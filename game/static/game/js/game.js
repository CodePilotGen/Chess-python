const roomName = JSON.parse(document.getElementById('room-name').textContent);
const chatSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/chat/'
  + roomName
  + '/'
);

chatSocket.onmessage = function(e) {
  const data = JSON.parse(e.data);
  document.querySelector('#chat-log').value += (data.message + '\n');
};

chatSocket.onclose = function(e) {
  console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').focus();
document.querySelector('#chat-message-input').onkeyup = function(e) {
  if (e.keyCode === 13) {  // enter, return
      document.querySelector('#chat-message-submit').click();
  }
};

document.querySelector('#chat-message-submit').onclick = function(e) {
  const messageInputDom = document.querySelector('#chat-message-input');
  const message = messageInputDom.value;
  chatSocket.send(JSON.stringify({
      'message': message
  }));
  messageInputDom.value = '';
};

const gameSocket = new WebSocket(
  'ws://'
  + window.location.host
  + '/ws/game/'
  + roomName
  + '/'
);

var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
}

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
}

function onSnapEnd () {
  board.position(game.fen());
  gameSocket.send(JSON.stringify({
    'fen': game.fen()
  }));
}

var config = {
  draggable: true,
  pieceTheme: '/media/img/chesspieces/wikipedia/{piece}.png',
  position: game.fen(),
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}

board = Chessboard('myBoard', config);

gameSocket.onmessage = function(e) {
  const data = JSON.parse(e.data);
  if (data.type_event === 'undo') {
    alert('undo requested!');
  } else {
    board.position(data.fen);
    game.load(data.fen);
    console.log(game.history());
    document.getElementById('pgn').innerHTML = data.fen;
  }
};

gameSocket.onclose = function(e) {
  console.error('Game socket closed unexpectedly');
};

document.querySelector('#undo').onclick = function() {
  console.log(game.fen());
  game.undo();
  board.position(game.fen());
  gameSocket.send(JSON.stringify({
    'type_event': 'undo',
    'fen': game.fen()
  }));
};