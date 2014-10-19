var myTTTapp = angular.module('myTTTapp', ["firebase"]);
// TICTACTOE CONTROLLER
myTTTapp.controller('TTTCtrl', function ($scope,$firebase) {
// Connect to Firebase database for game
var gameRef = new Firebase("https://tttcg.firebaseio.com/TTT");
$scope.remoteGameContainer = $firebase(gameRef);

// Another database for CHAT
var chatRef = new Firebase("https://tttcg.firebaseio.com/chat") ;
$scope.allcomments = $firebase(chatRef.limit(13));

// Decide who goes first - Default settings
var firstPlayer=0;
var secondPlayer=1;
$scope.currentPlayer={
  userName:"",
  userComment:""
};
// TIMER to keep track of each player total play time, to be used as a tie breaker
$scope.gameClock=0;
// Player Info (name, score, time on a currentgame, current tile choice, current's turn)
// $scope.player = [
// {name:"",score:0,waitTime:0, tilechoice:"X", board:["0","0","0","0","0","0","0","0","0"], isNext:true},
// {name:"",score:0,waitTime:0, tilechoice:"O", board:["0","0","0","0","0","0","0","0","0"], isNext:false}];
// Global Array to store gameBoard ID for each cell
// $scope.gameBoard = [
// {name:"c0",status:"0", pollNum:0},
// {name:"c1",status:"0", pollNum:0},
// {name:"c2",status:"0", pollNum:0},
// {name:"c3",status:"0", pollNum:0},
// {name:"c4",status:"0", pollNum:0},
// {name:"c5",status:"0", pollNum:0},
// {name:"c6",status:"0", pollNum:0},
// {name:"c7",status:"0", pollNum:0},
// {name:"c8",status:"0", pollNum:0}];
// Standard set of winning possibilities - only 8
var winningMoves = ["111000000",
                    "000111000",
                    "000000111",
                    "100100100",
                    "010010010",
                    "001001001",
                    "100010001",
                    "001010100"];
// Counter to make sure alternate between noughts and crosses
// $scope.count = 0;
// CurrentWinner to do announcement - First one by default
$scope.gameWinnerID = 0;
// See if this is the firs Player turn
$scope.isYourTurn = true;
// Local variable - served as your ID for the game
// 1: first player to the game
// 2: second player to the game
// 3,4,5...: 1st spectator and so on
$scope.playerID = 0;
$scope.activePlayer = 0;
// Game Status for rendering graphic and announcement
$scope.isGameOver = false;
// Tie in case
var tie = false;
// Winning Scenario Based on winningMoves index
$scope.winScene = "";
// Update Player Info once that is click and hide the input form
// Game Manager to take care of time sync, number of players and spectators and chats
// @param currentPlayer:
//  0: first player to the game - can play the board
//  1: second player to the game - can play the board
//  2: first and so on spectator - only view mode and chat and poll mode
// @param pollBoard: keep track of the amount of board and user tiles choose to assist player in making decision
// $scope.gameManager = {
//   playerNum:0,
//   userName:[],
//   pollBoard:["0","0","0","0","0","0","0","0","0"]
// };
//CONNECT TO DATABASE. ASSIGN UNIQUE GAMER ID TO USER - INITIALIZE GAME
gameRef.once('value', function(dataSnapshot) {
  // Let's find out how many players are on this board!
  if(!dataSnapshot.val()) {
    $scope.playerID = 0;
  }
  // If one player than 2nd player
  else {
    $scope.playerID = dataSnapshot.val().playerNum;
  }
  // This container object is what gets synced:
  $scope.gameContainer = {
    FBgameBoard: $scope.gameBoard, 
    FBcount: $scope.count,
    FBplayer: $scope.player,
    FBisGameOver: $scope.isGameOver,
    FBgameManager: $scope.gameManager,
    FBspectatorManager: $scope.spectatorManager
  };
  // Firebase bind and watch for changes. 3 way binding.
  $scope.remoteGameContainer.$bind($scope, "gameContainer");
  },
  function (){
    alert("Error Reading Database. Please Contact Customer Support.");
  }
);

$scope.$watch('gameContainer', function() {}) ;
$scope.updatePlayer = function(){
  // Add one more person to the game - First player need to check if they are the first
  $scope.gameContainer.FBgameManager.playerNum++;
  chatRef.push({userName:$scope.currentPlayer.userName, userComment:("I'm in.")});
  $scope.playerID = $scope.gameContainer.FBgameManager.playerNum;
  // Start Recording play time for each player
  $scope.gameClock = Date.now();
};

// START THE GAME
$scope.startGame = function() {
  if($scope.gameContainer.FBgameManager.activePlayer>=1){
    return;
  }
  else {
    $scope.gameContainer.FBplayer[0].name = $scope.currentPlayer.userName;
    $scope.gameContainer.FBplayer[0].tilechoice = $scope.currentPlayer.tilechoice;
    $scope.gameContainer.FBplayer[0].isNext = true;
    $scope.gameContainer.FBplayer[0].playerID = $scope.playerID;
    $scope.gameContainer.FBgameManager.activePlayer = 1;
  }
}
// JOIN THE GAME
$scope.joinGame = function(){
  if($scope.gameContainer.FBgameManager.activePlayer>=2){
    return;
  }
  else {
    $scope.gameContainer.FBplayer[1].name = $scope.currentPlayer.userName;
    $scope.gameContainer.FBplayer[1].tilechoice = ($scope.gameContainer.FBplayer[0].tilechoice=="X")? "O":"X";
    $scope.gameContainer.FBplayer[1].isNext = false;
    $scope.gameContainer.FBplayer[1].playerID = $scope.playerID;
    $scope.gameContainer.FBgameManager.activePlayer = 2;
  }
}
// THE JUDGE
var judgeGame = function (obj){
  var result = false;
  for (var i=0; i<=winningMoves.length;i++) {
    result = (parseInt(obj.join(""), 2) & parseInt(winningMoves[i], 2)) == parseInt(winningMoves[i], 2);
    // Binwise on steroid comparison
    if (result){
      // Assign winning scenario for winning rendering
      $scope.winScene = i;
      break;
    };
  }
  return result;
};
//chooseTile
$scope.chooseTile = function(thisTile){
  // Time Between plays
  var deltaTime = Date.now()-$scope.gameClock;
  // Winner ID - 0 for first player, 1 for second player
  var winnerID = "";
  $scope.gameClock = Date.now();
  if ((thisTile.status=='H') && ($scope.gameContainer.FBplayer[$scope.gameContainer.FBcount % 2].playerID==$scope.playerID)) {
    // Alternate between noughts and crosses
    // FIRST MOVE
    if (($scope.gameContainer.FBcount % 2) == 0) {
      thisTile.status = $scope.gameContainer.FBplayer[firstPlayer].tilechoice;
      // Update first player board
      $scope.gameContainer.FBplayer[firstPlayer].board[this.$index] = 1;
      // Update time
      $scope.gameContainer.FBplayer[firstPlayer].waitTime=deltaTime + $scope.gameContainer.FBplayer[firstPlayer].waitTime;
    }
    // SECOND MOVE
    else 
      {
      thisTile.status = $scope.gameContainer.FBplayer[secondPlayer].tilechoice;
      // Update 2nd player board
      $scope.gameContainer.FBplayer[secondPlayer].board[this.$index] = 1;
      // Update time
      $scope.gameContainer.FBplayer[secondPlayer].waitTime=deltaTime + $scope.gameContainer.FBplayer[secondPlayer].waitTime;
    }
    // Let's find out the winner after every tile click - And only check after the 5th turn
    if ($scope.gameContainer.FBcount>=4){
      if (judgeGame($scope.gameContainer.FBplayer[$scope.gameContainer.FBcount % 2].board)) {
        announcer($scope.gameContainer.FBcount % 2);
      }
      else if ($scope.gameContainer.FBcount == 8) {
        $scope.gameContainer.FBplayer[secondPlayer].waitTime <= $scope.gameContainer.FBplayer[secondPlayer].waitTime ?
        announcer(secondPlayer) : announcer(firstPlayer); 
        tie = true;
      }
    }
    // Change to who is the next player
    $scope.isYourTurn=!$scope.isYourTurn;
    // updatemove counter
    $scope.gameContainer.FBcount++;
  }
};
// WINNING RENDERING AND ANNOUCEMENT
var announcer = function(winnerID){
  updateBoard();
  $scope.gameWinnerID = winnerID;
  $scope.gameContainer.FBplayer[winnerID].score++;
  $scope.gameContainer.FBisGameOver = true;
  // Making sure the winner of the last game pick and play first
  // In an event of a tie, than the order is reverse
  if (winnerID==0){
    firstPlayer=1;
    secondPlayer=0;
    $scope.isYourTurn=false;
  }
  else {
    firstPlayer=0;
    secondPlayer=1;
    $scope.isYourTurn=true;
  };
};
// RENDER BOARD WITH WINNING COMBINATION
// Assign a CSS Class lossClass to tile that is loss so it's dimmed and not clickeable
var updateBoard = function () {
  if (!tie){
    var winMove = winningMoves[$scope.winScene].split('');
    for (var i = 0; i < winMove.length; i++) {
      if (winMove[i] == "0") {
        $scope.gameContainer.FBgameBoard[i].name = "lossClass";
      }
    }
  }
};
// RELOAD THE GAME
$scope.reloadGame = function(){
  // Resetting all values back to default
  $scope.gameContainer.FBplayer[0].board = ["0","0","0","0","0","0","0","0","0"];
  $scope.gameContainer.FBplayer[1].board = ["0","0","0","0","0","0","0","0","0"];
  $scope.gameContainer.FBplayer[0].waitTime = 0;
  $scope.gameContainer.FBplayer[1].waitTime = 0;
  $scope.gameContainer.FBgameBoard = [
    {name:0,status:"0", pollNum:0},
    {name:1,status:"0", pollNum:0},
    {name:2,status:"0", pollNum:0},
    {name:3,status:"0", pollNum:0},
    {name:4,status:"0", pollNum:0},
    {name:5,status:"0", pollNum:0},
    {name:6,status:"0", pollNum:0},
    {name:7,status:"0", pollNum:0},
    {name:8,status:"0", pollNum:0}];
  $scope.gameContainer.FBcount = 0;
  tie = false;
  $scope.winScene = "";
  $scope.gameContainer.FBisGameOver = false;
};
// Game TOTAL RESET
$scope.resetGame = function(){
  $scope.reloadGame();
  $scope.gameContainer.FBplayer[0].score = 0;
  $scope.gameContainer.FBplayer[1].score = 0;
};
// HARD RESET GAME - NEW GAME
$scope.hardResetGame = function(){
  $scope.reloadGame();
  $scope.gameContainer.FBplayer[0].score = 0;
  $scope.gameContainer.FBplayer[1].score = 0;
  $scope.gameContainer.FBplayer[0].name = "...";
  $scope.gameContainer.FBplayer[1].name = "...";
  $scope.gameContainer.FBplayer[0].isNext = true;
  $scope.gameContainer.FBplayer[1].isNext = false;
  $scope.gameContainer.FBplayer[0].tilechoice = "X"
  $scope.gameContainer.FBplayer[1].tilechoice = "O";
  $scope.gameContainer.FBgameManager.activePlayer = 0;
};
//  MOUSE OVER to Change Color, only perform if mouse is still playable
$scope.mouseEnterTile = function (thisTile){
  if (thisTile.status == "0" && thisTile.name != "lossClass") {
    thisTile.status = "H";
    thisTile.pollNum++;
  };
};
// RETURN origin tile when mouse leave
$scope.mouseLeaveTile = function (thisTile){
  if (thisTile.status == "H") {
    thisTile.status = "0";
    thisTile.pollNum--;
  };
};
// CHAT MANAGER
$scope.addComment = function () {
  chatRef.push({userName:$scope.currentPlayer.userName, userComment:$scope.userComment});
  $scope.userComment = "";
};
});





